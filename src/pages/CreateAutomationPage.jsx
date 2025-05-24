import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { ArrowLeft, Sparkles } from "lucide-react";

// Import Boom context
import { useBoom } from "@/contexts/BoomContext";

export function CreateAutomationPage() {
  const navigate = useNavigate();
  const { createAutomation, getPlatforms, getPages, getAutoReplyServices, getPagePosts, syncPagePosts, platforms, pages } = useBoom();
  
  // State for form fields
  const [formData, setFormData] = useState({
    status: "Active",
    service_id: "", // Will be set from available services
    incoming: "",
    platform_id: "",
    page_id: "",
    post_id: "",
    label: "",
    comment_content: "",
    dm_content: "",
    tittle: "",
    url: ""
  });
  
  // State for services and loading conditions
  const [services, setServices] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPlatforms, setLoadingPlatforms] = useState(true);
  const [loadingPages, setLoadingPages] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);
  const [syncingPosts, setSyncingPosts] = useState(false);
  
  // Fetch platforms, pages, and services on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingPlatforms(true);
        setLoadingPages(true);
        setLoadingPosts(true);
        setLoadingServices(true);
        
        // Fetch platforms
        const platformsResponse = await getPlatforms();
        console.log("Platforms response:", platformsResponse);
        setLoadingPlatforms(false);
        
        // Fetch pages
        const pagesResponse = await getPages();
        console.log("Pages response:", pagesResponse);
        setLoadingPages(false);
        
        // Fetch services
        const servicesResponse = await getAutoReplyServices();
        console.log("Services response:", servicesResponse);
        setServices(servicesResponse);
        setLoadingServices(false);
        
        // Fetch posts for the first page by default
        if (pagesResponse.length > 0) {
          const defaultPage = pagesResponse[0];
          setFormData(prev => ({
            ...prev,
            page_id: defaultPage.page_id,
            platform_id: defaultPage.platform_id
          }));
          
          // Fetch posts for the default page
          const postsResponse = await getPagePosts(defaultPage.page_id);
          console.log("Posts response:", postsResponse);
          setPosts(postsResponse);
        }
        
        setLoadingPosts(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load required data");
        setLoadingPlatforms(false);
        setLoadingPages(false);
        setLoadingPosts(false);
        setLoadingServices(false);
      }
    };
    
    fetchData();
  }, [getPlatforms, getPages, getPagePosts, getAutoReplyServices]);
  
  // Handle post fetching when page is selected
  const fetchPosts = async (pageId) => {
    if (!pageId) return;
    
    setLoadingPosts(true);
    try {
      const response = await getPagePosts(pageId);
      setPosts(response);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoadingPosts(false);
    }
  };
  
  // Handle post sync
  const handleSyncPosts = async () => {
    if (!formData.page_id) {
      toast.error("Please select a page first");
      return;
    }
    
    setSyncingPosts(true);
    try {
      const response = await syncPagePosts(formData.page_id);
      if (response?.data) {
        setPosts(response.data);
        toast.success(response.message);
      }
    } catch (error) {
      console.error("Error syncing posts:", error);
      toast.error("Failed to sync posts");
    } finally {
      setSyncingPosts(false);
    }
  };
  
  // Handle form field changes
  const handleChange = (field, value) => {
    if (field === "platform_id") {
      console.log("Platform selected:", value);
      // When platform changes, reset page_id and posts
      setFormData({
        ...formData,
        platform_id: value,
        page_id: "",
        post_id: ""
      });
      setPosts([]);
    } else if (field === "page_id") {
      console.log("Page selected:", value);
      setFormData({
        ...formData,
        [field]: value,
        post_id: ""
      });
      // Fetch posts for the selected page
      fetchPosts(value);
    } else {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };
  
  // Filter pages based on selected platform
  const filteredPages = formData.platform_id 
    ? pages.filter(page => page.platform_id === formData.platform_id)
    : pages;
    
  // Log the platform ID and filtered pages for debugging
  console.log("Current platform_id:", formData.platform_id);
  console.log("All pages:", pages);
  console.log("Filtered pages count:", filteredPages.length);
    // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.incoming.trim()) {
      toast.error("Please enter trigger keywords");
      return;
    }
    
    if (!formData.label.trim()) {
      toast.error("Please enter a label for this automation");
      return;
    }
    
    if (!formData.platform_id) {
      toast.error("Please select a platform");
      return;
    }
    
    if (!formData.page_id) {
      toast.error("Please select a page");
      return;
    }    // Validate based on service type
    if (formData.service_id === "1") {
      if (!formData.comment_content.trim()) {
        toast.error("Please enter a comment reply message");
        return;
      }
      // Clear DM content for comment-only service
      formData.dm_content = "";
    }
    
    if (formData.service_id === "2") {
      if (!formData.dm_content.trim()) {
        toast.error("Please enter a direct message reply");
        return;
      }
      // Clear comment content for DM-only service
      formData.comment_content = "";
      formData.post_id = ""; // Clear post_id as it's not needed for DM
    }
    
    if (formData.service_id === "5") {
      if (!formData.comment_content.trim() && !formData.dm_content.trim()) {
        toast.error("Please enter at least one reply message (comment or DM)");
        return;
      }
    }
    
    try {
      setIsLoading(true);
      
      // Log form data before submission
      console.log("Submitting automation data:", formData);
      
      // Create automation
      const response = await createAutomation(formData);
      console.log("Automation creation response:", response);
      
      toast.success("Automation created successfully");
      navigate("/automation"); // Navigate back to automation page
    } catch (error) {
      console.error("Error creating automation:", error);
      toast.error(`Failed to create automation: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Log filtered pages whenever platform changes
  useEffect(() => {
    if (formData.platform_id) {
      console.log("Platform ID:", formData.platform_id);
      console.log("Filtered pages:", filteredPages);
    }
  }, [formData.platform_id, filteredPages]);
  
  return (
    <div className="space-y-6 mx-auto max-w-[350px] sm:max-w-3xl">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/automation")}
              className="h-8 w-8 mr-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Create Automation</h2>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base ml-10">
            Set up a new automated response for your social media channels
          </p>
        </div>
      </motion.div>
      
      {/* Main Form */}
      <Card className="border shadow-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              New Automation
            </CardTitle>
            <CardDescription>
              Configure how your automation will respond to incoming messages
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Service Type */}
            <div className="space-y-2">
              <Label htmlFor="service_id">Service Type</Label>              <Select
                value={formData.service_id}
                onValueChange={(value) => handleChange("service_id", value)}
                disabled={isLoading || loadingServices}
              >
                <SelectTrigger id="service_id">
                  <SelectValue placeholder={loadingServices ? "Loading services..." : "Select service type"}>
                    {formData.service_id && services.find(s => s.id.toString() === formData.service_id)?.service}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      {service.service}
                      <span className="ml-2 text-xs text-muted-foreground">
                        (Daily limit: {service.limit_daily})
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose how your automation should respond to interactions
              </p>
            </div>
            
            {/* Platform */}
            <div className="space-y-2">
              <Label htmlFor="platform_id">Platform</Label>
              <Select
                value={formData.platform_id}
                onValueChange={(value) => handleChange("platform_id", value)}
                disabled={isLoading}
              >
                <SelectTrigger id="platform_id">
                  <SelectValue placeholder="Select platform">
                    {formData.platform_id && platforms.find(p => p.platform_id === formData.platform_id)?.platform_name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform.id} value={platform.platform_id}>
                      {platform.platform_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Select the social media platform for this automation
              </p>
            </div>
            
            {/* Page */}
            <div className="space-y-2">
              <Label htmlFor="page_id">Page</Label>
              <Select
                value={formData.page_id}
                onValueChange={(value) => handleChange("page_id", value)}
                disabled={isLoading || !formData.platform_id}
              >
                <SelectTrigger id="page_id">
                  <SelectValue 
                    placeholder={
                      loadingPages 
                        ? "Loading pages..." 
                        : !formData.platform_id 
                          ? "Select a platform first" 
                          : "Select page"
                    }
                  >
                    {formData.page_id && filteredPages.find(p => p.page_id === formData.page_id)?.page_name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {filteredPages.map((page) => (
                    <SelectItem key={page.id} value={page.page_id}>
                      {page.page_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Select the page you want to automate
              </p>
            </div>
            
            {/* Label */}
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                placeholder="Enter a label for this automation"
                value={formData.label}
                onChange={(e) => handleChange("label", e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                A label to help you identify this automation
              </p>
            </div>
            
            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
                disabled={isLoading}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Paused">Paused</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Set whether this automation is active or paused
              </p>
            </div>            {/* Post ID - Only show for comment replies */}
            {(formData.service_id === "1" || formData.service_id === "5") && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="post_id">Post ID</Label>
                  {formData.page_id && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleSyncPosts}
                      disabled={syncingPosts || isLoading}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${syncingPosts ? 'animate-spin' : ''}`} />
                      {syncingPosts ? 'Syncing...' : 'Sync Posts'}
                    </Button>
                  )}
                </div>
                <Select
                  value={formData.post_id}
                  onValueChange={(value) => handleChange("post_id", value)}
                  disabled={isLoading || loadingPosts || !formData.page_id}
                >
                  <SelectTrigger id="post_id">
                    <SelectValue 
                      placeholder={
                        loadingPosts 
                          ? "Loading posts..." 
                          : !formData.page_id 
                            ? "Select a page first" 
                            : "Select post (optional)"
                      }
                    >
                      {formData.post_id && posts.find(p => p.post_id === formData.post_id)?.messages?.substring(0, 50)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Posts</SelectItem>
                    {posts.map((post) => (
                      <SelectItem key={post.post_id} value={post.post_id}>
                        {post.messages?.substring(0, 50)}...
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({new Date(post.created_time).toLocaleDateString()})
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select a specific post to limit this automation to, or leave empty to apply to all posts
                </p>
              </div>
            )}
            
            {/* Trigger - incoming */}
            <div className="space-y-2">
              <Label htmlFor="incoming">Trigger Keywords</Label>
              <Input
                id="incoming"
                placeholder="Enter keywords that will trigger this automation (comma separated)"
                value={formData.incoming}
                onChange={(e) => handleChange("incoming", e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                When someone sends a message containing these keywords, your automation will respond
              </p>
            </div>

            {/* Title field */}
            <div className="space-y-2">
              <Label htmlFor="tittle">Titles</Label>
              <Input
                id="tittle"
                placeholder="Enter automation titles (comma separated)"
                value={formData.tittle}
                onChange={(e) => handleChange("tittle", e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Enter one or more titles, separated by commas
              </p>
            </div>

            {/* URL field */}
            <div className="space-y-2">
              <Label htmlFor="url">URLs</Label>
              <Input
                id="url"
                placeholder="Enter URLs (comma separated)"
                value={formData.url}
                onChange={(e) => handleChange("url", e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Enter one or more URLs, separated by commas
              </p>
            </div>

            {/* Comment Response - Show for comment replies */}
            {(formData.service_id === "1" || formData.service_id === "5") && (
              <div className="space-y-2">
                <Label htmlFor="comment_content">Comment Response</Label>
                <Textarea
                  id="comment_content"
                  placeholder="Enter the comment reply message"
                  value={formData.comment_content}
                  onChange={(e) => handleChange("comment_content", e.target.value)}
                  rows={3}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  This message will be posted as a comment reply
                </p>
              </div>
            )}

            {/* DM Response - Show for DM replies */}
            {(formData.service_id === "2" || formData.service_id === "5") && (
              <div className="space-y-2">
                <Label htmlFor="dm_content">Direct Message Response</Label>
                <Textarea
                  id="dm_content"
                  placeholder="Enter the direct message reply"
                  value={formData.dm_content}
                  onChange={(e) => handleChange("dm_content", e.target.value)}
                  rows={3}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  This message will be sent as a direct message
                </p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/automation")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                "Create Automation"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}