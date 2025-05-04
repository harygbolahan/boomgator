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
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar, Clock, Image, Video, AlertCircle, Check, X, RefreshCw, ChevronRight, Copy, Eye } from "lucide-react";

const platformOptions = [
  { id: 1, name: "Facebook" },
  { id: 2, name: "Instagram" },
  { id: 3, name: "Twitter" },
  { id: 4, name: "LinkedIn" },
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
    media: [],
    preview: false
  });
  const [selectedTab, setSelectedTab] = useState("All");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

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

  // Handle file upload
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    
    // Create preview URLs for each file
    const newMedia = files.map(file => ({
      file,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      url: URL.createObjectURL(file),
      name: file.name
    }));
    
    setFormData(prev => ({
      ...prev,
      media: [...prev.media, ...newMedia]
    }));
  };
  
  // Remove media from the list
  const removeMedia = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, index) => index !== indexToRemove)
    }));
  };
  
  // Toggle preview mode
  const togglePreview = () => {
    setFormData(prev => ({
      ...prev,
      preview: !prev.preview
    }));
  };

  // Toggle preview modal
  const openPreviewModal = () => {
    if (!formData.platform_id) {
      toast.error("Please select a platform to preview");
      return;
    }
    setIsPreviewModalOpen(true);
  };

  // Close preview modal
  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
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
      
      // Organize media files
      let image_path = null;
      let video_path = null;
      
      // In a real implementation, we would upload these files to a server
      // Here we're just setting the paths as if they were uploaded
      if (formData.media.length > 0) {
        // Process media files (in a real app, you'd upload them to a server)
        formData.media.forEach(media => {
          if (media.type === 'image') {
            // In a real implementation, this would be the URL returned from server
            image_path = media.name; 
          } else if (media.type === 'video') {
            // In a real implementation, this would be the URL returned from server
            video_path = media.name;
          }
        });
      }
      
      // Prepare submission data
      const submissionData = {
        content: formData.content,
        scheduled_time: scheduledDateTime,
        status: formData.status,
        platform_id: parseInt(formData.platform_id),
        image_path: image_path,
        video_path: video_path,
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
        media: [],
        preview: false
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
  const filteredPosts = selectedTab === "All" 
    ? posts 
    : posts.filter(post => post.status.toLowerCase() === selectedTab.toLowerCase());

  return (
    <div className="mx-auto px-1 space-y-6 w-full max-w-[380px] sm:max-w-none">
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
                        <div className="flex items-center">
                          <span className={`mr-2 ${
                            platform.name === 'Facebook' ? 'text-blue-600' : 
                            platform.name === 'Instagram' ? 'text-pink-600' : 
                            platform.name === 'Twitter' ? 'text-blue-400' : 
                            platform.name === 'LinkedIn' ? 'text-blue-700' : ''
                          }`}>
                            {platform.name === 'Facebook' && <span className="text-lg">ⓕ</span>}
                            {platform.name === 'Instagram' && <span className="text-lg">📷</span>}
                            {platform.name === 'Twitter' && <span className="text-lg">𝕏</span>}
                            {platform.name === 'LinkedIn' && <span className="text-lg">in</span>}
                          </span>
                          {platform.name}
                        </div>
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
            
            {/* Media Upload Section */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Media</Label>
              <div className="border-2 border-dashed rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                {formData.media && formData.media.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {formData.media.map((item, index) => (
                      <div key={index} className="relative group">
                        {item.type === 'image' ? (
                          <img 
                            src={item.url} 
                            alt={item.name}
                            className="h-24 w-full object-cover rounded-md"
                          />
                        ) : (
                          <div className="h-24 w-full bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                            <Video className="w-8 h-8 text-gray-500" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeMedia(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <p className="text-xs mt-1 truncate">{item.name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Image className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Upload images or videos</p>
                  </div>
                )}
                <div className="mt-4 flex justify-center">
                  <label htmlFor="media-upload" className="cursor-pointer">
                    <div className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-4 py-2 rounded-md flex items-center hover:bg-blue-100 transition-colors">
                      <Image className="w-4 h-4 mr-2" />
                      <span>Upload Media</span>
                    </div>
                    <input
                      id="media-upload"
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Platform Preview Section */}
            {formData.platform_id && formData.preview && (
              <div className="mt-6 border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-lg">Preview</h3>
                </div>
                
                {formData.platform_id === "1" && (
                  <div className="border rounded-lg overflow-hidden bg-white">
                    <div className="p-3 border-b flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        <span className="text-xl font-bold">ⓕ</span>
                      </div>
                      <div>
                        <p className="font-medium">Your Page</p>
                        <p className="text-xs text-gray-500">
                          {formData.scheduled_date && formData.scheduled_time 
                            ? `Scheduled for ${formData.scheduled_date} at ${formData.scheduled_time}`
                            : "Just now"
                          }
                        </p>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="whitespace-pre-wrap mb-3">{formData.content || "Your post content will appear here"}</p>
                      {formData.media && formData.media.length > 0 && (
                        <div className={`grid ${formData.media.length > 1 ? 'grid-cols-2 gap-1' : 'grid-cols-1'}`}>
                          {formData.media.map((item, index) => (
                            <div key={index} className="aspect-video bg-gray-100 rounded overflow-hidden">
                              {item.type === 'image' ? (
                                <img src={item.url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <Video className="w-8 h-8 text-gray-500" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="p-3 border-t flex justify-around">
                      <button className="text-gray-600 flex items-center text-sm">
                        <span className="mr-1">👍</span> Like
                      </button>
                      <button className="text-gray-600 flex items-center text-sm">
                        <span className="mr-1">💬</span> Comment
                      </button>
                      <button className="text-gray-600 flex items-center text-sm">
                        <span className="mr-1">↗️</span> Share
                      </button>
                    </div>
                  </div>
                )}

                {formData.platform_id === "2" && (
                  <div className="border rounded-lg overflow-hidden bg-white max-w-md mx-auto">
                    <div className="p-3 border-b flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 flex items-center justify-center text-white mr-3">
                        <span className="text-xs">📷</span>
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-sm">your_instagram</p>
                      </div>
                      <button className="text-gray-500">•••</button>
                    </div>
                    
                    {formData.media && formData.media.length > 0 ? (
                      <div className="aspect-square bg-black">
                        {formData.media[0].type === 'image' ? (
                          <img src={formData.media[0].url} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-800">
                            <Video className="w-12 h-12 text-white" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-square bg-gray-100 flex items-center justify-center">
                        <p className="text-gray-400">No media to display</p>
                      </div>
                    )}
                    
                    <div className="p-3">
                      <div className="flex justify-between mb-2">
                        <div className="flex space-x-4">
                          <span>❤️</span>
                          <span>💬</span>
                          <span>↗️</span>
                        </div>
                        <span>🔖</span>
                      </div>
                      <p className="text-sm mb-1"><strong>your_instagram</strong> {formData.content || "Your caption will appear here"}</p>
                      <p className="text-xs text-gray-500">
                        {formData.scheduled_date 
                          ? `Will be posted on ${formData.scheduled_date}`
                          : "Just now"
                        }
                      </p>
                    </div>
                  </div>
                )}

                {formData.platform_id === "3" && (
                  <div className="border rounded-lg overflow-hidden bg-white">
                    <div className="p-3 flex">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-400 mr-3">
                        <span className="text-xl font-bold">𝕏</span>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium">Your Name</p>
                          <p className="text-gray-500 text-sm ml-1">@your_handle</p>
                        </div>
                        <p className="whitespace-pre-wrap mt-1">{formData.content || "Your tweet will appear here"}</p>
                        
                        {formData.media && formData.media.length > 0 && (
                          <div className="mt-2 rounded-lg overflow-hidden border">
                            {formData.media[0].type === 'image' ? (
                              <img src={formData.media[0].url} alt="" className="w-full max-h-80 object-cover" />
                            ) : (
                              <div className="w-full h-60 flex items-center justify-center bg-gray-100">
                                <Video className="w-10 h-10 text-gray-500" />
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="mt-3 flex space-x-8 text-gray-500 text-sm">
                          <span>💬 0</span>
                          <span>🔁 0</span>
                          <span>❤️ 0</span>
                          <span>📊 0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {formData.platform_id === "4" && (
                  <div className="border rounded-lg overflow-hidden bg-white">
                    <div className="p-3 border-b flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                        <span className="text-xl font-bold">in</span>
                      </div>
                      <div>
                        <p className="font-medium">Your Name</p>
                        <p className="text-xs text-gray-500">
                          Your Title • {formData.scheduled_date 
                            ? `Scheduled for ${formData.scheduled_date}`
                            : "Just now"
                          }
                        </p>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="whitespace-pre-wrap mb-3">{formData.content || "Your post content will appear here"}</p>
                      {formData.media && formData.media.length > 0 && (
                        <div className="rounded overflow-hidden border">
                          {formData.media[0].type === 'image' ? (
                            <img src={formData.media[0].url} alt="" className="w-full max-h-80 object-cover" />
                          ) : (
                            <div className="w-full h-60 flex items-center justify-center bg-gray-100">
                              <Video className="w-10 h-10 text-gray-500" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="p-3 border-t flex justify-around">
                      <button className="text-gray-600 flex items-center text-sm">
                        <span className="mr-1">👍</span> Like
                      </button>
                      <button className="text-gray-600 flex items-center text-sm">
                        <span className="mr-1">💬</span> Comment
                      </button>
                      <button className="text-gray-600 flex items-center text-sm">
                        <span className="mr-1">↗️</span> Share
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-gray-500 mt-2 text-center">
                  This is a preview and may differ slightly from the actual post appearance
                </div>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="bg-gray-50 dark:bg-gray-800 flex justify-between">
          <Button
            variant="outline"
            onClick={openPreviewModal}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4 mr-1" />
            Preview Post
          </Button>
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Scheduled Posts
              </CardTitle>
              <CardDescription>
                Manage your scheduled social media content
              </CardDescription>
            </div>
            
            <Select 
              value={selectedTab} 
              onValueChange={setSelectedTab}
              className="w-full sm:w-[180px]"
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Posts</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Posted">Posted</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-lg text-gray-500">No {selectedTab === "All" ? "" : selectedTab} posts found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPosts.map((post) => {
                const platform = platformOptions.find(p => p.id === post.platform_id)?.name || "Unknown";
                const statusColor = statusColors[post.status] || "bg-gray-100 text-gray-800 border-gray-200";
                const statusIcon = statusIcons[post.status];
                
                return (
                  <div 
                    key={post.id} 
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md"
                  >
                    {/* Card Header with Platform and Status */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {platform}
                      </span>
                      <Badge className={`flex items-center px-3 py-1 ${statusColor} border`}>
                        {statusIcon}
                        {post.status}
                      </Badge>
                    </div>
                    
                    {/* Card Body with Content */}
                    <div className="p-4">
                      <div className="mb-4">
                        <div className="line-clamp-3 text-sm font-medium mb-2">{post.content}</div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-0 h-auto"
                          onClick={() => copyPostContent(post.content)}
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy text
                        </Button>
                      </div>
                      
                      {/* Schedule Time */}
                      <div className="flex items-center mb-3 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        {format(parseISO(post.scheduled_time), "MMM d, yyyy 'at' h:mm a")}
                      </div>
                      
                      {/* Media Indicators */}
                      {(post.image_path || post.video_path) && (
                        <div className="flex gap-2 mb-3">
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
                        </div>
                      )}
                    </div>
                    
                    {/* Card Footer with Actions */}
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-sm"
                        onClick={() => fetchPostById(post.id)}
                      >
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
        
        {filteredPosts.length > 0 && (
          <CardFooter className="bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredPosts.length} {selectedTab === "All" ? "total" : selectedTab} posts
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefreshPosts}
              className="flex items-center gap-2"
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </CardFooter>
        )}
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
      
      {/* Preview Post Dialog */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Post Preview</DialogTitle>
            <DialogDescription>
              Preview how your post will look on {
                formData.platform_id === "1" ? "Facebook" :
                formData.platform_id === "2" ? "Instagram" :
                formData.platform_id === "3" ? "Twitter" :
                formData.platform_id === "4" ? "LinkedIn" : "social media"
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {formData.platform_id === "1" && (
              <div className="border rounded-lg overflow-hidden bg-white">
                <div className="p-3 border-b flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    <span className="text-xl font-bold">ⓕ</span>
                  </div>
                  <div>
                    <p className="font-medium">Your Page</p>
                    <p className="text-xs text-gray-500">
                      {formData.scheduled_date && formData.scheduled_time 
                        ? `Scheduled for ${formData.scheduled_date} at ${formData.scheduled_time}`
                        : "Just now"
                      }
                    </p>
                  </div>
                </div>
                <div className="p-3">
                  <p className="whitespace-pre-wrap mb-3">{formData.content || "Your post content will appear here"}</p>
                  {formData.media && formData.media.length > 0 && (
                    <div className={`grid ${formData.media.length > 1 ? 'grid-cols-2 gap-1' : 'grid-cols-1'}`}>
                      {formData.media.map((item, index) => (
                        <div key={index} className="aspect-video bg-gray-100 rounded overflow-hidden">
                          {item.type === 'image' ? (
                            <img src={item.url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <Video className="w-8 h-8 text-gray-500" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-3 border-t flex justify-around">
                  <button className="text-gray-600 flex items-center text-sm">
                    <span className="mr-1">👍</span> Like
                  </button>
                  <button className="text-gray-600 flex items-center text-sm">
                    <span className="mr-1">💬</span> Comment
                  </button>
                  <button className="text-gray-600 flex items-center text-sm">
                    <span className="mr-1">↗️</span> Share
                  </button>
                </div>
              </div>
            )}

            {formData.platform_id === "2" && (
              <div className="border rounded-lg overflow-hidden bg-white max-w-md mx-auto">
                <div className="p-3 border-b flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 flex items-center justify-center text-white mr-3">
                    <span className="text-xs">📷</span>
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-sm">your_instagram</p>
                  </div>
                  <button className="text-gray-500">•••</button>
                </div>
                
                {formData.media && formData.media.length > 0 ? (
                  <div className="aspect-square bg-black">
                    {formData.media[0].type === 'image' ? (
                      <img src={formData.media[0].url} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <Video className="w-12 h-12 text-white" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-400">No media to display</p>
                  </div>
                )}
                
                <div className="p-3">
                  <div className="flex justify-between mb-2">
                    <div className="flex space-x-4">
                      <span>❤️</span>
                      <span>💬</span>
                      <span>↗️</span>
                    </div>
                    <span>🔖</span>
                  </div>
                  <p className="text-sm mb-1"><strong>your_instagram</strong> {formData.content || "Your caption will appear here"}</p>
                  <p className="text-xs text-gray-500">
                    {formData.scheduled_date 
                      ? `Will be posted on ${formData.scheduled_date}`
                      : "Just now"
                    }
                  </p>
                </div>
              </div>
            )}

            {formData.platform_id === "3" && (
              <div className="border rounded-lg overflow-hidden bg-white">
                <div className="p-3 flex">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-400 mr-3">
                    <span className="text-xl font-bold">𝕏</span>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium">Your Name</p>
                      <p className="text-gray-500 text-sm ml-1">@your_handle</p>
                    </div>
                    <p className="whitespace-pre-wrap mt-1">{formData.content || "Your tweet will appear here"}</p>
                    
                    {formData.media && formData.media.length > 0 && (
                      <div className="mt-2 rounded-lg overflow-hidden border">
                        {formData.media[0].type === 'image' ? (
                          <img src={formData.media[0].url} alt="" className="w-full max-h-80 object-cover" />
                        ) : (
                          <div className="w-full h-60 flex items-center justify-center bg-gray-100">
                            <Video className="w-10 h-10 text-gray-500" />
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-3 flex space-x-8 text-gray-500 text-sm">
                      <span>💬 0</span>
                      <span>🔁 0</span>
                      <span>❤️ 0</span>
                      <span>📊 0</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {formData.platform_id === "4" && (
              <div className="border rounded-lg overflow-hidden bg-white">
                <div className="p-3 border-b flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                    <span className="text-xl font-bold">in</span>
                  </div>
                  <div>
                    <p className="font-medium">Your Name</p>
                    <p className="text-xs text-gray-500">
                      Your Title • {formData.scheduled_date 
                        ? `Scheduled for ${formData.scheduled_date}`
                        : "Just now"
                      }
                    </p>
                  </div>
                </div>
                <div className="p-3">
                  <p className="whitespace-pre-wrap mb-3">{formData.content || "Your post content will appear here"}</p>
                  {formData.media && formData.media.length > 0 && (
                    <div className="rounded overflow-hidden border">
                      {formData.media[0].type === 'image' ? (
                        <img src={formData.media[0].url} alt="" className="w-full max-h-80 object-cover" />
                      ) : (
                        <div className="w-full h-60 flex items-center justify-center bg-gray-100">
                          <Video className="w-10 h-10 text-gray-500" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="p-3 border-t flex justify-around">
                  <button className="text-gray-600 flex items-center text-sm">
                    <span className="mr-1">👍</span> Like
                  </button>
                  <button className="text-gray-600 flex items-center text-sm">
                    <span className="mr-1">💬</span> Comment
                  </button>
                  <button className="text-gray-600 flex items-center text-sm">
                    <span className="mr-1">↗️</span> Share
                  </button>
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500 mt-4 text-center">
              This is a preview and may differ slightly from the actual post appearance
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={closePreviewModal}
              className="mt-2"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentSchedulerPage; 