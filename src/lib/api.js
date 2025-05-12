import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ai.loomsuite.com/api/ai';

// Create axios instance with common config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Token variable stored in memory
let authToken = null;
let userData = null;

// Handle for auth logout function (will be set by the auth service)
let logoutHandler = null;

// Set authentication token for all requests
const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // Also store for consistent state
    authToken = token;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
    authToken = null;
  }
};

// Add response interceptor for auth errors
apiClient.interceptors.response.use(
  response => response, // Pass successful responses through unchanged
  error => {
    // Check for unauthorized error (401)
    if (error.response && error.response.status === 401) {
      console.error('Authentication error detected in API request:', error.response.data);
      
      // Only attempt logout if handler is set and we have a token (we were previously authenticated)
      if (logoutHandler && authToken) {
        console.log('Logging out user due to authentication error');
        logoutHandler();
        
        // If app uses client-side routing, redirect to login
        if (window.location.pathname !== '/auth/login' && window.location.pathname !== '/login') {
          window.location.href = '/auth/login';
        }
      }
    }
    
    // Continue with the error
    return Promise.reject(error);
  }
);

// Scheduler Service for content scheduling endpoints
const schedulerService = {
  // Get all scheduled posts
  getScheduledPosts: async () => {
    try {
      const response = await apiClient.get('/get-schedule-posts');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching scheduled posts:', error);
      throw error;
    }
  },

  // Get a specific post by ID
  getScheduledPostById: async (postId) => {
    try {
      const response = await apiClient.post('/schedule-post', { post_id: postId });
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error fetching post #${postId}:`, error);
      throw error;
    }
  },

  // Create a new scheduled post
  createScheduledPost: async (postData) => {
    try {
      // Log the request data for debugging
      console.log('Creating scheduled post with data:', 
        postData instanceof FormData 
          ? 'FormData object with keys: ' + Array.from(postData.keys()).join(', ') 
          : postData
      );
      
      // Endpoint URL
      const endpoint = '/schedule-posts';
      
      // Make the API request with appropriate content type
      const config = {};
      
      // If FormData is used, let axios set the content-type to multipart/form-data
      if (postData instanceof FormData) {
        config.headers = {
          'Content-Type': 'multipart/form-data'
        };
      }
      
      // Make the API request
      const response = await apiClient.post(endpoint, postData, config);
      
      // Log successful response
      console.log('Post created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating scheduled post:', error);
      
      // Log more detailed error information
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Request was made but no response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
      }
      
      throw error;
    }
  },

  // Update an existing post
  updateScheduledPost: async (postId, postData) => {
    try {
      const response = await apiClient.put(`/scheduler/posts/${postId}`, postData);
      return response.data;
    } catch (error) {
      console.error(`Error updating post #${postId}:`, error);
      throw error;
    }
  },

  // Delete a scheduled post
  deleteScheduledPost: async (postId) => {
    try {
      const response = await apiClient.delete(`/scheduler/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting post #${postId}:`, error);
      throw error;
    }
  }
};

