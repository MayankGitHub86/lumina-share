// GitHub OAuth2 Implementation

export const initiateGitHubOAuth = () => {
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const redirectUri = `${window.location.origin}/login`;
  const scope = 'read:user user:email';
  const state = Math.random().toString(36).substring(7);
  
  // Store state for verification
  sessionStorage.setItem('github_oauth_state', state);
  
  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('scope', scope);
  authUrl.searchParams.append('state', state);
  authUrl.searchParams.append('allow_signup', 'true');
  
  // Redirect to GitHub OAuth
  window.location.href = authUrl.toString();
};

export const handleGitHubCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  const storedState = sessionStorage.getItem('github_oauth_state');
  
  if (!code || !state || state !== storedState) {
    throw new Error('Invalid OAuth callback');
  }
  
  // Clear stored state
  sessionStorage.removeItem('github_oauth_state');
  
  // Exchange code for token on backend
  const response = await fetch(
    `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/auth/oauth/github`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    }
  );
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error?.message || 'GitHub authentication failed');
  }
  
  return response.json();
};
