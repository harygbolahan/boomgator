import { format, parseISO } from 'date-fns';
import { Calendar, ChevronRight, Copy, Image, Video } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from 'react-toastify';

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

const PostCard = ({ post, onViewDetails }) => {
  const platform = platformOptions.find(p => p.id === post.platform_id)?.name || "Unknown";
  const statusColor = statusColors[post.status] || "bg-gray-100 text-gray-800 border-gray-200";
  const statusIcon = statusIcons[post.status];

  // Copy post content to clipboard
  const copyPostContent = (content, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(content);
    toast.success("Content copied to clipboard");
  };

  return (
    <div 
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
            onClick={(e) => copyPostContent(post.content, e)}
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
          onClick={() => onViewDetails(post.id)}
        >
          View Details
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default PostCard; 