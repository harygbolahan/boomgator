import { createContext, useContext, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { integrationService } from "@/lib/api";

const IntegrationsContext = createContext({});

// Helper function to extract the most specific error message from an API error
const extractErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  // Check for response data message (most specific)
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Check for response data error
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  
  // If error is already a string, return it
  if (typeof error === 'string') {
    return error;
  }
  
  // Check for standard error message
  if (error.message) {
    return error.message;
  }
  
  // Fallback for unknown error format
  return 'Something went wrong. Please try again.';
};

export function IntegrationsProvider({ children }) {
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [platformPages, setPlatformPages] = useState([]);
  const [pagePosts, setPagePosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const fetchConnectedPlatforms = useCallback(async () => {
    // Skip if already loading or max retries reached
    if (isLoading || retryCount >= MAX_RETRIES) return;
    
    try {
      setIsLoading(true);
      const platforms = await integrationService.getPlatforms();
      setConnectedAccounts(platforms);
      setError(null);
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error("Error fetching platforms:", error);
      const errorMessage = extractErrorMessage(error);
      setError(errorMessage);
      
      // Only show toast on first attempt
      if (retryCount === 0) {
        toast.error(`Failed to load connected platforms: ${errorMessage}`);
      }
      
      // Increment retry count
      setRetryCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, retryCount]);

  const getPlatformById = async (id) => {
    try {
      setIsLoading(true);
      const platform = await integrationService.getPlatformById(id);
      return platform;
    } catch (error) {
      console.error(`Error fetching platform with ID ${id}:`, error);
      const errorMessage = extractErrorMessage(error);
      toast.error(`Failed to load platform details: ${errorMessage}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlatformPages = async () => {
    try {
      setIsLoading(true);
      const pages = await integrationService.getAllPlatformPages();
      setPlatformPages(pages);
      return pages;
    } catch (error) {
      console.error("Error fetching platform pages:", error);
      const errorMessage = extractErrorMessage(error);
      toast.error(`Failed to load platform pages: ${errorMessage}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllPagePosts = async () => {
    try {
      setIsLoading(true);
      const posts = await integrationService.getAllPagePosts();
      setPagePosts(posts);
      return posts;
    } catch (error) {
      console.error("Error fetching all page posts:", error);
      const errorMessage = extractErrorMessage(error);
      toast.error(`Failed to load page posts: ${errorMessage}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPostsByPage = async (pageId) => {
    try {
      setIsLoading(true);
      const posts = await integrationService.getPostsByPage(pageId);
      return posts;
    } catch (error) {
      console.error(`Error fetching posts for page ID ${pageId}:`, error);
      const errorMessage = extractErrorMessage(error);
      toast.error(`Failed to load page posts: ${errorMessage}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const syncPagePosts = async (pageId) => {
    try {
      setIsLoading(true);
      const result = await integrationService.syncPagePosts(pageId);
      toast.success(result.message || "Posts synced successfully");
      return result;
    } catch (error) {
      console.error(`Error syncing posts for page ID ${pageId}:`, error);
      const errorMessage = extractErrorMessage(error);
      toast.error(`Failed to sync page posts: ${errorMessage}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const connectPlatform = async (platformId) => {
    try {
      setIsLoading(true);
      const result = await integrationService.connectPlatform(platformId);
      return result;
    } catch (error) {
      console.error("Error connecting platform:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectPlatform = async (platformId) => {
    try {
      setIsLoading(true);
      await integrationService.disconnectPlatform(platformId);
      setConnectedAccounts(prev => prev.filter(acc => acc.id !== platformId));
      toast.success("Platform disconnected successfully");
    } catch (error) {
      console.error("Error disconnecting platform:", error);
      const errorMessage = extractErrorMessage(error);
      toast.error(`Failed to disconnect platform: ${errorMessage}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addConnectedAccount = (account) => {
    setConnectedAccounts(prev => [...prev, account]);
  };

  return (
    <IntegrationsContext.Provider value={{
      connectedAccounts,
      platformPages,
      pagePosts,
      isLoading,
      error,
      fetchConnectedPlatforms,
      getPlatformById,
      fetchPlatformPages,
      fetchAllPagePosts,
      fetchPostsByPage,
      syncPagePosts,
      connectPlatform,
      disconnectPlatform,
      addConnectedAccount
    }}>
      {children}
    </IntegrationsContext.Provider>
  );
}

export const useIntegrations = () => {
  const context = useContext(IntegrationsContext);
  if (!context) {
    throw new Error("useIntegrations must be used within an IntegrationsProvider");
  }
  return context;
};