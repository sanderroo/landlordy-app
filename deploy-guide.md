# 🚀 Landlordy Backend Deployment Guide

## Quick Deploy Options (Recommended)

### 1. 🚂 Railway (Easiest - Free Tier Available)

**Step 1:** Go to [railway.app](https://railway.app) and sign up

**Step 2:** Click "Deploy from GitHub repo"

**Step 3:** Connect your GitHub account and select your repository

**Step 4:** Railway will auto-detect the backend and deploy it

**Step 5:** Add environment variables in Railway dashboard:
```
NODE_ENV=production
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_characters
DATABASE_URL=postgresql://username:password@host:port/database
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@yourdomain.com
FRONTEND_URL=https://your-netlify-app.netlify.app
```

**Step 6:** Railway provides a PostgreSQL database automatically!

---

### 2. 🎨 Render (Great Free Tier)

**Step 1:** Go to [render.com](https://render.com) and sign up

**Step 2:** Click "New +" → "Web Service"

**Step 3:** Connect GitHub and select your repo

**Step 4:** Configure:
- **Build Command:** `cd backend && npm install && npm run build`
- **Start Command:** `cd backend && npm start`
- **Environment:** Node

**Step 5:** Add environment variables (same as Railway)

**Step 6:** Create PostgreSQL database in Render dashboard

---

### 3. ⚡ Vercel (Serverless)

**Step 1:** Install Vercel CLI
```bash
npm i -g vercel
```

**Step 2:** Deploy backend
```bash
cd backend
vercel --prod
```

**Step 3:** Add environment variables in Vercel dashboard

**Note:** You'll need external PostgreSQL (like Supabase or PlanetScale)

---

### 4. 🐳 DigitalOcean App Platform

**Step 1:** Go to [digitalocean.com](https://digitalocean.com)

**Step 2:** Create new App

**Step 3:** Connect GitHub repository

**Step 4:** DigitalOcean auto-detects Node.js app

**Step 5:** Add managed PostgreSQL database

---

## 🗄️ Database Options

### Option A: Managed Database (Recommended)
- **Railway:** Automatic PostgreSQL
- **Render:** Built-in PostgreSQL
- **Supabase:** Free PostgreSQL with dashboard
- **PlanetScale:** MySQL alternative

### Option B: Free Database Services
- **Supabase:** 500MB free PostgreSQL
- **PlanetScale:** 5GB free MySQL
- **MongoDB Atlas:** 512MB free
- **CockroachDB:** 5GB free PostgreSQL

---

## 📧 Email Service Setup

### Option A: Gmail SMTP (Free)
1. Enable 2-factor authentication on Gmail
2. Generate App Password
3. Use in SMTP_PASS environment variable

### Option B: SendGrid (Free Tier)
1. Sign up at sendgrid.com
2. Get API key
3. Use SendGrid SMTP settings

### Option C: Mailgun (Free Tier)
1. Sign up at mailgun.com
2. Verify domain
3. Use Mailgun SMTP settings

---

## 🔧 Environment Variables Template

```bash
# Server
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://user:pass@host:5432/landlordy

# JWT
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_characters
JWT_EXPIRES_IN=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=Landlordy

# Frontend
FRONTEND_URL=https://your-netlify-app.netlify.app

# API Keys (Optional - for integrations)
TIKKIE_API_KEY=your_tikkie_api_key
TIKKIE_APP_TOKEN=your_tikkie_app_token
WHATSAPP_API_URL=https://graph.facebook.com/v18.0/your_phone_number_id
WHATSAPP_TOKEN=your_whatsapp_business_token
```

---

## 🚀 Recommended: Railway Deployment (5 minutes)

**Why Railway?**
- ✅ Automatic PostgreSQL database
- ✅ Zero configuration deployment
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Environment variable management
- ✅ GitHub integration

**Steps:**
1. Push your code to GitHub
2. Go to railway.app → "Deploy from GitHub"
3. Select your repository
4. Add environment variables
5. Deploy! 🎉

Your API will be available at: `https://your-app-name.railway.app`

---

## 📱 Update Frontend

After deploying backend, update your frontend `.env`:

```bash
VITE_API_URL=https://your-backend-url.railway.app/api/v1
```

Then redeploy your Netlify frontend!

---

## 🔍 Testing Your API

Test your deployed API:

```bash
# Health check
curl https://your-backend-url.railway.app/health

# Register test
curl -X POST https://your-backend-url.railway.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'
```

---

## 🆘 Need Help?

If you run into issues:
1. Check the deployment logs in your platform dashboard
2. Verify all environment variables are set
3. Test database connection
4. Check CORS settings for your frontend domain

Your Landlordy backend will be live and ready for production! 🏠💰