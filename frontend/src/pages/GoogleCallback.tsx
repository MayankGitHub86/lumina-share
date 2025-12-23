import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleGoogleCallback } from '@/lib/google-oauth2';
import { toast } from 'sonner';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const data = await handleGoogleCallback();
        
        // Store token and user data
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        toast.success('Google login successful!');
        navigate('/dashboard');
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    processCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-4">Authentication Failed</h2>
          <p className="text-muted-foreground">{error}</p>
          <p className="text-sm text-muted-foreground mt-2">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing Google authentication...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
