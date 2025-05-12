import { useState } from 'react';
import { toast } from 'react-toastify';
import { schedulerService } from '@/lib/api';

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
import { Calendar, Clock, Image, Video, Eye, X, Loader2 } from "lucide-react";

const SchedulePostForm = ({ onPostCreated, openPreviewModal, platforms = [], platformsLoading = false }) => {
  const [formData, setFormData] = useState({
    content: "",
    scheduled_time: "",
    scheduled_date: "",
    platform_id: "",
    status: "Scheduled",
    media: [],
    preview: false
  });
  const [submitLoading, setSubmitLoading] = useState(false);

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
      
      // Create FormData object to handle file uploads
      const formDataObj = new FormData();
      
      // Add text fields to FormData
      formDataObj.append('content', formData.content);
      formDataObj.append('scheduled_time', scheduledDateTime);
      formDataObj.append('status', formData.status);
      formDataObj.append('platform_id', formData.platform_id);
      
      // Add media files to FormData if they exist
      if (formData.media.length > 0) {
        // Find an image (use the first one found)
        const imageMedia = formData.media.find(media => media.type === 'image');
        if (imageMedia && imageMedia.file) {
          formDataObj.append('image', imageMedia.file);
        }
        
        // Find a video (use the first one found)
        const videoMedia = formData.media.find(media => media.type === 'video');
        if (videoMedia && videoMedia.file) {
          formDataObj.append('video', videoMedia.file);
        }
      }
      
      // Log the form data for debugging (only log keys since FormData values can't be easily logged)
      console.log('Sending form data keys:', Array.from(formDataObj.keys()));
      
      // Submit the form data with file uploads
      await schedulerService.createScheduledPost(formDataObj);
      
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
      
      // Notify parent component
      onPostCreated();
      
    } catch (error) {
      let errorMessage = "Failed to schedule post";
      
      if (error.response && error.response.data && error.response.data.errors) {
        // Format error messages from API response
        const errors = error.response.data.errors;
        errorMessage = Object.values(errors).join('\n');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      console.error("Form submission error:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Helper function to get platform icon
  const getPlatformIcon = (platformName) => {
    switch (platformName?.toLowerCase()) {
      case 'facebook':
        return <span className="text-lg text-blue-600">ⓕ</span>;
      case 'instagram':
        return <span className="text-lg text-pink-600">📷</span>;
      case 'twitter':
        return <span className="text-lg text-blue-400">𝕏</span>;
      case 'linkedin':
        return <span className="text-lg text-blue-700">in</span>;
      default:
        return null;
    }
  };

  // Helper function to get platform color class
  const getPlatformColorClass = (platformName) => {
    switch (platformName?.toLowerCase()) {
      case 'facebook': return 'text-blue-600';
      case 'instagram': return 'text-pink-600';
      case 'twitter': return 'text-blue-400';
      case 'linkedin': return 'text-blue-700';
      default: return '';
    }
  };

  return (
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
                disabled={platformsLoading || platforms.length === 0}
              >
                <SelectTrigger className="h-11">
                  {platformsLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading platforms...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder="Select a platform" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {platforms.length > 0 ? (
                    platforms.map((platform) => (
                      <SelectItem key={platform.id} value={platform.platform_id}>
                        <div className="flex items-center">
                          <span className={`mr-2 ${getPlatformColorClass(platform.platform_name)}`}>
                            {getPlatformIcon(platform.platform_name)}
                          </span>
                          {platform.platform_name}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-platforms" disabled>
                      No platforms available
                    </SelectItem>
                  )}
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
        </form>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-800 flex justify-between">
        <Button
          variant="outline"
          onClick={() => openPreviewModal(formData)}
          className="flex items-center gap-2"
          disabled={!formData.platform_id}
        >
          <Eye className="w-4 h-4 mr-1" />
          Preview Post
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={submitLoading || !formData.platform_id}
          className="px-6"
          size="lg"
        >
          {submitLoading ? "Scheduling..." : "Schedule Post"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SchedulePostForm; 