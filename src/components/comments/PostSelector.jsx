import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MessageSquare, Hash, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Helper function to categorize posts
const categorizePost = (post) => {
  const message = post.message?.toLowerCase() || "";
  
  // Check for hashtags
  if (message.includes("#")) return "hashtag";
  
  // Check for empty content
  if (message === "no content") return "empty";
  
  // Default category
  return "regular";
};

// Helper function to get post icon
const getPostIcon = (category) => {
  switch (category) {
    case "hashtag":
      return <Hash className="h-4 w-4 text-blue-500" />;
    case "empty":
      return <MessageSquare className="h-4 w-4 text-gray-400" />;
    default:
      return <FileText className="h-4 w-4 text-primary" />;
  }
};

export const PostSelector = ({ 
  posts = [], 
  selectedPost = "", 
  onSelectPost, 
  disabled = false,
  placeholder = "Choose a post"
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  
  // Sort posts by date (most recent first)
  const sortedPosts = [...posts].sort((a, b) => {
    // Try to use created_at, created_time, timestamp or any date field
    const dateA = a.created_at || a.created_time || a.timestamp || a.date || 0;
    const dateB = b.created_at || b.created_time || b.timestamp || b.date || 0;
    
    // If dates are available, sort by most recent
    if (dateA && dateB) {
      return new Date(dateB) - new Date(dateA);
    }
    
    // Fallback to post_id which might be sequential
    return (b.post_id || 0) - (a.post_id || 0);
  });
  
  // Filter posts based on search query
  const filteredPosts = sortedPosts.filter(post => 
    post.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get selected post data
  const selectedPostData = posts.find(post => post.post_id === selectedPost);
  
  // Group posts by category
  const groupedPosts = filteredPosts.reduce((acc, post) => {
    const category = categorizePost(post);
    if (!acc[category]) acc[category] = [];
    acc[category].push(post);
    return acc;
  }, {});
  
  // Close popover when selecting a post
  const handleSelectPost = (postId) => {
    onSelectPost(postId);
    setOpen(false);
  };
  
  // Categories display order and labels
  const categories = [
    { id: "regular", label: "Post Content" },
    { id: "hashtag", label: "Hashtags" },
    { id: "empty", label: "Other Content" }
  ];
  
  // Show post date if available
  const formatPostDate = (post) => {
    const dateValue = post.created_at || post.created_time || post.timestamp || post.date;
    if (!dateValue) return null;
    
    try {
      const date = new Date(dateValue);
      // Check if date is valid
      if (isNaN(date.getTime())) return null;
      
      // Format date to relative time (e.g. "2 days ago") or actual date
      const now = new Date();
      const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      
      return date.toLocaleDateString();
    } catch (e) {
      return null;
    }
  };
  
  return (
    <Popover open={open && !disabled} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label="Select a post"
        >
          <span className="flex-1 truncate text-left">
            {selectedPostData ? (
              <div className="flex items-center gap-2">
                {getPostIcon(categorizePost(selectedPostData))}
                <span className="truncate">
                  {selectedPostData.message && selectedPostData.message.length > 35
                    ? selectedPostData.message.substring(0, 35) + "..."
                    : selectedPostData.message}
                </span>
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="ml-2 h-4 w-4 opacity-50 transition-transform"
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
      </PopoverTrigger>
      
      <PopoverContent className="w-[300px] p-0" align="start">
        <Card className="border-0 shadow-none">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <ScrollArea className="h-[280px]">
            <div className="p-2">
              {filteredPosts.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No posts found
                </div>
              ) : (
                <div className="space-y-4">
                  {categories.map(category => {
                    const categoryPosts = groupedPosts[category.id] || [];
                    if (categoryPosts.length === 0) return null;
                    
                    return (
                      <div key={category.id} className="space-y-1">
                        <div className="px-2 py-1.5">
                          <Badge variant="outline" className="font-semibold">
                            {category.label}
                          </Badge>
                        </div>
                        
                        {categoryPosts.map(post => (
                          <motion.div
                            key={post.post_id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`
                              flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer
                              ${selectedPost === post.post_id ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}
                            `}
                            onClick={() => handleSelectPost(post.post_id)}
                            tabIndex="0"
                            role="option"
                            aria-selected={selectedPost === post.post_id}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleSelectPost(post.post_id);
                              }
                            }}
                          >
                            {getPostIcon(categorizePost(post))}
                            <div className="flex-1 overflow-hidden">
                              <span className="truncate block">
                                {post.message || "No content"}
                              </span>
                              {formatPostDate(post) && (
                                <span className="text-xs text-muted-foreground">
                                  {formatPostDate(post)}
                                </span>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>
      </PopoverContent>
    </Popover>
  );
}; 