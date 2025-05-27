import { useState, useEffect, useRef } from 'react';
import { useBoom } from '@/contexts/BoomContext';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';
import { FileText } from "lucide-react";
import { withSubscription } from '@/components/ui/withSubscription';

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
import { Calendar, Clock, Image, Video, AlertCircle, Check, X, RefreshCw, ChevronRight, Copy, Trash2, Plus, Sparkles, Edit } from "lucide-react";

const statusColors = {
  Scheduled: "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-300 dark:border-blue-700/50",
  Posted: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 dark:from-green-900/40 dark:to-emerald-900/40 dark:text-green-300 dark:border-green-700/50",
  Cancelled: "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200 dark:from-red-900/40 dark:to-pink-900/40 dark:text-red-300 dark:border-red-700/50",
};

const statusIcons = {
  Scheduled: <Clock className="w-3.5 h-3.5 mr-1.5" />,
  Posted: <Check className="w-3.5 h-3.5 mr-1.5" />,
  Cancelled: <X className="w-3.5 h-3.5 mr-1.5" />,
};

const platformColors = {
  Facebook: "bg-blue-600",
  Instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
  Twitter: "bg-sky-500",
};

export const ContentSchedulerPageBase = () => {
  const { token } = useAuth();
  const { 
    getScheduledPosts, 
    getScheduledPostById, 
    createScheduledPost,
    deleteScheduledPost,
    platforms,
    loadingPlatforms,
    getPlatforms,
    pages,
    loadingPages,
    getPages
  } = useBoom();
  
  // File input references
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formData, setFormData] = useState({
    content: "",
    scheduled_time: "",
    scheduled_date: "",
    platform_id: "",
    page_id: "",
    status: "Scheduled",
    image_path: null,
    video_path: null,
  });
  const [statusFilter, setStatusFilter] = useState("All");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filteredPages, setFilteredPages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Fetch scheduled posts, platforms and pages on component mount
  useEffect(() => {
    if (token) {
      fetchScheduledPosts();
      fetchPlatforms();
      fetchPages();
    }
  }, [token]);

  // Function to fetch all scheduled posts
  const fetchScheduledPosts = async () => {
    setLoading(true);
    try {
      const data = await getScheduledPosts();
      setPosts(data || []);
    } catch (error) {
      toast.error("Failed to load scheduled posts");
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to fetch all platforms
  const fetchPlatforms = async () => {
    try {
      await getPlatforms();
    } catch (error) {
      toast.error("Failed to load platforms");
      console.error("Error fetching platforms:", error);
    }
  };
  
  // Function to fetch all pages
  const fetchPages = async () => {
    try {
      await getPages();
    } catch (error) {
      toast.error("Failed to load pages");
      console.error("Error fetching pages:", error);
    }
  };

  // Filter pages based on selected platform
  useEffect(() => {
    if (formData.platform_id && pages.length > 0) {
      const filtered = pages.filter(page => 
        page.platform_id === formData.platform_id
      );
      setFilteredPages(filtered);
    } else {
      setFilteredPages([]);
    }
  }, [formData.platform_id, pages]);

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
      const post = await getScheduledPostById(postId);
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
      page_id: "", // Reset page_id when platform changes
    }));
  };
  
  // Handle page selection change
  const handlePageChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      page_id: value,
    }));
  };

  // Handlers for file inputs
  const handleImageClick = () => {
    imageInputRef.current?.click();
  };
  
  const handleVideoClick = () => {
    videoInputRef.current?.click();
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file is too large. Maximum size is 5MB.");
      return;
    }
    
    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      toast.error("Invalid image format. Please use JPG, PNG, GIF or WEBP.");
      return;
    }
    
    // Update form data with the image file
    setSelectedImage(file);
    setFormData((prev) => ({
      ...prev,
      image_path: file,
    }));
    
    toast.success(`Image "${file.name}" selected`);
  };
  
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file size (20MB max)
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Video file is too large. Maximum size is 20MB.");
      return;
    }
    
    // Validate file type
    const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/mpeg'];
    if (!validVideoTypes.includes(file.type)) {
      toast.error("Invalid video format. Please use MP4, MOV or MPEG.");
      return;
    }
    
    // Update form data with the video file
    setSelectedVideo(file);
    setFormData((prev) => ({
      ...prev,
      video_path: file,
    }));
    
    toast.success(`Video "${file.name}" selected`);
  };
  
  const clearSelectedMedia = (type) => {
    if (type === 'image') {
      setSelectedImage(null);
      setFormData((prev) => ({
        ...prev,
        image_path: null,
      }));
      // Reset file input
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    } else if (type === 'video') {
      setSelectedVideo(null);
      setFormData((prev) => ({
        ...prev,
        video_path: null,
      }));
      // Reset file input
      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }
    }
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
    
    if (!formData.page_id) {
      toast.error("Please select a page");
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
      
      // Create FormData object to properly handle file uploads
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('content', formData.content);
      formDataToSubmit.append('scheduled_time', scheduledDateTime);
      formDataToSubmit.append('status', 'Scheduled');
      formDataToSubmit.append('platform_id', String(formData.platform_id));
      formDataToSubmit.append('page_id', String(formData.page_id));
      
      // Append files if they exist
      if (formData.image_path) {
        formDataToSubmit.append('image_path', formData.image_path);
      }
      
      if (formData.video_path) {
        formDataToSubmit.append('video_path', formData.video_path);
      }
      
      // Submit the form data using a custom API call to handle multipart/form-data
      const response = await createScheduledPost(formDataToSubmit);
      
      if (response) {
        toast.success('Post scheduled successfully! 🎉');
        
        // Reset form
        setFormData({
          content: "",
          scheduled_time: "",
          scheduled_date: "",
          platform_id: "",
          page_id: "",
          status: "Scheduled",
          image_path: null,
          video_path: null,
        });
        setSelectedImage(null);
        setSelectedVideo(null);
        
        // Reset file inputs
        if (imageInputRef.current) imageInputRef.current.value = "";
        if (videoInputRef.current) videoInputRef.current.value = "";
        
        // Refresh posts list
        await fetchScheduledPosts();
      }
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

  // Filter posts based on selected status filter
  const filteredPosts = statusFilter === "All" 
    ? posts 
    : posts.filter(post => post.status.toLowerCase() === statusFilter.toLowerCase());

  // Function to handle delete confirmation dialog
  const openDeleteDialog = (post) => {
    setPostToDelete(post);
    setIsDeleteDialogOpen(true);
  };

  // Function to delete a post
  const handleDeletePost = async () => {
    if (!postToDelete) return;
    
    setDeleteLoading(true);
    
    try {
      const success = await deleteScheduledPost(postToDelete.id);
      if (success) {
        setIsDeleteDialogOpen(false);
        setPostToDelete(null);
        await fetchScheduledPosts();
        toast.success("Post deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[350px] mx-auto sm:max-w-none bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 min-h-screen">
      {/* Enhanced Header */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                  Content Scheduler
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Schedule & manage your social media content
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 border-blue-200/60 hover:border-blue-300 dark:border-gray-600 dark:hover:border-gray-500 transition-all duration-300 group backdrop-blur-sm shadow-sm hover:shadow-md" 
              onClick={handleRefreshPosts}
            >
              <RefreshCw 
                className={`w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:rotate-180 transition-transform duration-300 ${refreshing ? 'animate-spin' : ''}`} 
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Content Container */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <Tabs 
          defaultValue="posts" 
          className="space-y-4 sm:space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 p-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <TabsTrigger 
              value="posts" 
              className="text-sm sm:text-base rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-md dark:data-[state=active]:from-blue-600 dark:data-[state=active]:to-indigo-600 transition-all duration-300 font-medium py-2.5"
            >
              <Clock className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Content List</span>
              <span className="sm:hidden">Posts</span>
            </TabsTrigger>
            <TabsTrigger 
              value="scheduler" 
              className="text-sm sm:text-base rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-md dark:data-[state=active]:from-blue-600 dark:data-[state=active]:to-indigo-600 transition-all duration-300 font-medium py-2.5"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Schedule Content</span>
              <span className="sm:hidden">Create</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Content List Tab */}
          <TabsContent 
            value="posts" 
            className="space-y-4 animate-in fade-in-50 duration-300"
          >
            <Card className="overflow-hidden border-none shadow-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-gray-800/80 dark:to-gray-700/80 pb-4 sm:pb-6 border-b border-gray-100/50 dark:border-gray-700/50">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-xl shadow-lg">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg sm:text-xl text-blue-700 dark:text-blue-400 font-bold">
                        Scheduled Posts
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                        Manage your scheduled social media content
                      </CardDescription>
                    </div>
                  </div>
                  
                  <Select 
                    value={statusFilter} 
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-full bg-white/70 dark:bg-gray-700/70 border-gray-200/60 dark:border-gray-600/60 h-10 text-sm">
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
              
              <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                {loading ? (
                  <div className="flex flex-col justify-center items-center p-8 sm:p-12 gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-500"></div>
                    <p className="text-gray-500 animate-pulse text-sm">Loading posts...</p>
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-full mb-4">
                      <AlertCircle className="w-10 h-10 sm:w-14 sm:h-14 text-gray-300" />
                    </div>
                    <p className="text-base sm:text-lg text-gray-500 font-medium">No {statusFilter === "All" ? "" : statusFilter} posts found</p>
                    <p className="text-gray-400 mt-2 text-center max-w-md text-sm">Create a new scheduled post to get started with your content calendar</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {filteredPosts.map((post) => {
                      const platform = platforms.find(p => p.platform_id === post.platform_id)?.platform_name || "Unknown";
                      const page = pages.find(p => p.page_id === post.page_id)?.page_name || "Unknown Page";
                      
                      return (
                        <div 
                          key={post.id} 
                          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-3xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01] group shadow-lg"
                        >
                          {/* Card Header with Platform and Status */}
                          <div className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-gray-100/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-700/80">
                            <div className="flex items-center space-x-2 min-w-0 flex-1">
                              <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${platformColors[platform] || 'bg-gray-500'} shadow-lg`} />
                              <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm sm:text-base truncate">{platform}</span>
                            </div>
                            <Badge 
                              className={`flex items-center px-2 sm:px-3 py-1 rounded-full ${statusColors[post.status]} border text-xs font-medium shadow-sm`}
                            >
                              {statusIcons[post.status]}
                              <span className="hidden sm:inline">{post.status}</span>
                              <span className="sm:hidden">{post.status.charAt(0)}</span>
                            </Badge>
                          </div>
                          
                          {/* Card Body with Content */}
                          <div className="p-3 sm:p-4 space-y-3">
                            <div className="space-y-2">
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Page: <span className="font-medium text-gray-700 dark:text-gray-300">{page}</span>
                              </div>
                              <div className="line-clamp-3 text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                                {post.content}
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-gray-700 px-1 py-1 h-auto group transition-all duration-200"
                                onClick={() => copyPostContent(post.content)}
                              >
                                <Copy className="w-3 h-3 mr-1.5 group-hover:rotate-6 transition-transform" />
                                <span className="hidden sm:inline">Copy text</span>
                                <span className="sm:hidden">Copy</span>
                              </Button>
                            </div>
                            
                            {/* Schedule Time */}
                            <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-x-2 bg-blue-50/70 dark:bg-blue-900/30 p-2 rounded-xl">
                              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                              <span className="font-medium">{format(parseISO(post.scheduled_time), "MMM d, yyyy 'at' h:mm a")}</span>
                            </div>
                          </div>
                          
                          {/* Media Indicators */}
                          {(post.image_path || post.video_path) && (
                            <div className="flex gap-1.5 px-3 sm:px-4 pb-3">
                              {post.image_path && (
                                <span className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300 rounded-xl px-2 py-1 flex items-center space-x-1 border border-blue-200/50 dark:border-blue-800/30 shadow-sm">
                                  <Image className="w-3 h-3" />
                                  <span className="hidden sm:inline">Image</span>
                                  <span className="sm:hidden">IMG</span>
                                </span>
                              )}
                              {post.video_path && (
                                <span className="text-xs bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 dark:from-purple-900/30 dark:to-pink-900/30 dark:text-purple-300 rounded-xl px-2 py-1 flex items-center space-x-1 border border-purple-200/50 dark:border-purple-800/30 shadow-sm">
                                  <Video className="w-3 h-3" />
                                  <span className="hidden sm:inline">Video</span>
                                  <span className="sm:hidden">VID</span>
                                </span>
                              )}
                            </div>
                          )}
                          
                          {/* Card Footer with Actions */}
                          <div className="px-3 sm:px-4 py-3 bg-gradient-to-r from-gray-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-700/80 flex justify-between gap-2 border-t border-gray-100/50 dark:border-gray-700/50">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 text-xs border-red-200/60 text-red-600 hover:text-red-700 hover:bg-red-50 dark:border-red-800/50 dark:text-red-400 dark:hover:bg-red-900/30 transition-all duration-200 flex-1 sm:flex-none"
                              onClick={() => openDeleteDialog(post)}
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1" />
                              <span className="hidden sm:inline">Delete</span>
                              <span className="sm:hidden">Del</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 text-xs hover:bg-blue-50 dark:hover:bg-blue-900/30 border-blue-200/60 dark:border-blue-800/50 group/action transition-all duration-200 flex-1 sm:flex-none"
                              onClick={() => fetchPostById(post.id)}
                            >
                              <span className="hidden sm:inline mr-1">Details</span>
                              <span className="sm:hidden mr-1">View</span>
                              <ChevronRight className="w-3.5 h-3.5 group-hover/action:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
              
              {filteredPosts.length > 0 && (
                <CardFooter className="bg-gray-50/80 dark:bg-gray-800/80 flex items-center justify-center p-3 sm:p-4 border-t border-gray-100/50 dark:border-gray-700/50">
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Showing <span className="font-medium text-gray-700 dark:text-gray-300">{filteredPosts.length}</span> {statusFilter === "All" ? "total" : statusFilter} posts
                  </div>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          
          {/* Schedule Content Tab */}
          <TabsContent value="scheduler" className="animate-in slide-in-from-right-8 duration-300">
            <Card className="overflow-hidden border-none shadow-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-gray-800/80 dark:to-gray-700/80 border-b border-gray-100/50 dark:border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-xl shadow-lg">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg sm:text-xl text-blue-700 dark:text-blue-400 font-bold">
                      Schedule New Content
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                      Create a new scheduled post for your social media platforms
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* Content Textarea */}
                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-sm sm:text-base font-medium flex items-center text-gray-700 dark:text-gray-300">
                      Content
                      <span className="ml-1 text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Craft your social media post here..."
                      className="min-h-[100px] sm:min-h-[120px] resize-y focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800/50 transition-all duration-300 border-gray-200/60 dark:border-gray-700/60 rounded-xl text-sm sm:text-base"
                    />
                  </div>
                  
                  {/* Platform and Page Selection */}
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="platform" className="text-sm sm:text-base font-medium flex items-center text-gray-700 dark:text-gray-300">
                          Platform
                          <span className="ml-1 text-red-500">*</span>
                        </Label>
                        <Select 
                          value={formData.platform_id} 
                          onValueChange={handlePlatformChange}
                          disabled={loadingPlatforms || platforms.length === 0}
                        >
                          <SelectTrigger className="h-10 sm:h-11 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-sm sm:text-base border-gray-200/60 dark:border-gray-700/60">
                            <SelectValue placeholder={loadingPlatforms ? "Loading platforms..." : "Select a platform"}>
                              {formData.platform_id && platforms.find(p => p.platform_id === formData.platform_id)?.platform_name}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {platforms.map((platform) => (
                              <SelectItem key={platform.id} value={platform.platform_id}>
                                <div className="flex items-center">
                                  <div className={`w-3 h-3 rounded-full ${platformColors[platform.platform_name] || 'bg-gray-500'} mr-2 shadow-sm`} />
                                  <span className="text-sm sm:text-base">{platform.platform_name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="page" className="text-sm sm:text-base font-medium flex items-center text-gray-700 dark:text-gray-300">
                          Page
                          <span className="ml-1 text-red-500">*</span>
                        </Label>
                        <Select 
                          value={formData.page_id} 
                          onValueChange={handlePageChange}
                          disabled={!formData.platform_id || loadingPages || filteredPages.length === 0}
                        >
                          <SelectTrigger className="h-10 sm:h-11 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-sm sm:text-base border-gray-200/60 dark:border-gray-700/60">
                            <SelectValue 
                              placeholder={
                                !formData.platform_id 
                                  ? "Select a platform first" 
                                  : loadingPages 
                                    ? "Loading pages..." 
                                    : filteredPages.length === 0 
                                      ? "No pages available" 
                                      : "Select a page"
                              }
                            >
                              {formData.page_id && filteredPages.find(p => p.page_id === formData.page_id)?.page_name}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {filteredPages.map((page) => (
                              <SelectItem key={page.id} value={page.page_id}>
                                <span className="text-sm sm:text-base">{page.page_name}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Date and Time Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="scheduled_date" className="text-sm sm:text-base font-medium flex items-center text-gray-700 dark:text-gray-300">
                          Date
                          <span className="ml-1 text-red-500">*</span>
                        </Label>
                        <Input
                          id="scheduled_date"
                          name="scheduled_date"
                          type="date"
                          value={formData.scheduled_date}
                          onChange={handleInputChange}
                          className="h-10 sm:h-11 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-sm sm:text-base border-gray-200/60 dark:border-gray-700/60"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="scheduled_time" className="text-sm sm:text-base font-medium flex items-center text-gray-700 dark:text-gray-300">
                          Time
                          <span className="ml-1 text-red-500">*</span>
                        </Label>
                        <Input
                          id="scheduled_time"
                          name="scheduled_time"
                          type="time"
                          value={formData.scheduled_time}
                          onChange={handleInputChange}
                          className="h-10 sm:h-11 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-sm sm:text-base border-gray-200/60 dark:border-gray-700/60"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Media Upload Section */}
                  <div className="border-2 border-dashed border-blue-200/60 dark:border-gray-600 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-gray-800/30 dark:to-gray-700/20 hover:border-blue-300/70 dark:hover:border-gray-500 transition-all group">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 w-full">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        className="flex items-center justify-center gap-2 border-blue-200/60 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-800 group/media transition-all duration-200 h-10 text-sm"
                        onClick={handleImageClick}
                      >
                        <Image className="w-4 h-4 group-hover/media:scale-110 transition-transform text-blue-500 dark:text-blue-400" />
                        <span className="hidden sm:inline">Add Image</span>
                        <span className="sm:hidden">Image</span>
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        className="flex items-center justify-center gap-2 border-purple-200/60 dark:border-gray-600 hover:bg-purple-50 dark:hover:bg-gray-800 group/media transition-all duration-200 h-10 text-sm"
                        onClick={handleVideoClick}
                      >
                        <Video className="w-4 h-4 group-hover/media:scale-110 transition-transform text-purple-500 dark:text-purple-400" />
                        <span className="hidden sm:inline">Add Video</span>
                        <span className="sm:hidden">Video</span>
                      </Button>
                      
                      {/* Hidden file inputs */}
                      <input 
                        type="file" 
                        ref={imageInputRef}
                        onChange={handleImageChange}
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        className="hidden"
                      />
                      <input 
                        type="file" 
                        ref={videoInputRef}
                        onChange={handleVideoChange}
                        accept="video/mp4,video/quicktime,video/mpeg"
                        className="hidden"
                      />
                    </div>
                    
                    {/* Display selected media information */}
                    <div className="w-full space-y-2">
                      {(selectedImage || selectedVideo) ? (
                        <div className="flex flex-col gap-2 w-full">
                          {selectedImage && (
                            <div className="flex items-center justify-between bg-white/80 dark:bg-gray-800/80 p-2 px-3 rounded-lg border border-blue-200/60 dark:border-blue-800/50">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <Image className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                  {selectedImage.name}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                                  ({(selectedImage.size / 1024).toFixed(1)} KB)
                                </span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0 text-gray-500 hover:text-red-500 flex-shrink-0"
                                onClick={() => clearSelectedMedia('image')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                          
                          {selectedVideo && (
                            <div className="flex items-center justify-between bg-white/80 dark:bg-gray-800/80 p-2 px-3 rounded-lg border border-purple-200/60 dark:border-purple-800/50">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <Video className="w-4 h-4 text-purple-500 flex-shrink-0" />
                                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                  {selectedVideo.name}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                                  ({(selectedVideo.size / (1024 * 1024)).toFixed(2)} MB)
                                </span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0 text-gray-500 hover:text-red-500 flex-shrink-0"
                                onClick={() => clearSelectedMedia('video')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 opacity-70 group-hover:opacity-100 transition-opacity text-center">
                          Supported formats: JPG, PNG, MP4, MOV
                        </p>
                      )}
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="bg-gray-50/80 dark:bg-gray-800/80 flex justify-end p-3 sm:p-6 border-t border-gray-100/50 dark:border-gray-700/50">
                <Button 
                  onClick={handleSubmit} 
                  disabled={submitLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-700 dark:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800 text-white font-semibold py-2.5 sm:py-3 rounded-xl transition-all duration-300 group shadow-lg hover:shadow-xl"
                  size="lg"
                >
                  {submitLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                      <span className="text-sm sm:text-base">Scheduling...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center text-sm sm:text-base">
                      <Sparkles className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      Schedule Post
                      <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Post Details Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-[350px] sm:max-w-4xl p-0 overflow-hidden rounded-2xl shadow-2xl border-none mx-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {/* Sidebar with Post Metadata */}
              <div className="md:col-span-1 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 p-4 sm:p-6 border-r border-gray-100 dark:border-gray-800 flex flex-col justify-between">
                <div className="space-y-4 sm:space-y-6">
                  {/* Platform and Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${platformColors[platforms.find(p => p.platform_id === selectedPost?.platform_id)?.platform_name] || 'bg-gray-500'} shadow-lg`} />
                      <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200">
                        {platforms.find(p => p.platform_id === selectedPost?.platform_id)?.platform_name || "Unknown Platform"}
                      </h3>
                    </div>
                    
                    <Badge 
                      className={`flex items-center px-2 sm:px-3 py-1 rounded-full ${statusColors[selectedPost?.status] || statusColors.Scheduled} border text-xs sm:text-sm font-medium shadow-sm`}
                    >
                      {statusIcons[selectedPost?.status]}
                      {selectedPost?.status}
                    </Badge>
                  </div>
                  
                  {/* Page info */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 dark:text-blue-400" />
                      <span className="font-medium text-sm sm:text-base">Page</span>
                    </div>
                    <p className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200">
                      {pages.find(p => p.page_id === selectedPost?.page_id)?.page_name || "Unknown Page"}
                    </p>
                  </div>
                  
                  {/* Scheduled Time */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 dark:text-blue-400" />
                      <span className="font-medium text-sm sm:text-base">Scheduled For</span>
                    </div>
                    <p className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200">
                      {selectedPost ? format(parseISO(selectedPost.scheduled_time), "MMMM d, yyyy 'at' h:mm a") : "N/A"}
                    </p>
                  </div>
                  
                  {/* Media Details */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Image className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 dark:text-blue-400" />
                      <span className="font-medium text-sm sm:text-base">Media</span>
                    </div>
                    <div className="space-y-2">
                      {selectedPost?.image_path ? (
                        <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
                          <Image className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                          <span className="text-sm truncate max-w-[150px] sm:max-w-[200px]">{selectedPost.image_path}</span>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No image attached</p>
                      )}
                      {selectedPost?.video_path ? (
                        <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
                          <Video className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                          <span className="text-sm truncate max-w-[150px] sm:max-w-[200px]">{selectedPost.video_path}</span>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No video attached</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Additional Metadata */}
                <div className="mt-6 space-y-2 border-t border-gray-200 dark:border-gray-800 pt-4">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Created</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {selectedPost ? format(parseISO(selectedPost.created_at), "MMM d, yyyy") : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Last Updated</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {selectedPost ? format(parseISO(selectedPost.updated_at), "MMM d, yyyy") : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Post ID</span>
                    <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                      {selectedPost?.id}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Main Content Area */}
              <div className="md:col-span-2 p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Post Content */}
                <div className="space-y-3">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
                    <Edit className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 dark:text-blue-400" />
                    <span>Post Content</span>
                  </h2>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed text-sm sm:text-base">
                      {selectedPost?.content}
                    </p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      if (selectedPost?.content) {
                        navigator.clipboard.writeText(selectedPost.content);
                        toast.success("Content copied to clipboard");
                      }
                    }}
                    className="flex items-center justify-center gap-2 border-blue-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800 group/copy text-sm"
                  >
                    <Copy className="w-4 h-4 group-hover/copy:rotate-6 transition-transform text-blue-500 dark:text-blue-400" />
                    Copy Content
                  </Button>
                  
                  <Button 
                    onClick={() => setIsViewDialogOpen(false)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-700 dark:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800 text-white group text-sm"
                  >
                    Close
                    <X className="ml-2 w-4 h-4 group-hover:rotate-180 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-[320px] sm:max-w-md p-0 overflow-hidden rounded-2xl shadow-2xl border-none mx-3">
            <DialogHeader className="p-4 sm:p-6 bg-red-50 dark:bg-red-900/30 border-b border-red-100 dark:border-red-800/50">
              <DialogTitle className="text-lg sm:text-xl font-bold text-red-700 dark:text-red-400 flex items-center">
                <Trash2 className="w-5 h-5 mr-2" />
                Delete Post
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
                Are you sure you want to delete this post? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            {postToDelete && (
              <div className="p-4 sm:p-6">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700 mb-4">
                  <p className="text-sm line-clamp-3 text-gray-800 dark:text-gray-200">
                    {postToDelete.content}
                  </p>
                  
                  <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{format(parseISO(postToDelete.scheduled_time), "MMM d, yyyy 'at' h:mm a")}</span>
                  </div>
                </div>
                
                <DialogFooter className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-gray-200 dark:border-gray-700 text-sm"
                    onClick={() => setIsDeleteDialogOpen(false)}
                    disabled={deleteLoading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm"
                    onClick={handleDeletePost}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Deleting...
                      </div>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Post
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

// Wrap the component with subscription check for SCHEDULE_POST service
export const ContentSchedulerPage = withSubscription(ContentSchedulerPageBase, 'SCHEDULE_POST');

export default ContentSchedulerPage; 