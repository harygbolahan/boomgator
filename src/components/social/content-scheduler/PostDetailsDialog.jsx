import { format, parseISO } from 'date-fns';
import { Image, Video, Copy, Calendar, Clock, ExternalLink } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from 'react-toastify';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

// Base URL for media files
const MEDIA_BASE_URL = 'https://ai.loomsuite.com';

const platformIcons = {
  1: "🔵", // Facebook
  2: "📸", // Instagram
  3: "🐦", // Twitter
  4: "🔗", // LinkedIn
  "2708942999274612": "📸", // This appears to be an Instagram ID based on your data
};

const platformNames = {
  1: "Facebook",
  2: "Instagram",
  3: "Twitter",
  4: "LinkedIn",
  "2708942999274612": "Instagram",
};

const statusColors = {
  Scheduled: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
  Posted: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
  Cancelled: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
  Failed: "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200",
};

const statusIcons = {
  Scheduled: <span className="w-4 h-4 mr-1">⏱️</span>,
  Posted: <span className="w-4 h-4 mr-1">✅</span>,
  Cancelled: <span className="w-4 h-4 mr-1">❌</span>,
  Failed: <span className="w-4 h-4 mr-1">⚠️</span>,
};

const PostDetailsDialog = ({ post, isOpen, onClose }) => {
  if (!post) return null;
  
  // Copy post content to clipboard
  const copyPostContent = () => {
    navigator.clipboard.writeText(post.content);
    toast.success("Content copied to clipboard");
  };

  // Get full media URL with base
  const getFullMediaUrl = (path) => {
    if (!path) return '';
    // If path already includes http, it's already a full URL
    if (path.startsWith('http')) return path;
    // Otherwise, prepend the base URL
    return `${MEDIA_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  // Format the scheduled time for display
  const formatScheduledDateTime = (dateTimeStr) => {
    try {
      const dateTime = parseISO(dateTimeStr);
      return {
        date: format(dateTime, "MMMM d, yyyy"),
        time: format(dateTime, "h:mm a"),
        full: format(dateTime, "PPpp")
      };
    } catch (error) {
      console.error("Error parsing date:", error);
      return { date: "Invalid date", time: "Invalid time", full: "Invalid date/time" };
    }
  };

  // Determine platform type based on ID with better detection
  const determinePlatform = (platformId) => {
    // Handle numeric IDs (internal platform IDs)
    if (!isNaN(Number(platformId))) {
      const numId = Number(platformId);
      return {
        name: platformNames[numId] || "Unknown Platform",
        icon: platformIcons[numId] || "📱"
      };
    }
    
    // Handle string IDs (external platform IDs)
    // Check for Facebook pattern
    if (String(platformId).includes('fb') || String(platformId).startsWith('facebook_')) {
      return { name: "Facebook", icon: "🔵" };
    }
    
    // Check for known platform in our maps
    if (platformNames[platformId]) {
      return {
        name: platformNames[platformId],
        icon: platformIcons[platformId] || "📱"
      };
    }
    
    // Default to unknown
    return { name: "Unknown Platform", icon: "📱" };
  };

  const scheduledDateTime = formatScheduledDateTime(post.scheduled_time);
  const platform = determinePlatform(post.platform_id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto p-0">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 p-6">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold">Post Details</DialogTitle>
              <Badge 
                className={`${statusColors[post.status] || "bg-gray-100 text-gray-800 border-gray-200"} border px-3 py-1 flex items-center`}
              >
                {statusIcons[post.status] || "🔄"}
                {post.status}
              </Badge>
            </div>
            
            {/* Instead of using DialogDescription which uses a p tag internally,
                we use a div with appropriate styling to avoid hydration errors */}
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold">{platform.icon}</span>
                <span>{platform.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{scheduledDateTime.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{scheduledDateTime.time}</span>
              </div>
            </div>
          </DialogHeader>
        </div>
        
        <Tabs defaultValue="content" className="p-6">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Post Content</h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="whitespace-pre-wrap">{post.content}</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={copyPostContent}
                  className="flex items-center gap-2 mt-4"
                  size="sm"
                >
                  <Copy className="w-4 h-4" />
                  Copy Content
                </Button>
              </CardContent>
            </Card>
            
            {(post.image_path || post.video_path) && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Media</h3>
                  
                  {post.image_path && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-blue-600 mb-2">
                        <Image className="w-4 h-4 shrink-0" />
                        <span className="text-xs truncate">{post.image_path}</span>
                      </div>
                      <div className="flex justify-center bg-gray-100 dark:bg-gray-700 rounded-md p-2">
                        <img 
                          src={getFullMediaUrl(post.image_path)} 
                          alt="Post image" 
                          className="w-full md:max-w-full h-auto max-h-[300px] object-contain rounded shadow-sm hover:shadow-md transition-shadow"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNFRkYwRjMiIGQ9Ik0wIDBoMTIwdjEyMEgweiIvPjxwYXRoIGQ9Ik02MCAxMDdjLTI1Ljk2MyAwLTQ3LTIxLjAzNy00Ny00N3MyMS4wMzctNDcgNDctNDcgNDcgMjEuMDM3IDQ3IDQ3LTIxLjAzNyA0Ny00NyA0N3ptMC04NS41NjRjLTIxLjI0MyAwLTM4LjU2NCAxNy4zMjItMzguNTY0IDM4LjU2NCAwIDIxLjI0MyAxNy4zMiAzOC41NjQgMzguNTY0IDM4LjU2NCAyMS4yNDMgMCAzOC41NjQtMTcuMzIgMzguNTY0LTM4LjU2NCAwLTIxLjI0My0xNy4zMi0zOC41NjQtMzguNTY0LTM4LjU2NHoiIGZpbGw9IiNCRkMzQzkiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxjaXJjbGUgZmlsbD0iI0JGQzNDOSIgY3g9Ijg3IiBjeT0iNDciIHI9IjUiLz48cGF0aCBkPSJNNDEgNzJ2MmMwIC41NTIuNDQ4IDEgMSAxaDM2Yy41NTIgMCAxLS40NDggMS0xdi0yYzAtNC40MTgtMy41ODItOC04LThoLTIyYy00LjQxOCAwLTggMy41ODItOCA4eiIgZmlsbD0iI0JGQzNDOSIvPjwvZz48L3N2Zz4=';
                            e.target.classList.add('error-image');
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {post.video_path && (
                    <div>
                      <div className="flex items-center gap-2 text-purple-600 mb-2">
                        <Video className="w-4 h-4 shrink-0" />
                        <span className="text-xs truncate">{post.video_path}</span>
                      </div>
                      <div className="flex justify-center bg-gray-100 dark:bg-gray-700 rounded-md p-2">
                        <video 
                          src={getFullMediaUrl(post.video_path)} 
                          controls 
                          className="w-full md:max-w-full max-h-[300px] rounded shadow-sm"
                          poster={post.video_path ? getFullMediaUrl(post.video_path.replace(/\.\w+$/, '.jpg')) : ''}
                          onError={(e) => {
                            e.target.classList.add('error-video');
                            const errorEl = document.createElement('div');
                            errorEl.className = 'text-red-500 text-center p-4';
                            errorEl.innerText = 'Error loading video';
                            e.target.parentNode.replaceChild(errorEl, e.target);
                          }}
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="details">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Platform</h3>
                    <p className="font-medium flex items-center gap-2">
                      <span>{platform.icon}</span>
                      {platform.name}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</h3>
                    <Badge 
                      className={`inline-flex items-center px-3 py-1 ${statusColors[post.status] || "bg-gray-100 text-gray-800 border-gray-200"} border`}
                    >
                      {statusIcons[post.status]}
                      {post.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Scheduled For</h3>
                    <p className="font-medium flex flex-col">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {scheduledDateTime.date}
                      </span>
                      <span className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        {scheduledDateTime.time}
                      </span>
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Created</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {format(parseISO(post.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Last Updated</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {format(parseISO(post.updated_at), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Post ID</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-mono">{post.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="p-6 border-t border-gray-200 dark:border-gray-800">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostDetailsDialog; 