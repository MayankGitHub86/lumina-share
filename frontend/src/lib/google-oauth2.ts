// Google OAuth2 Direct Implementation (without One Tap)
// This bypasses the FedCM and origin issues

export const initiateGoogleOAuth = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = `${window.location.origin}/login`; // Changed to /login
  const scope = 'openid email profile';
  const responseType = 'code';
  const state = Math.random().toString(36).substring(7);
  
  // Store state for verification
  sessionStorage.setItem('google_oauth_state', state);
  
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('response_type', responseType);
  authUrl.searchParams.append('scope', scope);
  authUrl.searchParams.append('state', state);
  authUrl.searchParams.append('access_type', 'online');
  authUrl.searchParams.append('prompt', 'select_account');
  
  // Redirect to Google OAuth
  window.location.href = authUrl.toString();
};

export const handleGoogleCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  const storedState = sessionStorage.getItem('google_oauth_state');
  
  if (!code || !state || state !== storedState) {
    throw new Error('Invalid OAuth callback');
  }
  
  // Clear stored state
  sessionStorage.removeItem('google_oauth_state');
  
  // Exchange code for token on backend
  const response = await fetch(
    `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/auth/oauth/google/callback`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirectUri: `${window.location.origin}/login` }),
    }
  );
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error?.message || 'Google authentication failed');
  }
  
  return response.json();
};
