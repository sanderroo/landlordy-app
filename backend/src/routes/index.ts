import { Application } from 'express';
import authRoutes from './auth';
import propertyRoutes from './properties';
import tenantRoutes from './tenants';
import paymentRoutes from './payments';
import userRoutes from './users';

export function setupRoutes(app: Application): void {
  // API version prefix
  const API_PREFIX = '/api/v1';
  
  // Mount routes
  app.use(`${API_PREFIX}/auth`, authRoutes);
  app.use(`${API_PREFIX}/properties`, propertyRoutes);
  app.use(`${API_PREFIX}/tenants`, tenantRoutes);
  app.use(`${API_PREFIX}/payments`, paymentRoutes);
  app.use(`${API_PREFIX}/users`, userRoutes);
  
  // API info endpoint
  app.get(`${API_PREFIX}`, (req, res) => {
    res.json({
      name: 'Landlordy API',
      version: '1.0.0',
      description: 'Professional rental property management API',
      endpoints: {
        auth: `${API_PREFIX}/auth`,
        properties: `${API_PREFIX}/properties`,
        tenants: `${API_PREFIX}/tenants`,
        payments: `${API_PREFIX}/payments`,
        users: `${API_PREFIX}/users`
      }
    });
  });
}