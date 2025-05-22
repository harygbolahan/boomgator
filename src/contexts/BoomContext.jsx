import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const API_BASE_URL = 'https://ai.loomsuite.com/api/ai';

// Create the Boom Context for all app functionality
const BoomContext = createContext(null);

export const BoomProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  
  // Account data
  const [accountData, setAccountData] = useState(null);
  const [loadingAccount, setLoadingAccount] = useState(false);
  const [accountError, setAccountError] = useState(null);
  
  // Wallet data
  const [walletData, setWalletData] = useState(null);
  const [walletHistory, setWalletHistory] = useState([]);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [walletError, setWalletError] = useState(null);
  
  // Dashboard data
  const [homeData, setHomeData] = useState(null);
  const [loadingHome, setLoadingHome] = useState(false);
  const [homeError, setHomeError] = useState(null);
  
  // Automations data
  const [automations, setAutomations] = useState([]);
  const [loadingAutomations, setLoadingAutomations] = useState(false);
  const [automationsError, setAutomationsError] = useState(null);
  
  // Scheduled posts data
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [loadingScheduledPosts, setLoadingScheduledPosts] = useState(false);
  const [scheduledPostsError, setScheduledPostsError] = useState(null);
  
  // Platforms data
  const [platforms, setPlatforms] = useState([]);
  const [loadingPlatforms, setLoadingPlatforms] = useState(false);
  const [platformsError, setPlatformsError] = useState(null);
  
  // Pages data
  const [pages, setPages] = useState([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [pagesError, setPagesError] = useState(null);
  
  // Comment replies data
  const [commentReplies, setCommentReplies] = useState([]);
  const [loadingCommentReplies, setLoadingCommentReplies] = useState(false);
  const [commentRepliesError, setCommentRepliesError] = useState(null);
  
  // Auto reply services data
  const [autoReplyServices, setAutoReplyServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [servicesError, setServicesError] = useState(null);

  // API instance with auth token
  const api = useCallback(
    (customConfig = {}) => {
      const instance = axios.create({
        baseURL: API_BASE_URL,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...customConfig.headers,
        },
        ...customConfig,
      });

      // Add response interceptor to handle unauthorized errors
      instance.interceptors.response.use(
        (response) => response,
        (error) => {
          const isAuthError = error.response?.status === 401 || 
                            error.response?.data?.message === 'Unauthenticated.' ||
                            error.response?.data?.message?.toLowerCase().includes('unauthenticated');
                            
          if (isAuthError) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            localStorage.removeItem('isLoggedIn');
            
            if (typeof window !== 'undefined') {
              toast.error('Your session has expired. Please login again.');
              window.location.href = '/auth/login';
            }
          }
          return Promise.reject(error);
        }
      );

      return instance;
    },
    [token]
  );
  
  // =====================
  // ACCOUNT FUNCTIONS
  // =====================
  
  const getAccount = useCallback(async () => {
    if (!isAuthenticated) return null;
    
    setLoadingAccount(true);
    setAccountError(null);
    
    try {
      const response = await api().get('/account');
      setAccountData(response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setAccountError(errorMsg);
      toast.error(`Error loading account data: ${errorMsg}`);
      return null;
    } finally {
      setLoadingAccount(false);
    }
  }, [isAuthenticated, api]);
  
  const updateAccount = useCallback(async (data) => {
    if (!isAuthenticated) return null;
    
    setLoadingAccount(true);
    setAccountError(null);
    
    try {
      const response = await api().put('/account', data);
      setAccountData(response.data);
      toast.success('Account updated successfully');
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setAccountError(errorMsg);
      toast.error(`Error updating account: ${errorMsg}`);
      return null;
    } finally {
      setLoadingAccount(false);
    }
  }, [isAuthenticated, api]);
  
  // =====================
  // WALLET FUNCTIONS
  // =====================
  
  const getWallet = useCallback(async () => {
    if (!isAuthenticated) return null;
    
    setLoadingWallet(true);
    setWalletError(null);
    
    try {
      const response = await api().get('/wallet');
      setWalletData(response.data.wallet);
      setWalletHistory(response.data.wallet_history || []);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setWalletError(errorMsg);
      toast.error(`Error loading wallet data: ${errorMsg}`);
      return null;
    } finally {
      setLoadingWallet(false);
    }
  }, [isAuthenticated, api]);
  
  // =====================
  // DASHBOARD FUNCTIONS
  // =====================
  
  const getHomeData = useCallback(async () => {
    if (!isAuthenticated) return null;
    
    setLoadingHome(true);
    setHomeError(null);
    
    try {
      const response = await api().get('/home');
      setHomeData(response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setHomeError(errorMsg);
      toast.error(`Error loading dashboard data: ${errorMsg}`);
      return null;
    } finally {
      setLoadingHome(false);
    }
  }, [isAuthenticated, api]);
  
  // =====================
  // AUTOMATION FUNCTIONS
  // =====================
  
  const getAllAutomations = useCallback(async () => {
    if (!isAuthenticated) return [];
    
    setLoadingAutomations(true);
    setAutomationsError(null);
    
    try {
      const response = await api().post('/automations/all');
      setAutomations(response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setAutomationsError(errorMsg);
      toast.error(`Error loading automations: ${errorMsg}`);
      return [];
    } finally {
      setLoadingAutomations(false);
    }
  }, [isAuthenticated, api]);
  
  const createAutomation = useCallback(async (automationData) => {
    if (!isAuthenticated) return null;
    
    setLoadingAutomations(true);
    setAutomationsError(null);
    
    try {
      // Ensure required fields are provided
      const completeData = {
        ...automationData,
        triggers: automationData.triggers || 0,
        actions: automationData.actions || 0
      };
      
      const response = await api().post('/automations/set', completeData);
      await getAllAutomations(); // Refresh the list
      toast.success('Automation created successfully');
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setAutomationsError(errorMsg);
      toast.error(`Error creating automation: ${errorMsg}`);
      return null;
    } finally {
      setLoadingAutomations(false);
    }
  }, [isAuthenticated, api, getAllAutomations]);
  
  const updateAutomation = useCallback(async (automationData) => {
    if (!isAuthenticated) return null;
    
    setLoadingAutomations(true);
    setAutomationsError(null);
    
    try {
      // Ensure required fields are provided
      const completeData = {
        ...automationData,
        triggers: automationData.triggers || 0,
        actions: automationData.actions || 0
      };
      
      const response = await api().post('/automations/update', completeData);
      await getAllAutomations(); // Refresh the list
      toast.success('Automation updated successfully');
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setAutomationsError(errorMsg);
      toast.error(`Error updating automation: ${errorMsg}`);
      return null;
    } finally {
      setLoadingAutomations(false);
    }
  }, [isAuthenticated, api, getAllAutomations]);
  
  const deleteAutomation = useCallback(async (id) => {
    if (!isAuthenticated) return false;
    
    setLoadingAutomations(true);
    setAutomationsError(null);
    
    try {
      await api().post('/automations/delete', { id });
      await getAllAutomations(); // Refresh the list
      toast.success('Automation deleted successfully');
      return true;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setAutomationsError(errorMsg);
      toast.error(`Error deleting automation: ${errorMsg}`);
      return false;
    } finally {
      setLoadingAutomations(false);
    }
  }, [isAuthenticated, api, getAllAutomations]);
  
  // =====================
  // PLATFORM & PAGES FUNCTIONS
  // =====================
  
  const getPlatforms = useCallback(async () => {
    if (!isAuthenticated) return [];
    
    setLoadingPlatforms(true);
    setPlatformsError(null);
    
    try {
      const response = await api().get('/platforms');
      setPlatforms(response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setPlatformsError(errorMsg);
      toast.error(`Error loading platforms: ${errorMsg}`);
      return [];
    } finally {
      setLoadingPlatforms(false);
    }
  }, [isAuthenticated, api]);
  
  const getPages = useCallback(async () => {
    if (!isAuthenticated) return [];
    
    setLoadingPages(true);
    setPagesError(null);
    
    try {
      const response = await api().get('/platforms/pages');
      setPages(response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setPagesError(errorMsg);
      toast.error(`Error loading pages: ${errorMsg}`);
      return [];
    } finally {
      setLoadingPages(false);
    }
  }, [isAuthenticated, api]);
  
  // =====================
  // PLATFORM INTEGRATION FUNCTIONS
  // =====================
    const getPlatformAuthLink = useCallback(async (platformType) => {
    if (!isAuthenticated) return null;
    
    try {
      const response = await api().post('/link/social/login', {
        type: platformType
      });
      
      if (response.data.status === 'success' && response.data.link) {
        return response.data.link;
      } else {
        throw new Error("Failed to get platform authorization link");
      }
    } catch (error) {
      toast.error(`Error getting platform link: ${error.message}`);
      return null;
    }
  }, [isAuthenticated, api]);
    const getPagePosts = useCallback(async (pageId) => {
    if (!isAuthenticated) return [];
    
    try {
      const response = await api().post('/platforms/pages/post', {
        page_id: pageId
      });
      
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        throw new Error("Failed to fetch page posts");
      }
    } catch (error) {
      toast.error(`Error loading page posts: ${error.message}`);
      return [];
    }
  }, [isAuthenticated, api]);
    const syncPagePosts = useCallback(async (pageId) => {
    if (!isAuthenticated) return null;
    
    try {
      const response = await api().post('/platforms/pages/sync-posts', {
        page_id: pageId
      });
      
      if (response.data.message) {
        toast.success(`${response.data.message}: Added ${response.data.new_posts} new posts`);
        return response.data;
      } else {
        throw new Error("Failed to sync page posts");
      }
    } catch (error) {
      console.error('Error syncing page posts:', error);
      toast.error(`Error syncing page posts: ${error?.response?.data?.message || error?.response?.data?.error || error?.message}`);
      return null;
    }
  }, [isAuthenticated, api]);
  
  const getPlatformById = useCallback(async (platformId) => {
    if (!isAuthenticated) return null;
    
    try {
      const response = await fetch('https://ai.loomsuite.com/api/ai/platform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: platformId
        })
      });
      
      return await response.json();
    } catch (error) {
      toast.error(`Error fetching platform: ${error.message}`);
      return null;
    }
  }, [isAuthenticated, token]);
  
  // Get all posts from all pages
  const getAllPagePosts = useCallback(async () => {
    if (!isAuthenticated) return [];
    
    try {
      const response = await api().get('/platforms/pages/all-posts');
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      toast.error(`Error loading all page posts: ${errorMsg}`);
      console.error('Error fetching all page posts:', error);
      return [];
    }
  }, [isAuthenticated, api]);
  
  // =====================
  // SCHEDULER FUNCTIONS
  // =====================
  
  const getScheduledPosts = useCallback(async () => {
    if (!isAuthenticated) return [];
    
    setLoadingScheduledPosts(true);
    setScheduledPostsError(null);
    
    try {
      const response = await api().get('/get-schedule-posts');
      setScheduledPosts(response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setScheduledPostsError(errorMsg);
      toast.error(`Error loading scheduled posts: ${errorMsg}`);
      return [];
    } finally {
      setLoadingScheduledPosts(false);
    }
  }, [isAuthenticated, api]);
  
  const getScheduledPostById = useCallback(async (postId) => {
    if (!isAuthenticated) return null;
    
    setLoadingScheduledPosts(true);
    setScheduledPostsError(null);
    
    try {
      const response = await api().post('/schedule-post', { post_id: postId });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setScheduledPostsError(errorMsg);
      toast.error(`Error loading post details: ${errorMsg}`);
      return null;
    } finally {
      setLoadingScheduledPosts(false);
    }
  }, [isAuthenticated, api]);
  
  const createScheduledPost = useCallback(async (postData) => {
    if (!isAuthenticated) return null;
    
    setLoadingScheduledPosts(true);
    setScheduledPostsError(null);
    
    try {
      // Check if postData is FormData (for file uploads)
      const isFormData = postData instanceof FormData;
      
      // Create custom config for multipart/form-data if needed
      const config = isFormData ? {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      } : {};
      
      // Use axios directly to maintain FormData structure
      const response = await axios.post(
        `${API_BASE_URL}/schedule-posts`,
        postData,
        config
      );
      
      await getScheduledPosts(); // Refresh the list
      toast.success('Post scheduled successfully');
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setScheduledPostsError(errorMsg);
      toast.error(`Error scheduling post: ${errorMsg}`);
      return null;
    } finally {
      setLoadingScheduledPosts(false);
    }
  }, [isAuthenticated, api, getScheduledPosts, token]);

  const deleteScheduledPost = useCallback(async (postId) => {
    if (!isAuthenticated) return false;
    
    setLoadingScheduledPosts(true);
    setScheduledPostsError(null);
    
    try {
      const response = await api().post('/schedule-posts/delete', { post_id: postId });
      await getScheduledPosts(); // Refresh the list
      toast.success('Post deleted successfully');
      return true;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setScheduledPostsError(errorMsg);
      toast.error(`Error deleting post: ${errorMsg}`);
      return false;
    } finally {
      setLoadingScheduledPosts(false);
    }
  }, [isAuthenticated, api, getScheduledPosts]);
  
  // =====================
  // COMMENT REPLY FUNCTIONS
  // =====================
    const getAllCommentReplies = useCallback(async ({ post_id }) => {
    if (!isAuthenticated || !post_id) return [];
    
    setLoadingCommentReplies(true);
    setCommentRepliesError(null);
    
    try {
      console.log('Sending request to get comments with payload:', { post_id });
      const response = await api().post('/comment-replies', { post_id });
      console.log('Comment replies response:', response.data);
      console.log('Full response:', response);
      
      setCommentReplies(response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setCommentRepliesError(errorMsg);
      toast.error(`Error loading comment replies: ${errorMsg}`);
      return [];
    } finally {
      setLoadingCommentReplies(false);
    }
  }, [isAuthenticated, api]);
  
  const getCommentRepliesByCommentId = useCallback(async (commentId) => {
    if (!isAuthenticated) return [];
    
    setLoadingCommentReplies(true);
    setCommentRepliesError(null);
    
    try {
      const response = await api().post('/comment-replies/comment', { comment_id: commentId });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setCommentRepliesError(errorMsg);
      toast.error(`Error loading comment replies by ID: ${errorMsg}`);
      return [];
    } finally {
      setLoadingCommentReplies(false);
    }
  }, [isAuthenticated, api]);
  
  const addCommentReply = useCallback(async (commentData) => {
    if (!isAuthenticated) return null;
    
    setLoadingCommentReplies(true);
    setCommentRepliesError(null);
    
    try {
      console.log('Sending comment reply with data:', {
        page_id: commentData.page_id,
        post_id: commentData.post_id,
        comment_id: commentData.comment_id,
        reply_message: commentData.content
      });
      
      const response = await api().post('/add-comment', {
        page_id: commentData.page_id,
        post_id: commentData.post_id,
        comment_id: commentData.comment_id,
        reply_message: commentData.content
      });

      console.log('API response for comment reply:', response.data);
      
      if (response.data && response.data.message) {
        toast.success(response.data.message);
      } else {
        toast.success('Reply sent successfully');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error in addCommentReply:', error);
      
      // Log detailed error information
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      } else if (error.request) {
        console.error('Error request - no response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error occurred';
      setCommentRepliesError(errorMsg);
      toast.error(`Error adding comment reply: ${errorMsg}`);
      throw error;
    } finally {
      setLoadingCommentReplies(false);
    }
  }, [isAuthenticated, api]);
  
  // Get auto reply services
  const getAutoReplyServices = useCallback(async () => {
    if (!isAuthenticated) return [];
    
    setLoadingServices(true);
    setServicesError(null);
    
    try {
      const response = await api().get('/subscriptions/autoreply');
      console.log('services reply',response);
      
      setAutoReplyServices(response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setServicesError(errorMsg);
      toast.error(`Error loading auto reply services: ${errorMsg}`);
      return [];
    } finally {
      setLoadingServices(false);
    }
  }, [isAuthenticated, api]);


  
  // General loading state
  const isLoading = loadingAccount || loadingWallet || loadingHome || loadingAutomations || 
                    loadingScheduledPosts || loadingCommentReplies || loadingPlatforms || loadingPages || loadingServices;
  
  // Refresh all data
  const refreshAll = useCallback(() => {
    getAccount();
    getWallet();
    getHomeData();
    getAllAutomations();
    getScheduledPosts();
    getAllCommentReplies();
    getPlatforms();
    getPages();
    getAutoReplyServices();
  }, [getAccount, getWallet, getHomeData, getAllAutomations, getScheduledPosts, getAllCommentReplies, getPlatforms, getPages, getAutoReplyServices]);
    const value = {
    // Auto Reply Services
    autoReplyServices,
    loadingServices,
    servicesError,
    getAutoReplyServices,
    
    // Account
    accountData,
    loadingAccount,
    accountError,
    getAccount,
    updateAccount,
    
    // Wallet
    walletData,
    walletHistory,
    loadingWallet,
    walletError,
    getWallet,
    
    // Dashboard
    homeData,
    loadingHome,
    homeError,
    getHomeData,
    
    // Automations
    automations,
    loadingAutomations,
    automationsError,
    getAllAutomations,
    createAutomation,
    updateAutomation,
    deleteAutomation,
    
    // Platforms and Pages
    platforms,
    loadingPlatforms,
    platformsError,
    getPlatforms,
    getPlatformById,
    getPlatformAuthLink,
    pages,
    loadingPages,
    pagesError,
    getPages,
    getPagePosts,
    syncPagePosts,
    getAllPagePosts,
    
    // Scheduled Posts
    scheduledPosts,
    loadingScheduledPosts,
    scheduledPostsError,
    getScheduledPosts,
    getScheduledPostById,
    createScheduledPost,
    deleteScheduledPost,
    
    // Comment Replies
    commentReplies,
    loadingCommentReplies,
    commentRepliesError,
    getAllCommentReplies,
    getCommentRepliesByCommentId,
    addCommentReply,
    
    // Auto Reply Services
    autoReplyServices,
    loadingServices,
    servicesError,
    getAutoReplyServices,
    
    // General
    isLoading,
    refreshAll,
  };
  
  return <BoomContext.Provider value={value}>{children}</BoomContext.Provider>;
};

// Custom hook to use the Boom context
export const useBoom = () => {
  const context = useContext(BoomContext);
  if (!context) {
    throw new Error('useBoom must be used within a BoomProvider');
  }
  return context;
};

export default BoomContext;