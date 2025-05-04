import React from 'react';
import { format, parseISO } from 'date-fns';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Image, Video, Clock, Check, X } from "lucide-react";

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

interface PostDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: any;
  onCopyContent: (content: string) => void;
}

export const PostDetailsModal: React.FC<PostDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  post,
  onCopyContent 
}) => {
  if (!post) return null;

  const platform = platformOptions.find(p => p.id === post.platform_id)?.name || "Unknown";
  const statusColor = statusColors[post.status] || "bg-gray-100 text-gray-800 border-gray-200";
  const statusIcon = statusIcons[post.status];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
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
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {post.image_path && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Image className="w-5 h-5" />
                        <span>{post.image_path}</span>
                      </div>
                    )}
                    {post.video_path && (
                      <div className="flex items-center gap-2 text-purple-600 mt-2">
                        <Video className="w-5 h-5" />
                        <span>{post.video_path}</span>
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
                  {platform}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</h3>
                <Badge 
                  className={`flex items-center px-3 py-1 ${statusColor} border`}
                >
                  {statusIcon}
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
              onClick={() => onCopyContent(post.content)}
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Content
            </Button>
            
            <Button 
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 