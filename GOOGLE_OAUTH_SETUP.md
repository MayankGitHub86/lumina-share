# Google OAuth Setup Instructions

## Current Error
```
[GSI_LOGGER]: The given origin is not allowed for the given client ID.
```

This means `http://localhost:8080` is not authorized in your Google Cloud Console.

## Step-by-Step Fix

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 2. Navigate to Credentials
- Click on the menu (☰) → **APIs & Services** → **Credentials**

### 3. Find Your OAuth Client
Look for: `317615895239-hjk5cmerhr3cku0givucq52uportmf9r.apps.googleusercontent.com`

### 4. Edit the OAuth Client
Click on the client ID name to edit it.

### 5. Add Authorized JavaScript Origins
In the **Authorized JavaScript origins** section, add these EXACT URLs:
```
http://localhost:8080
http://localhost:3001
```

**IMPORTANT:** 
- Do NOT add trailing slashes (/)
- Use `http://` not `https://` for localhost
- Make sure there are no extra spaces

### 6. Add Authorized Redirect URIs (Optional but recommended)
In the **Authorized redirect URIs** section, add:
```
http://localhost:8080
http://localhost:8080/login
http://localhost:8080/signup
```

### 7. Save Changes
Click the **SAVE** button at the bottom.

### 8. Wait for Propagation
Google's changes can take 5-10 minutes to propagate. Clear your browser cache or use incognito mode to test.

## Verification Checklist
- [ ] Added `http://localhost:8080` to Authorized JavaScript origins
- [ ] Added `http://localhost:3001` to Authorized JavaScript origins  
- [ ] Clicked SAVE
- [ ] Waited 5-10 minutes
- [ ] Cleared browser cache or opened incognito window
- [ ] Restarted the servers

## Alternative: Create New OAuth Client
If the above doesn't work, you might need to create a new OAuth 2.0 Client ID:

1. In Credentials page, click **+ CREATE CREDENTIALS** → **OAuth client ID**
2. Application type: **Web application**
3. Name: `SolveHub Local Development`
4. Authorized JavaScript origins:
   - `http://localhost:8080`
   - `http://localhost:3001`
5. Authorized redirect URIs:
   - `http://localhost:8080`
6. Click **CREATE**
7. Copy the new Client ID and update `lumina-share/frontend/.env`:
   ```
   VITE_GOOGLE_CLIENT_ID=your_new_client_id_here
   ```

## Current Configuration
- **Client ID:** 317615895239-hjk5cmerhr3cku0givucq52uportmf9r.apps.googleusercontent.com
- **Frontend URL:** http://localhost:8080
- **Backend URL:** http://localhost:3001

## Testing
After making changes:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Or open an incognito/private window
3. Go to http://localhost:8080/login
4. Click "Google" button
5. Should see Google sign-in popup without errors
