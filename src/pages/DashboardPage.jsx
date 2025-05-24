import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart4, 
  MessageSquare, 
  Calendar, 
  Bot, 
  Edit, 
  ExternalLink,
  Facebook, 
  Instagram, 
  Twitter,
  Users,
  Heart,
  Bell,
  ArrowUp,
  ArrowDown,
  Download,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Share2,
  Reply,
  Loader,
  Wallet,
  RefreshCw
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useBoom } from "@/contexts/BoomContext";

export function DashboardPage() {
  const navigate = useNavigate();
  // Get dashboard data from context
  const { 
    homeData, 
    loadingHome, 
    homeError, 
    getHomeData,
    walletData,
    walletHistory,
    loadingWallet,
    walletError,
    getWallet
  } = useBoom();
  
  // State for dialogs
  const [isExportDataOpen, setIsExportDataOpen] = useState(false);
  const [isEditPostOpen, setIsEditPostOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [isEditAutomationOpen, setIsEditAutomationOpen] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState(null);
  const [isViewEngagementOpen, setIsViewEngagementOpen] = useState(false);
  const [viewingEngagement, setViewingEngagement] = useState(null);
  const [isWalletHistoryOpen, setIsWalletHistoryOpen] = useState(false);
  
  // Transform API data for UI
  const [quickStats, setQuickStats] = useState([]);
  const [activeAutomations, setActiveAutomations] = useState([]);  
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [recentEngagements, setRecentEngagements] = useState([]);
  

  useEffect(() => {
    getHomeData();
    getWallet();
  }, [getHomeData, getWallet]);
  // Process API data when it loads
  useEffect(() => {
    if (homeData) {
      console.log('Processing home data for dashboard:', homeData);
      
      // Transform quick stats
      setQuickStats([
        {
          title: "Total Followers",
          value: Number(homeData.platform?.followers || 0).toLocaleString(),
          change: "↑",
          trend: "up",
          icon: <Users size={20} />,
          iconBg: "bg-blue-100",
          iconColor: "text-blue-700",
          accentColor: "bg-gradient-to-r from-blue-500 to-blue-600"
        },
        {
          title: "Wallet Balance",
          value: walletData ? `₦${Number(walletData).toLocaleString()}` : "₦0",
          change: walletHistory && walletHistory.length > 0 ? "Active" : "No transactions",
          trend: "up",
          icon: <Wallet size={20} />,
          iconBg: "bg-emerald-100",
          iconColor: "text-emerald-700",
          accentColor: "bg-gradient-to-r from-emerald-500 to-emerald-600"
        },
        {
          title: "Scheduled Posts",
          value: homeData.scheduled_post?.toString() || "0",
          change: homeData.schedule_post?.posted || "0",
          trend: "up",
          icon: <Calendar size={20} />,
          iconBg: "bg-purple-100",
          iconColor: "text-purple-700",
          accentColor: "bg-gradient-to-r from-purple-500 to-purple-600"
        },
        {
          title: "Active Automations",
          value: homeData.automation?.active?.toString() || "0",
          change: homeData.automation_count?.toString() || "0",
          trend: "up",
          icon: <Bot size={20} />,
          iconBg: "bg-amber-100",
          iconColor: "text-amber-700",
          accentColor: "bg-gradient-to-r from-amber-500 to-amber-600"
        }
      ]);
      
      // Transform automations
      if (homeData.automation?.data) {
        setActiveAutomations(homeData.automation.data.map(automation => {
          // Map platform icons based on platform name
          const getPlatformIcon = (platformId) => {
            // This is a placeholder logic - in a real app you'd need to match to real platform IDs
            return <Instagram size={16} />;
          };
          
          return {
            name: automation.name,
            type: automation.type,
            platform: automation.platform,
            platformIcons: [getPlatformIcon(automation.platform)],
            status: automation.status,
            triggers: `${automation.triggers || 0} today`,
            id: automation.id,
            content: automation.content,
            incoming: automation.incoming
          };
        }));
      }
      
      // Transform scheduled posts
      if (homeData.schedule_post?.data) {
        setScheduledPosts(homeData.schedule_post.data
          .slice(0, 5) // Display recent posts regardless of status
          .map(post => {
            // Map platform to icon
            const getPlatformIcon = (platformId) => {
              // This is simplistic mapping, real app would need proper mapping
              if (platformId === 1) return <Facebook size={20} className="text-white" />;
              if (platformId === 2) return <Instagram size={20} className="text-white" />;
              return <Twitter size={20} className="text-white" />;
            };
            
            // Map platform to background color
            const getPlatformBg = (platformId) => {
              if (platformId === 1) return "bg-gradient-to-r from-indigo-500 to-blue-500";
              if (platformId === 2) return "bg-gradient-to-r from-pink-500 to-orange-500";
              return "bg-gradient-to-r from-blue-500 to-cyan-500";
            };
            
            // Format date for display
            const formatScheduleDate = (dateStr) => {
              const scheduleDate = new Date(dateStr);
              const now = new Date();
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              
              if (scheduleDate.toDateString() === now.toDateString()) {
                return `Today, ${scheduleDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
              } else if (scheduleDate.toDateString() === tomorrow.toDateString()) {
                return `Tomorrow, ${scheduleDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
              } else {
                return `${scheduleDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${scheduleDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
              }
            };
            
            return {
              id: post.id,
              title: post.content.slice(0, 30) + (post.content.length > 30 ? '...' : ''),
              time: formatScheduleDate(post.scheduled_time),
              platformIcon: getPlatformIcon(post.platform_id),
              platformBg: getPlatformBg(post.platform_id),
              content: post.content,
              status: post.status,
              image_path: post.image_path,
              video_path: post.video_path
            };
          })
        );
      }
      
      // Transform comment data for engagements
      if (homeData.comment_reply?.data) {
        setRecentEngagements(homeData.comment_reply.data
          .slice(0, 5) // Limit to 5 comments
          .map(comment => {
            // Map platform to icon
            const getPlatformIcon = (platformId) => {
              if (platformId === 1) return <Facebook size={20} className="text-white" />;
              if (platformId === 2) return <Instagram size={20} className="text-white" />;
              return <Twitter size={20} className="text-white" />;
            };
            
            // Map platform to background color
            const getPlatformBg = (platformId) => {
              if (platformId === 1) return "bg-gradient-to-r from-indigo-500 to-blue-500";
              if (platformId === 2) return "bg-gradient-to-r from-pink-500 to-orange-500";
              return "bg-gradient-to-r from-blue-500 to-cyan-500";
            };
            
            // Format date for display
            const formatCommentTime = (dateStr) => {
              const commentDate = new Date(dateStr);
              const now = new Date();
              const diffMs = now - commentDate;
              const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
              
              if (diffHours < 1) return 'Just now';
              if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
              return `${Math.floor(diffHours / 24)} day${Math.floor(diffHours / 24) > 1 ? 's' : ''} ago`;
            };
            
            return {
              id: comment.id,
              title: `Comment from ID ${comment.comment_id}`,
              description: comment.content,
              time: formatCommentTime(comment.created_at),
              platformIcon: getPlatformIcon(comment.platform_id),
              platformBg: getPlatformBg(comment.platform_id),
              hasResponse: comment.reply === 'auto',
              responseText: typeof comment.reply === 'string' && comment.reply !== 'auto' && 
                            comment.reply !== 'admin' && comment.reply !== 'fan' ? comment.reply : null
            };
          })
        );
      }
    }
  }, [homeData, walletData, walletHistory]);
  
  // Format currency for wallet display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Format date for wallet history
  const formatTransactionDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Export Data functionality
  const handleExportData = (format) => {
    // In a real app, this would trigger an API call to generate the export
    console.log(`Exporting data in ${format} format`);
    // Mock download by creating a temporary anchor element
    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('download', `boomgator_dashboard_export_${new Date().toISOString().split('T')[0]}.${format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportDataOpen(false);
  };
  
  // Edit Post functionality
  const openEditPost = (post) => {
    setEditingPost(post);
    setIsEditPostOpen(true);
  };
  
  const handleEditPost = (event) => {
    event.preventDefault();
    // In a real app, this would submit form data to an API
    console.log("Post updated", editingPost);
    setIsEditPostOpen(false);
  };
  
  // Edit Automation functionality
  const openEditAutomation = (automation) => {
    setEditingAutomation(automation);
    setIsEditAutomationOpen(true);
  };
  
  const handleEditAutomation = (event) => {
    event.preventDefault();
    // In a real app, this would submit form data to an API
    console.log("Automation updated", editingAutomation);
    setIsEditAutomationOpen(false);
  };
  
  // View Engagement Details
  const openEngagementDetails = (engagement) => {
    setViewingEngagement(engagement);
    setIsViewEngagementOpen(true);
  };
  
  const handleReplyToEngagement = (event) => {
    event.preventDefault();
    // In a real app, this would submit the reply to an API
    console.log("Reply sent to engagement", viewingEngagement);
    setIsViewEngagementOpen(false);
  };

  // Call fetchHomeData and fetchWallet when needed
  const refreshDashboard = () => {
    getHomeData();
    getWallet();
  };

  // Load wallet data on component mount
  useEffect(() => {
    getWallet();
  }, [getWallet]);

  // Loading state
  if ((loadingHome && !homeData) || (loadingWallet && !walletData)) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }
  
  // Error state
  if ((homeError && !homeData) || (walletError && !walletData)) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4 flex items-start gap-3 max-w-md">
          <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error loading dashboard data</p>
            <p className="text-sm mt-1">{homeError || walletError}</p>
          </div>
        </div>
        <Button onClick={refreshDashboard} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

    return (    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0 min-w-[340px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Dashboard</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Welcome back! Here's an overview of your social media automation.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
          {/* Refresh button */}
          
          <Button 
            
            variant="outline" 
            size="sm" 
            className="h-8 text-xs border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 flex items-center gap-1"
            onClick={refreshDashboard}
            disabled={loadingHome}
          >
            {loadingHome ? (
              <Loader size={12} className="animate-spin" />
            ) : (
              <RefreshCw size={12} className="rotate-90" />
            )}
            <span className="hidden sm:inline">Refresh</span>
          </Button>          

          {/* Add Account button */}
          <Button 
            size="sm" 
            className="h-8 text-xs bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            onClick={() => navigate('/integrations')}
          >
            <Plus size={12} className="mr-1 sm:mr-2" /> <span className="hidden sm:inline">Add Account</span>
          </Button>

          {/* Wallet History Dialog */}
          <Dialog open={isWalletHistoryOpen} onOpenChange={setIsWalletHistoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50">
                <Wallet size={12} className="mr-1 sm:mr-2" /> <span className="hidden sm:inline">Wallet</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[calc(100%-20px)] max-w-[340px] xs:max-w-sm sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-sm sm:text-base">Wallet History</DialogTitle>
                <DialogDescription className="text-xs">
                  View your wallet balance and transaction history
                </DialogDescription>
              </DialogHeader>
              <div className="py-3">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-4 text-white mb-4">
                  <p className="text-xs font-medium">Current Balance</p>
                  <p className="text-xl font-bold">{walletData ? formatCurrency(walletData) : 'N/A'}</p>
                </div>
                
                <h4 className="text-xs font-medium mb-2">Recent Transactions</h4>
                {walletHistory && walletHistory.length > 0 ? (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {walletHistory.map((transaction, index) => (
                      <div key={index} className="bg-slate-50 p-2 rounded-md text-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-medium">{transaction.transaction_type}</span>
                            <p className="text-[10px] text-muted-foreground">{formatTransactionDate(transaction.created_at)}</p>
                          </div>
                          <div className="text-right">
                            <span className={transaction.debit_amount > 0 ? "text-rose-600" : "text-emerald-600"}>
                              {transaction.debit_amount > 0 ? '-' : '+'}{formatCurrency(Math.abs(transaction.debit_amount))}
                            </span>
                            <p className="text-[10px] text-muted-foreground">Balance: {formatCurrency(transaction.new_balance)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground text-xs">
                    No transaction history available
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" className="h-8 text-xs" onClick={() => setIsWalletHistoryOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="overflow-hidden border-none shadow-md transition-all duration-200 hover:shadow-lg">
            <div className={`h-1 w-full ${stat.accentColor}`}></div>
            <CardContent className="p-2.5 xs:p-3 sm:p-4 md:p-6">
              <div className="flex justify-between items-start mb-1.5 sm:mb-2">
                <h3 className="text-[10px] xs:text-xs sm:text-sm font-medium text-muted-foreground">{stat.title}</h3>
                <div className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${stat.iconBg} ${stat.iconColor}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm xs:text-base sm:text-xl md:text-2xl font-bold">{stat.value}</p>
                <div className="flex items-center gap-0.5">
                  <span className={`flex items-center gap-0.5 text-[10px] xs:text-xs ${stat.trend === "up" ? "text-emerald-600" : "text-rose-600"}`}>
                    {stat.trend === "up" ? <ArrowUp size={10} /> : <ArrowDown size={10} />} {stat.change}
                  </span>
                  <span className="text-[10px] xs:text-xs text-muted-foreground">total</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dashboard Layout */}
      <div className="grid grid-cols-1 gap-4">
        {/* Left column */}
        <div className="space-y-4">
          {/* Active Automations */}
          <Card className="border-none shadow-md">
            <CardHeader className="p-3 pb-1 sm:p-4 sm:pb-2 flex flex-row justify-between items-center">
              <CardTitle className="text-sm sm:text-base md:text-lg font-medium">Active Automations</CardTitle>
              <Link to="/automation" className="text-[10px] xs:text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
                View All <ExternalLink size={10} className="inline" />
              </Link>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
              {activeAutomations.length === 0 ? (
                <div className="text-center py-6">
                  <Bot size={32} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-xs sm:text-sm text-muted-foreground">No automation workflows set up yet.</p>
                  <Link to="/automation">
                    <Button className="mt-3 h-8 text-xs bg-gradient-to-r from-indigo-600 to-purple-600">
                      Create Automation
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {activeAutomations.map((automation, index) => (
                    <div key={index} className="bg-white rounded-lg border p-2 sm:p-3 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 mr-2">
                            <Bot size={14} />
                          </div>
                          <div>
                            <h4 className="font-medium text-xs sm:text-sm truncate max-w-[150px] xs:max-w-none">{automation.name}</h4>
                            <p className="text-[10px] xs:text-xs text-muted-foreground">Type: {automation.type}</p>
                          </div>
                        </div>
                        <Badge className={`text-[10px] px-1.5 py-0.5 xs:text-xs ${automation.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                          {automation.status}
                        </Badge>
                      </div>
                      
                      <div className="bg-slate-50 rounded-md p-1.5 mb-1.5 text-[10px] xs:text-xs">
                        <div className="mb-0.5">
                          <span className="font-medium">When: </span>
                          <span className="text-slate-600 truncate block xs:inline">{automation.incoming || "Any trigger"}</span>
                        </div>
                        <div>
                          <span className="font-medium">Reply: </span>
                          <span className="text-slate-600 truncate block xs:inline">{automation.content || "Automated message"}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1 items-center">
                          <span className="text-[10px] xs:text-xs text-muted-foreground">Platform:</span>
                          <div className="flex space-x-1">
                            {automation.platformIcons.map((icon, i) => (
                              <div key={i} className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center">
                                {icon}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <Button size="sm" variant="ghost" className="h-6 px-1.5 text-[10px] xs:text-xs" onClick={() => openEditAutomation(automation)}>
                          <Edit size={10} className="mr-1" /> Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Posts */}
          <Card className="border-none shadow-md">
            <CardHeader className="p-3 pb-1 sm:p-4 sm:pb-2 flex flex-row justify-between items-center">
              <CardTitle className="text-sm sm:text-base md:text-lg font-medium">Recent Posts</CardTitle>
              <Link to="/calendar" className="text-[10px] xs:text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
                View Calendar <ExternalLink size={10} className="inline" />
              </Link>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
              {scheduledPosts.length === 0 ? (
                <div className="text-center py-6">
                  <Calendar size={32} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-xs sm:text-sm text-muted-foreground">No posts found.</p>
                  <Link to="/calendar">
                    <Button className="mt-3 h-8 text-xs bg-gradient-to-r from-indigo-600 to-purple-600">
                      Create a Post
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {scheduledPosts.map((post, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 sm:gap-3 p-1.5 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => openEditPost(post)}
                    >
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md flex items-center justify-center ${post.platformBg}`}>
                        {post.platformIcon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-medium text-xs sm:text-sm truncate">{post.title}</p>
                          <Badge className={`text-[9px] px-1 py-0.5 h-4 ${post.status === "Posted" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                            {post.status || "Scheduled"}
                          </Badge>
                        </div>
                        <p className="text-[10px] xs:text-xs text-muted-foreground">{post.time}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 px-1.5">
                        <Edit size={12} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div>
          {/* Recent Activity */}
          <Card className="border-none shadow-md">
            <CardHeader className="p-3 pb-1 sm:p-4 sm:pb-2">
              <CardTitle className="text-sm sm:text-base md:text-lg font-medium">Recent Engagements</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
              {recentEngagements.length === 0 ? (
                <div className="text-center py-6">
                  <MessageSquare size={32} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-xs sm:text-sm text-muted-foreground">No recent engagements found.</p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {recentEngagements.map((activity, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-2 pb-2 border-b last:border-0 hover:bg-slate-50 p-1.5 rounded-md transition-colors cursor-pointer"
                      onClick={() => openEngagementDetails(activity)}
                    >
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activity.platformBg}`}>
                        {activity.platformIcon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs sm:text-sm truncate">{activity.title}</p>
                        <p className="text-[10px] xs:text-xs text-slate-600 truncate">"{activity.description}"</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-[10px] xs:text-xs text-muted-foreground">{activity.time}</span>
                          {activity.hasResponse && (
                            <Badge className="text-[10px] px-1.5 py-0.5 xs:text-xs bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                              Auto
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 