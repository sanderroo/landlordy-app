# 🏠 Landlordy - Complete Rental Property Management

## 🚀 Quick Start Guide

This is a complete rental property management system with:
- Frontend: React + TypeScript (deployed on Netlify)
- Backend: Node.js + Express + PostgreSQL (ready for Railway deployment)

## 📁 Project Structure

```
/
├── src/                 # Frontend React app
├── backend/            # Backend API server
├── public/             # Static assets
└── README-DEPLOYMENT.md # This file
```

## 🔧 Backend Deployment (Railway)

1. Go to [railway.app](https://railway.app)
2. Click "Deploy from GitHub repo"
3. Select this repository
4. Railway will auto-detect the backend
5. Add environment variables (see backend/.env.example)
6. Deploy!

## 📱 Frontend Configuration

After backend deployment, update your Netlify environment variables:
```
VITE_API_URL=https://your-railway-app.railway.app/api/v1
```

## 🎯 Features

- User authentication with email verification
- Property management
- Tenant management
- Payment tracking with Tikkie integration
- WhatsApp messaging for rent reminders
- Analytics and reporting
- Automated payment reminders

## 🔐 Required Environment Variables

See `backend/.env.example` for all required environment variables.

## 📞 Support

This is a production-ready rental property management system.