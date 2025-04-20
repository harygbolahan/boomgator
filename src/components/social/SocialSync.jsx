import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  RefreshCcw, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Trash2, 
  Settings, 
  MoreHorizontal,
  Shield,
  Wifi,
  Zap,
  ChevronRight
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function SocialSync({ accounts, onDeleteAccount }) {
  const [syncStatus, setSyncStatus] = useState({
    inProgress: false,
    lastSynced: null,
    progress: 0,
    accounts: []
  });
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState(null);

  useEffect(() => {
    if (accounts && accounts.length > 0) {
      // Initialize sync status based on connected accounts
      setSyncStatus({
        inProgress: false,
        lastSynced: new Date(),
        progress: 100,
        accounts: accounts.map(account => ({
          id: account.id,
          platform: account.platform,
          name: account.name,
          status: account.status,
          metrics: generateRandomMetrics(account.platform),
          issues: account.status === "active" ? [] : ["Authentication error"]
        }))
      });
    }
  }, [accounts]);

  const handleSyncAll = () => {
    // Start sync animation
    setSyncStatus(prev => ({
      ...prev,
      inProgress: true,
      progress: 0
    }));

    // Simulate sync progress
    const interval = setInterval(() => {
      setSyncStatus(prev => {
        const newProgress = prev.progress + 10;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          
          return {
            ...prev,
            inProgress: false,
            progress: 100,
            lastSynced: new Date(),
            accounts: prev.accounts.map(account => ({
              ...account,
              metrics: generateRandomMetrics(account.platform),
              status: "active",
              issues: []
            }))
          };
        }
        
        return {
          ...prev,
          progress: newProgress
        };
      });
    }, 400);
  };

  const handleSyncAccount = (accountId) => {
    // Start sync animation for single account
    setSyncStatus(prev => ({
      ...prev,
      inProgress: true,
      accounts: prev.accounts.map(account => 
        account.id === accountId 
          ? { ...account, syncing: true } 
          : account
      )
    }));

    // Simulate account sync
    setTimeout(() => {
      setSyncStatus(prev => ({
        ...prev,
        inProgress: false,
        lastSynced: new Date(),
        accounts: prev.accounts.map(account => 
          account.id === accountId 
            ? { 
                ...account, 
                syncing: false, 
                status: "active",
                metrics: generateRandomMetrics(account.platform),
                issues: [] 
              } 
            : account
        )
      }));
    }, 1500);
  };

  const handleConfirmDeleteAccount = () => {
    if (accountToDelete && onDeleteAccount) {
      onDeleteAccount(accountToDelete);
    }
    setShowConfirmDelete(false);
    setAccountToDelete(null);
  };

  const handleOpenDeleteConfirm = (accountId) => {
    setAccountToDelete(accountId);
    setShowConfirmDelete(true);
  };

  const handleOpenAccountSettings = (account) => {
    setAccountToEdit(account);
    setShowAccountSettings(true);
  };

  const handleUpdateAccountSettings = () => {
    // In a real app, this would save account settings to backend
    // For now, just close the dialog
    setShowAccountSettings(false);
    setAccountToEdit(null);
  };

  const getPlatformIcon = (platform) => {
    switch(platform) {
      case "facebook": return "F";
      case "instagram": return "I";
      case "twitter": return "T";
      case "linkedin": return "L";
      default: return "S";
    }
  };

  // Helper to generate random metrics for demo purposes
  const generateRandomMetrics = (platform) => {
    return {
      followers: Math.floor(Math.random() * 10000) + 1000,
      engagement: parseFloat((Math.random() * 5 + 1).toFixed(2)),
      posts: Math.floor(Math.random() * 100) + 50,
      reach: Math.floor(Math.random() * 50000) + 5000
    };
  };

  // Calculate sync health percentage
  const getSyncHealth = () => {
    if (!syncStatus.accounts.length) return 0;
    
    const activeAccounts = syncStatus.accounts.filter(account => 
      account.status === "active" && !account.issues.length
    ).length;
    
    return Math.round((activeAccounts / syncStatus.accounts.length) * 100);
  };

  return (
    <>
      <Card className="border-none shadow-md bg-gradient-to-b from-white to-slate-50 dark:from-gray-900 dark:to-gray-950">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-primary" />
                Social Sync Status
              </CardTitle>
              <CardDescription>
                {syncStatus.lastSynced 
                  ? `Last synced: ${syncStatus.lastSynced.toLocaleString()}` 
                  : "Not synced yet"}
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSyncAll}
              disabled={syncStatus.inProgress}
              className="hover:bg-primary/10 hover:text-primary hover:border-primary/30"
            >
              <RefreshCcw className={`h-4 w-4 mr-2 ${syncStatus.inProgress ? "animate-spin" : ""}`} />
              Sync All Accounts
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {syncStatus.inProgress && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Sync in progress...</span>
                <span className="text-sm font-medium">{syncStatus.progress}%</span>
              </div>
              <Progress value={syncStatus.progress} className="h-2" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center justify-between p-4 bg-gradient-to-br from-white to-slate-100 rounded-lg shadow-sm dark:from-gray-800 dark:to-gray-950">
              <div>
                <span className="text-sm text-muted-foreground">Sync Health</span>
                <div className="text-2xl font-bold">{getSyncHealth()}%</div>
                <span className="text-xs text-muted-foreground">
                  {getSyncHealth() > 75 
                    ? "All systems operational" 
                    : getSyncHealth() > 50 
                      ? "Some accounts need attention" 
                      : "Urgent attention required"}
                </span>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center 
                ${getSyncHealth() > 75 
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500" 
                  : getSyncHealth() > 50 
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500" 
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-500"}`}>
                {getSyncHealth() > 75 
                  ? <CheckCircle className="h-6 w-6" /> 
                  : getSyncHealth() > 50 
                    ? <Clock className="h-6 w-6" /> 
                    : <AlertTriangle className="h-6 w-6" />}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-to-br from-white to-slate-100 rounded-lg shadow-sm dark:from-gray-800 dark:to-gray-950">
              <div>
                <span className="text-sm text-muted-foreground">Connected Platforms</span>
                <div className="text-2xl font-bold">{syncStatus.accounts.length}</div>
                <span className="text-xs text-muted-foreground">
                  {syncStatus.accounts.length > 3 
                    ? "Multiple platforms connected" 
                    : "Add more platforms for better reach"}
                </span>
              </div>
              <div className="flex -space-x-3">
                {syncStatus.accounts.slice(0, 4).map((account, index) => (
                  <div 
                    key={account.id}
                    className={`w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-sm font-medium text-white ${
                      account.platform === "facebook" ? "bg-blue-600" :
                      account.platform === "instagram" ? "bg-gradient-to-br from-purple-600 to-pink-500" :
                      account.platform === "twitter" ? "bg-sky-500" :
                      account.platform === "linkedin" ? "bg-blue-800" :
                      "bg-gray-600"
                    }`}
                  >
                    {getPlatformIcon(account.platform)}
                  </div>
                ))}
                {syncStatus.accounts.length > 4 && (
                  <div className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-muted flex items-center justify-center text-xs font-medium">
                    +{syncStatus.accounts.length - 4}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="accounts" className="mt-2">
            <TabsList className="mb-4 w-full md:w-auto bg-slate-100 p-1 dark:bg-gray-800/50">
              <TabsTrigger value="accounts" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
                <Shield className="h-4 w-4 mr-2" />
                Connected Accounts
              </TabsTrigger>
              <TabsTrigger value="issues" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Sync Issues
                {syncStatus.accounts.some(account => account.status !== "active" || account.issues.length > 0) && (
                  <Badge variant="destructive" className="ml-2 rounded-full px-1.5 py-px text-[10px] h-4 min-w-4">
                    {syncStatus.accounts.filter(account => account.status !== "active" || account.issues.length > 0).length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="accounts">
              <div className="space-y-3">
                {syncStatus.accounts.map(account => (
                  <div 
                    key={account.id} 
                    className="flex items-center justify-between p-3 border border-border/40 rounded-lg shadow-sm bg-white hover:bg-slate-50 transition-colors dark:bg-gray-900 dark:hover:bg-gray-800/60"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className={`border-2 ${
                        account.platform === "facebook" ? "border-blue-600 bg-blue-100 text-blue-800" :
                        account.platform === "instagram" ? "border-pink-600 bg-pink-100 text-pink-800" :
                        account.platform === "twitter" ? "border-sky-500 bg-sky-100 text-sky-800" :
                        account.platform === "linkedin" ? "border-blue-800 bg-blue-100 text-blue-800" :
                        "border-gray-600 bg-gray-100 text-gray-800"
                      }`}>
                        <AvatarFallback>{getPlatformIcon(account.platform)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium flex items-center">
                          {account.name}
                          <Badge 
                            variant={account.status === "active" ? "outline" : "destructive"} 
                            className={`ml-2 ${account.status === "active" ? "bg-green-50 text-green-700 hover:bg-green-100 border-green-200" : ""}`}
                          >
                            {account.status === "active" ? "Active" : "Error"}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {account.metrics.followers.toLocaleString()} followers · {account.metrics.engagement}% engagement
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className={`${account.syncing ? "animate-pulse" : ""} hover:bg-primary/10 hover:text-primary`}
                        onClick={() => handleSyncAccount(account.id)}
                        disabled={account.syncing}
                      >
                        <RefreshCcw className={`h-4 w-4 ${account.syncing ? "animate-spin" : ""}`} />
                        <span className="sr-only">Sync</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="hover:bg-slate-100 dark:hover:bg-gray-800">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Account Options</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleOpenAccountSettings(account)}>
                            <Settings className="h-4 w-4 mr-2" />
                            Account Settings
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(`https://${account.platform}.com/${account.username}`, '_blank')}>
                            <ChevronRight className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive" 
                            onClick={() => handleOpenDeleteConfirm(account.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="issues">
              {syncStatus.accounts.some(account => account.status !== "active" || account.issues.length > 0) ? (
                <div className="space-y-3">
                  {syncStatus.accounts
                    .filter(account => account.status !== "active" || account.issues.length > 0)
                    .map(account => (
                      <Alert key={account.id} variant="destructive" className="mb-3 border-red-200 bg-red-50 text-red-800 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-400">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Sync Error: {account.name}</AlertTitle>
                        <AlertDescription>
                          {account.issues.length > 0 
                            ? account.issues.join(", ") 
                            : "Unknown error occurred during synchronization"}
                        </AlertDescription>
                        <div className="mt-3 flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleSyncAccount(account.id)}
                            className="bg-white hover:bg-white/90 border-red-200 hover:border-red-300 text-red-800 dark:bg-gray-900 dark:hover:bg-gray-800"
                          >
                            <RefreshCcw className="h-3 w-3 mr-2" />
                            Retry Sync
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleOpenAccountSettings(account)}
                            className="bg-white hover:bg-white/90 border-red-200 hover:border-red-300 text-red-800 dark:bg-gray-900 dark:hover:bg-gray-800"
                          >
                            <Settings className="h-3 w-3 mr-2" />
                            Check Settings
                          </Button>
                        </div>
                      </Alert>
                    ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-green-50 rounded-lg dark:bg-green-900/10">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-green-800 dark:text-green-400 font-medium">All accounts are synced successfully</p>
                  <p className="text-green-600 dark:text-green-500 text-sm mt-1">Your social media accounts are connected and working properly</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Account Removal</DialogTitle>
            <DialogDescription>
              Are you sure you want to disconnect this social media account? You'll need to reconnect it later if you want to manage it from this dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowConfirmDelete(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDeleteAccount}>
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Account Settings Dialog */}
      <Dialog open={showAccountSettings} onOpenChange={setShowAccountSettings}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Account Settings</DialogTitle>
            <DialogDescription>
              Configure your account settings and permissions.
            </DialogDescription>
          </DialogHeader>
          
          {accountToEdit && (
            <div className="py-4">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                <Avatar className={
                  accountToEdit.platform === "facebook" ? "bg-blue-100 text-blue-800" :
                  accountToEdit.platform === "instagram" ? "bg-pink-100 text-pink-800" :
                  accountToEdit.platform === "twitter" ? "bg-sky-100 text-sky-800" :
                  accountToEdit.platform === "linkedin" ? "bg-blue-100 text-blue-800" :
                  "bg-gray-100 text-gray-800"
                }>
                  <AvatarFallback>{getPlatformIcon(accountToEdit.platform)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{accountToEdit.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Connected on {accountToEdit.connectedAt?.toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Post Permission</h4>
                    <p className="text-sm text-muted-foreground">Allow dashboard to post content</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100">
                    Enabled
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Read Analytics</h4>
                    <p className="text-sm text-muted-foreground">Access account analytics and insights</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100">
                    Enabled
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Message Management</h4>
                    <p className="text-sm text-muted-foreground">Read and respond to messages</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100">
                    Enabled
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Automatic Refresh</h4>
                    <p className="text-sm text-muted-foreground">Refresh data automatically</p>
                  </div>
                  <Button size="sm" variant="outline">Disabled</Button>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAccountSettings(false)}>Cancel</Button>
            <Button onClick={handleUpdateAccountSettings}>
              <Zap className="h-4 w-4 mr-2" />
              Update Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 