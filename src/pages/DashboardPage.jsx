import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  User,
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
  Zap,
  Settings,
  AlertCircle,
  Clock,
  RefreshCw,
  Image,
  Check,
  X,
  Shield
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
import { useDashboard } from "@/contexts/DashboardContext";
import SubscriptionStatus from "@/components/ui/SubscriptionStatus";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

export function DashboardPage() {
  // Get dashboard data from context
  const { homeData, accountData, loadingHome, homeError, fetchHomeData, refreshDashboard } = useDashboard();
  
  // State for dialogs
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isExportDataOpen, setIsExportDataOpen] = useState(false);
  const [isEditPostOpen, setIsEditPostOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [isEditAutomationOpen, setIsEditAutomationOpen] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState(null);
  const [isViewEngagementOpen, setIsViewEngagementOpen] = useState(false);
  const [viewingEngagement, setViewingEngagement] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Transform API data for UI
  const [quickStats, setQuickStats] = useState([]);
  const [activeAutomations, setActiveAutomations] = useState([]);  
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [recentEngagements, setRecentEngagements] = useState([]);
  const [platformData, setPlatformData] = useState([]);

  // User data
  const userData = accountData?.data?.data || {};
  const walletBalance = accountData?.wallet?.data || userData?.wallet || 0;
  const subscription = userData?.subscription || accountData?.subscription || "trial";
  const packageTier = userData?.package || "Trial";
  
  // Notification settings
  const notifications = accountData?.notification || userData?.notification || {};
  const hasNotificationsEnabled = Object.values(notifications).some(value => value === "yes");
  
  // Add pricing dialog state
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly");

  // Define pricing plans
  const pricingPlans = [
    {
      id: "trial",
      name: "Trial",
      description: "Basic features to test the platform",
      price: { monthly: 0, yearly: 0 },
      color: "bg-amber-100",
      features: [
        { name: "Limited feature access", included: true },
        { name: "Basic account setup", included: true },
        { name: "Up to 2 social accounts", included: true },
        { name: "Content scheduler (2 posts/day)", included: true },
        { name: "Basic automation workflows", included: true },
        { name: "AI content generation", included: false },
        { name: "Analytics dashboard", included: false },
        { name: "Priority support", included: false }
      ],
      icon: <Clock className="h-5 w-5 text-amber-700" />
    },
    {
      id: "plus",
      name: "Plus",
      description: "For growing creators and small businesses",
      price: { monthly: 200, yearly: 2000 },
      savings: "Save ₦400",
      color: "bg-blue-100",
      popular: true,
      features: [
        { name: "Everything in Trial, plus:", included: true },
        { name: "Up to 10 social accounts", included: true },
        { name: "Premium content scheduler (10 posts/day)", included: true },
        { name: "Auto-reply to comments", included: true },
        { name: "Auto DM responses", included: true },
        { name: "Basic analytics dashboard", included: true },
        { name: "AI content generation (limited)", included: true },
        { name: "Priority support", included: false }
      ],
      icon: <Zap className="h-5 w-5 text-blue-700" />
    },
    {
      id: "pro",
      name: "Pro",
      description: "Advanced features for serious businesses",
      price: { monthly: 500, yearly: 5000 },
      savings: "Save ₦1,000",
      color: "bg-purple-100",
      features: [
        { name: "Everything in Plus, plus:", included: true },
        { name: "Unlimited social accounts", included: true },
        { name: "Advanced automation workflows", included: true },
        { name: "Unlimited content scheduling", included: true },
        { name: "AI content generation (unlimited)", included: true },
        { name: "Advanced analytics with reports", included: true },
        { name: "Priority support", included: true },
        { name: "Dedicated account manager", included: true }
      ],
      icon: <Shield className="h-5 w-5 text-purple-700" />
    }
  ];

  // Process API data when it loads
  useEffect(() => {
    if (homeData?.data) {
      console.log('Processing home data for dashboard:', homeData?.data);
      console.log('Platform data detail:', homeData?.data?.platform);
      console.log('Automation data detail:', homeData?.data?.automation);
      
      let calculatedTotalFollowers = 0;
      let calculatedTotalEngagements = 0;
      let calculatedTotalLikes = 0;

      // Calculate aggregated stats from platform data if available
      if (homeData.data.platform?.data && Array.isArray(homeData.data.platform.data) && homeData.data.platform.data.length > 0) {
        homeData.data.platform.data.forEach(p => {
          calculatedTotalFollowers += Number(p.followers || 0);
          calculatedTotalEngagements += Number(p.total_engagement || 0);
          calculatedTotalLikes += Number(p.likes || 0);
        });
      } else {
        // Fallback to top-level summary fields if detailed data is not available
        calculatedTotalFollowers = Number(homeData.data.platform?.followers || 0);
        calculatedTotalEngagements = Number(homeData.data.platform?.engagement || 0);
        calculatedTotalLikes = Number(homeData.data.platform?.likes || 0);
      }
      
      setQuickStats([
        {
          title: "Total Followers",
          value: calculatedTotalFollowers.toLocaleString(),
          change: "↑", // Remains static as no trend data is available
          trend: "up",
          icon: <Users size={20} />,
          iconBg: "bg-blue-100",
          iconColor: "text-blue-700",
          accentColor: "bg-gradient-to-r from-blue-500 to-blue-600",
          link: "/analytics"
        },
        {
          title: "Engagements",
          value: calculatedTotalEngagements.toLocaleString(),
          change: calculatedTotalEngagements > 0 
                  ? `${Math.round((calculatedTotalLikes / calculatedTotalEngagements) * 100)}%` 
                  : "0%",
          trend: "up", // Remains static
          icon: <Heart size={20} />,
          iconBg: "bg-rose-100",
          iconColor: "text-rose-700",
          accentColor: "bg-gradient-to-r from-rose-500 to-rose-600",
          link: "/analytics"
        },
        {
          title: "Scheduled Posts",
          value: (homeData.data.schedule_post?.scheduled ?? homeData.data.scheduled_post ?? 0).toString(),
          change: (homeData.data.schedule_post?.posted ?? 0).toString(),
          trend: "up", // Remains static
          icon: <Calendar size={20} />,
          iconBg: "bg-purple-100",
          iconColor: "text-purple-700",
          accentColor: "bg-gradient-to-r from-purple-500 to-purple-600",
          link: "/content-scheduler"
        },
        {
          title: "Active Automations",
          value: (homeData.data.automation?.active ?? 0).toString(),
          change: (homeData.data.automation_count ?? 0).toString(),
          trend: "up", // Remains static
          icon: <Bot size={20} />,
          iconBg: "bg-amber-100",
          iconColor: "text-amber-700",
          accentColor: "bg-gradient-to-r from-amber-500 to-amber-600",
          link: "/automation"
        }
      ]);
      
      // Transform platform data
      if (homeData.data.platform?.data && Array.isArray(homeData.data.platform.data)) {
        setPlatformData(homeData.data.platform.data.map(platform => {
          // Map platform to icon
          const getPlatformIcon = (platformName) => {
            if (platformName.toLowerCase().includes('facebook')) return <Facebook size={20} className="text-white" />;
            if (platformName.toLowerCase().includes('instagram')) return <Instagram size={20} className="text-white" />;
            if (platformName.toLowerCase().includes('twitter')) return <Twitter size={20} className="text-white" />;
            return <Share2 size={20} className="text-white" />;
          };
          
          // Map platform to background color
          const getPlatformBg = (platformName) => {
            if (platformName.toLowerCase().includes('facebook')) return "bg-blue-600";
            if (platformName.toLowerCase().includes('instagram')) return "bg-gradient-to-r from-purple-600 to-pink-600";
            if (platformName.toLowerCase().includes('twitter')) return "bg-blue-400";
            return "bg-gray-600";
          };
          
          return {
            id: platform.id,
            name: platform.profile_name,
            platformName: platform.platform_name,
            icon: getPlatformIcon(platform.platform_name),
            bgColor: getPlatformBg(platform.platform_name),
            followers: platform.followers || 0,
            likes: platform.likes || 0,
            comments: platform.comments || 0,
            engagement: platform.total_engagement || 0,
            status: platform.status || "inactive",
            lastActivity: new Date(platform.last_activity || Date.now()),
            profileUrl: platform.profile_url || "#"
          };
        }));
      } else if (homeData.data.platform) {
        // If platform data exists but not in expected format, create a default entry
        setPlatformData([{
          id: 1,
          name: "Default Platform",
          platformName: "Social Media",
          icon: <Share2 size={20} className="text-white" />,
          bgColor: "bg-gray-600",
          followers: homeData.data.platform.followers || 0,
          likes: homeData.data.platform.likes || 0,
          comments: homeData.data.platform.comments || 0,
          engagement: homeData.data.platform.engagement || 0,
          status: "active",
          lastActivity: new Date(),
          profileUrl: "#"
        }]);
      } else {
        setPlatformData([]);
      }
      
      // Transform automations
      if (homeData.data.automation?.data && Array.isArray(homeData.data.automation.data)) {
        setActiveAutomations(homeData.data.automation.data.map(automation => {
          // Map platform icons based on platform name
          const getPlatformIcon = () => {
            // Default to Facebook if we don't have specific mapping info
            return <Facebook size={16} className="text-white" />;
          };
          
          return {
            name: automation.name || "Automation",
            type: automation.type || "Comment",
            platform: automation.platform || "",
            platformIcons: [getPlatformIcon()],
            status: automation.status || "Active",
            triggers: `${automation.triggers || 0} today`,
            id: automation.id,
            content: automation.content || "",
            incoming: automation.incoming || ""
          };
        }));
      } else if (homeData.data.automation && typeof homeData.data.automation === 'object') {
        // If we have automation data but not in the expected format, create default entries
        const numActiveAutomations = homeData.data.automation.active || 0;
        if (numActiveAutomations > 0) {
          setActiveAutomations(Array(numActiveAutomations).fill().map((_, i) => ({
            name: `Automation ${i+1}`,
            type: "Comment",
            platform: "",
            platformIcons: [<Facebook size={16} className="text-white" />],
            status: "Active",
            triggers: "0 today",
            id: i+1,
            content: "Automated response",
            incoming: "Any comment"
          })));
        } else {
          setActiveAutomations([]);
        }
      } else {
        setActiveAutomations([]);
      }
      
      // Transform scheduled posts - handle empty data case
      if (homeData.schedule_post?.data && Array.isArray(homeData.schedule_post.data)) {
        const filteredPosts = homeData.schedule_post.data
          .filter(post => post.status === "Scheduled")
          .slice(0, 5); // Limit to 5 posts
          
        if (filteredPosts.length > 0) {
          setScheduledPosts(filteredPosts.map(post => {
            // Map platform to icon
            const getPlatformIcon = (platformId) => {
              // Default to Facebook if we don't have specific mapping info
              return <Facebook size={20} className="text-white" />;
            };
            
            // Map platform to background color
            const getPlatformBg = () => {
              return "bg-gradient-to-r from-indigo-500 to-blue-500";
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
              title: post.content?.slice(0, 30) + (post.content?.length > 30 ? '...' : '') || "Scheduled post",
              time: formatScheduleDate(post.scheduled_time || new Date()),
              platformIcon: getPlatformIcon(post.platform_id),
              platformBg: getPlatformBg(),
              content: post.content || "",
              image_path: post.image_path || "",
              video_path: post.video_path || ""
            };
          }));
        } else {
          setScheduledPosts([]);
        }
      } else {
        setScheduledPosts([]);
      }
      
      // Transform comment data for engagements - handle empty data case
      if (homeData.comment_reply?.data && Array.isArray(homeData.comment_reply.data)) {
        const commentData = homeData.comment_reply.data.slice(0, 5); // Limit to 5 comments
        
        if (commentData.length > 0) {
          setRecentEngagements(commentData.map(comment => {
            // Map platform to icon
            const getPlatformIcon = () => {
              // Default to Facebook
              return <Facebook size={20} className="text-white" />;
            };
            
            // Format date for display
            const formatCommentTime = (dateStr) => {
              const commentDate = new Date(dateStr || Date.now());
              const now = new Date();
              const diff = now - commentDate;
              
              // Less than a minute
              if (diff < 60000) {
                return "Just now";
              }
              // Less than an hour
              else if (diff < 3600000) {
                return `${Math.floor(diff / 60000)}m ago`;
              }
              // Less than a day
              else if (diff < 86400000) {
                return `${Math.floor(diff / 3600000)}h ago`;
              }
              // Less than a week
              else if (diff < 604800000) {
                return `${Math.floor(diff / 86400000)}d ago`;
              }
              // Otherwise return formatted date
              else {
                return commentDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
              }
            };
            
            return {
              id: comment.id,
              content: comment.content || "No content",
              userName: comment.user_name || "User",
              userHandle: comment.user_handle || "user",
              platformIcon: getPlatformIcon(),
              time: formatCommentTime(comment.created_at),
              type: comment.type || "comment",
              replied: !!comment.reply_content,
              replyContent: comment.reply_content || ""
            };
          }));
        } else {
          setRecentEngagements([]);
        }
      } else {
        setRecentEngagements([]);
      }
    }
  }, [homeData]);
  
  // Handle refreshing dashboard data
  const handleRefreshData = () => {
    refreshDashboard();
  };

  // Handle export data
  const handleExportData = (format) => {
    console.log(`Exporting data in ${format} format`);
    setIsExportDataOpen(false);
    // In a real app, this would trigger an API call to get export data
  };

  // Handle adding account
  const handleAddAccount = (event) => {
    event.preventDefault();
    console.log('Add account form submitted');
    setIsAddAccountOpen(false);
    // In a real app, this would send form data to API
  };

  // Open edit post dialog
  const openEditPost = (post) => {
    setEditingPost(post);
    setIsEditPostOpen(true);
  };

  // Handle editing post
  const handleEditPost = (event) => {
    event.preventDefault();
    console.log('Edit post form submitted', editingPost);
    setIsEditPostOpen(false);
    // In a real app, this would update post via API
  };

  // Open edit automation dialog
  const openEditAutomation = (automation) => {
    setEditingAutomation(automation);
    setIsEditAutomationOpen(true);
  };

  // Handle editing automation
  const handleEditAutomation = (event) => {
    event.preventDefault();
    console.log('Edit automation form submitted', editingAutomation);
    setIsEditAutomationOpen(false);
    // In a real app, this would update automation via API
  };

  // Open engagement details dialog
  const openEngagementDetails = (engagement) => {
    setViewingEngagement(engagement);
    setIsViewEngagementOpen(true);
  };

  // Handle replying to engagement
  const handleReplyToEngagement = (event) => {
    event.preventDefault();
    console.log('Reply to engagement submitted', viewingEngagement);
    setIsViewEngagementOpen(false);
    // In a real app, this would send reply via API
  };

  // Format subscription status
  const getSubscriptionBadge = () => {
    const subscriptionMap = {
      "trial": { 
        label: "Trial", 
        color: "bg-gray-100 text-gray-800 border-gray-200" 
      },
      "plus": { 
        label: "Plus", 
        color: "bg-blue-100 text-blue-800 border-blue-200" 
      },
      "pro": { 
        label: "Pro", 
        color: "bg-purple-100 text-purple-800 border-purple-200" 
      }
    };
    
    // Determine which subscription tier to display based on packageTier
    const packageName = packageTier.toLowerCase();
    
    // Match package to available subscription types
    const subscriptionKey = Object.keys(subscriptionMap).find(key => 
      packageName.includes(key)
    ) || "trial";
    
    return subscriptionMap[subscriptionKey];
  };

  // Handle plan subscription
  const handleSubscribe = (planId) => {
    console.log(`Subscribing to ${planId} plan`);
    // Here you would implement the actual subscription logic
    setIsPricingOpen(false);
    // Show a success message
    toast.success(`Subscribed to ${planId} plan successfully!`);
  };

  // Add debugging logs to get more info on data structures
  useEffect(() => {
    console.log('homeData structure:', homeData);
    console.log('accountData structure:', accountData);
    console.log('Current userData:', userData);
    console.log('Wallet balance:', walletBalance);
    console.log('Subscription tier:', subscription);
    console.log('Package tier:', packageTier);
  }, [homeData, accountData, userData, walletBalance, subscription, packageTier]);

  if (loadingHome) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-[70vh]">
          <div className="flex flex-col items-center">
            <Loader className="h-10 w-10 text-primary animate-spin mb-4" />
            <h3 className="text-lg font-medium">Loading your dashboard...</h3>
            <p className="text-muted-foreground">Please wait while we fetch your latest data</p>
          </div>
        </div>
      </div>
    );
  }

  if (homeError) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-3xl mx-auto">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3 mt-0.5" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Error Loading Dashboard</h3>
              <p className="text-red-700 mt-1">{homeError}</p>
              <Button 
                variant="outline" 
                className="mt-4 border-red-300 text-red-700 hover:bg-red-50"
                onClick={handleRefreshData}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get subscription badge
  const subscriptionBadge = getSubscriptionBadge();

  return (
    <div className="container mx-auto py-6 px-4 max-w-[350px] sm:max-w-none">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <div className="flex items-center space-x-3">
            <p className="text-muted-foreground">
              Welcome back, {userData?.first_name || "User"}
            </p>
            <Badge variant="outline" className={subscriptionBadge.color}>
              {packageTier || subscriptionBadge.label}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button variant="outline" size="sm" onClick={handleRefreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Remove Dashboard Tabs and just show overview content */}
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <Link to={stat.link} key={index}>
              <Card className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                      <div className="flex items-end gap-2">
                        <h3 className="text-2xl font-bold">{stat.value}</h3>
                        {stat.change && (
                          <div className={`text-xs px-1.5 py-0.5 rounded-full ${stat.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} flex items-center`}>
                            {stat.trend === 'up' ? <ArrowUp className="h-3 w-3 mr-0.5" /> : <ArrowDown className="h-3 w-3 mr-0.5" />}
                            {stat.change}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={`p-2 rounded-full ${stat.iconBg}`}>
                      <div className={stat.iconColor}>
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        {/* Subscription Status */}
        <Card className="overflow-hidden border-gray-200">
          <div className={`h-1.5 w-full ${
            (packageTier || "").toLowerCase().includes("pro") ? "bg-purple-500" : 
            (packageTier || "").toLowerCase().includes("plus") ? "bg-blue-500" : 
            "bg-amber-500"
          }`}></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Subscription Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${
                      (packageTier || "").toLowerCase().includes("pro") ? "bg-purple-100 text-purple-800 border-purple-200" : 
                      (packageTier || "").toLowerCase().includes("plus") ? "bg-blue-100 text-blue-800 border-blue-200" : 
                      "bg-amber-100 text-amber-800 border-amber-200"
                    } px-2.5 py-0.5`}>
                      {packageTier || "Trial"}
                    </Badge>
                    <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                    <span className="text-sm text-muted-foreground">
                      {(subscription || "").toLowerCase().includes("trial") ? "Trial Subscription" : `${subscription ? subscription.charAt(0).toUpperCase() + subscription.slice(1) : "Trial"} Subscription`}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground flex items-center">
                    <span className="font-medium text-slate-900">₦{Number(walletBalance || 0).toLocaleString()}</span>
                    <span className="mx-2">•</span>
                    <span>Wallet Balance</span>
                  </p>
                </div>
                
                {!(packageTier || "").toLowerCase().includes("pro") && (
                  <Button className="mt-4 sm:mt-0" onClick={() => setIsPricingOpen(true)}>
                    <Zap className="h-4 w-4 mr-2" />
                    {(packageTier || "").toLowerCase().includes("plus") ? "Upgrade to Pro" : "Upgrade Plan"}
                  </Button>
                )}
              </div>
              
              {/* Subscription Status Message */}
              {(packageTier || "").toLowerCase().includes("trial") && (
                <div className="bg-amber-50 border border-amber-100 text-amber-800 px-4 py-3 rounded-md text-sm flex items-start">
                  <AlertCircle className="h-4 w-4 mr-2 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p>Your trial gives you access to limited features. Upgrade to unlock all features.</p>
                </div>
              )}
              
              {(packageTier || "").toLowerCase().includes("plus") && (
                <div className="bg-blue-50 border border-blue-100 text-blue-800 px-4 py-3 rounded-md text-sm flex items-start">
                  <Zap className="h-4 w-4 mr-2 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p>You have access to most premium features. Upgrade to Pro for unlimited access to all features.</p>
                </div>
              )}
              
              {(packageTier || "").toLowerCase().includes("pro") && (
                <div className="bg-purple-50 border border-purple-100 text-purple-800 px-4 py-3 rounded-md text-sm flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p>You have access to all premium features and priority support.</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                <div className="flex items-center p-3 rounded-md border border-gray-100 bg-gray-50">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-sm">Content Scheduling</span>
                </div>
                <div className="flex items-center p-3 rounded-md border border-gray-100 bg-gray-50">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-sm">Basic Analytics</span>
                </div>
                <div className="flex items-center p-3 rounded-md border border-gray-100 bg-gray-50">
                  {(packageTier || "").toLowerCase().includes("trial") ? (
                    <XCircle className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  )}
                  <span className={(packageTier || "").toLowerCase().includes("trial") ? "text-sm text-gray-500" : "text-sm"}>Advanced Automation</span>
                </div>
                <div className="flex items-center p-3 rounded-md border border-gray-100 bg-gray-50">
                  {(packageTier || "").toLowerCase().includes("trial") ? (
                    <XCircle className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  )}
                  <span className={(packageTier || "").toLowerCase().includes("trial") ? "text-sm text-gray-500" : "text-sm"}>Priority Support</span>
                </div>
                <div className="flex items-center p-3 rounded-md border border-gray-100 bg-gray-50">
                  {(packageTier || "").toLowerCase().includes("pro") ? (
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                  )}
                  <span className={(packageTier || "").toLowerCase().includes("pro") ? "text-sm" : "text-sm text-gray-500"}>Advanced Reports</span>
                </div>
                <div className="flex items-center p-3 rounded-md border border-gray-100 bg-gray-50">
                  {(packageTier || "").toLowerCase().includes("pro") ? (
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                  )}
                  <span className={(packageTier || "").toLowerCase().includes("pro") ? "text-sm" : "text-sm text-gray-500"}>White Label Reports</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Connected Platforms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Platform List */}
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Connected Platforms</CardTitle>
                <CardDescription>
                  {platformData.length} platform{platformData.length !== 1 ? 's' : ''} connected
                </CardDescription>
              </div>
              
              <Button size="sm" variant="ghost" asChild>
                <Link to="/integrations">
                  <Plus className="h-4 w-4 mr-2" />
                  Connect
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformData.length > 0 ? (
                  platformData.map((platform) => (
                    <div key={platform.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full ${platform.bgColor} mr-3`}>
                          {platform.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{platform.name}</h4>
                          <p className="text-xs text-muted-foreground">{platform.platformName}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant={platform.status === 'active' ? 'outline' : 'secondary'} className={platform.status === 'active' ? 'bg-green-50 text-green-800 border-green-200' : ''}>
                                {platform.status === 'active' ? 'Active' : 'Inactive'}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Last activity: {platform.lastActivity.toLocaleDateString()}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Share2 className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-1">No platforms connected</h3>
                    <p className="text-muted-foreground text-sm mb-4">Connect your social media accounts to get started</p>
                    <Button asChild>
                      <Link to="/integrations">
                        <Plus className="h-4 w-4 mr-2" />
                        Connect Platform
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            {platformData.length > 0 && (
              <CardFooter className="border-t pt-4">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/integrations">
                    Manage Platforms
                  </Link>
                </Button>
              </CardFooter>
            )}
          </Card>
          
          {/* Automation Overview */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Automations</CardTitle>
              <CardDescription>
                {activeAutomations.length} automation{activeAutomations.length !== 1 ? 's' : ''} running
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeAutomations.length > 0 ? (
                  activeAutomations.map((automation) => (
                    <div key={automation.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Bot className="h-5 w-5 text-purple-500 mr-2" />
                          <h4 className="font-medium">{automation.name}</h4>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                          {automation.status}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        <span className="font-medium">Trigger:</span> {automation.incoming || "Any comment"}
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        <span className="font-medium">Response:</span> {automation.content}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <div className="bg-purple-100 rounded-full p-1 mr-2">
                            {automation.platformIcons.map((icon, i) => (
                              <span key={i}>{icon}</span>
                            ))}
                          </div>
                          <span>{automation.type}</span>
                        </div>
                        
                        <Button size="sm" variant="ghost" onClick={() => openEditAutomation(automation)}>
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Bot className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-1">No active automations</h3>
                    <p className="text-muted-foreground text-sm mb-4">Set up automations to respond to comments and messages</p>
                    <Button asChild>
                      <Link to="/automation">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Automation
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            {activeAutomations.length > 0 && (
              <CardFooter className="border-t pt-4">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/automation">
                    View All Automations
                  </Link>
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
        
        {/* Scheduled Content */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Scheduled Posts</CardTitle>
            <CardDescription>
              {homeData?.schedule_post?.scheduled || scheduledPosts.length > 0 ? 
                `${homeData?.schedule_post?.scheduled || scheduledPosts.length} upcoming post${(homeData?.schedule_post?.scheduled || scheduledPosts.length) !== 1 ? 's' : ''}` : 
                'No upcoming posts'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scheduledPosts.length > 0 ? (
              <div className="space-y-4">
                {scheduledPosts.map((post) => (
                  <div key={post.id} className="flex border rounded-lg overflow-hidden">
                    <div className={`w-1 ${post.platformBg}`}></div>
                    <div className="flex-1 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className={`p-1 rounded-full ${post.platformBg} mr-2`}>
                            {post.platformIcon}
                          </div>
                          <span className="text-sm font-medium">{post.time}</span>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => openEditPost(post)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm line-clamp-2">{post.title}</p>
                      
                      {post.image_path && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            <Image className="h-3 w-3 mr-1" /> Image attached
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1">No scheduled posts</h3>
                <p className="text-muted-foreground text-sm mb-4">Plan your content in advance to maintain consistency</p>
                <Button asChild>
                  <Link to="/content-scheduler">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Post
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
          {scheduledPosts.length > 0 && (
            <CardFooter className="border-t pt-4">
              <Button variant="outline" asChild className="w-full">
                <Link to="/content-scheduler">
                  View All Scheduled Posts
                </Link>
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
      
      {/* Dialogs */}
      <Dialog open={isEditPostOpen} onOpenChange={setIsEditPostOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Scheduled Post</DialogTitle>
            <DialogDescription>
              Make changes to your scheduled post.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditPost}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="content" className="text-sm font-medium">Content</label>
                <Textarea 
                  id="content" 
                  value={editingPost?.content || ''} 
                  onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="scheduled-time" className="text-sm font-medium">Scheduled Time</label>
                <Input 
                  id="scheduled-time" 
                  type="datetime-local" 
                  value={editingPost?.scheduledTime || ''} 
                  onChange={(e) => setEditingPost({...editingPost, scheduledTime: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditAutomationOpen} onOpenChange={setIsEditAutomationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Automation</DialogTitle>
            <DialogDescription>
              Make changes to your automation workflow.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditAutomation}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="automation-name" className="text-sm font-medium">Name</label>
                <Input 
                  id="automation-name" 
                  value={editingAutomation?.name || ''} 
                  onChange={(e) => setEditingAutomation({...editingAutomation, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="trigger" className="text-sm font-medium">Trigger</label>
                <Input 
                  id="trigger" 
                  value={editingAutomation?.incoming || ''} 
                  onChange={(e) => setEditingAutomation({...editingAutomation, incoming: e.target.value})}
                  placeholder="e.g. when someone comments with 'price'"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="response" className="text-sm font-medium">Response</label>
                <Textarea 
                  id="response" 
                  value={editingAutomation?.content || ''} 
                  onChange={(e) => setEditingAutomation({...editingAutomation, content: e.target.value})}
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="status" className="text-sm font-medium">Status</label>
                <Select id="status" value={editingAutomation?.status || 'Active'}>
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isViewEngagementOpen} onOpenChange={setIsViewEngagementOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Engagement Details</DialogTitle>
            <DialogDescription>
              View and respond to this engagement.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted p-4 rounded-lg mb-4">
              <div className="flex items-start">
                <div className="mr-3">
                  {/* Avatar placeholder */}
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users size={18} className="text-primary" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <span className="font-medium">{viewingEngagement?.userName || 'User'}</span>
                    <span className="text-xs text-muted-foreground ml-2">@{viewingEngagement?.userHandle || 'user'}</span>
                  </div>
                  <p className="text-sm">{viewingEngagement?.content}</p>
                  <span className="text-xs text-muted-foreground">{viewingEngagement?.time}</span>
                </div>
              </div>
            </div>
            
            {viewingEngagement?.replied && (
              <div className="bg-muted/50 p-4 rounded-lg mb-4 ml-6">
                <div className="flex items-start">
                  <div className="mr-3">
                    {/* Avatar placeholder */}
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <User size={14} className="text-primary" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      <span className="font-medium text-sm">You</span>
                    </div>
                    <p className="text-sm">{viewingEngagement?.replyContent}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleReplyToEngagement}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="reply" className="text-sm font-medium">Your Reply</label>
                  <Textarea 
                    id="reply" 
                    placeholder="Type your reply here..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button type="submit">
                  <Reply className="h-4 w-4 mr-2" />
                  Send Reply
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Pricing Dialog */}
      <Dialog open={isPricingOpen} onOpenChange={setIsPricingOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Choose Your Plan</DialogTitle>
            <DialogDescription className="text-center max-w-md mx-auto">
              Select the plan that best fits your needs. Upgrade any time to unlock more features.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center mt-4 mb-6">
            <div className="bg-muted p-1 rounded-full flex items-center">
              <div className="flex items-center space-x-2 mr-4">
                <Switch 
                  id="billing-cycle" 
                  checked={billingCycle === "yearly"}
                  onCheckedChange={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                />
                <Label htmlFor="billing-cycle">Annual billing</Label>
              </div>
              {billingCycle === "yearly" && (
                <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                  Save up to 16%
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pricingPlans.map((plan) => {
              const isCurrentPlan = packageTier.toLowerCase().includes(plan.id);
              const priceToShow = billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly;
              const planDisabled = plan.id === "trial" && !packageTier.toLowerCase().includes("trial");
              
              return (
                <Card 
                  key={plan.id} 
                  className={`w-full relative border ${isCurrentPlan ? 'border-green-300 ring-1 ring-green-200' : ''} transition-all ${planDisabled ? 'opacity-70' : ''}`}
                >
                  {plan.popular && !isCurrentPlan && (
                    <div className="absolute -top-3 left-0 right-0 flex justify-center">
                      <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                    </div>
                  )}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-0 right-0 flex justify-center">
                      <Badge className="bg-green-500 text-white">Current Plan</Badge>
                    </div>
                  )}
                  
                  <CardHeader className={`${plan.color} rounded-t-lg p-4`}>
                    <div className="flex items-center mb-1">
                      <div className="mr-2 p-1.5 rounded-full bg-white/80">
                        {plan.icon}
                      </div>
                      <CardTitle className="text-base">{plan.name}</CardTitle>
                    </div>
                    <CardDescription className="text-xs">{plan.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <div className="flex items-end">
                        <span className="text-2xl font-bold">₦{priceToShow.toLocaleString()}</span>
                        <span className="text-muted-foreground ml-2 text-sm">
                          {plan.id === "trial" ? "Free" : `/${billingCycle === "monthly" ? "month" : "year"}`}
                        </span>
                      </div>
                      {billingCycle === "yearly" && plan.savings && (
                        <p className="text-xs text-green-600 mt-1">{plan.savings}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {plan.features.slice(0, 5).map((feature, idx) => (
                        <div key={idx} className="flex items-start text-sm">
                          {feature.included ? (
                            <Check className="h-4 w-4 text-green-500 mr-2 shrink-0 mt-0.5" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground mr-2 shrink-0 mt-0.5" />
                          )}
                          <span className={`text-sm ${feature.included ? "" : "text-muted-foreground"}`}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                      {plan.features.length > 5 && (
                        <p className="text-xs text-muted-foreground italic">+ {plan.features.length - 5} more features</p>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      variant={isCurrentPlan ? "outline" : "default"} 
                      className="w-full font-medium text-sm"
                      disabled={isCurrentPlan || planDisabled}
                      onClick={() => handleSubscribe(plan.id)}
                    >
                      {isCurrentPlan ? "Current Plan" : `Upgrade to ${plan.name}`}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
            <div className="text-sm text-muted-foreground">
              Wallet Balance: <span className="font-medium">₦{Number(walletBalance || 0).toLocaleString()}</span>
            </div>
            <Button variant="outline" onClick={() => setIsPricingOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 