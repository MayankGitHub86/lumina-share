# OAuth Setup Guide for Lumina Share

This guide helps you set up Google, Microsoft, and GitHub OAuth authentication for your Lumina Share platform.

## Overview
The OAuth integration allows users to sign in using their existing accounts from major providers (Google, Microsoft, GitHub), providing a seamless authentication experience.

## Prerequisites
- Node.js and npm installed
- Backend running on `http://localhost:3001`
- Frontend running on `http://localhost:8083`
- OAuth accounts with Google Cloud, Microsoft Azure, and GitHub

---

## 1. Google OAuth Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (e.g., "Lumina Share")
3. Enable the "Google+ API"

### Step 2: Create OAuth 2.0 Credentials
1. Go to **Credentials** in the left sidebar
2. Click **Create Credentials** → **OAuth client ID**
3. Choose **Web application**
4. Add the following to **Authorized JavaScript origins**:
   - `http://localhost:8083`
   - `http://localhost`
   - Your production domain (e.g., `https://yourdomain.com`)
5. Add to **Authorized redirect URIs**:
   - `http://localhost:8083`
   - Your production domain

### Step 3: Copy Client ID
1. Copy your **Client ID** (it looks like `XXXXX.apps.googleusercontent.com`)
2. Add it to `.env` file:
   ```
   VITE_GOOGLE_CLIENT_ID=your_client_id_here
   ```

---

## 2. Microsoft OAuth Setup

### Step 1: Create Azure App Registration
1. Go to [Azure Portal](https://portal.azure.com/)
2. Search for **App registrations**
3. Click **New registration**
4. Set **Redirect URI** to:
   - Platform: **Web**
   - URI: `http://localhost:8083`
   - Also add: `http://localhost:8083/auth/microsoft/callback`

### Step 2: Create Client Secret
1. Go to **Certificates & secrets**
2. Click **New client secret**
3. Set expiration to 12 months or longer
4. Copy the **Value** (not the ID)

### Step 3: Get Tenant ID
1. Go to **Overview** tab
2. Copy your **Tenant ID** (or use "common" for multi-tenant)

### Step 4: Update .env
```
VITE_MICROSOFT_CLIENT_ID=your_client_id
VITE_MICROSOFT_TENANT_ID=your_tenant_id_or_common
MICROSOFT_CLIENT_SECRET=your_client_secret
```

---

## 3. GitHub OAuth Setup

### Step 1: Create GitHub OAuth App
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the form:
   - **Application name**: Lumina Share
   - **Homepage URL**: `http://localhost:8083`
   - **Authorization callback URL**: `http://localhost:8083/auth/github/callback`

### Step 2: Copy Credentials
1. Copy your **Client ID**
2. Generate a new **Client Secret**
3. Add to `.env`:
   ```
   VITE_GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   ```

---

## 4. Backend Configuration

### Add OAuth Routes to Server
In `backend/src/server.ts`, add the OAuth route:

```typescript
import oauthRoutes from './routes/oauth.routes';

// ... other routes ...
app.use('/api/auth/oauth', oauthRoutes);
```

### Environment Variables
Create/update `backend/.env`:
```
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
JWT_SECRET=your_jwt_secret_key
```

---

## 5. Frontend Configuration

Your `.env` file in the root should have:
```
VITE_API_URL=http://localhost:3001/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_MICROSOFT_CLIENT_ID=your_microsoft_client_id
VITE_MICROSOFT_TENANT_ID=common
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

---

## 6. Testing OAuth

### Test Google Login
1. Go to `http://localhost:8083/login`
2. Click the Google button
3. Sign in with your Google account
4. Should redirect to home page and show success message

### Test Microsoft Login
1. Go to `http://localhost:8083/login`
2. Click the Microsoft button
3. Sign in with your Microsoft account
4. Should redirect to home page

### Test GitHub Login
1. Go to `http://localhost:8083/login`
2. Click the GitHub button
3. Authorize the app
4. Should be redirected to GitHub callback handler

---

## 7. Troubleshooting

### "Google script not loaded"
- Check internet connection
- Verify VITE_GOOGLE_CLIENT_ID is set correctly
- Clear browser cache

### "Microsoft Auth not initialized"
- Ensure VITE_MICROSOFT_CLIENT_ID is configured
- Check tenant ID is correct
- Verify redirect URI matches Azure app settings

### "GitHub authentication failed"
- Verify Client ID and Secret are correct
- Check redirect URI matches GitHub OAuth app settings
- Ensure backend has GITHUB_CLIENT_SECRET env var

### CORS Errors
- Backend should have CORS enabled for your frontend URL
- Check `.env` has correct VITE_API_URL
- Verify OAuth routes are registered on backend

---

## Production Deployment

When deploying to production:

1. **Update OAuth apps** with production domain:
   - Google: Add production domain to Authorized origins
   - Microsoft: Add production redirect URI
   - GitHub: Update homepage and callback URLs

2. **Use environment variables**:
   - Don't commit sensitive keys to version control
   - Use your hosting provider's environment variable management

3. **Enable HTTPS**:
   - OAuth requires HTTPS in production
   - Update callback URLs to use `https://`

4. **Update VITE_API_URL**:
   ```
   VITE_API_URL=https://yourdomain.com/api
   ```

---

## Support

For issues with:
- **Google OAuth**: Check [Google Identity Documentation](https://developers.google.com/identity)
- **Microsoft OAuth**: Check [Microsoft Identity Platform](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- **GitHub OAuth**: Check [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
