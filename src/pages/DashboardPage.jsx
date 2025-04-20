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
  Reply
} from "lucide-react";
import { useState } from "react";
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

export function DashboardPage() {
  // State for dialogs
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isExportDataOpen, setIsExportDataOpen] = useState(false);
  const [isEditPostOpen, setIsEditPostOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [isEditAutomationOpen, setIsEditAutomationOpen] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState(null);
  const [isViewEngagementOpen, setIsViewEngagementOpen] = useState(false);
  const [viewingEngagement, setViewingEngagement] = useState(null);
  
  // Export Data functionality
  const handleExportData = (format) => {
    // In a real app, this would trigger an API call to generate the export
    console.log(`Exporting data in ${format} format`);
    // Mock download by creating a temporary anchor element
    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('download', `social_dashboard_export_${new Date().toISOString().split('T')[0]}.${format}`);
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your social media automation.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Export Data functionality */}
          <Dialog open={isExportDataOpen} onOpenChange={setIsExportDataOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50">
                <Download size={16} className="mr-2" /> Export Data
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Dashboard Data</DialogTitle>
                <DialogDescription>
                  Choose the format for your data export
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={() => handleExportData('csv')} variant="outline" className="flex items-center gap-2">
                    <Download size={16} /> CSV Format
                  </Button>
                  <Button onClick={() => handleExportData('xlsx')} variant="outline" className="flex items-center gap-2">
                    <Download size={16} /> Excel Format
                  </Button>
                  <Button onClick={() => handleExportData('pdf')} variant="outline" className="flex items-center gap-2">
                    <Download size={16} /> PDF Report
                  </Button>
                  <Button onClick={() => handleExportData('json')} variant="outline" className="flex items-center gap-2">
                    <Download size={16} /> JSON Data
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
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <Plus size={16} className="mr-2" /> Add Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect Social Media Account</DialogTitle>
                <DialogDescription>
                  Link your social media profiles to enable automation
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddAccount}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="platform" className="text-sm font-medium">Platform</label>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" className="flex-1 flex items-center gap-2 justify-center">
                        <Facebook size={18} /> Facebook
                      </Button>
                      <Button type="button" variant="outline" className="flex-1 flex items-center gap-2 justify-center">
                        <Instagram size={18} /> Instagram
                      </Button>
                      <Button type="button" variant="outline" className="flex-1 flex items-center gap-2 justify-center">
                        <Twitter size={18} /> Twitter
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
                  <Button type="button" variant="outline" onClick={() => setIsAddAccountOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-600">Connect Account</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="overflow-hidden border-none shadow-md transition-all duration-200 hover:shadow-lg">
            <div className={`h-1 w-full ${stat.accentColor}`}></div>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.iconBg} ${stat.iconColor}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-2xl font-bold">{stat.value}</p>
                <div className="flex items-center gap-1">
                  <span className={`flex items-center gap-1 ${stat.trend === "up" ? "text-emerald-600" : "text-rose-600"}`}>
                    {stat.trend === "up" ? <ArrowUp size={14} /> : <ArrowDown size={14} />} {stat.change}
                  </span>
                  <span className="text-sm text-muted-foreground">vs last week</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Automation Dialog */}
      <Dialog open={isEditAutomationOpen} onOpenChange={setIsEditAutomationOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Automation</DialogTitle>
            <DialogDescription>
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
                    onChange={(e) => setEditingAutomation({...editingAutomation, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="type" className="text-sm font-medium">Type</label>
                  <Input 
                    id="type" 
                    defaultValue={editingAutomation.type} 
                    onChange={(e) => setEditingAutomation({...editingAutomation, type: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="status" className="text-sm font-medium">Status</label>
                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant={editingAutomation.status === "Active" ? "default" : "outline"}
                      className={editingAutomation.status === "Active" ? "bg-emerald-600" : ""}
                      onClick={() => setEditingAutomation({...editingAutomation, status: "Active"})}
                    >
                      <CheckCircle size={16} className="mr-2" /> Active
                    </Button>
                    <Button 
                      type="button" 
                      variant={editingAutomation.status === "Paused" ? "default" : "outline"}
                      className={editingAutomation.status === "Paused" ? "bg-amber-600" : ""}
                      onClick={() => setEditingAutomation({...editingAutomation, status: "Paused"})}
                    >
                      <XCircle size={16} className="mr-2" /> Paused
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Platforms</label>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" className="flex items-center gap-1">
                      <Facebook size={16} /> Facebook
                    </Button>
                    <Button type="button" variant="outline" className="flex items-center gap-1">
                      <Instagram size={16} /> Instagram
                    </Button>
                    <Button type="button" variant="outline" className="flex items-center gap-1">
                      <Twitter size={16} /> Twitter
                    </Button>
                  </div>
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

      {/* Active Automations */}
      <Card className="border-none shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Active Automations</CardTitle>
          <Link to="/automation">
            <Button variant="outline" size="sm" className="border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50">
              View All <ExternalLink size={14} className="ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto rounded-md">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3 font-medium text-muted-foreground">Name</th>
                  <th className="pb-3 font-medium text-muted-foreground">Type</th>
                  <th className="pb-3 font-medium text-muted-foreground">Platform</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 font-medium text-muted-foreground">Triggers</th>
                  <th className="pb-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeAutomations.map((automation, index) => (
                  <tr key={index} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="py-4 font-medium">{automation.name}</td>
                    <td className="py-4">{automation.type}</td>
                    <td className="py-4 flex items-center gap-1">
                      {automation.platformIcons.map((icon, i) => (
                        <span key={i} className="text-slate-700">{icon}</span>
                      ))}
                    </td>
                    <td className="py-4">
                      <Badge className={automation.status === "Active" 
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" 
                        : "bg-amber-100 text-amber-800 hover:bg-amber-200"}>
                        {automation.status}
                      </Badge>
                    </td>
                    <td className="py-4">{automation.triggers}</td>
                    <td className="py-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                        onClick={() => openEditAutomation(automation)}
                      >
                        <Edit size={16} className="mr-1" /> Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Post Dialog */}
      <Dialog open={isEditPostOpen} onOpenChange={setIsEditPostOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Scheduled Post</DialogTitle>
            <DialogDescription>
              Make changes to your upcoming post
            </DialogDescription>
          </DialogHeader>
          {editingPost && (
            <form onSubmit={handleEditPost}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="post-title" className="text-sm font-medium">Post Title</label>
                  <Input 
                    id="post-title" 
                    defaultValue={editingPost.title}
                    onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="post-content" className="text-sm font-medium">Content</label>
                  <Textarea 
                    id="post-content" 
                    rows={4} 
                    defaultValue="This is our new product launch! #newproduct #launch"
                    onChange={(e) => console.log(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="post-date" className="text-sm font-medium">Date & Time</label>
                  <div className="flex gap-2">
                    <Input 
                      id="post-date" 
                      type="date" 
                      className="flex-1" 
                      defaultValue={new Date().toISOString().split('T')[0]}
                    />
                    <Input 
                      id="post-time" 
                      type="time"
                      className="flex-1"
                      defaultValue={editingPost.time.split(', ')[1]}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${editingPost.platformBg}`}>
                      {editingPost.platformIcon}
                    </div>
                    <span className="text-sm font-medium">
                      {editingPost.platformIcon.type === Instagram ? "Instagram" : 
                       editingPost.platformIcon.type === Twitter ? "Twitter" : "Facebook"}
                    </span>
                  </div>
                  <Button type="button" variant="outline" size="sm" className="flex items-center gap-1">
                    <Share2 size={14} /> Add Platform
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditPostOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-600">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Two columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scheduled Posts */}
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Upcoming Scheduled Posts</CardTitle>
            <Link to="/calendar">
              <Button variant="outline" size="sm" className="border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50">
                View Calendar <Calendar size={14} className="ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduledPosts.map((post, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0 hover:bg-slate-50 p-2 rounded-md transition-colors">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${post.platformBg}`}>
                    {post.platformIcon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{post.title}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar size={14} /> {post.time}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                          onClick={() => openEditPost(post)}
                        >
                          <Edit size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* View Engagement Dialog */}
        <Dialog open={isViewEngagementOpen} onOpenChange={setIsViewEngagementOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Engagement Details</DialogTitle>
              <DialogDescription>
                View and respond to this engagement
              </DialogDescription>
            </DialogHeader>
            {viewingEngagement && (
              <>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${viewingEngagement.platformBg}`}>
                    {viewingEngagement.platformIcon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{viewingEngagement.title}</p>
                    <p className="text-sm text-slate-600 mt-1">"{viewingEngagement.description}"</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-muted-foreground">{viewingEngagement.time}</span>
                      {viewingEngagement.hasResponse && (
                        <Badge className="bg-emerald-100 text-emerald-800">
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
                      <p className="text-sm">Thank you for your interest! Yes, our product is available in red color. Would you like more information about it?</p>
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
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Recent Engagements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEngagements.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-4 pb-4 border-b last:border-0 hover:bg-slate-50 p-2 rounded-md transition-colors cursor-pointer"
                  onClick={() => openEngagementDetails(activity)}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${activity.platformBg}`}>
                    {activity.platformIcon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-slate-600">"{activity.description}"</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                      {activity.hasResponse && (
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                          Auto-response sent
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Sample data
const quickStats = [
  {
    title: "Total Followers",
    value: "24,532",
    change: "12%",
    trend: "up",
    icon: <Users size={20} />,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
    accentColor: "bg-gradient-to-r from-blue-500 to-blue-600"
  },
  {
    title: "Engagements",
    value: "1,429",
    change: "8%",
    trend: "up",
    icon: <Heart size={20} />,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-700",
    accentColor: "bg-gradient-to-r from-rose-500 to-rose-600"
  },
  {
    title: "Scheduled Posts",
    value: "18",
    change: "3",
    trend: "up",
    icon: <Calendar size={20} />,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-700",
    accentColor: "bg-gradient-to-r from-purple-500 to-purple-600"
  },
  {
    title: "Active Automations",
    value: "7",
    change: "2",
    trend: "up",
    icon: <Bot size={20} />,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
    accentColor: "bg-gradient-to-r from-amber-500 to-amber-600"
  }
];

const activeAutomations = [
  {
    name: "Comment Responder",
    type: "Comment",
    platform: "Facebook, Instagram",
    platformIcons: [<Facebook size={16} />, <Instagram size={16} />],
    status: "Active",
    triggers: "24 today"
  },
  {
    name: "DM Welcome",
    type: "Message",
    platform: "Instagram",
    platformIcons: [<Instagram size={16} />],
    status: "Active",
    triggers: "12 today"
  },
  {
    name: "Product Inquiry",
    type: "Keyword",
    platform: "All Platforms",
    platformIcons: [<Facebook size={16} />, <Instagram size={16} />, <Twitter size={16} />],
    status: "Paused",
    triggers: "0 today"
  },
  {
    name: "Story Mentions",
    type: "Story",
    platform: "Instagram",
    platformIcons: [<Instagram size={16} />],
    status: "Active",
    triggers: "8 today"
  }
];

const scheduledPosts = [
  {
    title: "Weekly Product Showcase",
    time: "Today, 2:00 PM",
    platformIcon: <Instagram size={20} className="text-white" />,
    platformBg: "bg-gradient-to-r from-pink-500 to-orange-500"
  },
  {
    title: "Customer Testimonial",
    time: "Tomorrow, 10:30 AM",
    platformIcon: <Twitter size={20} className="text-white" />,
    platformBg: "bg-gradient-to-r from-blue-500 to-cyan-500"
  },
  {
    title: "New Product Launch",
    time: "Aug 15, 9:00 AM",
    platformIcon: <Facebook size={20} className="text-white" />,
    platformBg: "bg-gradient-to-r from-indigo-500 to-blue-500"
  }
];

const recentEngagements = [
  {
    title: "New Comment on Ad",
    description: "Is this product available in red color?",
    time: "2 hours ago",
    platformIcon: <Facebook size={20} className="text-white" />,
    platformBg: "bg-gradient-to-r from-indigo-500 to-blue-500",
    hasResponse: true
  },
  {
    title: "Direct Message",
    description: "I'd like to know more about your pricing",
    time: "3 hours ago",
    platformIcon: <Instagram size={20} className="text-white" />,
    platformBg: "bg-gradient-to-r from-pink-500 to-orange-500",
    hasResponse: true
  },
  {
    title: "Story Mention",
    description: "@yourbrand was mentioned in a story",
    time: "5 hours ago",
    platformIcon: <Instagram size={20} className="text-white" />,
    platformBg: "bg-gradient-to-r from-pink-500 to-orange-500",
    hasResponse: false
  }
]; 