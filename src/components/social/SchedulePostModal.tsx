import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar, Image, Video, X } from "lucide-react";

const platformOptions = [
  { id: 1, name: "Facebook" },
  { id: 2, name: "Instagram" },
  { id: 3, name: "Twitter" },
  { id: 4, name: "LinkedIn" },
];

interface SchedulePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: any) => Promise<void>;
}

export const SchedulePostModal: React.FC<SchedulePostModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    content: "",
    scheduled_time: "",
    scheduled_date: "",
    platform_id: "",
    status: "Scheduled",
    media: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlatformChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      platform_id: value,
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
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

  const removeMedia = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.content.trim()) {
      alert("Content is required");
      return;
    }
    
    if (!formData.platform_id) {
      alert("Please select a platform");
      return;
    }
    
    if (!formData.scheduled_date || !formData.scheduled_time) {
      alert("Scheduled date and time are required");
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        content: "",
        scheduled_time: "",
        scheduled_date: "",
        platform_id: "",
        status: "Scheduled",
        media: [],
      });
    } catch (error) {
      console.error("Failed to submit post", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Schedule New Content
          </DialogTitle>
          <DialogDescription>
            Create a new scheduled post for your social media platforms
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Enter your post content here..."
              className="min-h-[120px] resize-y"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduled_date">Date</Label>
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
                <Label htmlFor="scheduled_time">Time</Label>
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

          <div className="space-y-2">
            <Label>Media</Label>
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

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">
              Schedule Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 