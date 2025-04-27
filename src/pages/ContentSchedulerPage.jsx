import { useState, useEffect } from 'react';
import { schedulerService } from '@/lib/api';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Clock, Image, Video, AlertCircle, Check, X, RefreshCw, ChevronRight, Copy } from "lucide-react";

const platformOptions = [
  { id: 1, name: "Facebook" },
  { id: 2, name: "Instagram" },
  { id: 3, name: "Twitter" },
];

const statusColors = {
  Scheduled: "bg-blue-100 text-blue-800 border-blue-200",
  Posted: "bg-green-100 text-green-800 border-green-200",
  Cancelled: "bg-red-100 text-red-800 border-red-200",
};

const statusIcons = {
  Scheduled: <Clock className="w-4 h-4 mr-1" />,
  Posted: <Check className="w-4 h-4 mr-1" />,
  Cancelled: <X className="w-4 h-4 mr-1" />,
};

export const ContentSchedulerPage = () => {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    content: "",
    scheduled_time: "",
    scheduled_date: "",
    platform_id: "",
    status: "Scheduled",
    image_path: null,
    video_path: null,
  });
  const [selectedTab, setSelectedTab] = useState("all");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch scheduled posts on component mount
  useEffect(() => {
    if (token) {
      fetchScheduledPosts();
    }
  }, [token]);

  // Function to fetch all scheduled posts
  const fetchScheduledPosts = async () => {
    setLoading(true);
    try {
      const data = await schedulerService.getScheduledPosts();
      setPosts(data || []);
    } catch (error) {
      toast.error("Failed to load scheduled posts");
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh posts with animation
  const handleRefreshPosts = async () => {
    setRefreshing(true);
    try {
      await fetchScheduledPosts();
      toast.success("Posts refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh posts");
    } finally {
      setTimeout(() => setRefreshing(false), 600);
    }
  };

  // Function to fetch a specific post by ID
  const fetchPostById = async (postId) => {
    try {
      const post = await schedulerService.getScheduledPostById(postId);
      setSelectedPost(post);
      setIsViewDialogOpen(true);
    } catch (error) {
      toast.error("Failed to load post details");
      console.error("Error fetching post:", error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle platform selection change
  const handlePlatformChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      platform_id: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.content.trim()) {
      toast.error("Content is required");
      return;
    }
    
    if (!formData.platform_id) {
      toast.error("Please select a platform");
      return;
    }
    
    if (!formData.scheduled_date || !formData.scheduled_time) {
      toast.error("Scheduled date and time are required");
      return;
    }
    
    setSubmitLoading(true);
    
    try {
      // Combine date and time fields
      const scheduledDateTime = `${formData.scheduled_date} ${formData.scheduled_time}:00`;
      
      // Prepare submission data
      const submissionData = {
        content: formData.content,
        scheduled_time: scheduledDateTime,
        status: formData.status,
        platform_id: parseInt(formData.platform_id),
        image_path: formData.image_path,
        video_path: formData.video_path,
      };
      
      // Submit the form data
      await schedulerService.createScheduledPost(submissionData);
      
      // Show success message
      toast.success("Post scheduled successfully");
      
      // Reset form
      setFormData({
        content: "",
        scheduled_time: "",
        scheduled_date: "",
        platform_id: "",
        status: "Scheduled",
        image_path: null,
        video_path: null,
      });
      
      // Refresh posts list
      fetchScheduledPosts();
      
    } catch (error) {
      toast.error(error.message || "Failed to schedule post");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Copy post content to clipboard
  const copyPostContent = (content) => {
    navigator.clipboard.writeText(content);
    toast.success("Content copied to clipboard");
  };

  // Filter posts based on selected tab
  const filteredPosts = selectedTab === "all" 
    ? posts 
    : posts.filter(post => post.status.toLowerCase() === selectedTab.toLowerCase());

  return (
    <div className="mx-auto p-4 space-y-6 w-full max-w-[350px] sm:max-w-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Content Scheduler</h1>
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={handleRefreshPosts}
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {/* Create New Scheduled Post Form */}
      <Card className="shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
          <CardTitle className="text-xl flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Schedule New Content
          </CardTitle>
          <CardDescription>
            Create a new scheduled post for your social media platforms
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content" className="text-base font-medium">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Enter your post content here..."
                className="min-h-[120px] resize-y"
              />
            </div>
            
            {/* Adjust grid layout for responsiveness */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="platform" className="text-base font-medium">Platform</Label>
                <Select 
                  value={formData.platform_id} 
                  onValueChange={handlePlatformChange}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select a platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platformOptions.map((platform) => (
                      <SelectItem key={platform.id} value={platform.id.toString()}>
                        {platform.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Nested grid for Date and Time to stack until medium screen */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduled_date" className="text-base font-medium">Date</Label>
                  <Input
                    id="scheduled_date"
                    name="scheduled_date"
                    type="date"
                    value={formData.scheduled_date}
                    onChange={handleInputChange}
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="scheduled_time" className="text-base font-medium">Time</Label>
                  <Input
                    id="scheduled_time"
                    name="scheduled_time"
                    type="time"
                    value={formData.scheduled_time}
                    onChange={handleInputChange}
                    className="h-11"
                  />
                </div>
              </div>
            </div>
            
            {/* Note: In a real implementation, add file upload functionality for images/videos */}
          </form>
        </CardContent>
        <CardFooter className="bg-gray-50 dark:bg-gray-800 flex justify-end">
          <Button 
            onClick={handleSubmit} 
            disabled={submitLoading}
            className="px-6"
            size="lg"
          >
            {submitLoading ? "Scheduling..." : "Schedule Post"}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Scheduled Posts List */}
      <Card className="shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
          <CardTitle className="text-xl flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Scheduled Posts
          </CardTitle>
          <CardDescription className="mb-4">
            Manage your scheduled social media content
          </CardDescription>
          
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-2">
            <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:grid-cols-4 gap-1">
              <TabsTrigger value="all" className="px-4 py-2">All</TabsTrigger>
              <TabsTrigger value="scheduled" className="px-4 py-2">Scheduled</TabsTrigger>
              <TabsTrigger value="posted" className="px-4 py-2">Posted</TabsTrigger>
              <TabsTrigger value="cancelled" className="px-4 py-2">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-lg text-gray-500">No {selectedTab === "all" ? "" : selectedTab} posts found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                    <th className="p-4 font-medium">Content</th>
                    <th className="p-4 font-medium">Platform</th>
                    <th className="p-4 font-medium">Scheduled For</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Media</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="p-4 max-w-[300px]">
                        <div className="line-clamp-2">{post.content}</div>
                      </td>
                      <td className="p-4">
                        {platformOptions.find(p => p.id === post.platform_id)?.name || "Unknown"}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {format(parseISO(post.scheduled_time), "MMM d, yyyy 'at' h:mm a")}
                      </td>
                      <td className="p-4">
                        <Badge 
                          className={`flex items-center px-3 py-1 ${statusColors[post.status] || "bg-gray-100 text-gray-800 border-gray-200"} border`}
                        >
                          {statusIcons[post.status]}
                          {post.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          {post.image_path && (
                            <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1 flex items-center">
                              <Image className="w-3 h-3 mr-1" />
                              Image
                            </span>
                          )}
                          {post.video_path && (
                            <span className="text-xs bg-purple-100 text-purple-800 rounded-full px-2 py-1 flex items-center">
                              <Video className="w-3 h-3 mr-1" />
                              Video
                            </span>
                          )}
                          {!post.image_path && !post.video_path && (
                            <span className="text-xs text-gray-500">None</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => copyPostContent(post.content)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => fetchPostById(post.id)}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Post Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Post Details</DialogTitle>
            <DialogDescription>
              View the details of your scheduled post
            </DialogDescription>
          </DialogHeader>
          
          {selectedPost && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Content</h3>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="whitespace-pre-wrap">{selectedPost.content}</p>
                    </div>
                  </div>
                  
                  {(selectedPost.image_path || selectedPost.video_path) && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Media</h3>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        {selectedPost.image_path && (
                          <div className="flex items-center gap-2 text-blue-600">
                            <Image className="w-5 h-5" />
                            <span>{selectedPost.image_path}</span>
                          </div>
                        )}
                        {selectedPost.video_path && (
                          <div className="flex items-center gap-2 text-purple-600 mt-2">
                            <Video className="w-5 h-5" />
                            <span>{selectedPost.video_path}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Platform</h3>
                    <p className="font-medium">
                      {platformOptions.find(p => p.id === selectedPost.platform_id)?.name || "Unknown"}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</h3>
                    <Badge 
                      className={`flex items-center px-3 py-1 ${statusColors[selectedPost.status] || "bg-gray-100 text-gray-800 border-gray-200"} border`}
                    >
                      {statusIcons[selectedPost.status]}
                      {selectedPost.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Scheduled For</h3>
                    <p className="font-medium">
                      {format(parseISO(selectedPost.scheduled_time), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Created</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {format(parseISO(selectedPost.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Last Updated</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {format(parseISO(selectedPost.updated_at), "MMM d, yyyy")}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Post ID</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{selectedPost.id}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  variant="outline" 
                  onClick={() => copyPostContent(selectedPost.content)}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Content
                </Button>
                
                <Button 
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentSchedulerPage; 