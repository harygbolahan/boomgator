import React from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Image, Video, ChevronRight, Copy, AlertCircle, RefreshCw, Check, X } from "lucide-react";

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

interface ScheduledPostsListProps {
  posts: any[];
  loading: boolean;
  refreshing: boolean;
  selectedTab: string;
  onTabChange: (tab: string) => void;
  onRefresh: () => void;
  onViewPost: (postId: number) => void;
  onCopyContent: (content: string) => void;
}

export const ScheduledPostsList: React.FC<ScheduledPostsListProps> = ({
  posts,
  loading,
  refreshing,
  selectedTab,
  onTabChange,
  onRefresh,
  onViewPost,
  onCopyContent
}) => {
  const filteredPosts = selectedTab === "All" 
    ? posts 
    : posts.filter(post => post.status.toLowerCase() === selectedTab.toLowerCase());

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              Scheduled Posts
            </CardTitle>
            <CardDescription>
              Manage your scheduled social media content
            </CardDescription>
          </div>
          
          <Select 
            value={selectedTab} 
            onValueChange={onTabChange}
            className="w-full sm:w-[180px]"
          >
            <SelectTrigger>
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
      
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-lg text-gray-500">No {selectedTab === "All" ? "" : selectedTab} posts found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPosts.map((post) => {
              const platform = platformOptions.find(p => p.id === post.platform_id)?.name || "Unknown";
              const statusColor = statusColors[post.status] || "bg-gray-100 text-gray-800 border-gray-200";
              const statusIcon = statusIcons[post.status];
              
              return (
                <div 
                  key={post.id} 
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
                        onClick={() => onCopyContent(post.content)}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy text
                      </Button>
                    </div>
                    
                    {/* Schedule Time */}
                    <div className="flex items-center mb-3 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-2" />
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
                      onClick={() => onViewPost(post.id)}
                    >
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
      
      {filteredPosts.length > 0 && (
        <CardFooter className="bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredPosts.length} {selectedTab === "All" ? "total" : selectedTab} posts
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRefresh}
            className="flex items-center gap-2"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}; 