import { useState, useEffect } from "react";
import { connectSocialMedia, getConnectedAccounts } from "@/lib/socialMediaAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export function SocialMediaConnect({ onAccountConnected }) {
  const [accounts, setAccounts] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [connectError, setConnectError] = useState(null);
  const [connectStep, setConnectStep] = useState(1);
  const [connectSuccess, setConnectSuccess] = useState(false);

  useEffect(() => {
    // Load connected accounts when component mounts
    setAccounts(getConnectedAccounts());
  }, []);

  const platforms = [
    {
      id: "facebook",
      name: "Facebook",
      icon: "✓",
      color: "bg-blue-600 text-white",
      bgColor: "bg-blue-100",
      description: "Connect to post comments and messages"
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: "📸",
      color: "bg-gradient-to-r from-purple-600 to-pink-500 text-white",
      bgColor: "bg-gradient-to-r from-purple-100 to-pink-100",
      description: "Connect to reply to comments and messages"
    },
    {
      id: "twitter",
      name: "Twitter (X)",
      icon: "𝕏",
      color: "bg-black text-white",
      bgColor: "bg-gray-100",
      description: "Connect to manage tweets and responses"
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: "in",
      color: "bg-blue-800 text-white",
      bgColor: "bg-blue-100",
      description: "Connect to manage comments and messages"
    },
    {
      id: "pinterest",
      name: "Pinterest",
      icon: "P",
      color: "bg-red-600 text-white",
      bgColor: "bg-red-100",
      description: "Connect to manage pins and comments"
    }
  ];

  const handleConnectClick = (platform) => {
    setSelectedPlatform(platform);
    setConnectStep(1);
    setConnectError(null);
    setConnectSuccess(false);
    setIsModalOpen(true);
  };

  const handleStartConnection = async () => {
    setIsConnecting(true);
    setConnectError(null);
    
    try {
      // In a real app, this would connect to the platform
      const result = await connectSocialMedia(selectedPlatform.id);
      
      setConnectSuccess(true);
      setConnectStep(2);
      
      // Add the newly connected account to the list
      if (!result.mockData) {
        const newAccount = {
          id: result.userInfo?.id || `${selectedPlatform.id}-${Date.now()}`,
          platform: selectedPlatform.id,
          name: result.userInfo?.name || `${selectedPlatform.name} Account`,
          username: result.userInfo?.username || 'username',
          profileImage: result.userInfo?.picture?.data?.url || 'https://via.placeholder.com/150',
          accessToken: result.accessToken,
          expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
        };
        
        const updatedAccounts = [...accounts, newAccount];
        setAccounts(updatedAccounts);
        
        // Notify parent component if callback provided
        if (onAccountConnected) {
          onAccountConnected(updatedAccounts);
        }
      } else {
        // For demo, add mock account
        const newAccount = {
          id: `${selectedPlatform.id}-${Date.now()}`,
          platform: selectedPlatform.id,
          name: `${selectedPlatform.name} Account`,
          username: `yourbrand_${selectedPlatform.id}`,
          profileImage: 'https://via.placeholder.com/150',
          accessToken: 'mock-token',
          expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
        };
        
        const updatedAccounts = [...accounts, newAccount];
        setAccounts(updatedAccounts);
        
        // Notify parent component if callback provided
        if (onAccountConnected) {
          onAccountConnected(updatedAccounts);
        }
      }
    } catch (error) {
      setConnectError(error.toString());
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = (accountId) => {
    // In a real app, this would call an API to revoke access to the platform
    const updatedAccounts = accounts.filter(account => account.id !== accountId);
    setAccounts(updatedAccounts);
    
    // Notify parent component if callback provided
    if (onAccountConnected) {
      onAccountConnected(updatedAccounts);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => {
          const platform = platforms.find(p => p.id === account.platform);
          return (
            <div 
              key={account.id} 
              className="bg-card rounded-xl shadow-sm border overflow-hidden transition-all hover:shadow-md"
            >
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${platform?.color || 'bg-gray-200'}`}>
                    {platform?.icon || '●'}
                  </div>
                  <div>
                    <h3 className="font-medium">{account.name}</h3>
                    <p className="text-sm text-muted-foreground">@{account.username}</p>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                  Connected
                </Badge>
              </div>
              <div className="border-t p-3 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDisconnect(account.id)}
                >
                  Disconnect
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Connect Additional Accounts</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {platforms.map((platform) => {
            const isConnected = accounts.some(a => a.platform === platform.id);
            return (
              <button
                key={platform.id}
                className={`flex flex-col items-center p-4 rounded-xl border transition-all ${
                  isConnected 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-accent cursor-pointer'
                }`}
                onClick={() => !isConnected && handleConnectClick(platform)}
                disabled={isConnected}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${platform.color}`}>
                  {platform.icon}
                </div>
                <span className="font-medium text-sm">{platform.name}</span>
                {isConnected && (
                  <span className="text-xs mt-1 text-emerald-600">Connected</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Connect Account Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {connectStep === 1 
                ? `Connect to ${selectedPlatform?.name}`
                : 'Connection Successful'}
            </DialogTitle>
            <DialogDescription>
              {connectStep === 1 
                ? `Connect your ${selectedPlatform?.name} account to enable automations.`
                : `Your ${selectedPlatform?.name} account has been connected successfully.`}
            </DialogDescription>
          </DialogHeader>

          {connectStep === 1 && (
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedPlatform?.color}`}>
                  {selectedPlatform?.icon}
                </div>
                <div>
                  <div className="font-medium">{selectedPlatform?.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedPlatform?.description}
                  </div>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm">
                  Connecting will allow the app to:
                </p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>Access your profile information</li>
                  <li>Post content on your behalf (when configured)</li>
                  <li>Read and respond to comments and messages</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-3">
                  Note: You can disconnect at any time to revoke these permissions.
                </p>
              </div>
              
              {connectError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-800 text-sm">
                  {connectError}
                </div>
              )}
            </div>
          )}
          
          {connectStep === 2 && (
            <div className="py-4 text-center">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl mb-4">
                ✓
              </div>
              <h3 className="text-lg font-medium">Connection Successful!</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Your {selectedPlatform?.name} account has been successfully connected.
                You can now set up automations for this account.
              </p>
            </div>
          )}
          
          <DialogFooter>
            {connectStep === 1 ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleStartConnection}
                  disabled={isConnecting}
                >
                  {isConnecting ? 'Connecting...' : 'Connect Account'}
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setIsModalOpen(false)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Continue
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 