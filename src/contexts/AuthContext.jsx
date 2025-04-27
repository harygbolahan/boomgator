import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/lib/api';
import { toast } from 'react-toastify';

// Create the Auth Context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = () => {
      try {
        console.log('Initializing authentication state...');
        
        // Get auth data from memory or localStorage
        const { token: storedToken, user: storedUser, isLoggedIn } = authService.getAuthData();
        
        console.log('Auth initialization result:', {
          hasToken: !!storedToken,
          hasUser: !!storedUser,
          isLoggedIn
        });
        
        if (storedToken) {
          console.log('Setting token in AuthContext');
          setToken(storedToken);
          
          if (storedUser) {
            setUser(storedUser);
          } else {
            console.warn('Token found but no user data available');
          }
        } else {
          // Try to get token directly from localStorage as fallback
          const localToken = localStorage.getItem('authToken');
          if (localToken) {
            console.log('Found token in localStorage, setting in AuthContext');
            setToken(localToken);
            authService.setAuthData(localToken, storedUser || null);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear potentially corrupted data
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Effect to update token in API when token state changes
  useEffect(() => {
    if (token) {
      console.log('Token updated in AuthContext, syncing with API service');
      // Ensure the token is set in the authService
      authService.setAuthData(token, user);
    }
  }, [token, user]);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting login with credentials');
      const response = await authService.login(credentials);
      
      if (response.status === 'success') {
        const { access_token, user } = response.data;
        console.log('Login successful, received token:', !!access_token);
        
        // Store auth data in memory
        authService.setAuthData(access_token, user);
        
        // Update state
        setToken(access_token);
        setUser(user);
        
        toast.success('Login successful');
        setLoading(false);
        return { success: true };
      } else {
        console.error('Login failed:', response.message || 'Unknown error');
        const errorMsg = response.message || 'Login failed';
        setError(errorMsg);
        toast.error(errorMsg);
        setLoading(false);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = error.message || 'Failed to login. Please check your credentials.';
      setError(errorMsg);
      toast.error(errorMsg);
      setLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting registration with user data');
      const response = await authService.register(userData);
      
      if (response.status === 'success') {
        const { access_token, user } = response.data;
        console.log('Registration successful, received token:', !!access_token);
        
        // Store auth data in memory
        authService.setAuthData(access_token, user);
        
        // Update state
        setToken(access_token);
        setUser(user);
        
        toast.success('Registration successful');
        return { success: true };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Failed to register. Please try again.');
      toast.error(error.message || 'Registration failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    console.log('Logging out user');
    authService.logout();
    setUser(null);
    setToken(null);
    toast.info('Logged out successfully');
  };

  // Check if user is authenticated
  const isAuthenticated = !!token;

  // Function to manually set token (for debugging)
  const setDebugToken = (debugToken) => {
    console.log('Manually setting debug token');
    if (debugToken) {
      setToken(debugToken);
      authService.setAuthData(debugToken, user);
      return true;
    }
    return false;
  };

  // Debug authentication state on changes
  useEffect(() => {
    console.log('Auth state changed:', { 
      isAuthenticated, 
      hasToken: !!token, 
      hasUser: !!user 
    });
  }, [isAuthenticated, token, user]);

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    setDebugToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 