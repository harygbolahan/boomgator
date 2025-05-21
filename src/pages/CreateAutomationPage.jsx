import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  const { createAutomation, getPlatforms, getPages, platforms, pages } = useBoom();
  
  // State for form fields
  const [formData, setFormData] = useState({
    status: "Active",
    service_id: "2", // Default to DM replies
    incoming: "",
    platform_id: "",
    page_id: "",
    content: ""
  });
  
  // State for loading conditions
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPlatforms, setLoadingPlatforms] = useState(true);
  const [loadingPages, setLoadingPages] = useState(true);
  
  // Fetch platforms and pages on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingPlatforms(true);
        setLoadingPages(true);
        
        // Fetch platforms
        const platformsResponse = await getPlatforms();
        console.log("Platforms response:", platformsResponse);
        setLoadingPlatforms(false);
        
        // Fetch pages
        const pagesResponse = await getPages();
        console.log("Pages response:", pagesResponse);
        setLoadingPages(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load required data");
        setLoadingPlatforms(false);
        setLoadingPages(false);
      }
    };
    
    fetchData();
  }, [getPlatforms, getPages]);
  
  // Handle form field changes
  const handleChange = (field, value) => {
    if (field === "platform_id") {
      console.log("Platform selected:", value);
      // When platform changes, reset page_id
      setFormData({
        ...formData,
        platform_id: value,
        page_id: ""
      });
    } else if (field === "page_id") {
      console.log("Page selected:", value);
      setFormData({
        ...formData,
        [field]: value
      });
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
      toast.error("Please enter a trigger message");
      return;
    }
    
    if (!formData.content.trim()) {
      toast.error("Please enter a reply message");
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
              <Label htmlFor="service_id">Service Type</Label>
              <Select
                value={formData.service_id}
                onValueChange={(value) => handleChange("service_id", value)}
                disabled={isLoading}
              >
                <SelectTrigger id="service_id">
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Comment Replies (respond to comments)</SelectItem>
                  <SelectItem value="2">DM Replies (respond to direct messages)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose whether this automation will reply to comments or direct messages
              </p>
            </div>
            
            {/* Platform */}
            <div className="space-y-2">
              <Label htmlFor="platform_id">Platform</Label>
              <Select
                value={formData.platform_id}
                onValueChange={(value) => handleChange("platform_id", value)}
                disabled={isLoading || loadingPlatforms}
              >
                <SelectTrigger id="platform_id">
                  <SelectValue placeholder={loadingPlatforms ? "Loading platforms..." : "Select platform"} />
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
                disabled={isLoading || loadingPages || !formData.platform_id}
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
              <p className="text-xs text-muted-foreground">
                Select the page you want to automate
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
            </div>
            
            {/* Trigger - incoming */}
            <div className="space-y-2">
              <Label htmlFor="incoming">Trigger Message</Label>
              <Input
                id="incoming"
                placeholder="Enter the message that will trigger this automation"
                value={formData.incoming}
                onChange={(e) => handleChange("incoming", e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                When someone sends this message, your automation will respond
              </p>
            </div>
            
            {/* Response - content */}
            <div className="space-y-2">
              <Label htmlFor="content">Response Message</Label>
              <Textarea
                id="content"
                placeholder="Enter the automatic response message"
                value={formData.content}
                onChange={(e) => handleChange("content", e.target.value)}
                rows={4}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                This is the message that will be sent in response to the trigger
              </p>
            </div>
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