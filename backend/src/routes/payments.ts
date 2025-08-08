import { Router } from 'express';
import { query } from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { validatePayment } from '../utils/validation';
import { createTikkiePaymentLink } from '../services/tikkieService';
import { sendWhatsAppMessage } from '../services/whatsappService';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get all payments for user
router.get('/', asyncHandler(async (req: AuthRequest, res) => {
  const { status, propertyId, tenantId, month } = req.query;
  
  let whereClause = 'WHERE p.user_id = $1';
  const params = [req.user!.id];
  let paramCount = 1;

  if (status) {
    whereClause += ` AND p.status = $${++paramCount}`;
    params.push(status as string);
  }

  if (propertyId) {
    whereClause += ` AND p.property_id = $${++paramCount}`;
    params.push(propertyId as string);
  }

  if (tenantId) {
    whereClause += ` AND p.tenant_id = $${++paramCount}`;
    params.push(tenantId as string);
  }

  if (month) {
    whereClause += ` AND DATE_TRUNC('month', p.due_date) = DATE_TRUNC('month', $${++paramCount}::date)`;
    params.push(month as string);
  }

  const result = await query(
    `SELECT p.id, p.amount, p.due_date, p.paid_date, p.status, p.payment_method, 
            p.transaction_id, p.payment_link_sent, p.reminders_sent, p.last_reminder_date, p.notes,
            p.created_at, p.updated_at,
            t.name as tenant_name, t.email as tenant_email, t.phone as tenant_phone, t.unit_number,
            pr.name as property_name
     FROM payments p
     JOIN tenants t ON p.tenant_id = t.id
     JOIN properties pr ON p.property_id = pr.id
     ${whereClause}
     ORDER BY p.due_date DESC, p.created_at DESC`,
    params
  );

  res.json({
    success: true,
    data: result.rows.map(row => ({
      id: row.id,
      tenantId: row.tenant_id,
      tenantName: row.tenant_name,
      tenantEmail: row.tenant_email,
      tenantPhone: row.tenant_phone,
      propertyName: row.property_name,
      unitNumber: row.unit_number,
      amount: parseFloat(row.amount),
      dueDate: row.due_date,
      paidDate: row.paid_date,
      status: row.status,
      paymentMethod: row.payment_method,
      transactionId: row.transaction_id,
      paymentLinkSent: row.payment_link_sent,
      remindersSent: row.reminders_sent,
      lastReminderDate: row.last_reminder_date,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }))
  });
}));

// Get single payment
router.get('/:id', asyncHandler(async (req: AuthRequest, res) => {
  const result = await query(
    `SELECT p.id, p.amount, p.due_date, p.paid_date, p.status, p.payment_method, 
            p.transaction_id, p.payment_link_sent, p.reminders_sent, p.last_reminder_date, p.notes,
            p.created_at, p.updated_at,
            t.name as tenant_name, t.email as tenant_email, t.phone as tenant_phone, t.unit_number,
            pr.name as property_name
     FROM payments p
     JOIN tenants t ON p.tenant_id = t.id
     JOIN properties pr ON p.property_id = pr.id
     WHERE p.id = $1 AND p.user_id = $2`,
    [req.params.id, req.user!.id]
  );

  if (result.rows.length === 0) {
    throw createError('Payment not found', 404);
  }

  const payment = result.rows[0];

  res.json({
    success: true,
    data: {
      id: payment.id,
      tenantName: payment.tenant_name,
      tenantEmail: payment.tenant_email,
      tenantPhone: payment.tenant_phone,
      propertyName: payment.property_name,
      unitNumber: payment.unit_number,
      amount: parseFloat(payment.amount),
      dueDate: payment.due_date,
      paidDate: payment.paid_date,
      status: payment.status,
      paymentMethod: payment.payment_method,
      transactionId: payment.transaction_id,
      paymentLinkSent: payment.payment_link_sent,
      remindersSent: payment.reminders_sent,
      lastReminderDate: payment.last_reminder_date,
      notes: payment.notes,
      createdAt: payment.created_at,
      updatedAt: payment.updated_at
    }
  });
}));

// Create new payment
router.post('/', asyncHandler(async (req: AuthRequest, res) => {
  const { error, value } = validatePayment(req.body);
  if (error) {
    throw createError(error.details[0].message, 400);
  }

  const { tenantId, amount, dueDate, notes } = value;

  // Verify tenant belongs to user
  const tenantCheck = await query(
    'SELECT property_id FROM tenants WHERE id = $1 AND user_id = $2',
    [tenantId, req.user!.id]
  );

  if (tenantCheck.rows.length === 0) {
    throw createError('Tenant not found', 404);
  }

  const propertyId = tenantCheck.rows[0].property_id;

  const result = await query(
    `INSERT INTO payments (user_id, tenant_id, property_id, amount, due_date, notes)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, amount, due_date, status, notes, created_at, updated_at`,
    [req.user!.id, tenantId, propertyId, amount, dueDate, notes]
  );

  const payment = result.rows[0];

  res.status(201).json({
    success: true,
    message: 'Payment created successfully',
    data: {
      id: payment.id,
      tenantId: tenantId,
      propertyId: propertyId,
      amount: parseFloat(payment.amount),
      dueDate: payment.due_date,
      status: payment.status,
      notes: payment.notes,
      createdAt: payment.created_at,
      updatedAt: payment.updated_at
    }
  });
}));

