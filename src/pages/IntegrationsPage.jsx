import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { socialAuthService } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export function IntegrationsPage() {
  const { user } = useAuth();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState(null);
  const [connectStep, setConnectStep] = useState(1);
  const [connectSuccess, setConnectSuccess] = useState(false);
  const [connectError, setConnectError] = useState("");
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedUserInfo, setConnectedUserInfo] = useState(null);
  const [connectedAccounts, setConnectedAccounts] = useState([]);

  useEffect(() => {
    // Initialize Facebook SDK when component mounts
    socialAuthService.initFacebookSdk().catch(console.error);
  }, []);

  const handleConnectClick = (platform) => {
    setCurrentPlatform(platform);
    setConnectStep(1);
    setConnectSuccess(false);
    setConnectError("");
    setShowConnectModal(true);
  };

  const handlePlatformConnect = async (platform) => {
    setIsConnecting(true);
    setShowAuthPopup(true);
    setConnectError("");
    
    try {
      const { authLink, handleCallback } = await socialAuthService.connectPlatform(platform.id);
      
      if (!authLink) {
        throw new Error('No authentication link received from server');
      }
      
      // Open the auth link in a popup window
      const authWindow = window.open(authLink, `${platform.name} Login`, 'width=600,height=600');
      
      if (!authWindow) {
        throw new Error('Popup was blocked. Please allow popups for this site.');
      }

      // Listen for messages from the popup window
      const handleAuthMessage = async (event) => {
        if (event.data?.type === 'social_auth_callback') {
          if (event.data.success) {
            try {
              // Process the callback
              const response = await handleCallback(event.data.token);
              
              // Create new account entry
              const newAccount = {
                id: Math.random().toString(36).slice(2, 11),
                platform: platform.id,
                name: response.profile?.name || `${platform.name} Account`,
                username: response.profile?.username || user?.email?.split('@')[0] || 'user',
                avatar: response.profile?.picture || "/placeholder-avatar.jpg",
                status: "active",
                connectedAt: new Date(),
                lastSync: new Date()
              };
              
              setConnectedUserInfo({
                name: newAccount.name,
                email: response.profile?.email || user?.email,
                picture: newAccount.avatar
              });
              
              setConnectedAccounts(prev => [...prev, newAccount]);
              setConnectSuccess(true);
              setConnectStep(3);
              
              // Close the popup
              authWindow.close();
            } catch (error) {
              setConnectError(error.message || 'Failed to complete authentication');
              setConnectStep(3);
            }
          } else {
            setConnectError(event.data.error || 'Authentication failed');
            setConnectStep(3);
          }
          
          // Remove the event listener
          window.removeEventListener('message', handleAuthMessage);
        }
      };
      
      // Add event listener for popup messages
      window.addEventListener('message', handleAuthMessage);
      
    } catch (error) {
      console.error('Connection error:', error);
      setConnectError(error.message || error.toString());
      setConnectStep(3);
    } finally {
      setShowAuthPopup(false);
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

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="text-muted-foreground">Connect and manage your social media accounts</p>
      </div>

      <Tabs defaultValue="accounts">
        <TabsList>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-6">
          {/* Connected Accounts */}
          {connectedAccounts.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {connectedAccounts.map(account => (
                <Card key={account.id}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      account.platform === "facebook" ? "bg-blue-600 text-white" : 
                      account.platform === "instagram" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" :
                      account.platform === "linkedin" ? "bg-blue-800 text-white" : ""
                    }`}>
                      <img src={account.avatar} alt="" className="w-full h-full rounded-full" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{account.name}</CardTitle>
                      <CardDescription>@{account.username}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Connected
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Available Platforms */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {platforms.map(platform => (
              <Card key={platform.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl ${platform.color}`}>
                    {platform.icon}
                  </div>
                  <div>
                    <CardTitle className="text-base">{platform.name}</CardTitle>
                    <CardDescription>{platform.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleConnectClick(platform)}
                  >
                    Connect {platform.name}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tools">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Tools</CardTitle>
              <CardDescription>Connect your favorite marketing tools</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your API keys for direct integration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Production Key</h3>
                  <code className="bg-muted p-2 rounded">xxxx-xxxx-xxxx-xxxx</code>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Development Key</h3>
                  <code className="bg-muted p-2 rounded">dev-xxxx-xxxx-xxxx</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Connect Account Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md relative">
            {/* Auth Popup Overlay */}
            {showAuthPopup && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-96 z-10">
                <div className="flex items-center space-x-3 border-b pb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${currentPlatform?.color}`}>
                    {currentPlatform?.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">{currentPlatform?.name}</h3>
                    <p className="text-sm text-gray-600">Log in to continue</p>
                  </div>
                </div>
                <div className="py-4 text-center">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Connecting to {currentPlatform?.name}...
                  </p>
                </div>
              </div>
            )}

            <h2 className="text-xl font-semibold mb-4">
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
                      Your {currentPlatform.name} account has been successfully connected.
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
                onClick={() => setShowConnectModal(false)}
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