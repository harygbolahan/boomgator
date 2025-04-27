import { Link } from "react-router-dom";
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
  Loader
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

export function DashboardPage() {
  // Get dashboard data from context
  const { homeData, loadingHome, homeError, fetchHomeData } = useDashboard();
  
  // State for dialogs
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isExportDataOpen, setIsExportDataOpen] = useState(false);
  const [isEditPostOpen, setIsEditPostOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [isEditAutomationOpen, setIsEditAutomationOpen] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState(null);
  const [isViewEngagementOpen, setIsViewEngagementOpen] = useState(false);
  const [viewingEngagement, setViewingEngagement] = useState(null);
  
  // Transform API data for UI
  const [quickStats, setQuickStats] = useState([]);
  const [activeAutomations, setActiveAutomations] = useState([]);  
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [recentEngagements, setRecentEngagements] = useState([]);
  
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
          title: "Engagements",
          value: Number(homeData.platform?.engagement || 0).toLocaleString(),
          change: homeData.platform?.likes ? `${Math.round(Number(homeData.platform.likes) / Number(homeData.platform.engagement) * 100)}%` : "0%",
          trend: "up",
          icon: <Heart size={20} />,
          iconBg: "bg-rose-100",
          iconColor: "text-rose-700",
          accentColor: "bg-gradient-to-r from-rose-500 to-rose-600"
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
          .filter(post => post.status === "Scheduled")
          .slice(0, 5) // Limit to 5 posts
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
  }, [homeData]);
  
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
  
  // Add Account functionality
  const handleAddAccount = (event) => {
    event.preventDefault();
    // In a real app, this would submit form data to an API
    console.log("Account added");
    setIsAddAccountOpen(false);
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

  // Loading state
  if (loadingHome && !homeData) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }
  
  // Error state
  if (homeError && !homeData) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4 flex items-start gap-3 max-w-md">
          <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error loading dashboard data</p>
            <p className="text-sm mt-1">{homeError}</p>
          </div>
        </div>
        <Button onClick={fetchHomeData} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Dashboard</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Welcome back! Here's an overview of your social media automation.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {/* Refresh button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs sm:text-sm border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 flex items-center gap-1.5"
            onClick={fetchHomeData}
            disabled={loadingHome}
          >
            {loadingHome ? (
              <Loader size={14} className="animate-spin" />
            ) : (
              <ArrowUp size={14} className="rotate-90" />
            )}
            <span className="sm:inline">Refresh</span>
          </Button>
          
          {/* Export Data functionality */}
          <Dialog open={isExportDataOpen} onOpenChange={setIsExportDataOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50">
                <Download size={14} className="mr-1 sm:mr-2" /> <span className="sm:inline">Export Data</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-w-[calc(100vw-2rem)]">
              <DialogHeader>
                <DialogTitle className="text-base sm:text-lg">Export Dashboard Data</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  Choose the format for your data export
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                  <Button onClick={() => handleExportData('csv')} variant="outline" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                    <Download size={14} /> CSV Format
                  </Button>
                  <Button onClick={() => handleExportData('xlsx')} variant="outline" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                    <Download size={14} /> Excel Format
                  </Button>
                  <Button onClick={() => handleExportData('pdf')} variant="outline" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                    <Download size={14} /> PDF Report
                  </Button>
                  <Button onClick={() => handleExportData('json')} variant="outline" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                    <Download size={14} /> JSON Data
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsExportDataOpen(false)}>Cancel</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Account functionality */}
          <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="text-xs sm:text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <Plus size={14} className="mr-1 sm:mr-2" /> <span className="sm:inline">Add Account</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-w-[calc(100vw-2rem)]">
              <DialogHeader>
                <DialogTitle className="text-base sm:text-lg">Connect Social Media Account</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  Link your social media profiles to enable automation
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddAccount}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="platform" className="text-sm font-medium">Platform</label>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" className="flex-1 min-w-[80px] text-xs sm:text-sm flex items-center gap-1 sm:gap-2 justify-center">
                        <Facebook size={16} /> <span className="hidden xs:inline">Facebook</span>
                      </Button>
                      <Button type="button" variant="outline" className="flex-1 min-w-[80px] text-xs sm:text-sm flex items-center gap-1 sm:gap-2 justify-center">
                        <Instagram size={16} /> <span className="hidden xs:inline">Instagram</span>
                      </Button>
                      <Button type="button" variant="outline" className="flex-1 min-w-[80px] text-xs sm:text-sm flex items-center gap-1 sm:gap-2 justify-center">
                        <Twitter size={16} /> <span className="hidden xs:inline">Twitter</span>
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input id="email" type="email" />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="password" className="text-sm font-medium">Password</label>
                    <Input id="password" type="password" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" size="sm" className="text-xs sm:text-sm" onClick={() => setIsAddAccountOpen(false)}>Cancel</Button>
                  <Button type="submit" size="sm" className="text-xs sm:text-sm bg-gradient-to-r from-indigo-600 to-purple-600">Connect Account</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="overflow-hidden border-none shadow-md transition-all duration-200 hover:shadow-lg">
            <div className={`h-1 w-full ${stat.accentColor}`}></div>
            <CardContent className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">{stat.title}</h3>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${stat.iconBg} ${stat.iconColor}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                <div className="flex items-center gap-1">
                  <span className={`flex items-center gap-1 ${stat.trend === "up" ? "text-emerald-600" : "text-rose-600"}`}>
                    {stat.trend === "up" ? <ArrowUp size={14} /> : <ArrowDown size={14} />} {stat.change}
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground">total</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 sm:gap-6">
        {/* Left column - 4 units wide */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-6">
          {/* Edit Post Dialog */}
          <Dialog open={isEditPostOpen} onOpenChange={setIsEditPostOpen}>
            <DialogContent className="sm:max-w-xl max-w-[calc(100vw-2rem)]">
              <DialogHeader>
                <DialogTitle className="text-base sm:text-lg">Edit Scheduled Post</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  Make changes to your scheduled post
                </DialogDescription>
              </DialogHeader>
              {editingPost && (
                <form onSubmit={handleEditPost}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="content" className="text-sm font-medium">Content</label>
                      <Textarea 
                        id="content" 
                        rows={4}
                        defaultValue={editingPost.content}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label htmlFor="scheduledTime" className="text-sm font-medium">Scheduled Time</label>
                        <Input 
                          id="scheduledTime" 
                          type="datetime-local" 
                          defaultValue={new Date().toISOString().slice(0, 16)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="platform" className="text-sm font-medium">Platform</label>
                        <div className="flex">
                          <Button type="button" variant="outline" className="mr-2 text-xs flex items-center gap-1">
                            <Facebook size={14} /> Facebook
                          </Button>
                          <Button type="button" variant="outline" className="text-xs flex items-center gap-1">
                            <Instagram size={14} /> Instagram
                          </Button>
                        </div>
                      </div>
                    </div>
                    {editingPost.image_path && (
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Media</label>
                        <div className="bg-slate-100 rounded p-2 text-center">
                          <p className="text-xs">{editingPost.image_path}</p>
                        </div>
                      </div>
                    )}
                    {editingPost.video_path && (
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Video</label>
                        <div className="bg-slate-100 rounded p-2 text-center">
                          <p className="text-xs">{editingPost.video_path}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" size="sm" className="text-xs sm:text-sm" onClick={() => setIsEditPostOpen(false)}>Cancel</Button>
                    <Button type="submit" size="sm" className="text-xs sm:text-sm bg-gradient-to-r from-indigo-600 to-purple-600">Save Changes</Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>

          {/* Active Automations */}
          <Card className="border-none shadow-md">
            <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-2 flex flex-row justify-between items-center">
              <CardTitle className="text-base sm:text-lg font-medium">Active Automations</CardTitle>
              <Link to="/automation" className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 sm:gap-2">
                View All <ExternalLink size={12} className="inline" />
              </Link>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              {activeAutomations.length === 0 ? (
                <div className="text-center py-8">
                  <Bot size={40} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-muted-foreground">No automation workflows set up yet.</p>
                  <Link to="/automation">
                    <Button className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600">
                      Create Automation
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {activeAutomations.map((automation, index) => (
                    <div key={index} className="bg-white rounded-lg border p-3 sm:p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 mr-2 sm:mr-3">
                            <Bot size={18} />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm sm:text-base">{automation.name}</h4>
                            <p className="text-xs text-muted-foreground">Type: {automation.type}</p>
                          </div>
                        </div>
                        <Badge className={`text-xs ${automation.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                          {automation.status}
                        </Badge>
                      </div>
                      
                      <div className="bg-slate-50 rounded-md p-2 mb-2 text-xs">
                        <div className="mb-1">
                          <span className="font-medium">When: </span>
                          <span className="text-slate-600">{automation.incoming || "Any trigger"}</span>
                        </div>
                        <div>
                          <span className="font-medium">Reply with: </span>
                          <span className="text-slate-600">{automation.content || "Automated message"}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1 items-center">
                          <span className="text-xs text-muted-foreground">Platform:</span>
                          <div className="flex space-x-1">
                            {automation.platformIcons.map((icon, i) => (
                              <div key={i} className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                                {icon}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => openEditAutomation(automation)}>
                          <Edit size={12} className="mr-1" /> Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Edit Automation Dialog */}
          <Dialog open={isEditAutomationOpen} onOpenChange={setIsEditAutomationOpen}>
            <DialogContent className="sm:max-w-xl max-w-[calc(100vw-2rem)]">
              <DialogHeader>
                <DialogTitle className="text-base sm:text-lg">Edit Automation</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  Make changes to your automation workflow
                </DialogDescription>
              </DialogHeader>
              {editingAutomation && (
                <form onSubmit={handleEditAutomation}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="name" className="text-sm font-medium">Name</label>
                      <Input 
                        id="name" 
                        defaultValue={editingAutomation.name} 
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="type" className="text-sm font-medium">Type</label>
                      <select className="w-full p-2 border rounded" id="type" defaultValue={editingAutomation.type}>
                        <option>Comment</option>
                        <option>Message</option>
                        <option>Keyword</option>
                        <option>Story</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="incoming" className="text-sm font-medium">Trigger (When)</label>
                      <Textarea 
                        id="incoming" 
                        rows={2}
                        defaultValue={editingAutomation.incoming}
                        placeholder="Enter trigger phrase or pattern"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="content" className="text-sm font-medium">Response Message</label>
                      <Textarea 
                        id="content" 
                        rows={3}
                        defaultValue={editingAutomation.content}
                        placeholder="Enter automated response message"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="status" className="text-sm font-medium">Status</label>
                      <div className="flex gap-2">
                        <Button 
                          type="button" 
                          variant={editingAutomation.status === "Active" ? "default" : "outline"} 
                          className="flex-1"
                        >
                          <CheckCircle size={14} className="mr-2" /> Active
                        </Button>
                        <Button 
                          type="button" 
                          variant={editingAutomation.status === "Paused" ? "default" : "outline"} 
                          className="flex-1"
                        >
                          <XCircle size={14} className="mr-2" /> Paused
                        </Button>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" size="sm" className="text-xs sm:text-sm" onClick={() => setIsEditAutomationOpen(false)}>Cancel</Button>
                    <Button type="submit" size="sm" className="text-xs sm:text-sm bg-gradient-to-r from-indigo-600 to-purple-600">Save Changes</Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>

          {/* Scheduled Posts */}
          <Card className="border-none shadow-md">
            <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-2 flex flex-row justify-between items-center">
              <CardTitle className="text-base sm:text-lg font-medium">Scheduled Posts</CardTitle>
              <Link to="/calendar" className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 sm:gap-2">
                View Calendar <ExternalLink size={12} className="inline" />
              </Link>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              {scheduledPosts.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar size={40} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-muted-foreground">No posts scheduled yet.</p>
                  <Link to="/calendar">
                    <Button className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600">
                      Schedule a Post
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {scheduledPosts.map((post, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 sm:gap-4 p-2 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => openEditPost(post)}
                    >
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-md flex items-center justify-center ${post.platformBg}`}>
                        {post.platformIcon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate">{post.title}</p>
                        <p className="text-xs text-muted-foreground">{post.time}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Edit size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - 2 units wide */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* View Engagement Dialog */}
          <Dialog open={isViewEngagementOpen} onOpenChange={setIsViewEngagementOpen}>
            <DialogContent className="sm:max-w-md max-w-[calc(100vw-2rem)]">
              <DialogHeader>
                <DialogTitle className="text-base sm:text-lg">Engagement Details</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  View and respond to user engagement
                </DialogDescription>
              </DialogHeader>
              {viewingEngagement && (
                <>
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${viewingEngagement.platformBg}`}>
                      {viewingEngagement.platformIcon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{viewingEngagement.title}</p>
                      <p className="text-xs text-muted-foreground mb-2">{viewingEngagement.time}</p>
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-sm">{viewingEngagement.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-4">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Share2 size={14} className="mr-1.5" /> Share
                    </Button>
                    <div>
                      {viewingEngagement.hasResponse && (
                        <Badge className="text-xs bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                          Auto-response sent
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  {viewingEngagement.hasResponse && (
                    <div className="bg-gray-50 p-3 rounded-md mb-4">
                      <p className="text-xs text-muted-foreground mb-1">Auto-response sent:</p>
                      <p className="text-sm">{viewingEngagement.responseText || "Thank you for your interest! We'll get back to you soon."}</p>
                    </div>
                  )}
                  <form onSubmit={handleReplyToEngagement}>
                    <div className="grid gap-4">
                      <Textarea 
                        placeholder="Write your response..." 
                        rows={3}
                      />
                      <div className="flex justify-between items-center">
                        <Button type="button" variant="outline" size="sm" className="text-xs">
                          Insert Template Response
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-600">
                          <Reply size={14} className="mr-2" /> Send Reply
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* Recent Activity */}
          <Card className="border-none shadow-md">
            <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-2">
              <CardTitle className="text-base sm:text-lg font-medium">Recent Engagements</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              {recentEngagements.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare size={40} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-muted-foreground">No recent engagements found.</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {recentEngagements.map((activity, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-2 sm:gap-4 pb-3 sm:pb-4 border-b last:border-0 hover:bg-slate-50 p-2 rounded-md transition-colors cursor-pointer"
                      onClick={() => openEngagementDetails(activity)}
                    >
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${activity.platformBg}`}>
                        {activity.platformIcon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate">{activity.title}</p>
                        <p className="text-xs sm:text-sm text-slate-600 truncate">"{activity.description}"</p>
                        <div className="flex justify-between items-center mt-1 sm:mt-2">
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                          {activity.hasResponse && (
                            <Badge className="text-xs bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                              Auto-response
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