// Update payment
router.put('/:id', asyncHandler(async (req: AuthRequest, res) => {
  const { status, paidDate, paymentMethod, transactionId, notes } = req.body;

  // Check if payment exists and belongs to user
  const existingPayment = await query(
    'SELECT id FROM payments WHERE id = $1 AND user_id = $2',
    [req.params.id, req.user!.id]
  );

  if (existingPayment.rows.length === 0) {
    throw createError('Payment not found', 404);
  }

  const result = await query(
    `UPDATE payments 
     SET status = COALESCE($1, status), paid_date = COALESCE($2, paid_date), 
         payment_method = COALESCE($3, payment_method), transaction_id = COALESCE($4, transaction_id),
         notes = COALESCE($5, notes), updated_at = NOW()
     WHERE id = $6 AND user_id = $7
     RETURNING id, amount, due_date, paid_date, status, payment_method, transaction_id, notes, created_at, updated_at`,
    [status, paidDate, paymentMethod, transactionId, notes, req.params.id, req.user!.id]
  );

  const payment = result.rows[0];

  res.json({
    success: true,
    message: 'Payment updated successfully',
    data: {
      id: payment.id,
      amount: parseFloat(payment.amount),
      dueDate: payment.due_date,
      paidDate: payment.paid_date,
      status: payment.status,
      paymentMethod: payment.payment_method,
      transactionId: payment.transaction_id,
      notes: payment.notes,
      createdAt: payment.created_at,
      updatedAt: payment.updated_at
    }
  });
}));

// Send payment link
router.post('/:id/send-link', asyncHandler(async (req: AuthRequest, res) => {
  // Get payment and tenant details
  const result = await query(
    `SELECT p.id, p.amount, p.due_date, t.name as tenant_name, t.phone as tenant_phone, 
            pr.name as property_name, t.unit_number
     FROM payments p
     JOIN tenants t ON p.tenant_id = t.id
     JOIN properties pr ON p.property_id = pr.id
     WHERE p.id = $1 AND p.user_id = $2`,
    [req.params.id, req.user!.id]
  );

  if (result.rows.length === 0) {
    throw createError('Payment not found', 404);
  }

  const payment = result.rows[0];

  try {
    // Create Tikkie payment link
    const tikkieLink = await createTikkiePaymentLink({
      amountInCents: Math.round(parseFloat(payment.amount) * 100),
      description: `Huur ${payment.property_name} ${payment.unit_number}`,
      externalId: `payment_${payment.id}`,
      referenceId: payment.id
    });

    // Save payment link to database
    await query(
      `INSERT INTO payment_links (user_id, tenant_id, payment_id, tikkie_token, tikkie_url, amount_cents, description, external_id, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        req.user!.id,
        result.rows[0].tenant_id,
        payment.id,
        tikkieLink.paymentRequestToken,
        tikkieLink.url,
        Math.round(parseFloat(payment.amount) * 100),
        `Huur ${payment.property_name} ${payment.unit_number}`,
        `payment_${payment.id}`,
        tikkieLink.expiryDate
      ]
    );

    // Send WhatsApp message
    const message = `Hallo ${payment.tenant_name}! Je huur van €${payment.amount} voor ${payment.property_name} ${payment.unit_number} is verschuldigd op ${new Date(payment.due_date).toLocaleDateString('nl-NL')}. Betaal eenvoudig via deze Tikkie link: ${tikkieLink.url}`;
    
    await sendWhatsAppMessage(payment.tenant_phone, message);

    // Update payment as link sent
    await query(
      'UPDATE payments SET payment_link_sent = TRUE, updated_at = NOW() WHERE id = $1',
      [payment.id]
    );

    res.json({
      success: true,
      message: 'Payment link sent successfully',
      data: {
        tikkieUrl: tikkieLink.url,
        expiryDate: tikkieLink.expiryDate
      }
    });
  } catch (error) {
    console.error('Failed to send payment link:', error);
    throw createError('Failed to send payment link', 500);
  }
}));

// Send reminder
router.post('/:id/send-reminder', asyncHandler(async (req: AuthRequest, res) => {
  // Get payment and tenant details
  const result = await query(
    `SELECT p.id, p.amount, p.due_date, p.reminders_sent, t.name as tenant_name, t.phone as tenant_phone, 
            pr.name as property_name, t.unit_number
     FROM payments p
     JOIN tenants t ON p.tenant_id = t.id
     JOIN properties pr ON p.property_id = pr.id
     WHERE p.id = $1 AND p.user_id = $2`,
    [req.params.id, req.user!.id]
  );

  if (result.rows.length === 0) {
    throw createError('Payment not found', 404);
  }

  const payment = result.rows[0];

  try {
    // Send WhatsApp reminder
    const daysOverdue = Math.floor((Date.now() - new Date(payment.due_date).getTime()) / (1000 * 60 * 60 * 24));
    const message = `Herinnering: Je huur van €${payment.amount} voor ${payment.property_name} ${payment.unit_number} is ${daysOverdue} dagen geleden verschuldigd. Gelieve zo spoedig mogelijk te betalen.`;
    
    await sendWhatsAppMessage(payment.tenant_phone, message);

    // Update reminder count
    await query(
      'UPDATE payments SET reminders_sent = reminders_sent + 1, last_reminder_date = NOW(), updated_at = NOW() WHERE id = $1',
      [payment.id]
    );

    res.json({
      success: true,
      message: 'Reminder sent successfully',
      data: {
        remindersSent: payment.reminders_sent + 1
      }
    });
  } catch (error) {
    console.error('Failed to send reminder:', error);
    throw createError('Failed to send reminder', 500);
  }
}));

export default router;