import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { asyncHandler, createError } from '../middleware/errorHandler';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get user profile
router.get('/profile', asyncHandler(async (req: AuthRequest, res) => {
  const result = await query(
    'SELECT id, email, first_name, last_name, is_email_verified, created_at FROM users WHERE id = $1',
    [req.user!.id]
  );

  if (result.rows.length === 0) {
    throw createError('User not found', 404);
  }

  const user = result.rows[0];

  res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      isEmailVerified: user.is_email_verified,
      createdAt: user.created_at
    }
  });
}));

// Update user profile
router.put('/profile', asyncHandler(async (req: AuthRequest, res) => {
  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    throw createError('First name and last name are required', 400);
  }

  const result = await query(
    `UPDATE users SET first_name = $1, last_name = $2, updated_at = NOW() 
     WHERE id = $3 
     RETURNING id, email, first_name, last_name, is_email_verified, created_at, updated_at`,
    [firstName, lastName, req.user!.id]
  );

  const user = result.rows[0];

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      isEmailVerified: user.is_email_verified,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    }
  });
}));

// Change password
router.put('/password', asyncHandler(async (req: AuthRequest, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw createError('Current password and new password are required', 400);
  }

  if (newPassword.length < 6) {
    throw createError('New password must be at least 6 characters long', 400);
  }

  // Get current password hash
  const result = await query(
    'SELECT password_hash FROM users WHERE id = $1',
    [req.user!.id]
  );

  if (result.rows.length === 0) {
    throw createError('User not found', 404);
  }

  // Verify current password
  const isValidPassword = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
  if (!isValidPassword) {
    throw createError('Current password is incorrect', 400);
  }

  // Hash new password
  const newPasswordHash = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS || '12'));

  // Update password
  await query(
    'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
    [newPasswordHash, req.user!.id]
  );

  res.json({
    success: true,
    message: 'Password updated successfully'
  });
}));

// Get user statistics
router.get('/stats', asyncHandler(async (req: AuthRequest, res) => {
  // Get properties count
  const propertiesResult = await query(
    'SELECT COUNT(*) as count FROM properties WHERE user_id = $1',
    [req.user!.id]
  );

  // Get tenants count
  const tenantsResult = await query(
    'SELECT COUNT(*) as count FROM tenants WHERE user_id = $1',
    [req.user!.id]
  );

  // Get total monthly revenue
  const revenueResult = await query(
    'SELECT COALESCE(SUM(monthly_revenue), 0) as total FROM properties WHERE user_id = $1',
    [req.user!.id]
  );

  // Get payment statistics
  const paymentsResult = await query(
    `SELECT 
       COUNT(*) as total_payments,
       COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_payments,
       COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_payments,
       COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_payments,
       COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) as total_collected
     FROM payments WHERE user_id = $1`,
    [req.user!.id]
  );

  const paymentStats = paymentsResult.rows[0];

  res.json({
    success: true,
    data: {
      properties: parseInt(propertiesResult.rows[0].count),
      tenants: parseInt(tenantsResult.rows[0].count),
      monthlyRevenue: parseFloat(revenueResult.rows[0].total),
      payments: {
        total: parseInt(paymentStats.total_payments),
        paid: parseInt(paymentStats.paid_payments),
        pending: parseInt(paymentStats.pending_payments),
        overdue: parseInt(paymentStats.overdue_payments),
        totalCollected: parseFloat(paymentStats.total_collected)
      }
    }
  });
}));

export default router;