import axios from 'axios';

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
    console.log(`API Request [${config.method.toUpperCase()}]:`, config.url, config.data);
    // Check authentication state
    console.log('Auth token available:', !!authToken);
    
    if (authToken) {
      // Explicitly format the Authorization header with Bearer prefix
      config.headers.Authorization = `Bearer ${authToken}`;
      console.log('Authorization header set:', config.headers.Authorization);
    } else {
      console.warn('No auth token available for request');
      
      // Try to retrieve from localStorage as a fallback
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        console.log('Found token in localStorage, using it instead');
        config.headers.Authorization = `Bearer ${storedToken}`;
        // Update the in-memory token as well
        authToken = storedToken;
      }
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response [${response.config.method.toUpperCase()}]:`, response.config.url, response.data);
    return response.data;
  },
  (error) => {
    console.error('API Response Error:', error.config?.url, error.response?.data || error.message);
    
    // Check for authentication errors specifically
    const isAuthError = error.response?.status === 401 || error.response?.data?.message === 'Unauthenticated.';
    const isLoginAttempt = error.config?.url.endsWith('/login');
    
    if (isAuthError && !isLoginAttempt) {
      console.error('Authentication error detected on non-login route. Logging out.');
      
      // Check if authService is available to prevent circular dependency issues
      // This check might be necessary depending on import order
      if (typeof authService !== 'undefined' && authService.logout) {
        authService.logout();
      } else {
        console.warn('authService.logout not available in interceptor, clearing localStorage directly.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
      }
      
      // If window object is available (in browser environment), redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      
      // Return a specific error to stop further processing in this case
      return Promise.reject(new Error('Session expired or invalid. Redirecting to login.'));
    }
    
    // For login errors (401 or other) or non-auth errors, just extract the message and reject
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(errorMessage));
  }
);

/**
 * Auth API services
 */
export const authService = {
  // Set authentication data
  setAuthData: (token, user) => {
    console.log('Setting auth data, token:', !!token);
    authToken = token;
    userData = user;
    isUserLoggedIn = true;
    
    // Also store in localStorage as a backup
    if (token) {
      localStorage.setItem('authToken', token);
      console.log('Token saved to localStorage');
    }
  },

  // Get current auth data
  getAuthData: () => {
    // If no token in memory, try to get from localStorage
    if (!authToken) {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        console.log('Retrieved token from localStorage');
        authToken = storedToken;
        isUserLoggedIn = true;
      }
    }
    
    return {
      token: authToken,
      user: userData,
      isLoggedIn: isUserLoggedIn
    };
  },

  // Login endpoint
  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      
      // If login successful, automatically set the auth data
      if (response.status === 'success' && response.data?.access_token) {
        console.log('Login successful, setting auth token');
        authService.setAuthData(response.data.access_token, response.data.user);
        return response;
      } else {
        console.error('Login failed:', response.message || 'Unknown error');
        // Return the response even if not successful for proper error handling
        return response;
      }
    } catch (error) {
      console.error('API login error:', error);
      // Properly extract error message from the axios error object
      const errorMessage = error.response?.data?.message || error.message || 'Authentication failed';
      return {
        status: 'error',
        message: errorMessage,
        data: null
      };
    }
  },
  
  // Register endpoint
  register: async (userData) => {
    const response = await api.post('/register', userData);
    
    // If registration successful, automatically set the auth data
    if (response.status === 'success' && response.data?.access_token) {
      console.log('Registration successful, setting auth token');
      authService.setAuthData(response.data.access_token, response.data.user);
    }
    
    return response;
  },
  
  // Logout and clear auth data
  logout: () => {
    console.log('Logging out, clearing auth data');
    
    // Clear memory variables
    authToken = null;
    userData = null;
    isUserLoggedIn = false;
    
    // Clear from localStorage - use try-catch to handle any potential errors
    try {
      localStorage.removeItem('authToken');
      // Also clear any other auth-related items that might exist
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      console.log('Auth data cleared from localStorage');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
    
    // For extra measure, try to redirect (if in browser context)
    if (typeof window !== 'undefined') {
      console.log('Redirecting to login page after logout');
    }
  },
};

/**
 * User Account API services
 */
export const accountService = {
  // Get user account details
  getAccount: async () => {
    console.log('accountService: Fetching account details');
    try {
      const response = await api.get('/account');
      console.log('accountService: Account details received', response);
      return response;
    } catch (error) {
      console.error('accountService: Error fetching account', error);
      throw error;
    }
  },
  
  // Update user account details
  updateAccount: async (data) => {
    console.log('accountService: Updating account with data', data);
    try {
      const response = await api.put('/account', data);
      console.log('accountService: Account update successful', response);
      return response;
    } catch (error) {
      console.error('accountService: Error updating account', error);
      throw error;
    }
  },
};

/**
 * Dashboard API services
 */
export const dashboardService = {
  // Get home dashboard data
  getHomeData: async () => {
    return api.get('/home');
  },
};

/**
 * Automation API services
 */
export const automationService = {
  // Get all automations
  getAllAutomations: async () => {
    return api.post('/automations/all');
  },
  
  // Create a new automation
  createAutomation: async (automationData) => {
    // Ensure required fields are provided
    const completeData = {
      ...automationData,
      triggers: automationData.triggers || 0,
      actions: automationData.actions || 0
    };
    return api.post('/automations/set', completeData);
  },
  
  // Update an existing automation
  updateAutomation: async (automationData) => {
    // Ensure required fields are provided
    const completeData = {
      ...automationData,
      triggers: automationData.triggers || 0,
      actions: automationData.actions || 0
    };
    return api.post('/automations/update', completeData);
  },
  
  // Delete an automation
  deleteAutomation: async (id) => {
    return api.post('/automations/delete', { id });
  }
};

/**
 * Content Scheduler API services
 */
export const schedulerService = {
  // Get all scheduled posts
  getScheduledPosts: async () => {
    try {
      console.log('schedulerService: Fetching all scheduled posts');
      const response = await api.get('/get-schedule-posts');
      console.log('schedulerService: Scheduled posts received', response);
      return response;
    } catch (error) {
      console.error('schedulerService: Error fetching scheduled posts', error);
      throw error;
    }
  },
  
  // Get post by ID
  getScheduledPostById: async (postId) => {
    try {
      console.log(`schedulerService: Fetching post ID ${postId}`);
      const response = await api.post('/schedule-post', { post_id: postId });
      console.log('schedulerService: Post details received', response);
      return response;
    } catch (error) {
      console.error('schedulerService: Error fetching post by ID', error);
      throw error;
    }
  },
  
  // Create a new scheduled post
  createScheduledPost: async (postData) => {
    try {
      console.log('schedulerService: Creating new scheduled post', postData);
      const response = await api.post('/schedule-posts', postData);
      console.log('schedulerService: Post created successfully', response);
      return response;
    } catch (error) {
      console.error('schedulerService: Error creating scheduled post', error);
      throw error;
    }
  }
};

/**
 * Comment Replies API services
 */
export const commentRepliesService = {
  // Get all comment replies
  getAllCommentReplies: async () => {
    try {
      const response = await fetch('https://ai.loomsuite.com/api/ai/comment-replies', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch comment replies: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching comment replies:', error);
      throw error;
    }
  },
  
  // Get comment replies by comment ID
  getCommentRepliesByCommentId: async (commentId) => {
    try {
      const response = await fetch('https://ai.loomsuite.com/api/ai/comment-replies/comment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comment_id: commentId })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch comment replies by ID: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching comment replies by ID:', error);
      throw error;
    }
  },
  
  // Add a new comment reply
  addCommentReply: async (commentData) => {
    try {
      const response = await fetch('https://ai.loomsuite.com/api/ai/add-comment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(commentData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add comment reply: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding comment reply:', error);
      throw error;
    }
  }
};

// Export the api instance for other requests
export default api; 