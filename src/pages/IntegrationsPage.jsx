import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useIntegrations } from "@/contexts/IntegrationsContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// View states for navigation
const VIEWS = {
  MAIN: "main",
  ACCOUNT_DETAILS: "account_details",
  PAGES: "pages",
  POSTS: "posts",
};

export function IntegrationsPage() {
  const { user } = useAuth();
  const { 
    connectedAccounts, 
    platformPages,
    pagePosts,
    isLoading: isContextLoading, 
    error: contextError,
    fetchConnectedPlatforms,
    fetchPlatformPages,
    fetchAllPagePosts,
    fetchPostsByPage,
    syncPagePosts,
    connectPlatform,
    addConnectedAccount
  } = useIntegrations();

  // Navigation and view state
  const [currentView, setCurrentView] = useState(VIEWS.MAIN);
  const [viewHistory, setViewHistory] = useState([]);

  // Data states
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);
  const [pages, setPages] = useState([]);
  const [posts, setPosts] = useState([]);
  
  // Status states
  const [connectStep, setConnectStep] = useState(1);
  const [connectSuccess, setConnectSuccess] = useState(false);
  const [connectError, setConnectError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [connectedUserInfo, setConnectedUserInfo] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      fetchConnectedPlatforms();
    };
    
    // Initial fetch with a small delay to prevent rapid requests
    const timer = setTimeout(fetchData, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Navigation helpers
  const navigateTo = (view, account = null, page = null) => {
    setViewHistory([...viewHistory, currentView]);
    setCurrentView(view);
    
    if (account) setSelectedAccount(account);
    if (page) setSelectedPage(page);
  };

  const navigateBack = () => {
    if (viewHistory.length === 0) return;
    
    const prevView = viewHistory[viewHistory.length - 1];
    setCurrentView(prevView);
    setViewHistory(viewHistory.slice(0, -1));
  };

  // Refresh helpers
  const refreshCurrentView = async () => {
    setIsRefreshing(true);
    
    try {
      switch (currentView) {
        case VIEWS.MAIN:
          await fetchConnectedPlatforms();
          break;
        case VIEWS.ACCOUNT_DETAILS:
          await fetchConnectedPlatforms();
          break;
        case VIEWS.PAGES:
          if (selectedAccount) {
            const fetchedPages = await fetchPlatformPages();
            const platformPages = fetchedPages.filter(
              page => page.platform_id === selectedAccount.platformId
            );
            setPages(platformPages);
          }
          break;
        case VIEWS.POSTS:
          if (selectedPage) {
            const fetchedPosts = await fetchPostsByPage(selectedPage.page_id);
            setPosts(fetchedPosts);
          }
          break;
        default:
          break;
      }
      toast.success("Data refreshed successfully");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleConnectClick = (platform) => {
    setCurrentPlatform(platform);
    setConnectStep(1);
    setConnectSuccess(false);
    setConnectError("");
    setShowConnectModal(true);
  };

  const handleViewDetails = (account) => {
    setSelectedAccount(account);
    navigateTo(VIEWS.ACCOUNT_DETAILS, account);
  };

  const handleViewPages = async (account) => {
    try {
      setSelectedAccount(account);
      setIsConnecting(true);
      const fetchedPages = await fetchPlatformPages();
      // Filter pages by the selected platform ID
      const platformPages = fetchedPages.filter(
        page => page.platform_id === account.platformId
      );
      setPages(platformPages);
      navigateTo(VIEWS.PAGES, account);
    } catch (error) {
      console.error("Error fetching pages:", error);
      toast.error("Failed to fetch pages");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleViewPagePosts = async (page) => {
    try {
      setIsSyncing(true);
      const fetchedPosts = await fetchPostsByPage(page.page_id);
      setPosts(fetchedPosts);
      navigateTo(VIEWS.POSTS, selectedAccount, page);
    } catch (error) {
      console.error("Error fetching page posts:", error);
      toast.error("Failed to fetch page posts");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncPagePosts = async (page) => {
    try {
      setIsSyncing(true);
      const result = await syncPagePosts(page.page_id);
      const fetchedPosts = result.data || [];
      setPosts(fetchedPosts);
      toast.success("Posts synced successfully");
    } catch (error) {
      console.error("Error syncing page posts:", error);
      toast.error("Failed to sync page posts");
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePlatformConnect = async (platform) => {
    setIsConnecting(true);
    setConnectError("");
    
    try {
      const { authLink, handleCallback } = await connectPlatform(platform.id);
      
      if (!authLink) {
        throw new Error('No authentication link received from server');
      }

      // Open authentication in a new window
      const authWindow = window.open(
        authLink,
        `${platform.name}Auth`,
        'width=600,height=700,left=' + (window.innerWidth - 600)/2 + ',top=' + (window.innerHeight - 700)/2
      );

      if (!authWindow) {
        throw new Error('Pop-up window was blocked. Please allow pop-ups for this site.');
      }

      setConnectStep(2);
      
      // Listen for messages from the auth window
      const handleAuthMessage = async (event) => {
        const allowedOrigins = [window.location.origin];
        if (!allowedOrigins.includes(event.origin)) {
          console.log('Ignored message from unauthorized origin:', event.origin);
          return;
        }

        if (event.data?.type === 'social_auth_callback') {
          if (event.data.success) {
            try {
              const response = await handleCallback(event.data.token);
              
              const newAccount = {
                id: response.id || Math.random().toString(36).slice(2, 11),
                platform: platform.id,
                name: response.profile?.name || `${platform.name} Account`,
                username: response.profile?.username || user?.email?.split('@')[0] || 'user',
                avatar: response.profile?.picture || "/placeholder-avatar.jpg",
                status: "active",
                connectedAt: new Date(),
                lastSync: new Date(),
                stats: response.stats || {}
              };
              
              setConnectedUserInfo({
                name: newAccount.name,
                email: response.profile?.email || user?.email,
                picture: newAccount.avatar
              });
              
              addConnectedAccount(newAccount);
              setConnectSuccess(true);
              setConnectStep(3);
              toast.success(`${platform.name} connected successfully`);

              if (authWindow && !authWindow.closed) {
                authWindow.close();
              }
            } catch (error) {
              console.error('Error processing callback:', error);
              setConnectError(error.message || 'Failed to complete authentication');
              setConnectStep(3);
              toast.error(`Failed to connect ${platform.name}`);
            }
          } else {
            console.error('Authentication failed:', event.data.error);
            setConnectError(event.data.error || 'Authentication failed');
            setConnectStep(3);
            toast.error(`${platform.name} authentication failed`);
          }
          
          window.removeEventListener('message', handleAuthMessage);
        }
      };
      
      window.addEventListener('message', handleAuthMessage);
      
      const checkWindow = setInterval(() => {
        if (authWindow.closed) {
          clearInterval(checkWindow);
          window.removeEventListener('message', handleAuthMessage);
          if (!connectSuccess) {
            setConnectError('Authentication window was closed');
            setConnectStep(3);
            setIsConnecting(false);
            toast.warning('Authentication window was closed');
          }
        }
      }, 1000);
      
    } catch (error) {
      console.error('Connection process error:', error);
      setConnectError(error.message || error.toString());
      setConnectStep(3);
      toast.error(`Failed to connect ${platform.name}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const platforms = [
    {
      id: "facebook",
      name: "Facebook",
      icon: "f",
      bgColor: "bg-blue-100",
      color: "bg-blue-600 text-white",
      description: "Connect your Facebook account to manage pages and posts"
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: "📸",
      bgColor: "bg-gradient-to-r from-purple-100 to-pink-100",
      color: "bg-gradient-to-r from-purple-600 to-pink-600 text-white",
      description: "Connect your Instagram business account to manage posts"
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: "in",
      bgColor: "bg-blue-100",
      color: "bg-blue-800 text-white",
      description: "Connect your LinkedIn profile to manage professional content"
    }
  ];

  // Filter out platforms that are already connected
  const availablePlatforms = platforms.filter(platform => 
    !connectedAccounts.some(account => account.platform === platform.id.toLowerCase())
  );

  // Breadcrumb generation
  const generateBreadcrumbs = () => {
    const breadcrumbs = [
      { label: "Integrations", view: VIEWS.MAIN }
    ];

    if (currentView === VIEWS.ACCOUNT_DETAILS && selectedAccount) {
      breadcrumbs.push({ 
        label: selectedAccount.name, 
        view: VIEWS.ACCOUNT_DETAILS 
      });
    }

    if (currentView === VIEWS.PAGES && selectedAccount) {
      breadcrumbs.push({ 
        label: selectedAccount.name, 
        view: VIEWS.ACCOUNT_DETAILS 
      });
      breadcrumbs.push({ 
        label: "Pages", 
        view: VIEWS.PAGES 
      });
    }

    if (currentView === VIEWS.POSTS && selectedPage) {
      breadcrumbs.push({ 
        label: selectedAccount?.name || "Account", 
        view: VIEWS.ACCOUNT_DETAILS 
      });
      breadcrumbs.push({ 
        label: "Pages", 
        view: VIEWS.PAGES 
      });
      breadcrumbs.push({ 
        label: selectedPage.page_name || "Posts", 
        view: VIEWS.POSTS 
      });
    }

    return breadcrumbs;
  };

  // Render navigation bar
  const renderNavigation = () => {
    const breadcrumbs = generateBreadcrumbs();
    
    return (
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center flex-wrap">
          {currentView !== VIEWS.MAIN && (
            <Button
              variant="ghost"
              size="sm"
              onClick={navigateBack}
              className="text-muted-foreground mr-1 p-1 sm:p-2 h-8"
            >
              ←
            </Button>
          )}
          
          <div className="flex items-center flex-wrap">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && <span className="mx-1 sm:mx-2 text-muted-foreground text-xs sm:text-sm">/</span>}
                <span 
                  className={`text-xs sm:text-sm ${
                    index === breadcrumbs.length - 1 
                      ? "font-medium" 
                      : "text-muted-foreground hover:text-foreground cursor-pointer"
                  }`}
                  onClick={() => {
                    if (index < breadcrumbs.length - 1) {
                      setCurrentView(crumb.view);
                      setViewHistory(viewHistory.slice(0, index));
                    }
                  }}
                >
                  {crumb.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={refreshCurrentView}
          disabled={isRefreshing || isContextLoading}
          className="flex items-center text-xs h-8 px-2 sm:px-3"
        >
          {isRefreshing ? (
            <>
              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-1 sm:mr-2"></div>
              <span className="sm:inline hidden">Refreshing...</span>
              <span className="sm:hidden inline">...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 sm:mr-2">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                <path d="M3 21v-5h5"></path>
              </svg>
              <span className="sm:inline hidden">Refresh</span>
            </>
          )}
        </Button>
      </div>
    );
  };

  // Render the appropriate view
  const renderView = () => {
    switch (currentView) {
      case VIEWS.MAIN:
        return renderMainView();
      case VIEWS.ACCOUNT_DETAILS:
        return renderAccountDetails();
      case VIEWS.PAGES:
        return renderPagesView();
      case VIEWS.POSTS:
        return renderPostsView();
      default:
        return renderMainView();
    }
  };

  // Main view with connected accounts and available platforms
  const renderMainView = () => (
    <div className="space-y-8">
      {/* Connected Accounts */}
      {connectedAccounts.length > 0 && (
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Connected Accounts</h2>
            <p className="text-muted-foreground text-xs sm:text-sm">Your active social media integrations</p>
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {connectedAccounts.map(account => (
              <Card key={account.id} className="hover:shadow-md transition-shadow border-t-4 border-green-500">
                <CardHeader className="flex flex-row items-center gap-3 sm:gap-4 p-4 sm:p-6">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                    account.platform === "facebook" ? "bg-blue-600 text-white" : 
                    account.platform === "instagram" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" :
                    account.platform === "linkedin" ? "bg-blue-800 text-white" : ""
                  }`}>
                    <img src={account.avatar} alt="" className="w-full h-full rounded-full" />
                  </div>
                  <div>
                    <CardTitle className="text-sm sm:text-base">{account.name}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">@{account.username}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      Connected
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      {account.platform.charAt(0).toUpperCase() + account.platform.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Followers</span>
                      <span className="font-medium">{account.stats.followers || 0}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Engagement</span>
                      <span className="font-medium">{account.stats.totalEngagement || 0}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 p-4 sm:p-6">
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 w-full">
                    <Button 
                      variant="outline" 
                      onClick={() => handleViewDetails(account)}
                      className="text-xs sm:text-sm h-8 sm:h-10"
                    >
                      View Details
                    </Button>
                    {account.platform === "facebook" && (
                      <Button 
                        variant="outline"
                        className="text-xs sm:text-sm h-8 sm:h-10 bg-blue-50 hover:bg-blue-100"
                        onClick={() => handleViewPages(account)}
                      >
                        View Pages
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Platforms */}
      {availablePlatforms.length > 0 && (
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Available Integrations</h2>
            <p className="text-muted-foreground text-xs sm:text-sm">Connect additional platforms to your account</p>
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {availablePlatforms.map(platform => (
              <Card key={platform.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-3 sm:gap-4 p-4 sm:p-6">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl ${platform.color}`}>
                    {platform.icon}
                  </div>
                  <div>
                    <CardTitle className="text-sm sm:text-base">{platform.name}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">{platform.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardFooter className="p-4 sm:p-6">
                  <Button 
                    variant="outline" 
                    className="w-full text-xs sm:text-sm h-8 sm:h-10"
                    onClick={() => handleConnectClick(platform)}
                  >
                    Connect {platform.name}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Account details view
  const renderAccountDetails = () => {
    if (!selectedAccount) return null;
    
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto sm:mx-0 ${
            selectedAccount.platform === "facebook" ? "bg-blue-600" : 
            selectedAccount.platform === "instagram" ? "bg-gradient-to-r from-purple-600 to-pink-600" :
            selectedAccount.platform === "linkedin" ? "bg-blue-800" : "bg-gray-600"
          }`}>
            <img 
              src={selectedAccount.avatar} 
              alt={selectedAccount.name} 
              className="w-full h-full rounded-full"
            />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold">{selectedAccount.name}</h2>
            <p className="text-muted-foreground text-sm">@{selectedAccount.username}</p>
            <div className="flex gap-2 mt-1 justify-center sm:justify-start flex-wrap">
              <Badge 
                variant="outline" 
                className="text-xs capitalize bg-blue-50 text-blue-700 border-blue-200"
              >
                {selectedAccount.platform}
              </Badge>
              <Badge 
                variant="outline" 
                className={`text-xs ${selectedAccount.status === "active" 
                  ? "bg-green-50 text-green-700 border-green-200" 
                  : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {selectedAccount.status}
              </Badge>
            </div>
          </div>
        </div>
        
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-sm sm:text-base">Connection Details</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs sm:text-sm">
              <div>
                <h4 className="font-medium text-muted-foreground mb-1">Connected</h4>
                <p>{new Date(selectedAccount.connectedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="font-medium text-muted-foreground mb-1">Last Sync</h4>
                <p>{new Date(selectedAccount.lastSync).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="font-medium text-muted-foreground mb-1">Last Activity</h4>
                <p>{selectedAccount.lastActivity ? new Date(selectedAccount.lastActivity).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-medium text-muted-foreground mb-1">Platform ID</h4>
                <p className="truncate">{selectedAccount.platformId || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-sm sm:text-base">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Platform Type:</span>
                  <span>{selectedAccount.platformType || 'Social Media'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Language:</span>
                  <span>{selectedAccount.language || 'Not specified'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Timezone:</span>
                  <span>{selectedAccount.timezone || 'Not specified'}</span>
                </div>
                {selectedAccount.profileUrl && (
                  <div className="pt-2">
                    <a 
                      href={selectedAccount.profileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center text-xs sm:text-sm"
                    >
                      View Profile
                      <span className="ml-1">↗</span>
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-sm sm:text-base">Account Statistics</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs sm:text-sm text-muted-foreground">Followers</div>
                  <div className="text-lg sm:text-2xl font-semibold mt-1">{selectedAccount.stats.followers || 0}</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs sm:text-sm text-muted-foreground">Likes</div>
                  <div className="text-lg sm:text-2xl font-semibold mt-1">{selectedAccount.stats.likes || 0}</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs sm:text-sm text-muted-foreground">Comments</div>
                  <div className="text-lg sm:text-2xl font-semibold mt-1">{selectedAccount.stats.comments || 0}</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs sm:text-sm text-muted-foreground">Total Engagement</div>
                  <div className="text-lg sm:text-2xl font-semibold mt-1">{selectedAccount.stats.totalEngagement || 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedAccount.platform === "facebook" && (
          <div className="flex justify-center mt-4">
            <Button 
              size="lg"
              onClick={() => handleViewPages(selectedAccount)}
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-sm"
            >
              View Facebook Pages
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Platform pages view
  const renderPagesView = () => {
    if (!selectedAccount) return null;
    
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            {selectedAccount.name} - Facebook Pages
          </h2>
          <p className="text-muted-foreground">
            Manage your Facebook pages and their content
          </p>
        </div>
        
        {isConnecting ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <span className="ml-3 text-muted-foreground">Loading pages...</span>
          </div>
        ) : pages.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {pages.map(page => (
              <Card key={page.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="bg-blue-50 pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle>{page.page_name}</CardTitle>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                      {page.platform_name}
                    </Badge>
                  </div>
                  <CardDescription className="truncate mt-1">ID: {page.page_id}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span>{new Date(page.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span>{new Date(page.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2 border-t pt-4">
                  <Button 
                    variant="default" 
                    className="flex-1"
                    onClick={() => handleViewPagePosts(page)}
                  >
                    View Posts
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleSyncPagePosts(page)}
                    disabled={isSyncing}
                  >
                    {isSyncing ? (
                      <span className="flex items-center">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                        Syncing...
                      </span>
                    ) : "Sync Posts"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-muted p-8 rounded-lg text-center">
            <h3 className="text-lg font-medium mb-2">No Pages Found</h3>
            <p className="text-muted-foreground mb-4">
              No Facebook pages were found for this account.
            </p>
            <Button onClick={refreshCurrentView}>
              Try Again
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Page posts view
  const renderPostsView = () => {
    if (!selectedPage) return null;
    
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            {selectedPage.page_name} - Posts
          </h2>
          <p className="text-muted-foreground">
            View and manage posts from this Facebook page
          </p>
        </div>
        
        <div className="flex justify-between items-center my-4">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Page ID:</div>
            <div className="font-mono text-sm bg-muted p-1 px-2 rounded">{selectedPage.page_id}</div>
          </div>
          
          <Button 
            onClick={() => handleSyncPagePosts(selectedPage)}
            disabled={isSyncing}
            className="flex items-center gap-2"
          >
            {isSyncing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Syncing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                  <path d="M3 21v-5h5"></path>
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                  <path d="M21 3v5h-5"></path>
                </svg>
                Sync Posts
              </>
            )}
          </Button>
        </div>
        
        {isSyncing ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <span className="ml-3 text-muted-foreground">Loading posts...</span>
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            <Tabs defaultValue="list">
              <TabsList className="mb-4">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="list">
                <div className="space-y-4">
                  {posts.map(post => (
                    <Card key={post.id} className="hover:shadow-sm transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base font-medium">{post.page_name}</CardTitle>
                          <Badge variant="outline" className="text-blue-700 bg-blue-50 border-blue-200">
                            {new Date(post.created_time).toLocaleDateString()}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm py-2 border-y">
                          {post.messages}
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>Post ID: {post.post_id.split('_')[1]}</span>
                          <span>Created: {new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="grid">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {posts.map(post => (
                    <Card key={post.id} className="hover:shadow-sm transition-shadow overflow-hidden">
                      <CardHeader className="pb-2 bg-gray-50">
                        <CardTitle className="text-base font-medium">{post.page_name}</CardTitle>
                        <CardDescription>
                          Posted on {new Date(post.created_time).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm line-clamp-4">{post.messages}</p>
                      </CardContent>
                      <CardFooter className="bg-gray-50 text-xs text-muted-foreground">
                        ID: {post.post_id.split('_')[1]}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="bg-muted p-8 rounded-lg text-center">
            <h3 className="text-lg font-medium mb-2">No Posts Found</h3>
            <p className="text-muted-foreground mb-4">
              No posts were found for this page. Try syncing posts to fetch the latest content.
            </p>
            <Button onClick={() => handleSyncPagePosts(selectedPage)}>
              Sync Posts
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container py-6 mx-auto px-4 sm:px-6 max-w-6xl">
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Integrations</h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">Connect and manage your social media accounts</p>
      </div>

      {contextError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="text-sm">{contextError}</AlertDescription>
        </Alert>
      )}

      {currentView !== VIEWS.MAIN && (
        <div className="mb-6 overflow-x-auto pb-2">
          {renderNavigation()}
        </div>
      )}

      {isContextLoading && !isRefreshing ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <span className="ml-3 text-muted-foreground text-sm">Loading data...</span>
        </div>
      ) : (
        <div className="overflow-x-hidden">
          {renderView()}
        </div>
      )}

      {/* Connect Account Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg p-4 sm:p-6 w-full max-w-2xl relative max-h-[90vh] overflow-auto">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              {connectStep === 3 && connectSuccess
                ? "Connection Successful!"
                : currentPlatform 
                  ? `Connect to ${currentPlatform.name}`
                  : "Connect Social Media Account"
              }
            </h2>
            
            {connectStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded flex items-center justify-center ${currentPlatform?.bgColor}`}>
                    {currentPlatform?.icon}
                  </div>
                  <div>
                    <div className="font-medium">{currentPlatform?.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {currentPlatform?.description}
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm">
                    This will allow the app to:
                  </p>
                  <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                    <li>Access your public profile information</li>
                    <li>Manage your pages and posts</li>
                    <li>Read engagement metrics</li>
                  </ul>
                </div>
              </div>
            )}

            {connectStep === 2 && (
              <div className="text-center p-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-lg font-medium">Connecting to {currentPlatform?.name}...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please complete the authentication in the popup window.
                  Don't close this window.
                </p>
              </div>
            )}
            
            {connectStep === 3 && (
              <div className="space-y-4">
                {connectSuccess && connectedUserInfo ? (
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl mb-4">
                      ✓
                    </div>
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <img 
                        src={connectedUserInfo.picture} 
                        alt={connectedUserInfo.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="text-left">
                        <div className="font-medium">{connectedUserInfo.name}</div>
                        <div className="text-sm text-muted-foreground">{connectedUserInfo.email}</div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your {currentPlatform?.name} account has been successfully connected.
                      You can now start managing your content and viewing analytics.
                    </p>
                  </div>
                ) : (
                  <Alert variant="destructive">
                    <AlertTitle>Connection Failed</AlertTitle>
                    <AlertDescription>{connectError}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowConnectModal(false);
                }}
                disabled={isConnecting}
              >
                {connectStep === 3 ? "Close" : "Cancel"}
              </Button>
              
              {connectStep === 1 && (
                <Button 
                  onClick={() => handlePlatformConnect(currentPlatform)}
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <span className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Connecting...</span>
                    </span>
                  ) : (
                    "Connect Account"
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}