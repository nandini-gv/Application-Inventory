import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  displayName: string;
  email: string;
  avatarUrl?: string;
  roles: string[];
  department?: string;
  title?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  user: UserProfile | null;
  login: () => Promise<UserProfile>;
  logout: () => Promise<void>;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check for existing session in localStorage
  useEffect(() => {
    const checkSession = () => {
      try {
        const storedUser = localStorage.getItem('app_hub_user');
        const storedToken = localStorage.getItem('app_hub_token');
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Failed to parse stored session:', err);
      } finally {
        setIsAuthenticating(false);
      }
    };
    checkSession();
  }, []);

  const login = (): Promise<UserProfile> => {
    return new Promise((resolve, reject) => {
      setAuthError(null);
      
      // Calculate center coordinates for popup
      const width = 500;
      const height = 620;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      // Open a realistic popup window pointing to /ms-login
      const popup = window.open(
        '/ms-login',
        'MSAL_Login',
        `width=${width},height=${height},top=${top},left=${left},status=no,toolbar=no,menubar=no,location=no,scrollbars=yes`
      );

      if (!popup) {
        const err = 'Popup blocked by browser. Please enable popups and try again.';
        setAuthError(err);
        reject(new Error(err));
        return;
      }

      // Track popup state
      let loginSuccessful = false;

      const handleAuthMessage = (event: MessageEvent) => {
        // Validate origin if needed, here we accept local origin
        if (event.origin !== window.location.origin) return;

        if (event.data?.type === 'MSAL_LOGIN_SUCCESS') {
          const profile: UserProfile = event.data.profile;
          const token = event.data.token;

          localStorage.setItem('app_hub_user', JSON.stringify(profile));
          localStorage.setItem('app_hub_token', token);
          
          setUser(profile);
          setIsAuthenticated(true);
          loginSuccessful = true;
          
          window.removeEventListener('message', handleAuthMessage);
          popup.close();
          resolve(profile);
        } else if (event.data?.type === 'MSAL_LOGIN_FAILURE') {
          const errMsg = event.data.error || 'Authentication aborted';
          setAuthError(errMsg);
          window.removeEventListener('message', handleAuthMessage);
          popup.close();
          reject(new Error(errMsg));
        }
      };

      // Listen for message from popup
      window.addEventListener('message', handleAuthMessage);

      // Periodically check if the popup was closed manually
      const pollTimer = setInterval(() => {
        if (popup.closed) {
          clearInterval(pollTimer);
          window.removeEventListener('message', handleAuthMessage);
          
          if (!loginSuccessful) {
            const err = 'Authentication window was closed before signing in.';
            setAuthError(err);
            reject(new Error(err));
          }
        }
      }, 500);
    });
  };

  const logout = async (): Promise<void> => {
    setIsAuthenticating(true);
    // Simulate slight delay for logout
    await new Promise((resolve) => setTimeout(resolve, 500));
    localStorage.removeItem('app_hub_user');
    localStorage.removeItem('app_hub_token');
    setUser(null);
    setIsAuthenticated(false);
    setIsAuthenticating(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAuthenticating, user, login, logout, authError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
