import { Router } from 'express';
import { query } from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { validateTenant } from '../utils/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get all tenants for user
router.get('/', asyncHandler(async (req: AuthRequest, res) => {
  const result = await query(
    `SELECT t.id, t.name, t.email, t.phone, t.unit_number, t.rent_amount, 
            t.lease_start, t.lease_end, t.payment_day, t.payment_time,
            t.created_at, t.updated_at, p.name as property_name, p.id as property_id
     FROM tenants t
     JOIN properties p ON t.property_id = p.id
     WHERE t.user_id = $1 
     ORDER BY t.created_at DESC`,
    [req.user!.id]
  );

  res.json({
    success: true,
    data: result.rows.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      propertyId: row.property_id,
      propertyName: row.property_name,
      unitNumber: row.unit_number,
      rentAmount: parseFloat(row.rent_amount),
      leaseStart: row.lease_start,
      leaseEnd: row.lease_end,
      paymentDay: row.payment_day,
      paymentTime: row.payment_time,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }))
  });
}));

// Get single tenant
router.get('/:id', asyncHandler(async (req: AuthRequest, res) => {
  const result = await query(
    `SELECT t.id, t.name, t.email, t.phone, t.unit_number, t.rent_amount, 
            t.lease_start, t.lease_end, t.payment_day, t.payment_time,
            t.created_at, t.updated_at, p.name as property_name, p.id as property_id
     FROM tenants t
     JOIN properties p ON t.property_id = p.id
     WHERE t.id = $1 AND t.user_id = $2`,
    [req.params.id, req.user!.id]
  );

  if (result.rows.length === 0) {
    throw createError('Tenant not found', 404);
  }

  const tenant = result.rows[0];

  res.json({
    success: true,
    data: {
      id: tenant.id,
      name: tenant.name,
      email: tenant.email,
      phone: tenant.phone,
      propertyId: tenant.property_id,
      propertyName: tenant.property_name,
      unitNumber: tenant.unit_number,
      rentAmount: parseFloat(tenant.rent_amount),
      leaseStart: tenant.lease_start,
      leaseEnd: tenant.lease_end,
      paymentDay: tenant.payment_day,
      paymentTime: tenant.payment_time,
      createdAt: tenant.created_at,
      updatedAt: tenant.updated_at
    }
  });
}));

// Create new tenant
router.post('/', asyncHandler(async (req: AuthRequest, res) => {
  const { error, value } = validateTenant(req.body);
  if (error) {
    throw createError(error.details[0].message, 400);
  }

  const { 
    name, email, phone, propertyId, unitNumber, rentAmount, 
    leaseStart, leaseEnd, paymentDay, paymentTime 
  } = value;

  // Verify property belongs to user
  const propertyCheck = await query(
    'SELECT name FROM properties WHERE id = $1 AND user_id = $2',
    [propertyId, req.user!.id]
  );

  if (propertyCheck.rows.length === 0) {
    throw createError('Property not found', 404);
  }

  // Check if unit number is already taken
  const unitCheck = await query(
    'SELECT id FROM tenants WHERE property_id = $1 AND unit_number = $2',
    [propertyId, unitNumber]
  );

  if (unitCheck.rows.length > 0) {
    throw createError('Unit number already occupied', 400);
  }

  const result = await query(
    `INSERT INTO tenants (user_id, property_id, name, email, phone, unit_number, rent_amount, lease_start, lease_end, payment_day, payment_time)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING id, name, email, phone, unit_number, rent_amount, lease_start, lease_end, payment_day, payment_time, created_at, updated_at`,
    [req.user!.id, propertyId, name, email, phone, unitNumber, rentAmount, leaseStart, leaseEnd, paymentDay, paymentTime]
  );

  const tenant = result.rows[0];

  res.status(201).json({
    success: true,
    message: 'Tenant created successfully',
    data: {
      id: tenant.id,
      name: tenant.name,
      email: tenant.email,
      phone: tenant.phone,
      propertyId: propertyId,
      propertyName: propertyCheck.rows[0].name,
      unitNumber: tenant.unit_number,
      rentAmount: parseFloat(tenant.rent_amount),
      leaseStart: tenant.lease_start,
      leaseEnd: tenant.lease_end,
      paymentDay: tenant.payment_day,
      paymentTime: tenant.payment_time,
      createdAt: tenant.created_at,
      updatedAt: tenant.updated_at
    }
  });
}));

