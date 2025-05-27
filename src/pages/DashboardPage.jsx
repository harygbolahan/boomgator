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
  RefreshCw,
  LayoutDashboard,
  TrendingUp,
  Zap
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
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Added animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } }
};

const container = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

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
  // Active tab for mobile view
  const [activeTab, setActiveTab] = useState("overview");
  
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
          icon: <Users size={24} className="text-blue-500" />,
          iconBg: "bg-blue-100/60",
          iconColor: "text-blue-500",
          accentColor: "from-blue-400 to-indigo-500",
          borderColor: "border-blue-200"
        },
        {
          title: "Wallet Balance",
          value: walletData ? `₦${Number(walletData).toLocaleString()}` : "₦0",
          change: walletHistory && walletHistory.length > 0 ? "Active" : "No transactions",
          trend: "up",
          icon: <Wallet size={24} className="text-emerald-500" />,
          iconBg: "bg-emerald-100/60",
          iconColor: "text-emerald-500",
          accentColor: "from-emerald-400 to-green-500",
          borderColor: "border-emerald-200"
        },
        {
          title: "Scheduled Posts",
          value: homeData.scheduled_post?.toString() || "0",
          change: homeData.schedule_post?.posted || "0",
          trend: "up",
          icon: <Calendar size={24} className="text-purple-500" />,
          iconBg: "bg-purple-100/60",
          iconColor: "text-purple-500",
          accentColor: "from-purple-400 to-violet-500",
          borderColor: "border-purple-200"
        },
        {
          title: "Active Automations",
          value: homeData.automation?.active?.toString() || "0",
          change: homeData.automation_count?.toString() || "0",
          trend: "up",
          icon: <Zap size={24} className="text-amber-500" />,
          iconBg: "bg-amber-100/60",
          iconColor: "text-amber-500",
          accentColor: "from-amber-400 to-yellow-500",
          borderColor: "border-amber-200"
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
        <div className="relative">
          <Loader className="w-10 h-10 animate-spin text-primary" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-background"></div>
          </div>
        </div>
        <p className="text-muted-foreground mt-4 animate-pulse">Loading dashboard data...</p>
      </div>
    );
  }
  
  // Error state
  if ((homeError && !homeData) || (walletError && !walletData)) {
    return (
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="flex flex-col items-center justify-center h-[60vh] text-center"
      >
        <div className="bg-red-50 text-red-700 p-6 rounded-lg mb-4 flex items-start gap-4 max-w-md shadow-lg border border-red-100">
          <XCircle className="h-6 w-6 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold">Error loading dashboard data</p>
            <p className="text-sm mt-2">{homeError || walletError}</p>
          </div>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            onClick={refreshDashboard} 
            className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  // Render function to maintain clarity
  const renderMainContent = () => {
    return (
      <div className="min-h-screen px-2 sm:px-4 py-4 sm:py-6">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={container}
          className="max-w-7xl mx-auto"
        >
          {/* Dashboard Header with futuristic design */}
          <motion.div 
            variants={slideUp}
            className="relative mb-8 rounded-2xl bg-gradient-to-r from-indigo-900/90 via-purple-900/90 to-indigo-900/90 p-4 sm:p-6 overflow-hidden shadow-xl"
          >
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5))]"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div className="bg-white/10 rounded-xl p-2 sm:p-3 backdrop-blur-sm">
                  <LayoutDashboard className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
                    Command Center
                  </h1>
                  <p className="text-white/70 text-xs sm:text-sm mt-1">
                    Welcome back! Here's your social automation overview
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-end md:self-auto">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-9 bg-white/10 backdrop-blur-sm text-white border-0 hover:bg-white/20"
                          onClick={refreshDashboard}
                          disabled={loadingHome}
                        >
                          {loadingHome ? (
                            <Loader size={14} className="animate-spin" />
                          ) : (
                            <RefreshCw size={14} />
                          )}
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Refresh data</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Add Account button */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="sm" 
                    className="h-9 text-xs bg-white text-indigo-900 hover:bg-white/90 font-medium shadow-md"
                    onClick={() => navigate('/integrations')}
                  >
                    <Plus size={14} className="mr-1 sm:mr-2" /> <span>Add Account</span>
                  </Button>
                </motion.div>

                {/* Wallet Link */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to="/wallet">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-9 bg-emerald-500/20 backdrop-blur-sm text-white border-0 hover:bg-emerald-500/30"
                          >
                            <Wallet size={14} className="mr-1 sm:mr-2" /> 
                            <span className="hidden sm:inline">{walletData ? formatCurrency(walletData) : 'Wallet'}</span>
                          </Button>
                        </motion.div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Manage your wallet</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            {/* Mobile tab navigation for responsive design */}
            <div className="md:hidden mt-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 bg-white/10 backdrop-blur-sm rounded-xl p-1">
                  <TabsTrigger value="overview" className="text-xs text-white bg-purple-500/20 rounded-lg data-[state=active]:text-red dark:data-[state=active]:text-white data-[state=active]:shadow-sm">
                    <BarChart4 size={12} className="mr-1" /> Overview
                  </TabsTrigger>
                  <TabsTrigger value="automations" className="text-xs text-white bg-purple-500/20 rounded-lg data-[state=active]:bg-purple-500 data-[state=active]:text-white dark:data-[state=active]:text-white data-[state=active]:shadow-sm">
                    <Zap size={12} className="mr-1" /> Automations
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="text-xs text-white bg-purple-500/20  rounded-lg data-[state=active]:bg-purple-500 data-[state=active]:text-white dark:data-[state=active]:text-white data-[state=active]:shadow-sm">
                    <MessageSquare size={12} className="mr-1" /> Activity
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </motion.div>

          {/* Quick Stats with modern card design */}
          <motion.div variants={container} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {quickStats.map((stat, index) => (
              <motion.div 
                key={index} 
                variants={slideUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group"
              >
                <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-900/90 border border-slate-200/50 dark:border-slate-700/50 overflow-hidden rounded-xl shadow-lg">
                  <CardContent className="p-3 sm:p-4 md:p-5">
                    <div className="flex justify-between items-center mb-3">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${stat.iconBg} group-hover:scale-110 transition-transform duration-200`}>
                        {stat.icon}
                      </div>
                      <div className="flex items-center">
                        <span className={`text-xs ${stat.trend === "up" ? "text-emerald-500" : "text-rose-500"} flex items-center`}>
                          {stat.trend === "up" ? <TrendingUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{stat.title}</h3>
                    <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                      {stat.value}
                    </p>
                    <div className={`h-1 w-full mt-3 rounded-full bg-gradient-to-r ${stat.accentColor} opacity-75 group-hover:opacity-100 transition-opacity duration-200`}></div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Dashboard Content - Desktop View */}
          <div className="hidden md:grid md:grid-cols-2 gap-6">
            {/* Left Column - Automations */}
            <motion.div variants={slideUp} className="space-y-6">
              {/* Active Automations */}
              <Card className="overflow-hidden border-none bg-gradient-to-b from-white to-slate-50/90 dark:from-slate-900/95 dark:to-slate-800/90 backdrop-blur-sm rounded-xl shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-3xl -ml-12 -mb-12"></div>
                <CardHeader className="p-4 pb-2 flex flex-row justify-between items-center border-b border-slate-100/80 dark:border-slate-700/80 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg">
                      <Zap size={18} />
                    </div>
                    <CardTitle className="text-base font-medium">Active Automations</CardTitle>
                  </div>
                  <Link to="/automation" className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 group font-medium">
                    View All <ExternalLink size={12} className="inline transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </CardHeader>
                <CardContent className="p-4 pt-3 relative z-10">
                  {activeAutomations.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-10"
                    >
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/90 to-purple-500/90 flex items-center justify-center mx-auto mb-6 shadow-lg transform -rotate-6">
                        <Bot size={32} className="text-white" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 max-w-xs mx-auto">No automation workflows set up yet. Create your first workflow to automate your social responses.</p>
                      <Link to="/automation">
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md px-5 h-10">
                            <Plus className="mr-2 h-4 w-4" /> Create Automation
                          </Button>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={container}
                      initial="hidden"
                      animate="visible"
                      className="space-y-4"
                    >
                      {activeAutomations.map((automation, index) => (
                        <motion.div 
                          key={index} 
                          variants={slideUp}
                          whileHover={{ y: -2 }}
                          className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200/70 dark:border-slate-700/50 hover:shadow-lg transition-all group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          
                          <div className="flex items-center justify-between mb-3 relative">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-md rotate-0 group-hover:rotate-3 transition-transform">
                                <Bot size={18} />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm sm:text-base truncate max-w-[200px]">{automation.name}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <p className="text-xs text-slate-500 dark:text-slate-400">{automation.type}</p>
                                  <Badge className={`px-2 py-0.5 text-[10px] ${automation.status === "Active" 
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30" 
                                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30"}`}
                                  >
                                    {automation.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <div className="flex -space-x-1 mr-2">
                                {automation.platformIcons.map((icon, i) => (
                                  <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm ring-2 ring-white dark:ring-slate-800">
                                    {icon}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-slate-50/80 dark:bg-slate-700/30 backdrop-blur-sm rounded-xl p-3 text-xs relative">
                            <div className="mb-2">
                              <div className="flex items-start">
                                <span className="font-medium text-slate-700 dark:text-slate-300 min-w-[50px]">When:</span>
                                <span className="text-slate-600 dark:text-slate-400 ml-1">{automation.incoming || "Any trigger"}</span>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-start">
                                <span className="font-medium text-slate-700 dark:text-slate-300 min-w-[50px]">Reply:</span>
                                <span className="text-slate-600 dark:text-slate-400 ml-1">{automation.content || "Automated message"}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* <div className="flex justify-end mt-3">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 px-3 text-xs font-medium text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/40 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors" 
                              onClick={() => openEditAutomation(automation)}
                            >
                              <Edit size={12} className="mr-1.5" /> Edit Automation
                            </Button>
                          </div> */}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Posts */}
              <Card className="overflow-hidden border-none bg-gradient-to-b from-white to-slate-50/90 dark:from-slate-900/95 dark:to-slate-800/90 backdrop-blur-sm rounded-xl shadow-lg">
                <div className="absolute top-0 left-0 w-32 h-32 bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-3xl -ml-16 -mt-16"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-pink-400/10 dark:bg-pink-600/10 rounded-full blur-3xl -mr-12 -mb-12"></div>
                <CardHeader className="p-4 pb-2 flex flex-row justify-between items-center border-b border-slate-100/80 dark:border-slate-700/80 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                      <Calendar size={18} />
                    </div>
                    <CardTitle className="text-base font-medium">Recent Posts</CardTitle>
                  </div>
                  <Link to="/calendar" className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 flex items-center gap-1 group font-medium">
                    View Calendar <ExternalLink size={12} className="inline transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </CardHeader>
                <CardContent className="p-4 pt-3 relative z-10">
                  {scheduledPosts.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-10"
                    >
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/90 to-pink-500/90 flex items-center justify-center mx-auto mb-6 shadow-lg transform rotate-6">
                        <Calendar size={32} className="text-white" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 max-w-xs mx-auto">No scheduled posts found. Create your first post to start building your content calendar.</p>
                      <Link to="/calendar">
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md px-5 h-10">
                            <Plus className="mr-2 h-4 w-4" /> Create a Post
                          </Button>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.div 
                      variants={container}
                      initial="hidden"
                      animate="visible"
                      className="space-y-3"
                    >
                      {scheduledPosts.map((post, index) => (
                        <motion.div 
                          key={index}
                          variants={slideUp}
                          whileHover={{ y: -2 }}
                          className="group relative overflow-hidden bg-white dark:bg-slate-800 rounded-xl border border-slate-200/70 dark:border-slate-700/50 hover:shadow-lg transition-all"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          
                          <div className="flex p-3 relative">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${post.platformBg} shadow-md group-hover:shadow-lg transition-shadow flex-shrink-0 mr-3`}>
                              {post.platformIcon}
                            </div>
                            
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm sm:text-base truncate max-w-[200px]">{post.title}</h4>
                                <Badge className={`ml-2 text-[10px] px-1.5 py-0.5 ${post.status === "Posted" 
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30" 
                                  : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30"}`}
                                >
                                  {post.status || "Scheduled"}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                                  <span className="inline-block w-2 h-2 rounded-full bg-purple-400 mr-1.5"></span> 
                                  {post.time}
                                </p>
                                
                                {/* <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 px-2 -mr-1 text-xs text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditPost(post);
                                  }}
                                >
                                  <Edit size={14} className="mr-1" /> Edit
                                </Button> */}
                              </div>
                            </div>
                          </div>
                          
                          {(post.image_path || post.video_path) && (
                            <div className="px-3 pb-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                              <Eye size={12} className="text-purple-500" />
                              <span className="truncate">
                                {post.image_path ? `Image: ${post.image_path.split('/').pop()}` : 
                                 post.video_path ? `Video: ${post.video_path.split('/').pop()}` : ''}
                              </span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column - Engagements */}
            <motion.div variants={slideUp}>
              <Card className="overflow-hidden border-none bg-gradient-to-b from-white to-slate-50/90 dark:from-slate-900/95 dark:to-slate-800/90 backdrop-blur-sm rounded-xl shadow-lg h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-400/10 dark:bg-cyan-600/10 rounded-full blur-3xl -ml-12 -mb-12"></div>
                <CardHeader className="p-4 pb-2 flex flex-row justify-between items-center border-b border-slate-100/80 dark:border-slate-700/80 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                      <MessageSquare size={18} />
                    </div>
                    <CardTitle className="text-base font-medium">Recent Engagements</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-3 relative z-10">
                  {recentEngagements.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-10"
                    >
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/90 to-cyan-500/90 flex items-center justify-center mx-auto mb-6 shadow-lg transform rotate-3">
                        <MessageSquare size={32} className="text-white" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs mx-auto">No recent engagements found. Engagements will appear here when users interact with your content.</p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      variants={container}
                      initial="hidden"
                      animate="visible"
                      className="space-y-4"
                    >
                      {recentEngagements.map((activity, index) => (
                        <motion.div 
                          key={index} 
                          variants={slideUp}
                          whileHover={{ y: -2 }}
                          onClick={() => openEngagementDetails(activity)}
                          className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-xl border border-slate-200/70 dark:border-slate-700/50 hover:shadow-lg transition-all cursor-pointer group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          
                          <div className="flex gap-3 p-4 relative">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${activity.platformBg} shadow-md group-hover:shadow-lg transition-shadow`}>
                              {activity.platformIcon}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1">
                                <h4 className="font-medium text-sm sm:text-base truncate max-w-[200px]">{activity.title}</h4>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-2 whitespace-nowrap">{activity.time}</span>
                              </div>
                              
                              <div className="bg-slate-50/80 dark:bg-slate-700/30 backdrop-blur-sm rounded-xl p-3 text-xs relative mb-3">
                                <div className="absolute top-0 left-4 w-2 h-2 bg-slate-50/80 dark:bg-slate-700/30 transform rotate-45 -translate-y-1"></div>
                                <p className="text-slate-600 dark:text-slate-300 italic">"{activity.description}"</p>
                              </div>
                              
                              <div className="flex justify-end">
                                {activity.hasResponse ? (
                                  <Badge className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30 flex items-center">
                                    <CheckCircle size={12} className="mr-1.5" /> Auto-Replied
                                  </Badge>
                                ) : (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 px-3 text-xs font-medium text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/40 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                  >
                                    <Reply size={12} className="mr-1.5" /> Reply Now
                                  </Button>
                                )}
                              </div>
                              
                              {activity.responseText && (
                                <div className="mt-3 bg-emerald-50/50 dark:bg-emerald-900/10 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900/20 text-xs">
                                  <div className="flex items-start gap-2">
                                    <CheckCircle size={12} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-slate-700 dark:text-slate-300">{activity.responseText}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* Mobile Tabs View */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="md:hidden">
            <TabsContent value="overview" className="mt-2">
              <div className="grid grid-cols-1 gap-4">
                {quickStats.slice(0, 2).map((stat, index) => (
                  <motion.div 
                    key={index} 
                    variants={slideUp}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="group"
                  >
                    <Card className="backdrop-blur-sm bg-white/95 dark:bg-slate-900/90 border border-slate-200/50 dark:border-slate-700/50 overflow-hidden rounded-xl shadow-lg">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex justify-between items-center mb-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center ${stat.iconBg} group-hover:scale-110 transition-transform duration-200`}>
                            {stat.icon}
                          </div>
                          <div className="flex items-center">
                            <span className={`text-xs ${stat.trend === "up" ? "text-emerald-500" : "text-rose-500"} flex items-center`}>
                              {stat.trend === "up" ? <TrendingUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
                              {stat.change}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{stat.title}</h3>
                        <p className="text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                          {stat.value}
                        </p>
                        <div className={`h-1 w-full mt-3 rounded-full bg-gradient-to-r ${stat.accentColor} opacity-75 group-hover:opacity-100 transition-opacity duration-200`}></div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="automations" className="mt-2">
              <Card className="overflow-hidden border-none bg-gradient-to-b from-white to-slate-50/90 dark:from-slate-900/95 dark:to-slate-800/90 backdrop-blur-sm rounded-xl shadow-lg">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl -mr-12 -mt-12"></div>
                <CardHeader className="p-4 pb-2 flex flex-row justify-between items-center border-b border-slate-100/80 dark:border-slate-700/80 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg">
                      <Zap size={16} />
                    </div>
                    <CardTitle className="text-base font-medium">Active Automations</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-3 max-h-[400px] overflow-y-auto relative z-10">
                  {activeAutomations.length === 0 ? (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500/90 to-purple-500/90 flex items-center justify-center mx-auto mb-4 shadow-lg transform -rotate-6">
                        <Bot size={24} className="text-white" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">No automation workflows yet.</p>
                      <Link to="/automation">
                        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md text-xs h-9 px-4">
                          <Plus className="mr-1 h-3 w-3" /> Create Automation
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activeAutomations.map((automation, index) => (
                        <div 
                          key={index} 
                          className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200/70 dark:border-slate-700/50 hover:shadow-md transition-all group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          
                          <div className="flex items-center gap-3 mb-2 relative">
                            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white shadow-md">
                              <Bot size={15} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm truncate max-w-[160px]">{automation.name}</h4>
                                <Badge className={`text-[10px] px-1.5 py-0.5 ${automation.status === "Active" 
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30" 
                                  : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30"}`}
                                >
                                  {automation.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Type: {automation.type}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex -space-x-1">
                              {automation.platformIcons.map((icon, i) => (
                                <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm ring-1 ring-white dark:ring-slate-800">
                                  {icon}
                                </div>
                              ))}
                            </div>
                            
                            {/* <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 px-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/40" 
                              onClick={() => openEditAutomation(automation)}
                            >
                              <Edit size={12} className="mr-1" /> Edit
                            </Button> */}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity" className="mt-2">
              <Card className="overflow-hidden border-none bg-gradient-to-b from-white to-slate-50/90 dark:from-slate-900/95 dark:to-slate-800/90 backdrop-blur-sm rounded-xl shadow-lg">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl -mr-12 -mt-12"></div>
                <CardHeader className="p-4 pb-2 flex flex-row justify-between items-center border-b border-slate-100/80 dark:border-slate-700/80 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                      <MessageSquare size={16} />
                    </div>
                    <CardTitle className="text-base font-medium">Recent Engagements</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-3 max-h-[400px] overflow-y-auto relative z-10">
                  {recentEngagements.length === 0 ? (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/90 to-cyan-500/90 flex items-center justify-center mx-auto mb-4 shadow-lg transform rotate-3">
                        <MessageSquare size={24} className="text-white" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">No recent engagements found.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentEngagements.map((activity, index) => (
                        <div 
                          key={index} 
                          className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200/70 dark:border-slate-700/50 hover:shadow-md transition-all cursor-pointer"
                          onClick={() => openEngagementDetails(activity)}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          
                          <div className="flex items-start gap-3 relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activity.platformBg} shadow-md`}>
                              {activity.platformIcon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium text-xs truncate max-w-[160px]">{activity.title}</h4>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{activity.time}</p>
                                </div>
                                {activity.hasResponse && (
                                  <Badge className="text-[10px] px-1.5 py-0.5 ml-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30 flex items-center">
                                    <CheckCircle size={10} className="mr-1" />
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="bg-slate-50/80 dark:bg-slate-700/30 backdrop-blur-sm rounded-lg p-2 text-xs mt-2">
                                <p className="text-slate-600 dark:text-slate-300 line-clamp-2">"{activity.description}"</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    );
  };

  // Edit Post Dialog
  const EditPostDialog = () => (
    <Dialog open={isEditPostOpen} onOpenChange={setIsEditPostOpen}>
      <DialogContent className="w-[calc(100%-20px)] max-w-lg rounded-xl backdrop-blur-sm border border-slate-200/20 bg-white/95 dark:bg-slate-900/90">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Edit size={16} className="text-purple-600 dark:text-purple-400" />
            </div>
            Edit Scheduled Post
          </DialogTitle>
          <DialogDescription>
            Make changes to your scheduled post below
          </DialogDescription>
        </DialogHeader>
        
        {editingPost && (
          <form onSubmit={handleEditPost} className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${editingPost.platformBg}`}>
                  {editingPost.platformIcon}
                </div>
                <div>
                  <Badge className={`text-xs px-2 py-0.5 ${editingPost.status === "Posted" 
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30" 
                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30"}`}
                  >
                    {editingPost.status || "Scheduled"}
                  </Badge>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{editingPost.time}</p>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium mb-1.5 block">Post Content</label>
                <Textarea 
                  className="min-h-[100px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  value={editingPost.content || ''}
                  onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                />
              </div>
              
              {editingPost.image_path && (
                <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-medium p-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">Image Preview</p>
                  <div className="aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <p className="text-xs text-slate-500">Image: {editingPost.image_path}</p>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditPostOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-gradient-to-r from-purple-600 to-indigo-600">Save Changes</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
  
  // Edit Automation Dialog
  const EditAutomationDialog = () => (
    <Dialog open={isEditAutomationOpen} onOpenChange={setIsEditAutomationOpen}>
      <DialogContent className="w-[calc(100%-20px)] max-w-lg rounded-xl backdrop-blur-sm border border-slate-200/20 bg-white/95 dark:bg-slate-900/90">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
              <Zap size={16} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            Edit Automation
          </DialogTitle>
          <DialogDescription>
            Configure your automation workflow settings
          </DialogDescription>
        </DialogHeader>
        
        {editingAutomation && (
          <form onSubmit={handleEditAutomation} className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium mb-1.5 block">Automation Name</label>
                <Input 
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  value={editingAutomation.name || ''}
                  onChange={(e) => setEditingAutomation({...editingAutomation, name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1.5 block">Status</label>
                  <Select value={editingAutomation.status || "Active"}>
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block">Type</label>
                  <Select value={editingAutomation.type || ""}>
                    <option value="Comment Reply">Comment Reply</option>
                    <option value="Message Reply">Message Reply</option>
                    <option value="Mention">Mention</option>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium mb-1.5 block">Trigger Phrase</label>
                <Input 
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  value={editingAutomation.incoming || ''}
                  onChange={(e) => setEditingAutomation({...editingAutomation, incoming: e.target.value})}
                  placeholder="Any text that should trigger this automation"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium mb-1.5 block">Response Message</label>
                <Textarea 
                  className="min-h-[100px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  value={editingAutomation.content || ''}
                  onChange={(e) => setEditingAutomation({...editingAutomation, content: e.target.value})}
                  placeholder="Automated response message"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditAutomationOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-600">Save Changes</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
  
  // View Engagement Dialog
  const ViewEngagementDialog = () => (
    <Dialog open={isViewEngagementOpen} onOpenChange={setIsViewEngagementOpen}>
      <DialogContent className="w-[calc(100%-20px)] max-w-lg rounded-xl backdrop-blur-sm border border-slate-200/20 bg-white/95 dark:bg-slate-900/90">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <MessageSquare size={16} className="text-blue-600 dark:text-blue-400" />
            </div>
            Engagement Details
          </DialogTitle>
          <DialogDescription>
            View and respond to this engagement
          </DialogDescription>
        </DialogHeader>
        
        {viewingEngagement && (
          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${viewingEngagement.platformBg}`}>
                  {viewingEngagement.platformIcon}
                </div>
                <div>
                  <p className="font-medium text-sm">{viewingEngagement.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{viewingEngagement.time}</p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 mb-3">
                <p className="text-sm">"{viewingEngagement.description}"</p>
              </div>
              
              {viewingEngagement.hasResponse && viewingEngagement.responseText && (
                <div>
                  <p className="text-xs font-medium mb-1.5 flex items-center">
                    <CheckCircle size={12} className="mr-1 text-emerald-500" /> Automated Response
                  </p>
                  <div className="bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/20">
                    <p className="text-sm text-slate-700 dark:text-slate-300">{viewingEngagement.responseText}</p>
                  </div>
                </div>
              )}
              
              {!viewingEngagement.hasResponse && (
                <form onSubmit={handleReplyToEngagement} className="mt-4">
                  <label className="text-xs font-medium mb-1.5 block">Reply to this engagement:</label>
                  <Textarea 
                    className="min-h-[100px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-3"
                    placeholder="Type your reply here..."
                  />
                  <div className="flex justify-end">
                    <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                      <Reply className="mr-2 h-4 w-4" /> Send Reply
                    </Button>
                  </div>
                </form>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewEngagementOpen(false)}>Close</Button>
              {viewingEngagement.hasResponse && (
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
              )}
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
  
  // Return the main component
  return (
    <TooltipProvider>
      <div>
        {renderMainContent()}
        <EditPostDialog />
        <EditAutomationDialog />
        <ViewEngagementDialog />
      </div>
    </TooltipProvider>
  );
} 