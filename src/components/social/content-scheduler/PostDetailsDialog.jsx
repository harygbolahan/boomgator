import { format, parseISO } from 'date-fns';
import { Image, Video, Copy } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from 'react-toastify';

// Base URL for media files
const MEDIA_BASE_URL = 'https://ai.loomsuite.com';

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
  Scheduled: <span className="w-4 h-4 mr-1">⏱️</span>,
  Posted: <span className="w-4 h-4 mr-1">✅</span>,
  Cancelled: <span className="w-4 h-4 mr-1">❌</span>,
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
    return `${MEDIA_BASE_URL}${path}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Post Details</DialogTitle>
          <DialogDescription>
            View the details of your scheduled post
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Content</h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="whitespace-pre-wrap">{post.content}</p>
                </div>
              </div>
              
              {(post.image_path || post.video_path) && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Media</h3>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
                    {post.image_path && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-blue-600">
                          <Image className="w-5 h-5 shrink-0" />
                          <span className="text-sm">{post.image_path}</span>
                        </div>
                        <div className="mt-2 flex justify-center bg-gray-100 dark:bg-gray-700 rounded-md p-2">
                          <img 
                            src={getFullMediaUrl(post.image_path)} 
                            alt="Post image" 
                            className="max-w-full max-h-[300px] object-contain rounded"
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
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-purple-600">
                          <Video className="w-5 h-5 shrink-0" />
                          <span className="text-sm">{post.video_path}</span>
                        </div>
                        <div className="mt-2 flex justify-center bg-gray-100 dark:bg-gray-700 rounded-md p-2">
                          <video 
                            src={getFullMediaUrl(post.video_path)} 
                            controls 
                            className="max-w-full max-h-[300px] rounded"
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
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Platform</h3>
                <p className="font-medium">
                  {platformOptions.find(p => p.id === post.platform_id)?.name || "Unknown"}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</h3>
                <Badge 
                  className={`flex items-center px-3 py-1 ${statusColors[post.status] || "bg-gray-100 text-gray-800 border-gray-200"} border`}
                >
                  {statusIcons[post.status]}
                  {post.status}
                </Badge>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Scheduled For</h3>
                <p className="font-medium">
                  {format(parseISO(post.scheduled_time), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Created</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {format(parseISO(post.created_at), "MMM d, yyyy")}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Last Updated</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {format(parseISO(post.updated_at), "MMM d, yyyy")}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Post ID</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{post.id}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="outline" 
              onClick={copyPostContent}
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Content
            </Button>
            
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostDetailsDialog; 