import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function IntegrationsPage() {
  const [connectedAccounts, setConnectedAccounts] = useState(initialConnectedAccounts);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState(null);
  const [connectStep, setConnectStep] = useState(1);
  const [authCode, setAuthCode] = useState("");
  const [connectSuccess, setConnectSuccess] = useState(false);
  const [connectError, setConnectError] = useState("");

  const handleConnectClick = (platform) => {
    setCurrentPlatform(platform);
    setConnectStep(1);
    setAuthCode("");
    setConnectSuccess(false);
    setConnectError("");
    setShowConnectModal(true);
  };

  const handleContinue = () => {
    if (connectStep === 1) {
      // In a real app, this would redirect to the platform's auth page
      // For demo, we'll just go to the next step
      setConnectStep(2);
    } else if (connectStep === 2) {
      if (!authCode.trim()) {
        setConnectError("Please enter the authorization code");
        return;
      }
      
      // Simulate API call to verify code
      setTimeout(() => {
        // Demo succeeds with code "12345"
        if (authCode === "12345") {
          setConnectSuccess(true);
          const newAccount = {
            id: Math.random().toString(36).slice(2, 11),
            platform: currentPlatform.id,
            name: `${currentPlatform.name} Account`,
            username: `user_${Math.floor(Math.random() * 1000)}`,
            avatar: "/placeholder-avatar.jpg",
            status: "active",
            connectedAt: new Date(),
            lastSync: new Date()
          };
          
          setConnectedAccounts([...connectedAccounts, newAccount]);
          setConnectStep(3);
        } else {
          setConnectError("Invalid authorization code. Try 12345 for the demo.");
        }
      }, 1000);
    } else if (connectStep === 3) {
      // Close the modal after success
      setShowConnectModal(false);
    }
  };

  const handleDisconnect = (accountId) => {
    const updatedAccounts = connectedAccounts.filter(account => account.id !== accountId);
    setConnectedAccounts(updatedAccounts);
  };

  const handleRefreshAccount = (accountId) => {
    const updatedAccounts = connectedAccounts.map(account => {
      if (account.id === accountId) {
        return {
          ...account,
          lastSync: new Date()
        };
      }
      return account;
    });
    setConnectedAccounts(updatedAccounts);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Integrations</h2>
          <p className="text-muted-foreground">
            Connect your social media accounts and other marketing tools.
          </p>
        </div>
      </div>

      <Tabs defaultValue="accounts">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>
        
        <TabsContent value="accounts" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Connected Accounts</h3>
            <Button onClick={() => setShowConnectModal(true)}>Connect New Account</Button>
          </div>
          
          {connectedAccounts.length === 0 ? (
            <Alert className="bg-muted">
              <AlertTitle>No accounts connected yet</AlertTitle>
              <AlertDescription>
                Connect your social media accounts to start scheduling posts and analyzing performance.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {connectedAccounts.map((account) => {
                const platform = platforms.find(p => p.id === account.platform);
                return (
                  <Card key={account.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 rounded flex items-center justify-center ${platform.bgColor}`}>
                            {platform.icon}
                          </div>
                          <CardTitle className="text-lg">{platform.name}</CardTitle>
                        </div>
                        <Badge variant={account.status === "active" ? "default" : "outline"}>
                          {account.status === "active" ? "Active" : "Error"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-3 mb-2">
                        <img 
                          src={account.avatar} 
                          alt={account.name} 
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="font-medium">{account.name}</div>
                          <div className="text-xs text-muted-foreground">@{account.username}</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        Last synced: {new Date(account.lastSync).toLocaleString()}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRefreshAccount(account.id)}
                      >
                        Refresh
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDisconnect(account.id)}
                      >
                        Disconnect
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
          
          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-semibold">Available Platforms</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {platforms.map((platform) => {
                const isConnected = connectedAccounts.some(a => a.platform === platform.id);
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
        
        <TabsContent value="tools" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Marketing Tools</h3>
            <Button variant="outline">Add New Tool</Button>
          </div>
          
          <Alert className="bg-muted">
            <AlertTitle>No tools connected yet</AlertTitle>
            <AlertDescription>
              Connect your marketing tools to enhance your workflow.
            </AlertDescription>
          </Alert>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {marketingTools.map((tool) => (
              <Card key={tool.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded flex items-center justify-center bg-muted">
                      {tool.icon}
                    </div>
                    <CardTitle className="text-md">{tool.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs">
                    {tool.description}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                  >
                    Connect
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">API Integration</h3>
            <Button variant="outline">Generate New Key</Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Your API Keys</CardTitle>
              <CardDescription>
                Use these keys to access our API and integrate with your own systems.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Production Key</div>
                    <div className="text-sm text-muted-foreground">Created: August 2, 2023</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Show</Button>
                    <Button variant="outline" size="sm">Revoke</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Development Key</div>
                    <div className="text-sm text-muted-foreground">Created: July 15, 2023</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Show</Button>
                    <Button variant="outline" size="sm">Revoke</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>
                Learn how to integrate with our platform through the API.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <a href="#" className="text-blue-600 hover:underline">Getting Started Guide</a>
                <a href="#" className="text-blue-600 hover:underline">API Reference</a>
                <a href="#" className="text-blue-600 hover:underline">Code Examples</a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Connect Account Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {currentPlatform 
                ? `Connect to ${currentPlatform.name}`
                : "Connect Social Media Account"
              }
            </h2>
            
            {connectStep === 1 && (
              <div className="space-y-4">
                {!currentPlatform ? (
                  <div className="grid gap-3 grid-cols-2">
                    {platforms.map((platform) => (
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
                        <li>Authorize access to your account</li>
                        <li>Copy the authorization code</li>
                        <li>Paste the code here to complete the connection</li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {connectStep === 2 && (
              <div className="space-y-4">
                <p className="text-sm">
                  Enter the authorization code you received from {currentPlatform.name}
                </p>
                
                <div>
                  <label htmlFor="auth-code" className="text-sm font-medium">
                    Authorization Code
                  </label>
                  <input
                    id="auth-code"
                    type="text"
                    className="w-full p-2 mt-1 border rounded-lg"
                    placeholder="Enter code here"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                  />
                  {connectError && (
                    <p className="text-sm text-red-500 mt-1">{connectError}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    For this demo, use code: 12345
                  </p>
                </div>
              </div>
            )}
            
            {connectStep === 3 && (
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl">
                  ✓
                </div>
                <h3 className="text-lg font-medium">Connection Successful!</h3>
                <p className="text-sm text-muted-foreground">
                  Your {currentPlatform.name} account has been successfully connected.
                  You can now schedule posts and view analytics for this account.
                </p>
              </div>
            )}
            
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowConnectModal(false)}
              >
                {connectStep === 3 ? "Close" : "Cancel"}
              </Button>
              
              {connectStep < 3 && (
                <Button onClick={handleContinue}>
                  {connectStep === 1
                    ? currentPlatform 
                      ? "Authorize Account" 
                      : "Continue"
                    : "Connect Account"}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sample data
const platforms = [
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
  },
  {
    id: "pinterest",
    name: "Pinterest",
    icon: "P",
    bgColor: "bg-red-100 text-red-800",
    description: "Connect to your Pinterest account to schedule pins and analyze performance."
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "♪",
    bgColor: "bg-black text-white",
    description: "Connect to your TikTok account to schedule posts and analyze performance."
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "▶",
    bgColor: "bg-red-100 text-red-800",
    description: "Connect to your YouTube channel to schedule uploads and analyze performance."
  },
  {
    id: "threads",
    name: "Threads",
    icon: "@",
    bgColor: "bg-gray-100 text-gray-800",
    description: "Connect to your Threads account to schedule posts and track engagement."
  }
];

const marketingTools = [
  {
    id: "mailchimp",
    name: "Mailchimp",
    icon: "📧",
    description: "Email marketing platform for sending campaigns and newsletters."
  },
  {
    id: "hubspot",
    name: "HubSpot",
    icon: "H",
    description: "CRM platform with marketing, sales, and service tools."
  },
  {
    id: "canva",
    name: "Canva",
    icon: "🎨",
    description: "Design tool for creating social media graphics and more."
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    icon: "📈",
    description: "Web analytics service to track website traffic and performance."
  }
];

const initialConnectedAccounts = [
  {
    id: "acc1",
    platform: "facebook",
    name: "Brand Page",
    username: "yourbrand",
    avatar: "/placeholder-avatar.jpg",
    status: "active",
    connectedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: "acc2",
    platform: "instagram",
    name: "Brand Profile",
    username: "yourbrand",
    avatar: "/placeholder-avatar.jpg",
    status: "active",
    connectedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    lastSync: new Date(Date.now() - 5 * 60 * 60 * 1000)
  }
]; 