// Update tenant
router.put('/:id', asyncHandler(async (req: AuthRequest, res) => {
  const { error, value } = validateTenant(req.body);
  if (error) {
    throw createError(error.details[0].message, 400);
  }

  const { 
    name, email, phone, propertyId, unitNumber, rentAmount, 
    leaseStart, leaseEnd, paymentDay, paymentTime 
  } = value;

  // Check if tenant exists and belongs to user
  const existingTenant = await query(
    'SELECT id, property_id FROM tenants WHERE id = $1 AND user_id = $2',
    [req.params.id, req.user!.id]
  );

  if (existingTenant.rows.length === 0) {
    throw createError('Tenant not found', 404);
  }

  // Verify property belongs to user
  const propertyCheck = await query(
    'SELECT name FROM properties WHERE id = $1 AND user_id = $2',
    [propertyId, req.user!.id]
  );

  if (propertyCheck.rows.length === 0) {
    throw createError('Property not found', 404);
  }

  // Check if unit number is already taken (excluding current tenant)
  const unitCheck = await query(
    'SELECT id FROM tenants WHERE property_id = $1 AND unit_number = $2 AND id != $3',
    [propertyId, unitNumber, req.params.id]
  );

  if (unitCheck.rows.length > 0) {
    throw createError('Unit number already occupied', 400);
  }

  const result = await query(
    `UPDATE tenants 
     SET property_id = $1, name = $2, email = $3, phone = $4, unit_number = $5, rent_amount = $6, 
         lease_start = $7, lease_end = $8, payment_day = $9, payment_time = $10, updated_at = NOW()
     WHERE id = $11 AND user_id = $12
     RETURNING id, name, email, phone, unit_number, rent_amount, lease_start, lease_end, payment_day, payment_time, created_at, updated_at`,
    [propertyId, name, email, phone, unitNumber, rentAmount, leaseStart, leaseEnd, paymentDay, paymentTime, req.params.id, req.user!.id]
  );

  const tenant = result.rows[0];

  res.json({
    success: true,
    message: 'Tenant updated successfully',
    data: {
      id: tenant.id,
      name: tenant.name,
      email: tenant.email,
      phone: tenant.phone,
      propertyId: propertyId,
      propertyName: propertyCheck.rows[0].name,
      unitNumber: tenant.unit_number,
      rentAmount: parseFloat(tenant.rent_amount),
      leaseStart: tenant.lease_start,
      leaseEnd: tenant.lease_end,
      paymentDay: tenant.payment_day,
      paymentTime: tenant.payment_time,
      createdAt: tenant.created_at,
      updatedAt: tenant.updated_at
    }
  });
}));

// Delete tenant
router.delete('/:id', asyncHandler(async (req: AuthRequest, res) => {
  // Check if tenant exists and belongs to user
  const existingTenant = await query(
    'SELECT id FROM tenants WHERE id = $1 AND user_id = $2',
    [req.params.id, req.user!.id]
  );

  if (existingTenant.rows.length === 0) {
    throw createError('Tenant not found', 404);
  }

  // Check if tenant has pending payments
  const payments = await query(
    'SELECT COUNT(*) as count FROM payments WHERE tenant_id = $1 AND status != $2',
    [req.params.id, 'paid']
  );

  if (parseInt(payments.rows[0].count) > 0) {
    throw createError('Cannot delete tenant with pending payments', 400);
  }

  await query('DELETE FROM tenants WHERE id = $1 AND user_id = $2', [req.params.id, req.user!.id]);

  res.json({
    success: true,
    message: 'Tenant deleted successfully'
  });
}));

export default router;