# Login Error Fix

## Error Message
```
Unexpected token '<', '<!DOCTYPE '... is not valid JSON
```

## What This Means
The frontend is trying to parse HTML as JSON. This happens when the API request fails and returns an HTML error page instead of JSON.

## Root Causes & Solutions

### 1. Backend Not Running ⚠️
**Check**: Is your backend running?

```bash
# Terminal 1 - Start Backend
cd lumina-share/backend
npm run dev
```

Backend should show:
```
Server is running on http://localhost:3001
```

### 2. Wrong API URL
**Check**: Frontend .env file

File: `lumina-share/frontend/.env`
```
VITE_API_URL=http://localhost:3001/api
```

Make sure it's exactly this (no trailing slash after `/api`)

### 3. CORS Issues
**Check**: Backend CORS configuration

The backend should allow `http://localhost:8080`. This is already configured in `backend/src/server.js`.

### 4. Port Conflicts
**Check**: Make sure ports are correct
- Backend: `http://localhost:3001`
- Frontend: `http://localhost:8080`

## Quick Fix Steps

### Step 1: Restart Backend
```bash
cd lumina-share/backend
# Stop if running (Ctrl+C)
npm run dev
```

Wait for: `Server is running on http://localhost:3001`

### Step 2: Test Backend
Open browser: http://localhost:3001/api/health

Should see:
```json
{
  "success": true,
  "message": "SolveHub API is running",
  "environment": "development"
}
```

### Step 3: Restart Frontend
```bash
cd lumina-share/frontend
# Stop if running (Ctrl+C)
npm run dev
```

### Step 4: Clear Browser Cache
1. Press `Ctrl + Shift + Delete`
2. Clear "Cached images and files"
3. Refresh page

### Step 5: Try Login Again
Use these credentials:
- Email: `priya.sharma@example.com`
- Password: `password123`

## Improved Error Handling

I've updated the API service to:
- ✅ Check if response is JSON before parsing
- ✅ Show clear error messages
- ✅ Detect network errors
- ✅ Log non-JSON responses for debugging

## Test Login from Command Line

```bash
cd lumina-share/backend

# PowerShell
$body = @{email='priya.sharma@example.com';password='password123'} | ConvertTo-Json
Invoke-WebRequest -Uri http://localhost:3001/api/auth/login -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing
```

Should return:
```json
{
  "success": true,
  "data": {
    "user": {...},
    "token": "..."
  }
}
```

## Common Issues

### Issue 1: "Cannot connect to server"
**Solution**: Backend is not running. Start it with `npm run dev`

### Issue 2: "CORS error"
**Solution**: Make sure frontend is on port 8080 and backend is on port 3001

### Issue 3: "Invalid credentials"
**Solution**: Use the correct seeded user credentials:
- `priya.sharma@example.com` / `password123`
- `rahul.kumar@example.com` / `password123`
- `ananya.patel@example.com` / `password123`

### Issue 4: "User not found"
**Solution**: Database might be empty. Reseed:
```bash
cd lumina-share/backend
npm run prisma:seed:indian
```

## Verification Checklist

- [ ] Backend running on port 3001
- [ ] Frontend running on port 8080
- [ ] Health endpoint returns JSON
- [ ] Database has users (run `node check-questions.js`)
- [ ] Browser cache cleared
- [ ] Using correct credentials
- [ ] No CORS errors in console

## Still Not Working?

1. **Check Backend Console**: Look for errors
2. **Check Frontend Console**: Look for network errors
3. **Check Network Tab**: See what the actual response is
4. **Restart Both**: Stop and restart both backend and frontend
5. **Check .env Files**: Make sure they're correct

## Files Modified

- `frontend/src/lib/api.ts` - Added better error handling
- `LOGIN_FIX.md` - This guide

## Success Indicators

When login works, you should see:
- ✅ Toast notification: "Login successful! Welcome back."
- ✅ Redirect to dashboard
- ✅ User avatar in navbar
- ✅ No errors in console
