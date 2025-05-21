import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, RefreshCw, Link2, Calendar, BarChart3, MessageCircle, Users } from "lucide-react";
import { useBoom } from "@/contexts/BoomContext";

export function IntegrationsPage() {
  const navigate = useNavigate();
  const { 
    platforms, 
    loadingPlatforms, 
    getPlatforms,
    pages, 
    loadingPages,
    getPages,
    getPlatformAuthLink,
    syncPagePosts
  } = useBoom();

  const [showConnectModal, setShowConnectModal] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState(null);
  const [connectStep, setConnectStep] = useState(1);
  const [connectError, setConnectError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [platformLink, setPlatformLink] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch platforms and pages on component mount
  useEffect(() => {
    getPlatforms();
    getPages();
  }, [getPlatforms, getPages]);

  const handleConnectClick = (platform) => {
    setCurrentPlatform(platform);
    setConnectStep(1);
    setConnectError("");
    setPlatformLink("");
    setShowConnectModal(true);
  };

  const handleGetPlatformLink = async () => {
    if (!currentPlatform) return;
    
    setIsConnecting(true);
    setConnectError("");
    
    try {
      const link = await getPlatformAuthLink(currentPlatform.id);
      
      if (link) {
        setPlatformLink(link);
        setConnectStep(2);
      } else {
        setConnectError("Failed to get platform authorization link");
      }
    } catch (error) {
      setConnectError("Error connecting to platform: " + error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleContinue = () => {
    if (connectStep === 1) {
      // Get the platform auth link
      handleGetPlatformLink();
    } else if (connectStep === 2) {
      // Open the platform auth link in a new window
      if (platformLink) {
        window.open(platformLink, '_blank', 'width=600,height=700');
        setConnectStep(3);
      }
    } else if (connectStep === 3) {
      // After user has authorized, refresh platforms
      handleRefreshAll();
      setShowConnectModal(false);
    }
  };

  const handleRefreshAll = async () => {
    setRefreshing(true);
    try {
      await getPlatforms();
      await getPages();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefreshAccount = async (platformId) => {
    try {
      await getPlatforms();
      await getPages();
    } catch (error) {
      console.error("Error refreshing account:", error);
    }
  };

  const handleSyncPagePosts = async (pageId) => {
    try {
      await syncPagePosts(pageId);
    } catch (error) {
      console.error("Error syncing page posts:", error);
    }
  };

  const handleViewPagePosts = (pageId) => {
    navigate(`/page-posts/${pageId}`);
  };

  // Define available platforms based on what the API supports
  const availablePlatforms = [
    {
      id: "facebook",
      name: "Facebook",
      icon: "f",
      bgColor: "bg-blue-100 text-blue-800",
      description: "Connect to your Facebook pages to schedule posts and analyze performance."
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: "📸",
      bgColor: "bg-pink-100 text-pink-800",
      description: "Connect to your Instagram business account to schedule posts and analyze performance."
    },
    {
      id: "twitter",
      name: "Twitter",
      icon: "𝕏",
      bgColor: "bg-gray-100 text-gray-800",
      description: "Connect to your Twitter account to schedule tweets and analyze engagement."
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: "in",
      bgColor: "bg-blue-100 text-blue-800",
      description: "Connect to your LinkedIn profile or page to schedule posts and track analytics."
    }
  ];

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago`;
    if (interval === 1) return `1 year ago`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;
    if (interval === 1) return `1 month ago`;
    
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;
    if (interval === 1) return `1 day ago`;
    
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;
    if (interval === 1) return `1 hour ago`;
    
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;
    if (interval === 1) return `1 minute ago`;
    
    return `${Math.floor(seconds)} seconds ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Social Platforms</h2>
          <p className="text-muted-foreground">
            Connect and manage your social media accounts to schedule posts and analyze performance.
          </p>
        </div>
        <Button 
          onClick={handleRefreshAll} 
          variant="outline" 
          disabled={refreshing || loadingPlatforms}
        >
          {refreshing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh All
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="accounts">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="accounts">Platforms</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="accounts" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Connected Platforms</h3>
            <Button onClick={() => setShowConnectModal(true)}>Connect New Platform</Button>
          </div>
          
          {loadingPlatforms ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : platforms.length === 0 ? (
            <Alert className="bg-muted">
              <AlertTitle>No platforms connected yet</AlertTitle>
              <AlertDescription>
                Connect your social media platforms to start scheduling posts and analyzing performance.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {platforms.map((platform) => (
                <Card key={platform.id} className="overflow-hidden border-l-4" style={{borderLeftColor: getPlatformBorderColor(platform.platform_name)}}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getPlatformColor(platform.platform_name)}`}>
                          {getPlatformIcon(platform.platform_name)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{platform.platform_name}</CardTitle>
                          <p className="text-xs text-muted-foreground">
                            Last synced: {timeAgo(platform.last_sync_at)}
                          </p>
                        </div>
                      </div>
                      <Badge variant={platform.status === "active" ? "default" : "outline"}>
                        {platform.status === "active" ? "Active" : "Error"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-2 gap-2 my-2">
                      <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                        <Users className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">Followers</p>
                          <p className="font-medium">{formatNumber(platform.followers || 0)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                        <BarChart3 className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">Engagement</p>
                          <p className="font-medium">{formatNumber(platform.total_engagement || 0)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                        <MessageCircle className="h-4 w-4 text-purple-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">Comments</p>
                          <p className="font-medium">{formatNumber(platform.comments || 0)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                        <Calendar className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">Activity</p>
                          <p className="font-medium">{timeAgo(platform.last_activity)}</p>
                        </div>
                      </div>
                    </div>
                    
                    {platform.profile_url && (
                      <div className="mt-3 text-sm truncate">
                        <Link2 className="h-3 w-3 inline-block mr-1 text-blue-500" />
                        <a href={platform.profile_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">
                          {platform.profile_url}
                        </a>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 bg-muted/20">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRefreshAccount(platform.id)}
                    >
                      Refresh
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Disconnect
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          
          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-semibold">Available Platforms</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {availablePlatforms.map((platform) => {
                const isConnected = platforms.some(p => p.platform_name.toLowerCase() === platform.name.toLowerCase());
                return (
                  <Card key={platform.id} className={isConnected ? "border-primary/50" : ""}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded flex items-center justify-center ${platform.bgColor}`}>
                          {platform.icon}
                        </div>
                        <CardTitle className="text-md">{platform.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-xs">
                        {platform.description}
                      </CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant={isConnected ? "outline" : "default"} 
                        size="sm" 
                        className="w-full"
                        disabled={isConnected}
                        onClick={() => handleConnectClick(platform)}
                      >
                        {isConnected ? "Connected" : "Connect"}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="pages" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Connected Pages</h3>
            <Button onClick={handleRefreshAll} variant="outline">Refresh Pages</Button>
          </div>
          
          {loadingPages ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : pages.length === 0 ? (
            <Alert className="bg-muted">
              <AlertTitle>No pages connected yet</AlertTitle>
              <AlertDescription>
                Connect your social media accounts to access your pages.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pages.map((page) => (
                <Card key={page.id} className="overflow-hidden border-l-4" style={{borderLeftColor: getPlatformBorderColor(page.platform_name)}}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded flex items-center justify-center ${getPlatformColor(page.platform_name)}`}>
                          {getPlatformIcon(page.platform_name)}
                        </div>
                        <CardTitle className="text-lg">{page.page_name}</CardTitle>
                      </div>
                      <Badge>
                        {page.platform_name}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <span className="font-medium">Page ID:</span> {page.page_id}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Connected since: {new Date(page.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last update: {timeAgo(page.updated_at)}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSyncPagePosts(page.page_id)}
                    >
                      Sync Posts
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleViewPagePosts(page.page_id)}
                    >
                      View Posts
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Connect Account Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {currentPlatform 
                ? `Connect to ${currentPlatform.name}`
                : "Connect Social Media Platform"
              }
            </h2>
            
            {connectStep === 1 && (
              <div className="space-y-4">
                {!currentPlatform ? (
                  <div className="grid gap-3 grid-cols-2">
                    {availablePlatforms.map((platform) => (
                      <button
                        key={platform.id}
                        className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent"
                        onClick={() => setCurrentPlatform(platform)}
                      >
                        <div className={`w-8 h-8 rounded flex items-center justify-center ${platform.bgColor}`}>
                          {platform.icon}
                        </div>
                        <span>{platform.name}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded flex items-center justify-center ${currentPlatform.bgColor}`}>
                        {currentPlatform.icon}
                      </div>
                      <div>
                        <div className="font-medium">{currentPlatform.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {currentPlatform.description}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm">
                        To connect your {currentPlatform.name} account, you'll need to:
                      </p>
                      <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
                        <li>Click the button below to start the authorization process</li>
                        <li>Log in to your {currentPlatform.name} account</li>
                        <li>Grant permissions to the app</li>
                        <li>Return to this page after successfully connecting</li>
                      </ol>
                    </div>
                    
                    {connectError && (
                      <Alert variant="destructive">
                        <AlertDescription>{connectError}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {connectStep === 2 && (
              <div className="space-y-4">
                <p className="text-sm">
                  Click the button below to open {currentPlatform.name} authorization page in a new window.
                </p>
                
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium">What happens next:</p>
                  <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
                    <li>Log in to your {currentPlatform.name} account</li>
                    <li>Grant the requested permissions</li>
                    <li>You'll be redirected back to our app automatically</li>
                    <li>Return to this window and click "Complete Connection"</li>
                  </ol>
                </div>
                
                {connectError && (
                  <Alert variant="destructive">
                    <AlertDescription>{connectError}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}
            
            {connectStep === 3 && (
              <div className="space-y-4">
                <p className="text-sm">
                  After authorizing in the new window, click the button below to complete the connection.
                </p>
                
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium">Please note:</p>
                  <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                    <li>Make sure you've completed the authorization process in the popup window</li>
                    <li>If the authorization failed, you can try again</li>
                    <li>After connecting, you'll be able to manage your {currentPlatform.name} content</li>
                  </ul>
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowConnectModal(false)}
              >
                Cancel
              </Button>
              
              <Button 
                onClick={handleContinue}
                disabled={isConnecting || (!currentPlatform && connectStep === 1)}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : connectStep === 1 
                  ? "Continue" 
                  : connectStep === 2 
                    ? "Open Authorization Page" 
                    : "Complete Connection"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const getPlatformColor = (platformName) => {
  const name = platformName.toLowerCase();
  if (name.includes('facebook')) return 'bg-blue-100 text-blue-800';
  if (name.includes('instagram')) return 'bg-pink-100 text-pink-800';
  if (name.includes('twitter')) return 'bg-gray-100 text-gray-800';
  if (name.includes('linkedin')) return 'bg-blue-100 text-blue-800';
  if (name.includes('pinterest')) return 'bg-red-100 text-red-800';
  if (name.includes('tiktok')) return 'bg-black text-white';
  if (name.includes('youtube')) return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800';
};

const getPlatformBorderColor = (platformName) => {
  const name = platformName.toLowerCase();
  if (name.includes('facebook')) return '#3b5998';
  if (name.includes('instagram')) return '#e1306c';
  if (name.includes('twitter')) return '#1da1f2';
  if (name.includes('linkedin')) return '#0077b5';
  if (name.includes('pinterest')) return '#bd081c';
  if (name.includes('tiktok')) return '#000000';
  if (name.includes('youtube')) return '#ff0000';
  return '#6b7280';
};

const getPlatformIcon = (platformName) => {
  const name = platformName.toLowerCase();
  if (name.includes('facebook')) return 'f';
  if (name.includes('instagram')) return '📸';
  if (name.includes('twitter')) return '𝕏';
  if (name.includes('linkedin')) return 'in';
  if (name.includes('pinterest')) return 'P';
  if (name.includes('tiktok')) return '♪';
  if (name.includes('youtube')) return '▶';
  return '@';
}; 