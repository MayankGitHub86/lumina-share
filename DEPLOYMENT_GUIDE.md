# 🚀 Vercel Deployment Guide - SolveHub

## 📋 Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com
2. **GitHub Repository**: Code pushed to GitHub ✅
3. **MongoDB Atlas**: Database URL ready ✅
4. **Environment Variables**: All API keys ready ✅

---

## 🎯 Deployment Steps

### Step 1: Connect to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository: `MayankGitHub86/solvehub`
3. Select the `lumina-share` folder as root directory

### Step 2: Configure Project

**Framework Preset:** Vite
**Root Directory:** `lumina-share/frontend`
**Build Command:** `npm run build`
**Output Directory:** `dist`

### Step 3: Environment Variables

Add these environment variables in Vercel dashboard:

#### Frontend Environment Variables
```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

#### Backend Environment Variables (if deploying backend to Vercel)
```
DATABASE_URL=your_mongodb_atlas_url
JWT_SECRET=your_jwt_secret
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://lumina-share-lac.vercel.app

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret

# AI
SAMBANOVA_API_KEY=your_sambanova_api_key

# Email
EMAIL_USER=pandeymp8602@gmail.com
EMAIL_PASSWORD=your_email_password
```

---

## 📁 Project Structure for Vercel

### Option 1: Deploy Frontend Only (Recommended for now)

Deploy frontend to Vercel, keep backend on another service (Railway, Render, etc.)

**Vercel Configuration:**
- Root: `lumina-share/frontend`
- Framework: Vite
- Build: `npm run build`
- Output: `dist`

### Option 2: Deploy Both (Monorepo)

Use Vercel's monorepo support to deploy both frontend and backend.

---

## 🔧 Configuration Files

### Frontend (Already configured)
- ✅ `vite.config.ts` - Build configuration
- ✅ `package.json` - Dependencies
- ✅ `.env` - Environment variables (local)

### Backend (Needs Vercel configuration)
Create `vercel.json` in backend folder:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ]
}
```

---

## 🌐 Domain Configuration

Your domain: `lumina-share-lac.vercel.app`

### Update OAuth Redirect URLs

After deployment, update OAuth redirect URLs in:

1. **Google Cloud Console**
   - Authorized redirect URIs: `https://lumina-share-lac.vercel.app/login`

2. **Microsoft Azure**
   - Redirect URIs: `https://lumina-share-lac.vercel.app/login`

---

## ✅ Post-Deployment Checklist

- [ ] Frontend deployed successfully
- [ ] Backend deployed (or connected to existing backend)
- [ ] Environment variables configured
- [ ] Database connection working
- [ ] OAuth redirect URLs updated
- [ ] Test login functionality
- [ ] Test all features
- [ ] Check real-time features (WebSocket)
- [ ] Verify email sending
- [ ] Test AI suggestions

---

## 🐛 Common Issues & Solutions

### Issue 1: API Connection Failed
**Solution:** Update `VITE_API_URL` in Vercel environment variables

### Issue 2: OAuth Not Working
**Solution:** Update redirect URLs in OAuth provider dashboards

### Issue 3: Database Connection Error
**Solution:** Whitelist Vercel IPs in MongoDB Atlas (or allow all: 0.0.0.0/0)

### Issue 4: WebSocket Not Working
**Solution:** Vercel doesn't support WebSocket on serverless. Deploy backend to Railway/Render

### Issue 5: Build Failed
**Solution:** Check build logs, ensure all dependencies in package.json

---

## 🚀 Alternative Backend Hosting

Since Vercel serverless has limitations (WebSocket, long-running connections), consider:

### Railway (Recommended)
- ✅ WebSocket support
- ✅ Long-running processes
- ✅ Free tier available
- Deploy: https://railway.app

### Render
- ✅ WebSocket support
- ✅ Free tier
- Deploy: https://render.com

### Heroku
- ✅ Full Node.js support
- ✅ WebSocket support
- Deploy: https://heroku.com

---

## 📝 Deployment Commands

### Deploy Frontend to Vercel (CLI)
```bash
cd lumina-share/frontend
npm install -g vercel
vercel login
vercel --prod
```

### Deploy Backend to Railway
```bash
cd lumina-share/backend
npm install -g @railway/cli
railway login
railway init
railway up
```

---

## 🔐 Security Notes

1. **Never commit .env files**
2. **Use environment variables in Vercel dashboard**
3. **Rotate API keys regularly**
4. **Enable CORS only for your domain**
5. **Use HTTPS only**

---

## 📊 Monitoring

After deployment, monitor:
- Vercel Analytics
- Error logs in Vercel dashboard
- Database connections in MongoDB Atlas
- API response times

---

**Last Updated:** December 26, 2024  
**Target Domain:** lumina-share-lac.vercel.app  
**Status:** Ready for deployment
