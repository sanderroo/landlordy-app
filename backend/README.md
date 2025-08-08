# Landlordy Backend API

Professional rental property management backend API built with Node.js, Express, and PostgreSQL.

## 🚀 Features

- **User Authentication**: JWT-based auth with email verification
- **Property Management**: CRUD operations for rental properties
- **Tenant Management**: Comprehensive tenant profiles and lease tracking
- **Payment Processing**: Integration with Tikkie API for payment links
- **WhatsApp Integration**: Automated messaging for rent reminders
- **Email Service**: Automated email notifications
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Centralized error management

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- Tikkie API credentials
- WhatsApp Business API access
- SMTP email service

## 🛠 Installation

1. **Clone and install dependencies:**
```bash
cd backend
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Set up PostgreSQL database:**
```bash
# Create database
createdb landlordy

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://username:password@localhost:5432/landlordy
```

4. **Start the server:**
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## 🔧 Environment Variables

### Required Variables

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/landlordy

# JWT
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_characters

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@landlordy.nl

# Application
FRONTEND_URL=https://your-landlordy-app.netlify.app

# API Keys
TIKKIE_API_KEY=your_tikkie_api_key
TIKKIE_APP_TOKEN=your_tikkie_app_token
WHATSAPP_API_URL=https://graph.facebook.com/v18.0/your_phone_number_id
WHATSAPP_TOKEN=your_whatsapp_business_token
```

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/verify-email` - Verify email address
- `POST /api/v1/auth/resend-verification` - Resend verification email
- `POST /api/v1/auth/forgot-password` - Request password reset

### Properties
- `GET /api/v1/properties` - Get all properties
- `POST /api/v1/properties` - Create property
- `GET /api/v1/properties/:id` - Get single property
- `PUT /api/v1/properties/:id` - Update property
- `DELETE /api/v1/properties/:id` - Delete property

### Tenants
- `GET /api/v1/tenants` - Get all tenants
- `POST /api/v1/tenants` - Create tenant
- `GET /api/v1/tenants/:id` - Get single tenant
- `PUT /api/v1/tenants/:id` - Update tenant
- `DELETE /api/v1/tenants/:id` - Delete tenant

### Payments
- `GET /api/v1/payments` - Get all payments
- `POST /api/v1/payments` - Create payment
- `GET /api/v1/payments/:id` - Get single payment
- `PUT /api/v1/payments/:id` - Update payment
- `POST /api/v1/payments/:id/send-link` - Send Tikkie payment link
- `POST /api/v1/payments/:id/send-reminder` - Send payment reminder

### Users
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `PUT /api/v1/users/password` - Change password
- `GET /api/v1/users/stats` - Get user statistics

## 🗄 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  is_email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  email_verification_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Properties Table
```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  total_units INTEGER NOT NULL DEFAULT 1,
  occupied_units INTEGER NOT NULL DEFAULT 0,
  monthly_revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tenants Table
```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  unit_number VARCHAR(50) NOT NULL,
  rent_amount DECIMAL(10,2) NOT NULL,
  lease_start DATE NOT NULL,
  lease_end DATE NOT NULL,
  payment_day INTEGER NOT NULL DEFAULT 1,
  payment_time TIME DEFAULT '09:00',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Payments Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  payment_method VARCHAR(50),
  transaction_id VARCHAR(255),
  payment_link_sent BOOLEAN DEFAULT FALSE,
  reminders_sent INTEGER DEFAULT 0,
  last_reminder_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Security Features

- **JWT Authentication** with secure token generation
- **Password Hashing** using bcrypt with configurable rounds
- **Rate Limiting** to prevent abuse
- **Input Validation** using Joi schemas
- **SQL Injection Protection** via parameterized queries
- **CORS Configuration** for cross-origin requests
- **Helmet.js** for security headers
- **Email Verification** required for account activation

## 🚀 Deployment

### Using PM2 (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Build the application
npm run build

# Start with PM2
pm2 start dist/server.js --name "landlordy-api"

# Save PM2 configuration
pm2 save
pm2 startup
```

### Using Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### Environment Setup
```bash
# Production environment variables
NODE_ENV=production
PORT=3000

# Database (use connection pooling in production)
DATABASE_URL=postgresql://user:pass@host:5432/landlordy

# Security
JWT_SECRET=your_production_jwt_secret_minimum_32_characters
BCRYPT_ROUNDS=12

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📊 Monitoring

### Health Check
```bash
curl https://your-api-domain.com/health
```

### Logs
```bash
# PM2 logs
pm2 logs landlordy-api

# Application logs are written to console
# Configure log aggregation service in production
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Test API endpoints
curl -X POST https://your-api-domain.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check PostgreSQL is running
   - Verify DATABASE_URL is correct
   - Ensure database exists

2. **Email Not Sending**
   - Verify SMTP credentials
   - Check firewall settings
   - Test with a different SMTP provider

3. **Tikkie API Errors**
   - Verify API key and app token
   - Check Tikkie API documentation
   - Ensure proper request format

4. **WhatsApp API Errors**
   - Verify phone number ID and token
   - Check WhatsApp Business API setup
   - Ensure proper message format

## 📞 Support

For production support:
- Email: support@landlordy.nl
- Documentation: [API Docs](https://docs.landlordy.nl)

## 📄 License

Commercial license - Contact for pricing and terms.