import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SocialSync } from "./SocialSync";
import { CrossPlatformAnalytics } from "./CrossPlatformAnalytics";
import { SmartScheduler } from "./SmartScheduler";
import { 
  RefreshCcw, 
  Plus, 
  Users, 
  MessageSquare, 
  BarChart3, 
  CalendarClock, 
  Zap, 
  Edit3, 
  Copy, 
  MessagesSquare, 
  ArrowUp, 
  Share2, 
  Bell, 
  Search, 
  Filter, 
  Download, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Trash2, 
  Send,
  Eye
} from "lucide-react";

export function BoomgatorDashboard() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    followers: 0,
    engagement: 0,
    impressions: 0,
    messages: 0
  });
  const [contentRecommendations, setContentRecommendations] = useState([]);
  const [currentActivity, setCurrentActivity] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newAccountForm, setNewAccountForm] = useState({
    platform: "instagram",
    username: ""
  });
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);

  useEffect(() => {
    // Simulate loading data from API
    setTimeout(() => {
      setAccounts(mockAccounts);
      setMetrics({
        followers: 23475,
        engagement: 3267,
        impressions: 58942,
        messages: 129
      });
      setContentRecommendations(mockContentRecommendations);
      setCurrentActivity(mockCurrentActivity);
      setLoading(false);
    }, 800);
  }, []);

  const getPlatformColor = (platform) => {
    switch(platform) {
      case "facebook": return "bg-blue-600";
      case "instagram": return "bg-gradient-to-r from-purple-600 to-pink-500";
      case "twitter": return "bg-sky-500";
      case "linkedin": return "bg-blue-800";
      default: return "bg-gray-600";
    }
  };

  const getPlatformIcon = (platform) => {
    switch(platform) {
      case "facebook": return <Facebook className="h-4 w-4" />;
      case "instagram": return <Instagram className="h-4 w-4" />;
      case "twitter": return <Twitter className="h-4 w-4" />;
      case "linkedin": return <Linkedin className="h-4 w-4" />;
      default: return null;
    }
  };

  const getPlatformName = (platform) => {
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  const handleConnectAccount = () => {
    // Simulate connecting new account
    const newAccount = {
      id: `acc${accounts.length + 1}`,
      platform: newAccountForm.platform,
      name: `${newAccountForm.username} - ${getPlatformName(newAccountForm.platform)}`,
      username: newAccountForm.username,
      avatar: "/placeholder-avatar.jpg",
      status: "active",
      connectedAt: new Date(),
      lastSync: new Date()
    };
    
    setAccounts([...accounts, newAccount]);
    setIsConnectDialogOpen(false);
    setNewAccountForm({ platform: "instagram", username: "" });
  };

  const handleDeleteAccount = (accountId) => {
    setAccounts(accounts.filter(account => account.id !== accountId));
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      // Update metrics with slightly different values
      setMetrics({
        followers: metrics.followers + Math.floor(Math.random() * 50),
        engagement: metrics.engagement + Math.floor(Math.random() * 20),
        impressions: metrics.impressions + Math.floor(Math.random() * 200),
        messages: metrics.messages + Math.floor(Math.random() * 5)
      });
      setLoading(false);
    }, 800);
  };

  const handleEditRecommendation = (index) => {
    // In a real app this would open an editor
    alert(`Editing content: ${contentRecommendations[index].content}`);
  };

  const handleUseRecommendation = (index) => {
    // In a real app this would copy to clipboard or add to scheduler
    alert(`Content copied to scheduler: ${contentRecommendations[index].content}`);
  };

  const handleGenerateMoreIdeas = () => {
    // Simulate API call for more content ideas
    setLoading(true);
    setTimeout(() => {
      const newIdeas = [
        {
          platform: "instagram",
          content: "Share your behind-the-scenes process with a day-in-the-life Reel! Perfect for boosting engagement.",
          score: 89
        },
        {
          platform: "linkedin",
          content: "Industry insights: 5 trends reshaping our approach to customer experience in 2023.",
          score: 91
        }
      ];
      setContentRecommendations([...newIdeas, ...contentRecommendations]);
      setLoading(false);
    }, 800);
  };

  const handleReplyToComment = (activityId) => {
    alert(`Opening reply interface for comment ID: ${activityId}`);
  };

  const handleDownloadAnalytics = () => {
    alert("Downloading analytics report as CSV");
  };

  const filteredActivity = searchTerm 
    ? currentActivity.filter(activity => 
        activity.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.platform.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : currentActivity;

  return (
    <div className="space-y-6">
      {/* <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">
              Boomgator Dashboard
            </span>
          </h2>
          <p className="text-muted-foreground">
            Manage all your social media platforms in one place
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Dialog open={isConnectDialogOpen} onOpenChange={setIsConnectDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Connect Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Connect Social Media Account</DialogTitle>
                <DialogDescription>
                  Enter your social media account details to connect it to the dashboard.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="platform">Platform</Label>
                  <div className="flex gap-2">
                    {["instagram", "facebook", "twitter", "linkedin"].map(platform => (
                      <button
                        key={platform}
                        type="button"
                        onClick={() => setNewAccountForm({...newAccountForm, platform})}
                        className={`flex items-center justify-center p-2 rounded-md transition-all ${
                          newAccountForm.platform === platform 
                            ? "ring-2 ring-primary/70 bg-primary/10" 
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {getPlatformIcon(platform)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="username">Username or Page Name</Label>
                  <Input 
                    id="username" 
                    value={newAccountForm.username}
                    onChange={(e) => setNewAccountForm({...newAccountForm, username: e.target.value})}
                    placeholder={`Your ${getPlatformName(newAccountForm.platform)} username`}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsConnectDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleConnectAccount} disabled={!newAccountForm.username.trim()}>Connect</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div> */}
      
      {loading ? (
        <div className="w-full h-full flex justify-center items-center py-20">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <p className="text-muted-foreground mt-4">Loading your Boomgator dashboard...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="overflow-hidden border-t-4 border-t-green-500">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Followers
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {metrics.followers.toLocaleString()}
                    </h3>
                    <p className="text-xs text-green-600 mt-1 flex items-center">
                      <ArrowUp className="h-3 w-3 mr-1" /> 
                      +2.5% from last week
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <Progress className="h-1 mt-4" value={78} />
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-t-4 border-t-blue-500">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Engagement
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {metrics.engagement.toLocaleString()}
                    </h3>
                    <p className="text-xs text-green-600 mt-1 flex items-center">
                      <ArrowUp className="h-3 w-3 mr-1" /> 
                      +3.7% from last week
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                </div>
                <Progress className="h-1 mt-4" value={64} />
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-t-4 border-t-purple-500">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Impressions
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {metrics.impressions.toLocaleString()}
                    </h3>
                    <p className="text-xs text-green-600 mt-1 flex items-center">
                      <ArrowUp className="h-3 w-3 mr-1" /> 
                      +5.2% from last week
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <Eye className="h-5 w-5" />
                  </div>
                </div>
                <Progress className="h-1 mt-4" value={85} />
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-t-4 border-t-amber-500">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Unread Messages
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {metrics.messages}
                    </h3>
                    <p className="text-xs text-red-600 mt-1 flex items-center">
                      <Bell className="h-3 w-3 mr-1" /> 
                      +12 new today
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                </div>
                <Progress className="h-1 mt-4" value={42} />
              </CardContent>
            </Card>
          </div>
          
          {/* Sync Status */}
          <SocialSync accounts={accounts} onDeleteAccount={handleDeleteAccount} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Content Recommendations */}
            <Card className="md:col-span-1 border-none shadow-md bg-gradient-to-b from-white to-slate-50 dark:from-gray-900 dark:to-gray-950">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Content Recommendations</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">AI</Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-xs">AI-powered content suggestions based on your audience engagement patterns</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
                <CardDescription>
                  AI-powered content suggestions based on engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contentRecommendations.map((rec, index) => (
                    <div key={index} className="p-3 border rounded-lg space-y-2 transition-all hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${getPlatformColor(rec.platform)}`}>
                            {getPlatformIcon(rec.platform)}
                          </div>
                          <span className="text-sm font-medium">{getPlatformName(rec.platform)}</span>
                        </div>
                        <Badge variant="outline" className={rec.score > 85 
                          ? "text-green-600 bg-green-50 border-green-200" 
                          : "text-amber-600 bg-amber-50 border-amber-200"}>
                          {rec.score}% match
                        </Badge>
                      </div>
                      
                      <p className="text-sm">{rec.content}</p>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs h-7 px-2 w-full hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                          onClick={() => handleEditRecommendation(index)}
                        >
                          <Edit3 className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs h-7 px-2 w-full hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                          onClick={() => handleUseRecommendation(index)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Use
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-dashed hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 group"
                    onClick={handleGenerateMoreIdeas}
                  >
                    <Zap className="h-4 w-4 mr-2 text-amber-500 group-hover:text-amber-600" />
                    Generate More Ideas
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Current Activity */}
            <Card className="md:col-span-2 border-none shadow-md bg-gradient-to-b from-white to-slate-50 dark:from-gray-900 dark:to-gray-950">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Activity</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="search" 
                        placeholder="Search activity..." 
                        className="w-[180px] pl-8 h-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button size="sm" variant="outline" className="h-9">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button size="sm" variant="outline" className="h-9" onClick={handleDownloadAnalytics}>
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Latest updates across your social platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredActivity.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No activity found matching your search
                    </div>
                  ) : (
                    filteredActivity.map((activity, index) => (
                      <div key={index} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0 hover:bg-slate-50 p-2 rounded-md transition-colors dark:hover:bg-gray-900">
                        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white ${getPlatformColor(activity.platform)}`}>
                          {getPlatformIcon(activity.platform)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{activity.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {activity.timestamp} • {getPlatformName(activity.platform)}
                              </p>
                            </div>
                            {activity.type === "comment" && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20"
                                onClick={() => handleReplyToComment(index)}
                              >
                                <Send className="h-3 w-3 mr-1" />
                                Reply
                              </Button>
                            )}
                            {activity.type === "message" && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20"
                                onClick={() => handleReplyToComment(index)}
                              >
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Message
                              </Button>
                            )}
                            {activity.type === "post" && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20"
                                onClick={() => alert(`Sharing post from ${activity.platform}`)}
                              >
                                <Share2 className="h-3 w-3 mr-1" />
                                Share
                              </Button>
                            )}
                          </div>
                          
                          <p className="text-sm mt-1">{activity.content}</p>
                          
                          {activity.stats && (
                            <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                              <button className="hover:text-blue-600 flex items-center gap-1 transition-colors">
                                <span>👍</span> {activity.stats.likes}
                              </button>
                              <button className="hover:text-blue-600 flex items-center gap-1 transition-colors">
                                <span>💬</span> {activity.stats.comments}
                              </button>
                              <button className="hover:text-blue-600 flex items-center gap-1 transition-colors">
                                <span>🔄</span> {activity.stats.shares}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs for Analytics and Scheduler */}
          <Tabs defaultValue="analytics" className="mt-6">
            <TabsList className="mb-4 w-full md:w-auto bg-slate-100 p-1 dark:bg-gray-800/50">
              <TabsTrigger value="analytics" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
                <BarChart3 className="h-4 w-4 mr-2" />
                Cross-Platform Analytics
              </TabsTrigger>
              <TabsTrigger value="scheduler" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
                <CalendarClock className="h-4 w-4 mr-2" />
                Smart Scheduler
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="analytics">
              <CrossPlatformAnalytics accounts={accounts} />
            </TabsContent>
            
            <TabsContent value="scheduler">
              <SmartScheduler accounts={accounts} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

// Mock data
const mockAccounts = [
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
  },
  {
    id: "acc3",
    platform: "twitter",
    name: "Brand Twitter",
    username: "yourbrand",
    avatar: "/placeholder-avatar.jpg",
    status: "error",
    connectedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    lastSync: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: "acc4",
    platform: "linkedin",
    name: "Company Page",
    username: "yourbrand",
    avatar: "/placeholder-avatar.jpg",
    status: "active",
    connectedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    lastSync: new Date(Date.now() - 8 * 60 * 60 * 1000)
  }
];

const mockContentRecommendations = [
  {
    platform: "instagram",
    content: "Behind the scenes look at our latest product photoshoot! #BehindTheScenes #NewProduct",
    score: 92
  },
  {
    platform: "linkedin",
    content: "We're excited to announce our new partnership with Industry Leader to bring you improved solutions for your business needs.",
    score: 87
  },
  {
    platform: "facebook",
    content: "Weekend FLASH SALE! 🔥 Get 25% off all products with code FLASH25 - Valid for 48 hours only!",
    score: 83
  },
  {
    platform: "twitter",
    content: "Have you tried our new feature yet? What do you think? We'd love to hear your feedback!",
    score: 78
  }
];

const mockCurrentActivity = [
  {
    type: "comment",
    platform: "facebook",
    title: "New comment on your post",
    content: "This looks amazing! When will it be available in Europe?",
    timestamp: "10 minutes ago",
    stats: {
      likes: 3,
      comments: 1,
      shares: 0
    }
  },
  {
    type: "message",
    platform: "instagram",
    title: "New direct message",
    content: "Hi, I'm interested in collaborating with your brand. Could we discuss potential partnership opportunities?",
    timestamp: "25 minutes ago"
  },
  {
    type: "post",
    platform: "twitter",
    title: "Your scheduled post was published",
    content: "Exciting news! Our new feature launch is just around the corner. Stay tuned for updates! #ComingSoon #ProductLaunch",
    timestamp: "1 hour ago",
    stats: {
      likes: 28,
      comments: 7,
      shares: 12
    }
  },
  {
    type: "analytics",
    platform: "linkedin",
    title: "Performance update",
    content: "Your latest post is performing 38% better than average. Consider boosting it for more visibility.",
    timestamp: "3 hours ago"
  }
];