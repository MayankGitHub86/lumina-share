// Microsoft OAuth Handler

export const loadMicrosoftAuthLibrary = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).msal) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://alcdn.msauth.net/browser/2.30.0/js/msal-browser.min.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Microsoft Auth Library"));
    document.head.appendChild(script);
  });
};

export const getMicrosoftAuthConfig = () => {
  const clientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID;
  const tenantId = import.meta.env.VITE_MICROSOFT_TENANT_ID || "common";

  if (!clientId) {
    console.error("Microsoft Client ID not configured");
    return null;
  }

  return {
    auth: {
      clientId,
      authority: `https://login.microsoftonline.com/${tenantId}`,
      redirectUri: window.location.origin, // Changed to just the origin
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: true,
    },
  };
};

export const initializeMicrosoftAuth = async () => {
  try {
    await loadMicrosoftAuthLibrary();
    const config = getMicrosoftAuthConfig();
    if (!config) return null;

    const msalInstance = new (window as any).msal.PublicClientApplication(config);
    await msalInstance.initialize();
    return msalInstance;
  } catch (error) {
    console.error("Failed to initialize Microsoft Auth:", error);
    return null;
  }
};
