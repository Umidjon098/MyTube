'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { AuthUser, AuthTokens } from '@/types';

interface AuthContextType {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  handleAuthCallback: (code: string, state: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Google OAuth configuration
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/callback';
  const YOUTUBE_SCOPE = 'https://www.googleapis.com/auth/youtube.readonly';

  // Define functions first to avoid circular dependencies




  useEffect(() => {
    // Check for existing tokens on app load
    const initAuth = async () => {
      try {
        const storedTokens = localStorage.getItem('mytube_tokens');
        if (storedTokens) {
          const parsedTokens: AuthTokens = JSON.parse(storedTokens);
          
          // Check if token is expired
          if (parsedTokens.expiresAt > Date.now()) {
            setTokens(parsedTokens);
            // Fetch user info inline to avoid dependency issues
            try {
              const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: {
                  'Authorization': `Bearer ${parsedTokens.accessToken}`,
                },
              });
              
              if (response.ok) {
                const userData = await response.json();
                const authUser: AuthUser = {
                  id: userData.id,
                  email: userData.email,
                  name: userData.name,
                  picture: userData.picture,
                };
                setUser(authUser);
              }
            } catch (error) {
              console.error('Error fetching user info:', error);
            }
          } else {
            // Token expired, handle inline to avoid dependency issues
            try {
              const response = await fetch('/api/auth/google/refresh', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh_token: parsedTokens.refreshToken }),
              });
              
              if (response.ok) {
                const tokenData = await response.json();
                const newTokens: AuthTokens = {
                  accessToken: tokenData.access_token,
                  refreshToken: parsedTokens.refreshToken,
                  expiresAt: Date.now() + (tokenData.expires_in * 1000),
                };
                setTokens(newTokens);
                localStorage.setItem('mytube_tokens', JSON.stringify(newTokens));
              }
            } catch (error) {
              console.error('Token refresh error:', error);
              setUser(null);
              setTokens(null);
              localStorage.removeItem('mytube_tokens');
            }
          }
        }
      } catch (error) {
        console.error('Error checking existing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, []);



  const login = async () => {
    try {
      setIsLoading(true);
      
      // Generate random state for security
      const state = Math.random().toString(36).substring(7);
      localStorage.setItem('mytube_oauth_state', state);
      
      // Build OAuth URL
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.append('client_id', GOOGLE_CLIENT_ID);
      authUrl.searchParams.append('redirect_uri', GOOGLE_REDIRECT_URI);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('scope', YOUTUBE_SCOPE);
      authUrl.searchParams.append('state', state);
      authUrl.searchParams.append('access_type', 'offline');
      authUrl.searchParams.append('prompt', 'consent');
      
      // Redirect to Google OAuth
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  const handleAuthCallback = async (code: string, state: string) => {
    try {
      setIsLoading(true);
      
      // Verify state parameter
      const storedState = localStorage.getItem('mytube_oauth_state');
      if (state !== storedState) {
        throw new Error('Invalid state parameter');
      }
      
      // Exchange code for tokens
      const tokenResponse = await fetch('/api/auth/google/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      
      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for tokens');
      }
      
      const tokenData = await tokenResponse.json();
      const newTokens: AuthTokens = {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: Date.now() + (tokenData.expires_in * 1000),
      };
      
      setTokens(newTokens);
      localStorage.setItem('mytube_tokens', JSON.stringify(newTokens));
      
      // Fetch user info
      await fetchUserInfo(newTokens.accessToken);
      
      // Clean up
      localStorage.removeItem('mytube_oauth_state');
      
    } catch (error) {
      console.error('Auth callback error:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserInfo = useCallback(async (accessToken: string) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
      
      const userData = await response.json();
      const authUser: AuthUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
      };
      
      setUser(authUser);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      if (!tokens?.refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await fetch('/api/auth/google/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: tokens.refreshToken }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      
      const tokenData = await response.json();
      const newTokens: AuthTokens = {
        accessToken: tokenData.access_token,
        refreshToken: tokens.refreshToken, // Keep existing refresh token
        expiresAt: Date.now() + (tokenData.expires_in * 1000),
      };
      
      setTokens(newTokens);
      localStorage.setItem('mytube_tokens', JSON.stringify(newTokens));
      
    } catch (error) {
      console.error('Token refresh error:', error);
      // Don't call logout here to avoid circular dependency
      setUser(null);
      setTokens(null);
      localStorage.removeItem('mytube_tokens');
      localStorage.removeItem('mytube_oauth_state');
    }
  }, [tokens?.refreshToken]);

  const logout = useCallback(async () => {
    try {
      setUser(null);
      setTokens(null);
      localStorage.removeItem('mytube_tokens');
      localStorage.removeItem('mytube_oauth_state');
      
      // Revoke Google access if possible
      if (tokens?.accessToken) {
        try {
          await fetch(`https://oauth2.googleapis.com/revoke?token=${tokens.accessToken}`);
        } catch (error) {
          console.error('Error revoking token:', error);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [tokens?.accessToken]);

  const value: AuthContextType = {
    user,
    tokens,
    isAuthenticated: !!user && !!tokens,
    isLoading,
    login,
    logout,
    refreshToken,
    handleAuthCallback,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


