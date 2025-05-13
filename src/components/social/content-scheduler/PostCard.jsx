import { format, parseISO } from 'date-fns';
import { Calendar, ChevronRight, Copy, Image, Video, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from 'react-toastify';

// Base URL for media previews
const MEDIA_BASE_URL = 'https://ai.loomsuite.com';

const platformIcons = {
  1: "🔵", // Facebook
  2: "📸", // Instagram
  3: "🐦", // Twitter
  4: "🔗", // LinkedIn
  "2708942999274612": "📸", // Instagram ID from example data
};

const platformNames = {
  1: "Facebook",
  2: "Instagram",
  3: "Twitter",
  4: "LinkedIn",
  "2708942999274612": "Instagram",
};

const statusColors = {
  Scheduled: "bg-blue-100 text-blue-800 border-blue-200",
  Posted: "bg-green-100 text-green-800 border-green-200",
  Cancelled: "bg-red-100 text-red-800 border-red-200",
  Failed: "bg-orange-100 text-orange-800 border-orange-200",
};

const statusIcons = {
  Scheduled: <span className="w-4 h-4 mr-1">⏱️</span>,
  Posted: <span className="w-4 h-4 mr-1">✅</span>,
  Cancelled: <span className="w-4 h-4 mr-1">❌</span>,
  Failed: <span className="w-4 h-4 mr-1">⚠️</span>,
};

const PostCard = ({ post, onViewDetails }) => {
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

  const platform = determinePlatform(post.platform_id);
  const statusColor = statusColors[post.status] || "bg-gray-100 text-gray-800 border-gray-200";
  const statusIcon = statusIcons[post.status];

  // Copy post content to clipboard
  const handleCopyContent = (e) => {
    e.stopPropagation();
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

  // Format the scheduled date and time
  const formatScheduledDateTime = () => {
    try {
      const dateTime = parseISO(post.scheduled_time);
      return {
        date: format(dateTime, "MMM d, yyyy"),
        time: format(dateTime, "h:mm a")
      };
    } catch (error) {
      return { date: "Invalid date", time: "Invalid time" };
    }
  };

  const scheduledDateTime = formatScheduledDateTime();

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md cursor-pointer"
      onClick={() => onViewDetails(post.id)}
    >
      {/* Card Header with Platform and Status */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">{platform.icon}</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {platform.name}
          </span>
        </div>
        <Badge className={`flex items-center px-3 py-1 ${statusColor} border`}>
          {statusIcon}
          {post.status}
        </Badge>
      </div>
      
      {/* Card Body with Content */}
      <div className="p-4">
        <div className="mb-4">
          <div className="line-clamp-3 text-sm font-medium mb-2 whitespace-pre-wrap">{post.content}</div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 h-auto"
            onClick={handleCopyContent}
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy text
          </Button>
        </div>
        
        {/* Schedule Date and Time */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center mb-1 sm:mb-0">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            {scheduledDateTime.date}
          </div>
          <div className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            {scheduledDateTime.time}
          </div>
        </div>
        
        {/* Media Previews */}
        {(post.image_path || post.video_path) && (
          <div className="mt-3 mb-2 space-y-2">
            {post.image_path && (
              <div>
                <div className="flex items-center mb-1">
                  <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 flex items-center">
                    <Image className="w-3 h-3 mr-1" />
                    Image
                  </span>
                </div>
                <div className="relative bg-gray-100 dark:bg-gray-700 rounded-md h-20 overflow-hidden">
                  <img 
                    src={getFullMediaUrl(post.image_path)} 
                    alt="Post image" 
                    className="w-full h-full object-cover absolute inset-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNFRkYwRjMiIGQ9Ik0wIDBoMTIwdjEyMEgweiIvPjxwYXRoIGQ9Ik02MCAxMDdjLTI1Ljk2MyAwLTQ3LTIxLjAzNy00Ny00N3MyMS4wMzctNDcgNDctNDcgNDcgMjEuMDM3IDQ3IDQ3LTIxLjAzNyA0Ny00NyA0N3ptMC04NS41NjRjLTIxLjI0MyAwLTM4LjU2NCAxNy4zMjItMzguNTY0IDM4LjU2NCAwIDIxLjI0MyAxNy4zMiAzOC41NjQgMzguNTY0IDM4LjU2NCAyMS4yNDMgMCAzOC41NjQtMTcuMzIgMzguNTY0LTM4LjU2NCAwLTIxLjI0My0xNy4zMi0zOC41NjQtMzguNTY0LTM4LjU2NHoiIGZpbGw9IiNCRkMzQzkiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxjaXJjbGUgZmlsbD0iI0JGQzNDOSIgY3g9Ijg3IiBjeT0iNDciIHI9IjUiLz48cGF0aCBkPSJNNDEgNzJ2MmMwIC41NTIuNDQ4IDEgMSAxaDM2Yy41NTIgMCAxLS40NDggMS0xdi0yYzAtNC40MTgtMy41ODItOC04LThoLTIyYy00LjQxOCAwLTggMy41ODItOCA4eiIgZmlsbD0iI0JGQzNDOSIvPjwvZz48L3N2Zz4=';
                    }}
                  />
                </div>
              </div>
            )}
            {post.video_path && (
              <div>
                <div className="flex items-center mb-1">
                  <span className="text-xs bg-purple-100 text-purple-800 rounded-full px-2 py-0.5 flex items-center">
                    <Video className="w-3 h-3 mr-1" />
                    Video
                  </span>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-md h-20 flex items-center justify-center">
                  <div className="flex items-center justify-center w-full h-full relative">
                    {/* Add video thumbnail if available */}
                    <img
                      src={getFullMediaUrl(post.video_path ? post.video_path.replace(/\.\w+$/, '.jpg') : '')}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover absolute inset-0"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-md">
                      <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-gray-800 ml-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Card Footer with Actions */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 flex justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          View Details
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default PostCard; 