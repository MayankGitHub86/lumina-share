# 🔄 Update Existing Vercel Deployment

## Current Setup
- **Vercel URL:** lumina-share-lac.vercel.app
- **GitHub Repo:** MayankGitHub86/lumina-share
- **Status:** Ready to update with new features

---

## 🚀 Quick Update Steps

### Option 1: Automatic Deployment (Recommended)

Since your Vercel project is connected to GitHub, it will auto-deploy when you push:

1. **Your code is already pushed to GitHub** ✅
2. **Vercel will automatically detect the push**
3. **Wait 2-3 minutes for deployment**
4. **Check:** https://lumina-share-lac.vercel.app

### Option 2: Manual Deployment via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Find your project: `lumina-share`
3. Click "Deployments" tab
4. Click "Redeploy" button
5. Select "Use existing Build Cache" (optional)
6. Click "Redeploy"

### Option 3: Deploy via Vercel CLI

```bash
cd lumina-share/frontend
vercel --prod
```

---

## ⚙️ Update Environment Variables

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

### Add/Update These Variables:

```
VITE_API_URL=http://localhost:3001/api
```

**Note:** Update this to your backend URL once backend is deployed.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [x] Code pushed to GitHub
- [x] All features tested locally
- [x] Environment variables ready
- [ ] Backend deployed (or update API URL)
- [ ] OAuth redirect URLs updated
- [ ] Database accessible from Vercel

---

## 🔧 Vercel Project Configuration

### Root Directory
If Vercel is looking at the wrong folder:

1. Go to: Settings → General
2. Set **Root Directory:** `frontend`
3. Save changes

### Build Settings
Ensure these are set:

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Node.js Version
- **Version:** 18.x (recommended)

---

## 🌐 Update OAuth Redirect URLs

After deployment, update these:

### Google OAuth
1. Go to: https://console.cloud.google.com/apis/credentials
2. Edit your OAuth 2.0 Client
3. Add Authorized redirect URI:
   ```
   https://lumina-share-lac.vercel.app/login
   ```

### Microsoft OAuth
1. Go to: https://portal.azure.com
2. Navigate to App registrations
3. Add redirect URI:
   ```
   https://lumina-share-lac.vercel.app/login
   ```

---

## 🐛 Troubleshooting

### Deployment Failed
1. Check build logs in Vercel dashboard
2. Verify all dependencies in package.json
3. Check for TypeScript errors
4. Ensure environment variables are set

### API Not Working
1. Update `VITE_API_URL` in environment variables
2. Ensure backend is deployed and accessible
3. Check CORS settings in backend

### OAuth Not Working
1. Verify redirect URLs are updated
2. Check OAuth credentials in environment variables
3. Test with email/password login first

### Features Not Working
1. Clear browser cache
2. Check browser console for errors
3. Verify WebSocket connection (may need separate backend)

---

## 📊 Monitor Deployment

### Check Deployment Status
1. Go to: https://vercel.com/dashboard
2. Click on your project
3. View latest deployment
4. Check logs for any errors

### Test After Deployment
- [ ] Homepage loads
- [ ] Login works (email/password)
- [ ] OAuth login works (Google, Microsoft)
- [ ] Questions page loads
- [ ] Can create question
- [ ] Can post answer
- [ ] Real-time features work
- [ ] Avatar upload works
- [ ] Contact form works

---

## 🎯 Next Steps After Deployment

1. **Test all features** on production URL
2. **Update backend URL** if needed
3. **Monitor error logs** in Vercel
4. **Set up custom domain** (optional)
5. **Enable analytics** in Vercel

---

## 📝 Important Notes

### Backend Deployment
Your backend needs to be deployed separately because:
- Vercel serverless doesn't support WebSocket
- Long-running connections not supported
- Real-time features need persistent connections

**Recommended Backend Hosting:**
- Railway: https://railway.app
- Render: https://render.com
- Heroku: https://heroku.com

### Environment Variables
Make sure to add all required environment variables in Vercel:
- Go to: Project Settings → Environment Variables
- Add each variable
- Redeploy after adding variables

---

## ✅ Deployment Complete!

Once deployed, your app will be live at:
**https://lumina-share-lac.vercel.app**

All new features will be available:
- ✅ Comments & Mentions
- ✅ Reviews System
- ✅ Contact Form
- ✅ Avatar Upload
- ✅ Live Points & Leaderboard
- ✅ Real-time Notifications
- ✅ AI Suggestions
- ✅ Messages
- ✅ All Authentication Methods

---

**Last Updated:** December 26, 2024  
**Status:** Ready to deploy
