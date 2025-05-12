import { createContext, useContext, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { integrationService } from "@/lib/api";

const IntegrationsContext = createContext({});

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
      setError("Failed to load connected platforms");
      
      // Only show toast on first attempt
      if (retryCount === 0) {
        toast.error("Failed to load connected platforms");
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
      toast.error("Failed to load platform details");
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
      toast.error("Failed to load platform pages");
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
      toast.error("Failed to load page posts");
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
      toast.error("Failed to load page posts");
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
      toast.error("Failed to sync page posts");
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
      toast.error("Failed to disconnect platform");
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