// Auth Service for authentication endpoints
const authService = {
  // Set authentication data
  setAuthData: (token, user) => {
    console.log('Setting auth data, token:', !!token);
    authToken = token;
    userData = user;
    
    // Also set the auth token in axios
    setAuthToken(token);
    
    // Also store in localStorage as a backup
    if (token) {
      localStorage.setItem('authToken', token);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      localStorage.setItem('isLoggedIn', 'true');
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
        
        // Try to get user data from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            userData = JSON.parse(storedUser);
          } catch (e) {
            console.error('Error parsing stored user data:', e);
          }
        }
        
        // Set the token in axios
        setAuthToken(storedToken);
      }
    }
    
    return {
      token: authToken,
      user: userData,
      isLoggedIn: !!authToken
    };
  },

  // User login
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      
      // Extract the most specific error message
      if (error.response?.data?.message) {
        const serverError = new Error(error.response.data.message);
        serverError.response = error.response;
        serverError.status = error.response.status;
        throw serverError;
      } else if (error.response?.status === 401) {
        // For 401 errors without a specific message
        const authError = new Error('Invalid email or password');
        authError.response = error.response;
        authError.status = 401;
        throw authError;
      }
      
      throw error;
    }
  },

  // User registration
  register: async (userData) => {
    try {
      const response = await apiClient.post('/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      
      // Extract the most specific error message
      if (error.response?.data?.message) {
        const serverError = new Error(error.response.data.message);
        serverError.response = error.response;
        serverError.status = error.response.status;
        throw serverError;
      }
      
      throw error;
    }
  },

  // Logout user
  logout: () => {
    console.log('Logging out, clearing auth data');
    
    // Clear memory variables
    authToken = null;
    userData = null;
    
    // Clear token from axios
    setAuthToken(null);
    
    // Clear from localStorage
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
  
  // Set logout handler from AuthContext
  setLogoutHandler: (handler) => {
    if (typeof handler === 'function') {
      logoutHandler = handler;
      console.log('Auth logout handler registered');
    }
  }
};

/**
 * Social Media Authentication Services
 */
export const socialAuthService = {
  // Initialize Facebook SDK
  initFacebookSdk: () => {
    return new Promise((resolve) => {
      window.fbAsyncInit = function() {
        window.FB.init({
          appId: import.meta.env.VITE_FACEBOOK_APP_ID || '123456789012345',
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
        resolve();
      };

      // Load the SDK
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    });
  },

  // Get social platform authentication link
  getSocialAuthLink: async (platform) => {
    try {
      const response = await apiClient.post('/link/social/login', { 
        type: platform 
      }, {
        baseURL: 'https://ai.loomsuite.com/api',
        headers: {
          'Accept': 'application/json'
        }
      });

      console.log('Social auth link response:', response);
      
      // Handle the response data properly
      const data = response.data || response;
      
      if (data.success && data.link) {
        return data.link;
      } else if (data.data && data.data.link) {
        return data.data.link;
      } else {
        throw new Error(data.message || 'Invalid response format');
      }
    } catch (error) {
      console.error('Error getting social auth link:', error);
      throw error;
    }
  },

  // Handle platform connection
  connectPlatform: async (platform) => {
    // Use the integrationService connectPlatform implementation
    return integrationService.connectPlatform(platform);
  },

  // Get connected accounts
  getConnectedAccounts: async () => {
    try {
      const response = await apiClient.get('/social/connected-accounts', {
        baseURL: 'https://ai.loomsuite.com/api'
      });
      return response;
    } catch (error) {
      console.error('Error fetching connected accounts:', error);
      throw error;
    }
  }
};

/**
 * User Account API services
 */
export const accountService = {
  // Get user account details
  getAccount: async () => {
    console.log('accountService: Fetching account details');
    try {
      const response = await apiClient.get('/account');
      console.log('accountService: Account details received', response?.data);
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
      const response = await apiClient.put('/account', data);
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
    return apiClient.get('/home');
  },
};

/**
 * Automation API services
 */
export const automationService = {
  // Get all automations
  getAllAutomations: async () => {
    try {
      const response = await apiClient.post('/automations/all');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching automations:', error);
      throw error;
    }
  },
  
  // Create a new automation
  createAutomation: async (automationData) => {
    try {
      // Ensure required fields are provided
      const completeData = {
        ...automationData,
        triggers: automationData.triggers || 0,
        actions: automationData.actions || 0
      };
      const response = await apiClient.post('/automations/set', completeData);
      return response.data || completeData;
    } catch (error) {
      console.error('Error creating automation:', error);
      throw error;
    }
  },
  
  // Update an existing automation
  updateAutomation: async (automationData) => {
    try {
      // Ensure required fields are provided
      const completeData = {
        ...automationData,
        triggers: automationData.triggers || 0,
        actions: automationData.actions || 0
      };
      const response = await apiClient.post('/automations/update', completeData);
      return response.data || completeData;
    } catch (error) {
      console.error('Error updating automation:', error);
      throw error;
    }
  },
  
  // Delete an automation
  deleteAutomation: async (id) => {
    try {
      const response = await apiClient.post('/automations/delete', { id });
      return response.data;
    } catch (error) {
      console.error('Error deleting automation:', error);
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
      console.log('commentRepliesService: Fetching all comment replies');
      const response = await apiClient.get('/comment-replies');
      console.log('commentRepliesService: Comment replies received', response);
      return response;
    } catch (error) {
      console.error('commentRepliesService: Error fetching comment replies', error);
      throw error;
    }
  },
  
  // Get comment replies by comment ID
  getCommentRepliesByCommentId: async (commentId) => {
    try {
      console.log(`commentRepliesService: Fetching replies for comment ID ${commentId}`);
      const response = await apiClient.post('/comment-replies/comment', { comment_id: commentId });
      console.log('commentRepliesService: Comment replies by ID received', response);
      return response;
    } catch (error) {
      console.error('commentRepliesService: Error fetching comment replies by ID', error);
      throw error;
    }
  },
  
  // Add a new comment reply
  addCommentReply: async (commentData) => {
    try {
      console.log('commentRepliesService: Adding new comment reply', commentData);
      const response = await apiClient.post('/add-comment', commentData);
      console.log('commentRepliesService: Comment reply added successfully', response);
      return response;
    } catch (error) {
      console.error('commentRepliesService: Error adding comment reply', error);
      throw error;
    }
  }
};

/**
 * Integration API services
 */
export const integrationService = {
  getPlatforms: async () => {
    try {
      console.log('integrationService: Fetching platforms');
      const response = await apiClient.get('/platforms');
      console.log('integrationService: Platforms received', response);
      
      // Extract data array from the response
      const platforms = response.data ? response.data : [];
      
      if (!Array.isArray(platforms)) {
        console.warn('integrationService: Invalid response format', response);
        return [];
      }
      
      return platforms.map(platform => ({
        id: platform.id,
        platform: platform.platform_name.toLowerCase(),
        name: platform.profile_name || platform.platform_name,
        username: platform.profile_url ? platform.profile_url.split('/').pop() : '',
        avatar: "/placeholder-avatar.jpg",
        status: platform.status,
        connectedAt: new Date(platform.created_at),
        lastSync: new Date(platform.last_sync_at),
        platformId: platform.platform_id,
        platformType: platform.platform_type,
        profileUrl: platform.profile_url,
        timezone: platform.timezone,
        language: platform.language,
        lastActivity: new Date(platform.last_activity),
        stats: {
          likes: platform.likes || 0,
          followers: platform.followers || 0,
          comments: platform.comments || 0,
          totalEngagement: platform.total_engagement || 0
        }
      }));
    } catch (error) {
      console.error('integrationService: Error fetching platforms', error);
      throw error;
    }
  },

  connectPlatform: async (platformId) => {
    try {
      console.log(`integrationService: Connecting platform ID ${platformId}`);
      // Use the endpoint shown in the image
      const response = await apiClient.post('/link/social/login', { 
        type: platformId 
      }, {
        baseURL: 'https://ai.loomsuite.com/api',
        headers: {
          'Accept': 'application/json'
        }
      });
      console.log('integrationService: Platform connection initiated', response);

      // Extract data from the response
      const responseData = response.data || response;

      if (!responseData || (!responseData.link && !responseData.data?.link)) {
        throw new Error('Invalid response format for platform connection');
      }

      // Get the auth link from the response
      const authLink = responseData.link || responseData.data?.link;

      return {
        authLink,
        handleCallback: async (token) => {
          console.log('integrationService: Handling platform connection callback');
          try {
            const callbackResponse = await apiClient.post('/link/social/callback', {
              type: platformId,
              token: token
            }, {
              baseURL: 'https://ai.loomsuite.com/api',
              headers: {
                'Accept': 'application/json'
              }
            });
            
            // Extract data from callback response
            const callbackData = callbackResponse.data || callbackResponse;
            console.log('integrationService: Platform connection completed', callbackData);
            return callbackData;
          } catch (error) {
            console.error('integrationService: Error in callback handling', error);
            throw error;
          }
        }
      };
    } catch (error) {
      console.error('integrationService: Error connecting platform', error);
      throw error;
    }
  },

  disconnectPlatform: async (platformId) => {
    try {
      console.log(`integrationService: Disconnecting platform ID ${platformId}`);
      
      // Try POST first, then fall back to GET if needed
      let response;
      try {
        response = await apiClient.post('/platform/disconnect', { 
          platform_id: platformId 
        });
      } catch (err) {
        // If POST fails with 405, try with GET instead
        if (err.response && err.response.status === 405) {
          console.log('integrationService: POST not allowed for disconnect, trying GET');
          response = await apiClient.get('/platform/disconnect', {
            params: { platform_id: platformId }
          });
        } else {
          throw err; // Re-throw if not a 405 error
        }
      }
      
      console.log('integrationService: Platform disconnected', response);
      // Extract data from the response
      const responseData = response.data ? response.data : response;
      return responseData;
    } catch (error) {
      console.error('integrationService: Error disconnecting platform', error);
      throw error;
    }
  },

  // New methods
  getPlatformById: async (id) => {
    try {
      console.log(`integrationService: Fetching platform with ID ${id}`);
      const response = await apiClient.post('/platform', { id });
      console.log('integrationService: Platform details received', response);
      
      // Extract data from the response
      const platform = response.data ? response.data : response;
      return platform;
    } catch (error) {
      console.error(`integrationService: Error fetching platform with ID ${id}`, error);
      throw error;
    }
  },
  
  getAllPlatformPages: async () => {
    try {
      console.log('integrationService: Fetching all platform pages');
      const response = await apiClient.get('/platforms/pages');
      console.log('integrationService: Platform pages received', response);
      
      // Extract data from the response
      const pages = response.data ? response.data : [];
      return Array.isArray(pages) ? pages : [];
    } catch (error) {
      console.error('integrationService: Error fetching platform pages', error);
      throw error;
    }
  },
  
  getAllPagePosts: async () => {
    try {
      console.log('integrationService: Fetching all page posts');
      const response = await apiClient.get('/platforms/pages/all-posts');
      console.log('integrationService: All page posts received', response);
      
      // Extract data from the response
      const posts = response.data ? response.data : [];
      return Array.isArray(posts) ? posts : [];
    } catch (error) {
      console.error('integrationService: Error fetching all page posts', error);
      throw error;
    }
  },
  
  getPostsByPage: async (pageId) => {
    try {
      console.log(`integrationService: Fetching posts for page ID ${pageId}`);
      const response = await apiClient.post('/platforms/pages/post', { page_id: pageId });
      console.log('integrationService: Page posts received', response);
      
      // Extract data from the response
      const posts = response.data ? response.data : [];
      return Array.isArray(posts) ? posts : [];
    } catch (error) {
      console.error(`integrationService: Error fetching posts for page ID ${pageId}`, error);
      throw error;
    }
  },
  
  syncPagePosts: async (pageId) => {
    try {
      console.log(`integrationService: Syncing posts for page ID ${pageId}`);
      const response = await apiClient.post('/platforms/pages/sync-posts', { page_id: pageId });
      console.log('integrationService: Page posts synced', response);
      
      // Extract data from the response
      const result = response.data ? response.data : response;
      return result;
    } catch (error) {
      console.error(`integrationService: Error syncing posts for page ID ${pageId}`, error);
      throw error;
    }
  }
};

/**
 * Subscription Services
 */
export const subscriptionService = {
  // Get all available subscription packages
  getAllPackages: async () => {
    try {
      const response = await apiClient.get('/subscriptions');
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription packages:', error);
      throw error;
    }
  },

  // Get the current user's subscription details
  getUserPackage: async () => {
    try {
      const response = await apiClient.get('/subscriptions/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      throw error;
    }
  },

  // Subscribe to a new package
  subscribeToPackage: async (packageName) => {
    try {
      const response = await apiClient.post('/subscribe/package', { package: packageName });
      return response.data;
    } catch (error) {
      console.error('Error subscribing to package:', error);
      throw error;
    }
  }
};

export { apiClient, setAuthToken, schedulerService, authService };