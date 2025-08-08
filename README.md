# Landlordy - Professional Rental Property Management

A comprehensive rental property management application for landlords to manage properties, tenants, payments, and communications.

## 🏠 Features

- **Property Management**: Add, edit, and track multiple rental properties
- **Tenant Management**: Comprehensive tenant profiles and lease tracking
- **Payment Processing**: Automated Tikkie payment links and tracking
- **WhatsApp Integration**: Automated rent reminders and communication
- **Analytics Dashboard**: Revenue tracking and occupancy analytics
- **Email Verification**: Secure user registration with email confirmation

## 🚀 Production Setup

### Prerequisites

1. **Backend API**: Set up a backend server with the following endpoints:
   - `POST /auth/register` - User registration
   - `POST /auth/login` - User login
   - `POST /auth/verify-email` - Email verification
   - `POST /auth/resend-verification` - Resend verification email
   - Protected routes for properties, tenants, payments, etc.

2. **Tikkie API Access**: 
   - Register at [Tikkie Developer Portal](https://developer.tikkie.me/)
   - Obtain API key and app token

3. **WhatsApp Business API**:
   - Set up WhatsApp Business API account
   - Get phone number ID and access token

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# API Configuration
VITE_API_URL=https://api.yourdomain.com

# Tikkie API
VITE_TIKKIE_API_KEY=your_tikkie_api_key
VITE_TIKKIE_APP_TOKEN=your_tikkie_app_token

# WhatsApp Business API
VITE_WHATSAPP_API_URL=https://graph.facebook.com/v18.0/your_phone_number_id
VITE_WHATSAPP_TOKEN=your_whatsapp_token
```

### Installation

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment

The app is configured for deployment on Netlify, Vercel, or any static hosting service.

For Netlify:
```bash
# Build command
npm run build

# Publish directory
dist
```

## 🔧 Backend Requirements

Your backend API should handle:

### Authentication Endpoints
- `POST /auth/register` - Create new user account
- `POST /auth/login` - Authenticate user
- `POST /auth/verify-email` - Verify email with token
- `POST /auth/resend-verification` - Resend verification email

### Protected Endpoints (require JWT token)
- `GET /properties` - Get user's properties
- `POST /properties` - Create new property
- `PUT /properties/:id` - Update property
- `DELETE /properties/:id` - Delete property
- `GET /tenants` - Get user's tenants
- `POST /tenants` - Create new tenant
- `GET /payments` - Get payment records
- `POST /payments` - Create payment record

### Email Service
Set up email service for:
- Email verification
- Password reset
- Payment notifications

### Database Schema
Required tables:
- `users` - User accounts
- `properties` - Rental properties
- `tenants` - Tenant information
- `payments` - Payment records
- `payment_links` - Tikkie payment links

## 🔐 Security Features

- JWT-based authentication
- Email verification required
- Secure API communication
- Input validation and sanitization
- HTTPS enforcement

## 📱 API Integrations

### Tikkie Integration
- Automated payment link creation
- Payment status tracking
- Real-time payment notifications

### WhatsApp Business API
- Automated rent reminders
- Payment confirmations
- Maintenance notifications

## 🎨 Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Authentication**: JWT tokens
- **API Integration**: Fetch API
- **Deployment**: Netlify/Vercel ready

## 📞 Support

For production support and custom development:
- Email: support@landlordy.nl
- Documentation: [API Docs](https://docs.landlordy.nl)

## 📄 License

Commercial license - Contact for pricing and terms.