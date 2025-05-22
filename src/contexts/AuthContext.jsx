import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'https://ai.loomsuite.com/api/ai';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token variable stored in memory instead of localStorage
let authToken = null;
let userData = null;
let isUserLoggedIn = false;

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    } else {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        config.headers.Authorization = `Bearer ${storedToken}`;
        authToken = storedToken;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {    const isAuthError = error.response?.status === 401 || error.response?.data?.message === 'Unauthenticated.' || error.response?.data?.message?.toLowerCase().includes('unauthenticated');
    const isLoginAttempt = error.config?.url.endsWith('/login') || error.config?.url.endsWith('/register');
    
    if (isAuthError && !isLoginAttempt) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      
      if (typeof window !== 'undefined') {
        toast.error('Your session has expired. Please login again.');
        window.location.href = '/auth/login';
      }
      
      return Promise.reject(new Error('Session expired or invalid. Redirecting to login.'));
    }
    
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(errorMessage));
  }
);

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
        // Check localStorage for token
        const storedToken = localStorage.getItem('authToken');
        
        if (storedToken) {
          setToken(storedToken);
          authToken = storedToken;
          isUserLoggedIn = true;
          
          // Try to get user data if available
          const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
          if (storedUser) {
            setUser(storedUser);
            userData = storedUser;
          }
        }
      } catch (error) {
        // Clear potentially corrupted data
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Effect to update token in API when token state changes
  useEffect(() => {
    if (token) {
      // Update auth data in memory and localStorage
      authToken = token;
      userData = user;
      isUserLoggedIn = true;
      localStorage.setItem('authToken', token);
      
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    }
  }, [token, user]);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/login', credentials);
      
      if (response.status === 'success') {
        const { access_token, user } = response.data;
        
        // Store auth data
        setToken(access_token);
        setUser(user);
        
        toast.success('Login successful');
        return { success: true };
      } else {
        const errorMsg = response.message || 'Login failed';
        setError(errorMsg);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      const errorMsg = error.message || 'Failed to login. Please check your credentials.';
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/register', userData);
      
      if (response.status === 'success') {
        const { access_token, user } = response.data;
        
        // Store auth data
        setToken(access_token);
        setUser(user);
        
        toast.success('Registration successful');
        return { success: true };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      setError(error.message || 'Failed to register. Please try again.');
      toast.error(error.message || 'Registration failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/forgot-password', { email });
      
      if (response.status === 'success') {
        toast.success('Password reset link sent to your email');
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to process forgot password request');
      }
    } catch (error) {
      const errorMsg = error.message || 'Failed to send password reset link';
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (resetData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/reset-password', resetData);
      
      if (response.status === 'success') {
        toast.success('Password reset successful');
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to reset password');
      }
    } catch (error) {
      const errorMsg = error.message || 'Failed to reset password';
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Clear memory variables
    authToken = null;
    userData = null;
    isUserLoggedIn = false;
    
    // Clear state
    setUser(null);
    setToken(null);
    
    // Clear from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    
    toast.info('Logged out successfully');
  };

  // Check if user is authenticated
  const isAuthenticated = !!token;

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
    isAuthenticated,
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