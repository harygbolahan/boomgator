import { useState, useEffect, useRef } from 'react';
import { useBoom } from '@/contexts/BoomContext';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';
import { FileText } from "lucide-react";

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
import { Calendar, Clock, Image, Video, AlertCircle, Check, X, RefreshCw, ChevronRight, Copy, Trash2 } from "lucide-react";

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
      console.log('data', data);
      
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
        toast.success('Post scheduled successfully');
        
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
        
        // Refresh posts list and move to posts tab
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
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="mx-auto px-4 space-y-8 w-full max-w-[380px] sm:max-w-none bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 container mx-auto px-4">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent tracking-tight">
          Content Scheduler
        </h1>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-2 border-blue-100 hover:border-blue-200 dark:border-gray-700 dark:hover:border-gray-600 transition-all duration-300 group" 
          onClick={handleRefreshPosts}
        >
          <RefreshCw 
            className={`w-5 h-5 text-blue-500 dark:text-blue-400 group-hover:rotate-180 transition-transform ${refreshing ? 'animate-spin' : ''}`} 
          />
          Refresh Posts
        </Button>
      </div>
      
      <Tabs 
        defaultValue="posts" 
        className="container mx-auto px-4 space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <TabsTrigger 
            value="posts" 
            className="text-base rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-300 transition-colors duration-300"
          >
            <Clock className="w-5 h-5 mr-2" />
            Content List
          </TabsTrigger>
          <TabsTrigger 
            value="scheduler" 
            className="text-base rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-300 transition-colors duration-300"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Schedule Content
          </TabsTrigger>
        </TabsList>
        
        {/* Content List Tab */}
        <TabsContent 
          value="posts" 
          className="space-y-6 animate-in fade-in-50 duration-300"
        >
          <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-white dark:bg-gray-800/50 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-gray-800/30 dark:to-gray-700/30 pb-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl flex items-center text-blue-700 dark:text-blue-400">
                    <Clock className="w-5 h-5 mr-2" />
                    Scheduled Posts
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                    Manage your scheduled social media content
                  </CardDescription>
                </div>
                
                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                  className="w-full sm:w-[180px]"
                >
                  <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
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
            
            <CardContent className="pt-6 px-4 sm:px-6">
              {loading ? (
                <div className="flex flex-col justify-center items-center p-12 gap-3">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  <p className="text-gray-500 animate-pulse">Loading posts...</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-full mb-4">
                    <AlertCircle className="w-14 h-14 text-gray-300" />
                  </div>
                  <p className="text-lg text-gray-500 font-medium">No {statusFilter === "All" ? "" : statusFilter} posts found</p>
                  <p className="text-gray-400 mt-2 text-center max-w-md">Create a new scheduled post to get started with your content calendar</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => {
                    const platform = platforms.find(p => p.platform_id === post.platform_id)?.platform_name || "Unknown";
                    const page = pages.find(p => p.page_id === post.page_id)?.page_name || "Unknown Page";
                    const statusColor = {
                      Scheduled: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
                      Posted: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300",
                      Cancelled: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300"
                    }[post.status] || "bg-gray-50 text-gray-700 border-gray-200";
                    
                    return (
                      <div 
                        key={post.id} 
                        className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group"
                      >
                        {/* Card Header with Platform and Status */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-750/30 transition-colors">
                          <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                            {platform === "Facebook" && <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse" />}
                            {platform === "Instagram" && <div className="w-4 h-4 rounded-full bg-pink-600 animate-pulse" />}
                            {platform === "Twitter" && <div className="w-4 h-4 rounded-full bg-sky-500 animate-pulse" />}
                            <span>{platform}</span>
                          </span>
                          <Badge 
                            className={`flex items-center px-3 py-1 rounded-full ${statusColor} border transition-colors`}
                          >
                            {statusIcons[post.status]}
                            {post.status}
                          </Badge>
                        </div>
                        
                        {/* Card Body with Content */}
                        <div className="p-5 space-y-4">
                          <div className="space-y-1">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                              Page: <span className="font-medium text-gray-700 dark:text-gray-300">{page}</span>
                            </div>
                            <div className="line-clamp-3 text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                              {post.content}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-gray-700 px-0 h-auto group"
                              onClick={() => copyPostContent(post.content)}
                            >
                              <Copy className="w-3 h-3 mr-1 group-hover:rotate-6 transition-transform" />
                              Copy text
                            </Button>
                          </div>
                          
                          {/* Schedule Time */}
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2">
                            <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                            <span>{format(parseISO(post.scheduled_time), "MMM d, yyyy 'at' h:mm a")}</span>
                          </div>
                        </div>
                        
                        {/* Media Indicators - Add this back with improved styling */}
                        {(post.image_path || post.video_path) && (
                          <div className="flex gap-2 px-5 pb-4">
                            {post.image_path && (
                              <span className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full px-3 py-1 flex items-center space-x-1.5 border border-blue-100 dark:border-blue-800/50">
                                <Image className="w-3 h-3" />
                                <span>Image</span>
                              </span>
                            )}
                            {post.video_path && (
                              <span className="text-xs bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full px-3 py-1 flex items-center space-x-1.5 border border-purple-100 dark:border-purple-800/50">
                                <Video className="w-3 h-3" />
                                <span>Video</span>
                              </span>
                            )}
                          </div>
                        )}
                        
                        {/* Card Footer with Actions */}
                        <div className="px-5 py-4 bg-gray-50/50 dark:bg-gray-750/30 flex justify-between group-hover:bg-gray-100 dark:group-hover:bg-gray-700/50 transition-colors">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-sm border-red-100 text-red-600 hover:text-red-700 hover:bg-red-50 dark:border-red-800/50 dark:text-red-400 dark:hover:bg-red-900/30"
                            onClick={() => openDeleteDialog(post)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 border-blue-100 dark:border-blue-800/50 group/action transition-all"
                            onClick={() => fetchPostById(post.id)}
                          >
                            <span className="group-hover/action:mr-2 transition-all duration-300 opacity-0 group-hover/action:opacity-100 mr-0 w-0">
                              Details
                            </span>
                            <ChevronRight className="w-4 h-4 group-hover/action:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
            
            {filteredPosts.length > 0 && (
              <CardFooter className="bg-gray-50 dark:bg-gray-800 flex items-center justify-between p-4 sm:px-6 border-t border-gray-100 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing <span className="font-medium text-gray-700 dark:text-gray-300">{filteredPosts.length}</span> {statusFilter === "All" ? "total" : statusFilter} posts
                </div>
                {/* <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleRefreshPosts}
                  className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  disabled={refreshing}
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-blue-500" : ""}`} />
                  Refresh
                </Button> */}
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        {/* Schedule Content Tab */}
        <TabsContent value="scheduler" className="animate-in slide-in-from-right-8 duration-300">
          <Card className="overflow-hidden border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
              <CardTitle className="text-xl flex items-center text-blue-700 dark:text-blue-400">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule New Content
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                Create a new scheduled post for your social media platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 px-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Content Textarea with Enhanced Focus */}
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Craft your social media post here..."
                  className="min-h-[120px] resize-y focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all duration-300 border-gray-200 dark:border-gray-700 rounded-xl"
                />
                
                {/* Adjust grid layout for responsiveness */}
                <div className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="platform" className="text-base font-medium flex items-center">
                        Platform
                        <span className="ml-1 text-red-500">*</span>
                      </Label>
                      <Select 
                        value={formData.platform_id} 
                        onValueChange={handlePlatformChange}
                        disabled={loadingPlatforms || platforms.length === 0}
                      >
                        <SelectTrigger className="h-11 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800">
                          <SelectValue placeholder={loadingPlatforms ? "Loading platforms..." : "Select a platform"} />
                        </SelectTrigger>
                        <SelectContent>
                          {platforms.map((platform) => (
                            <SelectItem key={platform.id} value={platform.platform_id}>
                              <div className="flex items-center">
                                {platform.platform_name === "Facebook" && <div className="w-3 h-3 rounded-full bg-blue-600 mr-2" />}
                                {platform.platform_name === "Instagram" && <div className="w-3 h-3 rounded-full bg-pink-600 mr-2" />}
                                {platform.platform_name === "Twitter" && <div className="w-3 h-3 rounded-full bg-sky-500 mr-2" />}
                                {platform.platform_name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="page" className="text-base font-medium flex items-center">
                        Page
                        <span className="ml-1 text-red-500">*</span>
                      </Label>
                      <Select 
                        value={formData.page_id} 
                        onValueChange={handlePageChange}
                        disabled={!formData.platform_id || loadingPages || filteredPages.length === 0}
                      >
                        <SelectTrigger className="h-11 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800">
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
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredPages.map((page) => (
                            <SelectItem key={page.id} value={page.page_id}>
                              {page.page_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Nested grid for Date and Time to stack until medium screen */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="scheduled_date" className="text-base font-medium flex items-center">
                        Date
                        <span className="ml-1 text-red-500">*</span>
                      </Label>
                      <Input
                        id="scheduled_date"
                        name="scheduled_date"
                        type="date"
                        value={formData.scheduled_date}
                        onChange={handleInputChange}
                        className="h-11 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="scheduled_time" className="text-base font-medium flex items-center">
                        Time
                        <span className="ml-1 text-red-500">*</span>
                      </Label>
                      <Input
                        id="scheduled_time"
                        name="scheduled_time"
                        type="time"
                        value={formData.scheduled_time}
                        onChange={handleInputChange}
                        className="h-11 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Media Upload Section with Modern Design */}
                <div className="border-2 border-dashed border-blue-100 dark:border-gray-700 rounded-2xl p-6 mt-4 flex flex-col items-center justify-center bg-blue-50/30 dark:bg-gray-800/20 hover:border-blue-200 dark:hover:border-gray-600 transition-all group">
                  <div className="flex space-x-4 mb-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex items-center gap-2 border-blue-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800 group/media"
                      onClick={handleImageClick}
                    >
                      <Image className="w-5 h-5 group-hover/media:scale-110 transition-transform text-blue-500 dark:text-blue-400" />
                      Add Image
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex items-center gap-2 border-purple-200 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-gray-800 group/media"
                      onClick={handleVideoClick}
                    >
                      <Video className="w-5 h-5 group-hover/media:scale-110 transition-transform text-purple-500 dark:text-purple-400" />
                      Add Video
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
                  <div className="w-full space-y-3">
                    {(selectedImage || selectedVideo) ? (
                      <div className="flex flex-col gap-2 w-full">
                        {selectedImage && (
                          <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 px-3 rounded-lg border border-blue-200 dark:border-blue-800/50">
                            <div className="flex items-center gap-2">
                              <Image className="w-4 h-4 text-blue-500" />
                              <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[180px]">
                                {selectedImage.name}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                ({(selectedImage.size / 1024).toFixed(1)} KB)
                              </span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 p-0 text-gray-500 hover:text-red-500"
                              onClick={() => clearSelectedMedia('image')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        
                        {selectedVideo && (
                          <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 px-3 rounded-lg border border-purple-200 dark:border-purple-800/50">
                            <div className="flex items-center gap-2">
                              <Video className="w-4 h-4 text-purple-500" />
                              <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[180px]">
                                {selectedVideo.name}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                ({(selectedVideo.size / (1024 * 1024)).toFixed(2)} MB)
                              </span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 p-0 text-gray-500 hover:text-red-500"
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
            <CardFooter className="bg-gray-50 dark:bg-gray-800 flex justify-end p-6 border-t border-gray-100 dark:border-gray-700">
              <Button 
                onClick={handleSubmit} 
                disabled={submitLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-700 dark:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800 text-white font-semibold py-3 rounded-xl transition-all duration-300 group"
                size="lg"
              >
                {submitLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    Scheduling...
                  </div>
                ) : (
                  <span className="flex items-center justify-center">
                    Schedule Post
                    <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Post Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-2xl shadow-2xl border-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {/* Sidebar with Post Metadata */}
            <div className="md:col-span-1 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 p-6 border-r border-gray-100 dark:border-gray-800 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Platform and Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {platforms.find(p => p.platform_id === selectedPost?.platform_id)?.platform_name === "Facebook" && 
                      <div className="w-6 h-6 rounded-full bg-blue-600 animate-pulse" />}
                    {platforms.find(p => p.platform_id === selectedPost?.platform_id)?.platform_name === "Instagram" && 
                      <div className="w-6 h-6 rounded-full bg-pink-600 animate-pulse" />}
                    {platforms.find(p => p.platform_id === selectedPost?.platform_id)?.platform_name === "Twitter" && 
                      <div className="w-6 h-6 rounded-full bg-sky-500 animate-pulse" />}
                    
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                      {platforms.find(p => p.platform_id === selectedPost?.platform_id)?.platform_name || "Unknown Platform"}
                    </h3>
                  </div>
                  
                  <Badge 
                    className={`flex items-center px-3 py-1 rounded-full ${
                      {
                        Scheduled: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
                        Posted: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300",
                        Cancelled: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300"
                      }[selectedPost?.status] || "bg-gray-50 text-gray-700 border-gray-200"
                    } border transition-colors`}
                  >
                    {statusIcons[selectedPost?.status]}
                    {selectedPost?.status}
                  </Badge>
                </div>
                
                {/* Page info */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <FileText className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                    <span className="font-medium">Page</span>
                  </div>
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    {pages.find(p => p.page_id === selectedPost?.page_id)?.page_name || "Unknown Page"}
                  </p>
                </div>
                
                {/* Scheduled Time */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                    <span className="font-medium">Scheduled For</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    {selectedPost ? format(parseISO(selectedPost.scheduled_time), "MMMM d, yyyy 'at' h:mm a") : "N/A"}
                  </p>
                </div>
                
                {/* Media Details */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Image className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                    <span className="font-medium">Media</span>
                  </div>
                  <div className="space-y-2">
                    {selectedPost?.image_path ? (
                      <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
                        <Image className="w-5 h-5 text-blue-600" />
                        <span className="text-sm truncate max-w-[200px]">{selectedPost.image_path}</span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No image attached</p>
                    )}
                    {selectedPost?.video_path ? (
                      <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
                        <Video className="w-5 h-5 text-purple-600" />
                        <span className="text-sm truncate max-w-[200px]">{selectedPost.video_path}</span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No video attached</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Additional Metadata */}
              <div className="mt-6 space-y-2 border-t border-gray-200 dark:border-gray-800 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Created</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {selectedPost ? format(parseISO(selectedPost.created_at), "MMM d, yyyy") : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Last Updated</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {selectedPost ? format(parseISO(selectedPost.updated_at), "MMM d, yyyy") : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Post ID</span>
                  <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                    {selectedPost?.id}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Main Content Area */}
            <div className="md:col-span-2 p-6 space-y-6">
              {/* Post Content */}
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
                  <FileText className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                  <span>Post Content</span>
                </h2>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
                    {selectedPost?.content}
                  </p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (selectedPost?.content) {
                      navigator.clipboard.writeText(selectedPost.content);
                      toast.success("Content copied to clipboard");
                    }
                  }}
                  className="flex items-center gap-2 border-blue-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800 group/copy"
                >
                  <Copy className="w-4 h-4 group-hover/copy:rotate-6 transition-transform text-blue-500 dark:text-blue-400" />
                  Copy Content
                </Button>
                
                <Button 
                  onClick={() => setIsViewDialogOpen(false)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-700 dark:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800 text-white group"
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
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl shadow-2xl border-none">
          <DialogHeader className="p-6 bg-red-50 dark:bg-red-900/30 border-b border-red-100 dark:border-red-800/50">
            <DialogTitle className="text-xl font-bold text-red-700 dark:text-red-400 flex items-center">
              <Trash2 className="w-5 h-5 mr-2" />
              Delete Scheduled Post
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400 mt-1">
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {postToDelete && (
            <div className="p-6">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 mb-4">
                <p className="text-sm line-clamp-3 text-gray-800 dark:text-gray-200">
                  {postToDelete.content}
                </p>
                
                <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>{format(parseISO(postToDelete.scheduled_time), "MMM d, yyyy 'at' h:mm a")}</span>
                </div>
              </div>
              
              <DialogFooter className="flex space-x-3 mt-2">
                <Button 
                  variant="outline" 
                  className="flex-1 border-gray-200 dark:border-gray-700"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={deleteLoading}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDeletePost}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <div className="flex items-center">
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
  );
};

export default ContentSchedulerPage; 