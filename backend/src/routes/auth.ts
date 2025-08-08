import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService';
import { authRateLimiterMiddleware } from '../middleware/rateLimiter';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { validateRegistration, validateLogin, validateEmail } from '../utils/validation';

const router = Router();

// Apply rate limiting to all auth routes
router.use(authRateLimiterMiddleware);

// Register new user
router.post('/register', asyncHandler(async (req, res) => {
  const { error, value } = validateRegistration(req.body);
  if (error) {
    throw createError(error.details[0].message, 400);
  }

  const { email, password, firstName, lastName } = value;

  // Check if user already exists
  const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    throw createError('User with this email already exists', 409);
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS || '12'));

  // Generate verification token
  const verificationToken = uuidv4();
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Create user
  const result = await query(
    `INSERT INTO users (email, password_hash, first_name, last_name, email_verification_token, email_verification_expires)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, first_name, last_name`,
    [email, passwordHash, firstName, lastName, verificationToken, verificationExpires]
  );

  const user = result.rows[0];

  // Send verification email
  try {
    await sendVerificationEmail(email, verificationToken, `${firstName} ${lastName}`);
  } catch (emailError) {
    console.error('Failed to send verification email:', emailError);
    // Don't fail registration if email fails
  }

  res.status(201).json({
    success: true,
    message: 'Account created successfully. Please check your email to verify your account.',
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name
    }
  });
}));

// Verify email
router.post('/verify-email', asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw createError('Verification token is required', 400);
  }

  // Find user with valid token
  const result = await query(
    `SELECT id, email, first_name, last_name FROM users 
     WHERE email_verification_token = $1 AND email_verification_expires > NOW()`,
    [token]
  );

  if (result.rows.length === 0) {
    throw createError('Invalid or expired verification token', 400);
  }

  const user = result.rows[0];

  // Update user as verified
  await query(
    `UPDATE users 
     SET is_email_verified = TRUE, email_verification_token = NULL, email_verification_expires = NULL, updated_at = NOW()
     WHERE id = $1`,
    [user.id]
  );

  res.json({
    success: true,
    message: 'Email verified successfully. You can now log in.'
  });
}));

// Login user
router.post('/login', asyncHandler(async (req, res) => {
  const { error, value } = validateLogin(req.body);
  if (error) {
    throw createError(error.details[0].message, 400);
  }

  const { email, password } = value;

  // Find user
  const result = await query(
    'SELECT id, email, password_hash, first_name, last_name, is_email_verified FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    throw createError('Invalid email or password', 401);
  }

  const user = result.rows[0];

  // Check password
  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    throw createError('Invalid email or password', 401);
  }

  // Check if email is verified
  if (!user.is_email_verified) {
    throw createError('Please verify your email before logging in', 401);
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      isEmailVerified: user.is_email_verified
    }
  });
}));

// Resend verification email
router.post('/resend-verification', asyncHandler(async (req, res) => {
  const { error, value } = validateEmail(req.body);
  if (error) {
    throw createError(error.details[0].message, 400);
  }

  const { email } = value;

  // Find unverified user
  const result = await query(
    'SELECT id, first_name, last_name FROM users WHERE email = $1 AND is_email_verified = FALSE',
    [email]
  );

  if (result.rows.length === 0) {
    // Don't reveal if email exists or is already verified
    return res.json({
      success: true,
      message: 'If an unverified account exists with this email, a verification email has been sent.'
    });
  }

  const user = result.rows[0];

  // Generate new verification token
  const verificationToken = uuidv4();
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Update user with new token
  await query(
    'UPDATE users SET email_verification_token = $1, email_verification_expires = $2 WHERE id = $3',
    [verificationToken, verificationExpires, user.id]
  );

  // Send verification email
  try {
    await sendVerificationEmail(email, verificationToken, `${user.first_name} ${user.last_name}`);
  } catch (emailError) {
    console.error('Failed to send verification email:', emailError);
    throw createError('Failed to send verification email', 500);
  }

  res.json({
    success: true,
    message: 'Verification email sent successfully.'
  });
}));

// Request password reset
router.post('/forgot-password', asyncHandler(async (req, res) => {
  const { error, value } = validateEmail(req.body);
  if (error) {
    throw createError(error.details[0].message, 400);
  }

  const { email } = value;

  // Find user
  const result = await query(
    'SELECT id, first_name, last_name FROM users WHERE email = $1 AND is_email_verified = TRUE',
    [email]
  );

  if (result.rows.length === 0) {
    // Don't reveal if email exists
    return res.json({
      success: true,
      message: 'If an account exists with this email, a password reset email has been sent.'
    });
  }

  const user = result.rows[0];

  // Generate reset token
  const resetToken = uuidv4();
  const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Update user with reset token
  await query(
    'UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE id = $3',
    [resetToken, resetExpires, user.id]
  );

  // Send reset email
  try {
    await sendPasswordResetEmail(email, resetToken, `${user.first_name} ${user.last_name}`);
  } catch (emailError) {
    console.error('Failed to send password reset email:', emailError);
    throw createError('Failed to send password reset email', 500);
  }

  res.json({
    success: true,
    message: 'Password reset email sent successfully.'
  });
}));

export default router;