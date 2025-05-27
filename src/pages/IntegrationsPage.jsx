import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, RefreshCw, Link2, Calendar, BarChart3, MessageCircle, Users, Plus, TrendingUp, Activity, Check, ExternalLink } from "lucide-react";
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
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
      textColor: "text-white",
      description: "Connect to your Facebook pages to schedule posts and analyze performance.",
      features: ["Post Scheduling", "Analytics", "Page Management"]
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: "📸",
      bgColor: "bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500",
      textColor: "text-white",
      description: "Connect to your Instagram business account to schedule posts and analyze performance.",
      features: ["Story Scheduling", "Feed Posts", "Insights"]
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="space-y-8 p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 p-8 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight">Social Media Hub</h1>
              <p className="text-blue-100 text-lg max-w-2xl">
                Connect and manage all your social media platforms in one unified dashboard. 
                Schedule posts, analyze performance, and grow your audience.
              </p>
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-blue-100">{platforms.length} platforms connected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-blue-100">{pages.length} pages managed</span>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleRefreshAll} 
              variant="secondary"
              size="lg"
              disabled={refreshing || loadingPlatforms}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              {refreshing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Refresh All
                </>
              )}
            </Button>
          </div>
          {/* Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
        </div>

        <Tabs defaultValue="accounts" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-white shadow-lg border-0 p-1 rounded-xl">
            <TabsTrigger value="accounts" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-medium">
              Platforms
            </TabsTrigger>
            <TabsTrigger value="pages" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-medium">
              Pages
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="accounts" className="space-y-8">
            {/* Connected Platforms Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Connected Platforms</h2>
                  <p className="text-gray-600 mt-1">Manage your active social media connections</p>
                </div>
                <Button 
                  onClick={() => setShowConnectModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Connect Platform
                </Button>
              </div>
              
              {loadingPlatforms ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                    <div className="absolute inset-0 h-12 w-12 border-4 border-blue-200 rounded-full"></div>
                  </div>
                  <p className="text-gray-600 font-medium">Loading your platforms...</p>
                </div>
              ) : platforms.length === 0 ? (
                <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center hover:border-blue-300 transition-colors duration-200">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
                  <div className="relative z-10 space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <Link2 className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">No platforms connected yet</h3>
                      <p className="text-gray-600 mt-2 max-w-md mx-auto">
                        Connect your social media platforms to start scheduling posts and analyzing performance.
                      </p>
                    </div>
                    <Button 
                      onClick={() => setShowConnectModal(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white mt-4"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Connect Your First Platform
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {platforms.map((platform) => (
                    <Card key={platform.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white hover:-translate-y-1">
                      <div className={`h-2 ${getPlatformGradient(platform.platform_name)}`}></div>
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getPlatformGradient(platform.platform_name)} text-white font-bold text-lg shadow-lg`}>
                              {getPlatformIcon(platform.platform_name)}
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold text-gray-900">{platform.platform_name}</CardTitle>
                              <p className="text-sm text-gray-500 flex items-center">
                                <Activity className="h-3 w-3 mr-1" />
                                {timeAgo(platform.last_sync_at)}
                              </p>
                            </div>
                          </div>
                          <Badge variant={platform.status === "active" ? "default" : "outline"} className={platform.status === "active" ? "bg-green-100 text-green-800 border-green-200" : ""}>
                            {platform.status === "active" ? (
                              <>
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                                Active
                              </>
                            ) : (
                              "Error"
                            )}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl border border-blue-200">
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-blue-600" />
                              <div>
                                <p className="text-xs text-blue-600 font-medium">Followers</p>
                                <p className="font-bold text-blue-800">{formatNumber(platform.followers || 0)}</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-xl border border-green-200">
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              <div>
                                <p className="text-xs text-green-600 font-medium">Engagement</p>
                                <p className="font-bold text-green-800">{formatNumber(platform.total_engagement || 0)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-xl border border-purple-200">
                            <div className="flex items-center space-x-2">
                              <MessageCircle className="h-4 w-4 text-purple-600" />
                              <div>
                                <p className="text-xs text-purple-600 font-medium">Comments</p>
                                <p className="font-bold text-purple-800">{formatNumber(platform.comments || 0)}</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-xl border border-orange-200">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-orange-600" />
                              <div>
                                <p className="text-xs text-orange-600 font-medium">Last Active</p>
                                <p className="font-bold text-orange-800 text-xs">{timeAgo(platform.last_activity)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {platform.profile_url && (
                          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl border">
                            <ExternalLink className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            <a 
                              href={platform.profile_url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate font-medium"
                            >
                              View Profile
                            </a>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="bg-gray-50/50 border-t border-gray-100">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRefreshAccount(platform.id)}
                          className="w-full hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors duration-200"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Refresh Data
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            
            {/* Available Platforms Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Available Platforms</h2>
                <p className="text-gray-600 mt-1">Connect to these social media platforms</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {availablePlatforms.map((platform) => {
                  const isConnected = platforms.some(p => p.platform_name.toLowerCase() === platform.name.toLowerCase());
                  return (
                    <Card key={platform.id} className={`group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white hover:-translate-y-1 ${isConnected ? "ring-2 ring-green-200" : ""}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${platform.bgColor} ${platform.textColor} font-bold text-lg shadow-lg`}>
                            {platform.icon}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg font-bold text-gray-900">{platform.name}</CardTitle>
                            {isConnected && (
                              <div className="flex items-center text-green-600 text-sm mt-1">
                                <Check className="h-3 w-3 mr-1" />
                                Connected
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <CardDescription className="text-sm text-gray-600 leading-relaxed">
                          {platform.description}
                        </CardDescription>
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-gray-700">Features:</p>
                          <div className="flex flex-wrap gap-1">
                            {platform.features.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant={isConnected ? "outline" : "default"} 
                          size="sm" 
                          className={`w-full transition-all duration-200 ${
                            isConnected 
                              ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100" 
                              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg"
                          }`}
                          disabled={isConnected}
                          onClick={() => handleConnectClick(platform)}
                        >
                          {isConnected ? (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Connected
                            </>
                          ) : (
                            <>
                              <Plus className="mr-2 h-4 w-4" />
                              Connect
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="pages" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Connected Pages</h2>
                <p className="text-gray-600 mt-1">Manage your social media pages and content</p>
              </div>
              <Button 
                onClick={handleRefreshAll} 
                variant="outline"
                className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Pages
              </Button>
            </div>
            
            {loadingPages ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="relative">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                  <div className="absolute inset-0 h-12 w-12 border-4 border-blue-200 rounded-full"></div>
                </div>
                <p className="text-gray-600 font-medium">Loading your pages...</p>
              </div>
            ) : pages.length === 0 ? (
              <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center hover:border-blue-300 transition-colors duration-200">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
                <div className="relative z-10 space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">No pages connected yet</h3>
                    <p className="text-gray-600 mt-2 max-w-md mx-auto">
                      Connect your social media accounts to access and manage your pages.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pages.map((page) => (
                  <Card key={page.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white hover:-translate-y-1">
                    <div className={`h-2 ${getPlatformGradient(page.platform_name)}`}></div>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getPlatformGradient(page.platform_name)} text-white font-bold shadow-md`}>
                            {getPlatformIcon(page.platform_name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg font-bold text-gray-900 truncate">{page.page_name}</CardTitle>
                          </div>
                        </div>
                        <Badge className={`${getPlatformColor(page.platform_name)} border-0 font-medium`}>
                          {page.platform_name}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-gray-50 p-3 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Page ID</span>
                          <span className="text-sm text-gray-600 font-mono">{page.page_id}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Connected</span>
                          <span className="text-sm text-gray-600">{new Date(page.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Last Updated</span>
                          <span className="text-sm text-gray-600">{timeAgo(page.updated_at)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex space-x-2 bg-gray-50/50 border-t border-gray-100">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSyncPagePosts(page.page_id)}
                        className="flex-1 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sync
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleViewPagePosts(page.page_id)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        View Posts
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Enhanced Connect Account Modal */}
        {showConnectModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <h2 className="text-2xl font-bold">
                  {currentPlatform 
                    ? `Connect to ${currentPlatform.name}`
                    : "Connect Social Media Platform"
                  }
                </h2>
                <div className="flex items-center mt-3 space-x-4">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                        connectStep >= step 
                          ? "bg-white text-blue-600" 
                          : "bg-white/20 text-white/60"
                      }`}>
                        {connectStep > step ? <Check className="h-4 w-4" /> : step}
                      </div>
                      {step < 3 && (
                        <div className={`w-8 h-1 mx-2 rounded transition-all duration-200 ${
                          connectStep > step ? "bg-white" : "bg-white/20"
                        }`}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
                {connectStep === 1 && (
                  <div className="space-y-6">
                    {!currentPlatform ? (
                      <div className="space-y-4">
                        <p className="text-gray-600 text-center">Choose a platform to connect:</p>
                        <div className="grid gap-3">
                          {availablePlatforms.map((platform) => (
                            <button
                              key={platform.id}
                              className="flex items-center space-x-4 p-4 border-2 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                              onClick={() => setCurrentPlatform(platform)}
                            >
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${platform.bgColor} ${platform.textColor} font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                                {platform.icon}
                              </div>
                              <div className="text-left flex-1">
                                <div className="font-semibold text-gray-900">{platform.name}</div>
                                <div className="text-sm text-gray-600">{platform.description}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-center space-x-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${currentPlatform.bgColor} ${currentPlatform.textColor} font-bold text-xl shadow-lg`}>
                            {currentPlatform.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-lg text-gray-900">{currentPlatform.name}</div>
                            <div className="text-sm text-gray-600">{currentPlatform.description}</div>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                          <h4 className="font-semibold text-blue-900 mb-3">Connection Process:</h4>
                          <ol className="list-decimal list-inside text-sm space-y-2 text-blue-800">
                            <li>Click "Start Authorization" to begin the process</li>
                            <li>Log in to your {currentPlatform.name} account</li>
                            <li>Grant permissions to access your account</li>
                            <li>Return here to complete the connection</li>
                          </ol>
                        </div>
                        
                        {connectError && (
                          <Alert variant="destructive" className="border-red-200 bg-red-50">
                            <AlertDescription className="text-red-800">{connectError}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                {connectStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                        <ExternalLink className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-gray-900">Ready to Authorize</h4>
                        <p className="text-gray-600">
                          Click the button below to open {currentPlatform.name} authorization page.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                      <h4 className="font-semibold text-amber-900 mb-2">Important:</h4>
                      <ul className="list-disc list-inside text-sm space-y-1 text-amber-800">
                        <li>A new window will open for authorization</li>
                        <li>Complete the login and permission process</li>
                        <li>Keep this window open during the process</li>
                        <li>Return here after successful authorization</li>
                      </ul>
                    </div>
                    
                    {connectError && (
                      <Alert variant="destructive" className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-800">{connectError}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
                
                {connectStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-gray-900">Almost Done!</h4>
                        <p className="text-gray-600">
                          Complete the authorization process and click below to finalize the connection.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
                      <h4 className="font-semibold text-green-900 mb-2">Final Steps:</h4>
                      <ul className="list-disc list-inside text-sm space-y-1 text-green-800">
                        <li>Ensure you've completed authorization in the popup window</li>
                        <li>If authorization failed, you can try connecting again</li>
                        <li>Your {currentPlatform.name} account will be ready to use</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Modal Footer */}
              <div className="flex justify-end gap-3 p-6 bg-gray-50 border-t border-gray-100">
                <Button
                  variant="outline"
                  onClick={() => setShowConnectModal(false)}
                  className="hover:bg-gray-100"
                >
                  Cancel
                </Button>
                
                <Button 
                  onClick={handleContinue}
                  disabled={isConnecting || (!currentPlatform && connectStep === 1)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : connectStep === 1 
                    ? "Start Authorization" 
                    : connectStep === 2 
                      ? "Open Authorization Page" 
                      : "Complete Connection"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
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
  if (name.includes('facebook')) return 'bg-blue-100 text-blue-800 border-blue-200';
  if (name.includes('instagram')) return 'bg-pink-100 text-pink-800 border-pink-200';
  if (name.includes('twitter')) return 'bg-gray-100 text-gray-800 border-gray-200';
  if (name.includes('linkedin')) return 'bg-blue-100 text-blue-800 border-blue-200';
  if (name.includes('pinterest')) return 'bg-red-100 text-red-800 border-red-200';
  if (name.includes('tiktok')) return 'bg-gray-900 text-white border-gray-700';
  if (name.includes('youtube')) return 'bg-red-100 text-red-800 border-red-200';
  return 'bg-gray-100 text-gray-800 border-gray-200';
};

const getPlatformGradient = (platformName) => {
  const name = platformName.toLowerCase();
  if (name.includes('facebook')) return 'bg-gradient-to-r from-blue-500 to-blue-600';
  if (name.includes('instagram')) return 'bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500';
  if (name.includes('twitter')) return 'bg-gradient-to-r from-blue-400 to-blue-500';
  if (name.includes('linkedin')) return 'bg-gradient-to-r from-blue-600 to-blue-700';
  if (name.includes('pinterest')) return 'bg-gradient-to-r from-red-500 to-red-600';
  if (name.includes('tiktok')) return 'bg-gradient-to-r from-gray-800 to-black';
  if (name.includes('youtube')) return 'bg-gradient-to-r from-red-500 to-red-600';
  return 'bg-gradient-to-r from-gray-500 to-gray-600';
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