// Google OAuth Script Loader - loads Google Sign-In library dynamically

export const loadGoogleScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).google) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google script"));
    document.head.appendChild(script);
  });
};

export const initializeGoogleButton = (
  containerId: string,
  onSuccess: (response: any) => void,
  onError: () => void
) => {
  if (!(window as any).google) {
    console.error("Google script not loaded");
    return;
  }

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    console.error("Google Client ID not configured");
    return;
  }

  (window as any).google.accounts.id.initialize({
    client_id: clientId,
    callback: onSuccess,
    use_fedcm_for_prompt: false, // Disable FedCM to avoid CORS issues
  });

  (window as any).google.accounts.id.renderButton(
    document.getElementById(containerId),
    {
      theme: "outline",
      size: "large",
      width: "100%",
    }
  );
};
