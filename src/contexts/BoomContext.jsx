import { createContext, useContext, useState, useCallback, useEffect } from 'react';
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

  // Announcements data
  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [announcementsError, setAnnouncementsError] = useState(null);

  // Chat data
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingCurrentChat, setLoadingCurrentChat] = useState(false);
  const [chatsError, setChatsError] = useState(null);
  const [currentChatError, setCurrentChatError] = useState(null);
  
  // Subscription data
  const [availablePackages, setAvailablePackages] = useState(null);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [loadingCurrentPackage, setLoadingCurrentPackage] = useState(false);
  const [packageError, setPackageError] = useState(null);
  const [subscribingPackage, setSubscribingPackage] = useState(false);
  const [subscribeError, setSubscribeError] = useState(null);

  // Support tickets data
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [ticketsError, setTicketsError] = useState(null);

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
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error loading account data";
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
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error updating account";
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
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error loading wallet data";
      setWalletError(errorMsg);
      toast.error(`Error loading wallet data: ${errorMsg}`);
      return null;
    } finally {
      setLoadingWallet(false);
    }
  }, [isAuthenticated, api]);

  const fundWallet = useCallback(async (amount) => {
    if (!isAuthenticated) return null;
    
    setLoadingWallet(true);
    setWalletError(null);
    
    try {
      const response = await axios.post('https://ai.loomsuite.com/api/checkout', {
        amount: parseFloat(amount),
        product_name: "Top up wallet"
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Log the response as requested
      console.log('Payment checkout response:', response.data);
      console.log('Full response object:', response);
      
      toast.success('Payment checkout initiated successfully');
      return response.data;
    } catch (error) {
      console.error('Payment checkout error:', error);
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error initiating payment checkout";
      setWalletError(errorMsg);
      toast.error(`Error initiating payment: ${errorMsg}`);
      return null;
    } finally {
      setLoadingWallet(false);
    }
  }, [isAuthenticated, token]);
  
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
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error loading dashboard data";
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
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error loading automations";
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
      const completeData = {
        ...automationData,
        triggers: automationData.triggers || 0,
        actions: automationData.actions || 0
      };
      
      const response = await api().post('/automations/set', completeData);
      await getAllAutomations(); 
      toast.success('Automation created successfully');
      return response.data;
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error creating automation";
      console.error('Error creating automation:', errorMsg);
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
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error updating automation";
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
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error deleting automation";
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
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error loading platforms";
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
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error loading pages";
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
      const response = await api().post('https://ai.loomsuite.com/api/link/social/login', {
        type: platformType
      });
      
      if (response.data.status === 'success' && response.data.link) {
        return response.data.link;
      } else {
        throw new Error("Failed to get platform authorization link");
      }
    } catch (error) {
      toast.error(`Error getting platform link: ${error?.response?.data?.message || error?.response?.data?.error || "Failed to get platform link"}`);
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
      toast.error(`Error loading page posts: ${error?.response?.data?.message || error?.response?.data?.error || "Failed to load page posts"}`);
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
      toast.error(`Error fetching platform: ${error?.response?.data?.message || error?.response?.data?.error || "Failed to fetch platform"}`);
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
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error loading all page posts";
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
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error loading scheduled posts";
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
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error loading post details";
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
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error scheduling post";
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
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error deleting post";
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
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error loading comment replies";
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
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error loading comment replies by ID";
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
        console.error('Error details:', error);
      }
      
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Unknown error occurred when adding comment reply";
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
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error loading auto reply services";
      setServicesError(errorMsg);
      toast.error(`Error loading auto reply services: ${errorMsg}`);
      return [];
    } finally {
      setLoadingServices(false);
    }
  }, [isAuthenticated, api]);

  // =====================
  // ANNOUNCEMENTS FUNCTIONS
  // =====================
  
  const getAnnouncements = useCallback(async () => {
    if (!isAuthenticated) return [];
    
    setLoadingAnnouncements(true);
    setAnnouncementsError(null);
    
    try {
      const response = await api().get('/announcements');
      setAnnouncements(response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error loading announcements";
      setAnnouncementsError(errorMsg);
      console.error('Error loading announcements:', errorMsg);
      return [];
    } finally {
      setLoadingAnnouncements(false);
    }
  }, [isAuthenticated, api]);

  // =====================
  // SUBSCRIPTION FUNCTIONS
  // =====================
  
  // Get all available subscription packages
  const getAllPackages = useCallback(async () => {
    if (!isAuthenticated) return null;
    
    setLoadingPackages(true);
    setPackageError(null);
    
    try {
      const response = await api().get('/subscriptions');
      setAvailablePackages(response.data.package);
      return response.data.package;
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error loading subscription packages";
      setPackageError(errorMsg);
      toast.error(`Error loading subscription packages: ${errorMsg}`);
      return null;
    } finally {
      setLoadingPackages(false);
    }
  }, [isAuthenticated, api]);
  
  // Get user's current package
  const getUserPackage = useCallback(async () => {
    if (!isAuthenticated) return null;
    
    setLoadingCurrentPackage(true);
    setPackageError(null);
    
    try {
      const response = await api().get('/subscriptions/me');
      console.log('user package',response);
      setCurrentPackage(response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error loading your subscription package";
      console.log('user package error',errorMsg);
      setPackageError(errorMsg);
      toast.error(`Error loading your subscription package: ${errorMsg}`);
      return null;
    } finally {
      setLoadingCurrentPackage(false);
    }
  }, [isAuthenticated, api]);
  
  // Subscribe to a new package
  const subscribeToPackage = useCallback(async (packageName) => {
    if (!isAuthenticated) return null;
    
    setSubscribingPackage(true);
    setSubscribeError(null);
    
    try {
      const response = await api().post('/subscribe/package', {
        package: packageName.toLowerCase() // Convert to lowercase to ensure consistency
      });
      
      // Update the current package
      setCurrentPackage(response.data);
      
      toast.success(`Successfully subscribed to ${packageName.toUpperCase()} package`);
      return response.data;
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || `Error subscribing to ${packageName} package`;
      setSubscribeError(errorMsg);
      toast.error(`Error subscribing to package: ${errorMsg}`);
      return null;
    } finally {
      setSubscribingPackage(false);
    }
  }, [isAuthenticated, api]);
  
  // Check if user has subscription for a specific service
  const checkServiceSubscription = useCallback((serviceId, serviceName = null) => {
    if (!currentPackage || !currentPackage.service || !Array.isArray(currentPackage.service)) {
      return {
        subscribed: false,
        limit: {
          daily: 0,
          weekly: 0,
          monthly: 0
        },
        service: serviceName || 'Unknown Service'
      };
    }
    
    // Find the service by ID or name
    const service = currentPackage.service.find(
      s => s.id === serviceId || (serviceName && s.service === serviceName)
    );
    
    if (!service) {
      return {
        subscribed: false,
        limit: {
          daily: 0,
          weekly: 0,
          monthly: 0
        },
        service: serviceName || 'Unknown Service'
      };
    }
    
    return {
      subscribed: true,
      limit: {
        daily: service.limit_daily || 0,
        weekly: service.limit_weekly || 0,
        monthly: service.limit_monthly || 0
      },
      service: service.service
    };
  }, [currentPackage]);

  // =====================
  // CHAT FUNCTIONS
  // =====================
  
  const getAllChats = useCallback(async (pageId) => {
    if (!isAuthenticated || !pageId) return [];
    
    setLoadingChats(true);
    setChatsError(null);
    
    try {
      const response = await api().post('/chats', { page_id: pageId });
      setChats(response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error loading chats";
      setChatsError(errorMsg);
      toast.error(`Error loading chats: ${errorMsg}`);
      return [];
    } finally {
      setLoadingChats(false);
    }
  }, [isAuthenticated, api]);
  
  const openChat = useCallback(async (pageId, threadId) => {
    if (!isAuthenticated || !pageId || !threadId) return [];
    
    setLoadingCurrentChat(true);
    setCurrentChatError(null);
    
    try {
      const response = await api().post('/chats/open', { 
        page_id: pageId,
        thread_id: threadId
      });
      setCurrentChat(response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error opening chat";
      setCurrentChatError(errorMsg);
      toast.error(`Error opening chat: ${errorMsg}`);
      return [];
    } finally {
      setLoadingCurrentChat(false);
    }
  }, [isAuthenticated, api]);
  
  const replyToChat = useCallback(async (pageId, recipientId, message) => {
    if (!isAuthenticated || !pageId || !recipientId || !message) return null;
    
    setLoadingCurrentChat(true);
    setCurrentChatError(null);
    
    try {
      const response = await api().post('/chats/reply', {
        page_id: pageId,
        recipient_id: recipientId,
        message: message
      });
      
      if (response.data.success) {
        toast.success('Message sent successfully');
        return response.data;
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error sending message";
      setCurrentChatError(errorMsg);
      toast.error(`Error sending message: ${errorMsg}`);
      return null;
    } finally {
      setLoadingCurrentChat(false);
    }
  }, [isAuthenticated, api]);
  
  // =====================
  // CONTENT GENERATION FUNCTIONS
  // =====================

  const generateContent = useCallback(async (contentParams) => {
    if (!isAuthenticated) return null;
    
    try {
      console.log('Generating content with params:', contentParams);
      
      const response = await api().post('/generate-content', {
        keyword: contentParams.keyword,
        audience: contentParams.audience || '',
        tone: contentParams.tone || 'Professional',
        voice_style: contentParams.voice_style || 'Straightforward',
        length: contentParams.length || '150 words',
        cta: contentParams.cta || ''
      });
      
      console.log('Content generation API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error generating content:', error);
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error generating content";
      toast.error(`Error generating content: ${errorMsg}`);
      return null;
    }
  }, [isAuthenticated, api]);
  
  // =====================
  // SUBSCRIBER FUNCTIONS
  // =====================
  
  const getSubscribers = useCallback(async () => {
    if (!isAuthenticated) return [];
    
    try {
      const response = await api().get('/subscribers');
      return response.data.data || [];
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error loading subscribers";
      toast.error(`Error loading subscribers: ${errorMsg}`);
      return [];
    }
  }, [isAuthenticated, api]);

  const getSubscribersByLabel = useCallback(async (keyword) => {
    if (!isAuthenticated || !keyword) return [];
    
    try {
      const response = await api().post('/subscribers/lebel', { keyword });
      return response.data.data || [];
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error loading subscribers by label";
      toast.error(`Error loading subscribers by label: ${errorMsg}`);
      return [];
    }
  }, [isAuthenticated, api]);

  const deleteSubscriber = useCallback(async (subscriberId) => {
    if (!isAuthenticated || !subscriberId) return false;
    
    try {
      const response = await api().post('/subscribers/delete', { id: subscriberId });
      if (response.data.status === 'success') {
        toast.success('Subscriber deleted successfully');
        return true;
      }
      return false;
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error deleting subscriber";
      toast.error(`Error deleting subscriber: ${errorMsg}`);
      return false;
    }
  }, [isAuthenticated, api]);

  const sendBroadcast = useCallback(async (broadcastData) => {
    if (!isAuthenticated || !broadcastData) return false;
    
    try {
      const response = await api().post('/subscribers/broadcasts', broadcastData);
      if (response.data.status === 'success') {
        return true;
      }
      return false;
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error sending broadcast";
      toast.error(`Error sending broadcast: ${errorMsg}`);
      return false;
    }
  }, [isAuthenticated, api]);
  
  // =====================
  // SUPPORT TICKET FUNCTIONS
  // =====================
  
  const getAllTickets = useCallback(async () => {
    if (!isAuthenticated) return [];
    
    setLoadingTickets(true);
    setTicketsError(null);
    
    try {
      const response = await api().get('/tickets');
      setTickets(response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error loading tickets";
      setTicketsError(errorMsg);
      toast.error(`Error loading tickets: ${errorMsg}`);
      return [];
    } finally {
      setLoadingTickets(false);
    }
  }, [isAuthenticated, api]);
  
  const createTicket = useCallback(async (ticketData) => {
    if (!isAuthenticated) return null;
    
    setLoadingTickets(true);
    setTicketsError(null);
    
    try {
      const response = await api().post('/tickets/add', {
        subject: ticketData.subject,
        message: ticketData.message
      });
      
      if (response.data.status === 'success') {
        await getAllTickets(); // Refresh the tickets list
        toast.success('Ticket created successfully');
        return response.data;
      } else {
        throw new Error("Failed to create ticket");
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error creating ticket";
      setTicketsError(errorMsg);
      toast.error(`Error creating ticket: ${errorMsg}`);
      return null;
    } finally {
      setLoadingTickets(false);
    }
  }, [isAuthenticated, api, getAllTickets]);
  
  const replyToTicket = useCallback(async (ticketId, reply) => {
    if (!isAuthenticated || !ticketId || !reply) return null;
    
    setLoadingTickets(true);
    setTicketsError(null);
    
    try {
      const response = await api().post('/tickets/reply', {
        ticket_id: ticketId,
        reply: reply
      });
      
      if (response.data.message) {
        await getAllTickets(); // Refresh the tickets list
        toast.success('Reply added successfully');
        return response.data;
      } else {
        throw new Error("Failed to add reply");
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.response?.data?.error || "Error adding reply";
      setTicketsError(errorMsg);
      toast.error(`Error adding reply: ${errorMsg}`);
      return null;
    } finally {
      setLoadingTickets(false);
    }
  }, [isAuthenticated, api, getAllTickets]);
  
  // General loading state
  const isLoading = loadingAccount || loadingWallet || loadingHome || loadingAutomations || 
                    loadingScheduledPosts || loadingCommentReplies || loadingPlatforms || 
                    loadingPages || loadingServices || loadingChats || loadingCurrentChat ||
                    loadingPackages || loadingCurrentPackage || subscribingPackage || 
                    loadingAnnouncements || loadingTickets;
  
  // Refresh all data
  const refreshAll = useCallback(() => {
    getAccount();
    getWallet();
    getHomeData();
    getAllAutomations();
    getScheduledPosts();
    getAllPackages();
    getUserPackage();
    getPlatforms();
    getPages();
    getAutoReplyServices();
    getAnnouncements();
    getAllTickets();
    // Note: 
    // - Not calling getAllChats here as it requires pageId parameter
    // - Not calling getAllCommentReplies here as it requires post_id parameter
  }, [getAccount, getWallet, getHomeData, getAllAutomations, getScheduledPosts, 
      getPlatforms, getPages, getAutoReplyServices, getAnnouncements,
      getAllPackages, getUserPackage, getAllTickets]);
    
  // Initialize the data when auth token changes
  useEffect(() => {
    if (isAuthenticated && token) {
      refreshAll();
    }
  }, [isAuthenticated, token, refreshAll]);

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
    fundWallet,
    
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
    
    // Announcements
    announcements,
    loadingAnnouncements,
    announcementsError,
    getAnnouncements,
    
    // Subscriptions
    availablePackages,
    currentPackage,
    loadingPackages,
    loadingCurrentPackage,
    packageError,
    subscribingPackage,
    subscribeError,
    getAllPackages,
    getUserPackage,
    subscribeToPackage,
    checkServiceSubscription,
    
    // Chats
    chats,
    currentChat,
    loadingChats,
    loadingCurrentChat,
    chatsError,
    currentChatError,
    getAllChats,
    openChat,
    replyToChat,
    
    // General
    isLoading,
    refreshAll,
    
    // Content Generation
    generateContent,
    
      // Subscribers
  getSubscribers,
  getSubscribersByLabel,
  deleteSubscriber,
  sendBroadcast,
  
  // Support Tickets
  tickets,
  loadingTickets,
  ticketsError,
  getAllTickets,
  createTicket,
  replyToTicket,
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