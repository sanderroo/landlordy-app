import { Router } from 'express';
import { query } from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { validateProperty } from '../utils/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get all properties for user
router.get('/', asyncHandler(async (req: AuthRequest, res) => {
  const result = await query(
    `SELECT id, name, address, total_units, occupied_units, monthly_revenue, created_at, updated_at
     FROM properties WHERE user_id = $1 ORDER BY created_at DESC`,
    [req.user!.id]
  );

  res.json({
    success: true,
    data: result.rows.map(row => ({
      id: row.id,
      name: row.name,
      address: row.address,
      totalUnits: row.total_units,
      occupiedUnits: row.occupied_units,
      monthlyRevenue: parseFloat(row.monthly_revenue),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }))
  });
}));

// Get single property
router.get('/:id', asyncHandler(async (req: AuthRequest, res) => {
  const result = await query(
    `SELECT id, name, address, total_units, occupied_units, monthly_revenue, created_at, updated_at
     FROM properties WHERE id = $1 AND user_id = $2`,
    [req.params.id, req.user!.id]
  );

  if (result.rows.length === 0) {
    throw createError('Property not found', 404);
  }

  const property = result.rows[0];

  res.json({
    success: true,
    data: {
      id: property.id,
      name: property.name,
      address: property.address,
      totalUnits: property.total_units,
      occupiedUnits: property.occupied_units,
      monthlyRevenue: parseFloat(property.monthly_revenue),
      createdAt: property.created_at,
      updatedAt: property.updated_at
    }
  });
}));

// Create new property
router.post('/', asyncHandler(async (req: AuthRequest, res) => {
  const { error, value } = validateProperty(req.body);
  if (error) {
    throw createError(error.details[0].message, 400);
  }

  const { name, address, totalUnits, occupiedUnits, monthlyRevenue } = value;

  const result = await query(
    `INSERT INTO properties (user_id, name, address, total_units, occupied_units, monthly_revenue)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, name, address, total_units, occupied_units, monthly_revenue, created_at, updated_at`,
    [req.user!.id, name, address, totalUnits, occupiedUnits || 0, monthlyRevenue || 0]
  );

  const property = result.rows[0];

  res.status(201).json({
    success: true,
    message: 'Property created successfully',
    data: {
      id: property.id,
      name: property.name,
      address: property.address,
      totalUnits: property.total_units,
      occupiedUnits: property.occupied_units,
      monthlyRevenue: parseFloat(property.monthly_revenue),
      createdAt: property.created_at,
      updatedAt: property.updated_at
    }
  });
}));

// Update property
router.put('/:id', asyncHandler(async (req: AuthRequest, res) => {
  const { error, value } = validateProperty(req.body);
  if (error) {
    throw createError(error.details[0].message, 400);
  }

  const { name, address, totalUnits, occupiedUnits, monthlyRevenue } = value;

  // Check if property exists and belongs to user
  const existingProperty = await query(
    'SELECT id FROM properties WHERE id = $1 AND user_id = $2',
    [req.params.id, req.user!.id]
  );

  if (existingProperty.rows.length === 0) {
    throw createError('Property not found', 404);
  }

  const result = await query(
    `UPDATE properties 
     SET name = $1, address = $2, total_units = $3, occupied_units = $4, monthly_revenue = $5, updated_at = NOW()
     WHERE id = $6 AND user_id = $7
     RETURNING id, name, address, total_units, occupied_units, monthly_revenue, created_at, updated_at`,
    [name, address, totalUnits, occupiedUnits, monthlyRevenue, req.params.id, req.user!.id]
  );

  const property = result.rows[0];

  res.json({
    success: true,
    message: 'Property updated successfully',
    data: {
      id: property.id,
      name: property.name,
      address: property.address,
      totalUnits: property.total_units,
      occupiedUnits: property.occupied_units,
      monthlyRevenue: parseFloat(property.monthly_revenue),
      createdAt: property.created_at,
      updatedAt: property.updated_at
    }
  });
}));

// Delete property
router.delete('/:id', asyncHandler(async (req: AuthRequest, res) => {
  // Check if property exists and belongs to user
  const existingProperty = await query(
    'SELECT id FROM properties WHERE id = $1 AND user_id = $2',
    [req.params.id, req.user!.id]
  );

  if (existingProperty.rows.length === 0) {
    throw createError('Property not found', 404);
  }

  // Check if property has tenants
  const tenants = await query(
    'SELECT COUNT(*) as count FROM tenants WHERE property_id = $1',
    [req.params.id]
  );

  if (parseInt(tenants.rows[0].count) > 0) {
    throw createError('Cannot delete property with active tenants', 400);
  }

  await query('DELETE FROM properties WHERE id = $1 AND user_id = $2', [req.params.id, req.user!.id]);

  res.json({
    success: true,
    message: 'Property deleted successfully'
  });
}));

export default router;