import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, X, Send, MessageSquare, ArrowLeft, UserCircle } from "lucide-react";
import { toast } from "react-toastify";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

import { commentRepliesService } from "@/lib/api";

// The replyTypes with their corresponding colors
const replyTypes = [
  { value: "admin", label: "Admin", color: "bg-blue-500" },
  { value: "auto", label: "Auto", color: "bg-green-500" },
  { value: "fan", label: "Fan", color: "bg-purple-500" }
];

// Platform mapping
const platforms = {
  1: "Facebook",
  2: "Instagram",
  3: "Twitter",
  4: "LinkedIn"
};

// Empty state component
const EmptyState = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center p-8 border border-dashed rounded-xl text-center"
  >
    <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4">
      <MessageSquare className="h-6 w-6 text-primary" />
    </div>
    <h3 className="font-medium text-lg mb-2">No Comments Found</h3>
    <p className="text-muted-foreground mb-6 max-w-md">
      No comments match your current filters. Try adjusting your search criteria or check back later.
    </p>
  </motion.div>
);

// CommentCard component
const CommentCard = ({ comment, onReply }) => {
  const platformName = platforms[comment.platform_id] || "Unknown";
  const replyType = replyTypes.find(type => type.value === comment.reply) || 
    { value: comment.reply, label: comment.reply, color: "bg-gray-500" };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      <Card className="w-full">
        <CardHeader className="pb-2 flex flex-row justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{platformName}</Badge>
              <Badge className={`${replyType.color} text-white`}>{replyType.label}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Comment ID: {comment.comment_id} • {new Date(comment.created_at).toLocaleString()}
            </p>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-sm font-medium">{comment.content}</p>
        </CardContent>
        <CardFooter className="pt-0 flex justify-between">
          <Button variant="ghost" size="sm" onClick={() => onReply(comment)}>
            <Send className="h-4 w-4 mr-1.5" />
            Reply
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// Reply Dialog component
const ReplyDialog = ({ open, onOpenChange, comment, onSubmit }) => {
  const [content, setContent] = useState("");
  const [replyType, setReplyType] = useState("admin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (open && comment) {
      setContent("");
      setReplyType("admin");
    }
  }, [open, comment]);
  
  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Reply content cannot be empty");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        comment_id: comment?.comment_id,
        platform_id: comment?.platform_id,
        content: content,
        reply: replyType
      });
      
      onOpenChange(false);
      toast.success("Reply added successfully");
    } catch (error) {
      toast.error(`Failed to add reply: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!comment) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reply to Comment</DialogTitle>
          <DialogDescription>
            Reply to the comment from {platforms[comment.platform_id] || "Unknown"}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-muted/50 p-3 rounded-md my-4">
          <p className="text-sm font-medium">{comment.content}</p>
        </div>
        
        <div className="grid gap-4 mb-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="replyType" className="text-sm font-medium">
              Reply as:
            </label>
            <Select value={replyType} onValueChange={setReplyType} className="col-span-3">
              <SelectTrigger>
                <SelectValue placeholder="Select reply type" />
              </SelectTrigger>
              <SelectContent>
                {replyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="content" className="text-sm font-medium">
              Your Reply
            </label>
            <Textarea
              id="content"
              placeholder="Type your reply here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Send Reply"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ActiveFilters component
const ActiveFilters = ({ filters, onClearFilter, onClearAll }) => {
  if (!filters.platform && !filters.replyType && !filters.search) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters.platform && (
        <Badge variant="outline" className="flex items-center gap-1">
          Platform: {platforms[filters.platform] || filters.platform}
          <X 
            className="h-3 w-3 cursor-pointer ml-1" 
            onClick={() => onClearFilter('platform')}
          />
        </Badge>
      )}
      
      {filters.replyType && (
        <Badge variant="outline" className="flex items-center gap-1">
          Reply Type: {replyTypes.find(type => type.value === filters.replyType)?.label || filters.replyType}
          <X 
            className="h-3 w-3 cursor-pointer ml-1" 
            onClick={() => onClearFilter('replyType')}
          />
        </Badge>
      )}
      
      {filters.search && (
        <Badge variant="outline" className="flex items-center gap-1">
          Search: {filters.search}
          <X 
            className="h-3 w-3 cursor-pointer ml-1" 
            onClick={() => onClearFilter('search')}
          />
        </Badge>
      )}
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-6 px-2 text-xs"
        onClick={onClearAll}
      >
        Clear all
      </Button>
    </div>
  );
};

// CommentDetailsView component
const CommentDetailsView = ({ comment, onBack, onReply }) => {
  const [relatedComments, setRelatedComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const platformName = platforms[comment.platform_id] || "Unknown";
  const replyType = replyTypes.find(type => type.value === comment.reply) || 
    { value: comment.reply, label: comment.reply, color: "bg-gray-500" };
  
  useEffect(() => {
    const fetchRelatedComments = async () => {
      try {
        setLoading(true);
        const data = await commentRepliesService.getCommentRepliesByCommentId(comment.comment_id);
        
        // Filter out the current comment
        const filteredComments = data.filter(c => c.id !== comment.id);
        setRelatedComments(filteredComments);
      } catch (error) {
        console.error("Error fetching related comments:", error);
        toast.error("Failed to load related comments");
      } finally {
        setLoading(false);
      }
    };
    
    fetchRelatedComments();
  }, [comment]);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h2 className="text-xl font-semibold">Comment Details</h2>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{platformName}</Badge>
              <Badge className={`${replyType.color} text-white`}>{replyType.label}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(comment.created_at).toLocaleString()}
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Comment ID: {comment.comment_id}</p>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 p-4 rounded-md mb-4">
            <p className="font-medium">{comment.content}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={() => onReply(comment)}>
            <Send className="h-4 w-4 mr-1.5" />
            Reply
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Related Comments</h3>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : relatedComments.length > 0 ? (
          <div className="space-y-4">
            {relatedComments.map(relatedComment => (
              <Card key={relatedComment.id} className="border-muted">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5 text-muted-foreground" />
                    <Badge variant="outline">
                      {replyTypes.find(t => t.value === relatedComment.reply)?.label || relatedComment.reply}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(relatedComment.created_at).toLocaleString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{relatedComment.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center py-6 text-muted-foreground">No related comments found</p>
        )}
      </div>
    </div>
  );
};

// Main CommentReplies component
export const CommentReplies = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    platform: "",
    replyType: "",
    search: ""
  });
  const [searchInput, setSearchInput] = useState("");
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [currentComment, setCurrentComment] = useState(null);
  
  // Fetch comments on component mount
  useEffect(() => {
    fetchComments();
  }, []);
  
  // Fetch all comments
  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await commentRepliesService.getAllCommentReplies();
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle reply to comment
  const handleReply = (comment) => {
    setSelectedComment(comment);
    setReplyDialogOpen(true);
  };
  
  // Handle submit reply
  const handleSubmitReply = async (replyData) => {
    try {
      const response = await commentRepliesService.addCommentReply(replyData);
      
      // Update the comments list with the new reply
      setComments(prevComments => [response.data, ...prevComments]);
      
      return response;
    } catch (error) {
      console.error("Error adding reply:", error);
      throw error;
    }
  };
  
  // Apply search filter
  const handleSearch = () => {
    setFilters({
      ...filters,
      search: searchInput.trim()
    });
  };
  
  // Handle filter by platform
  const handleFilterPlatform = (platformId) => {
    setFilters({
      ...filters,
      platform: platformId
    });
  };
  
  // Handle filter by reply type
  const handleFilterReplyType = (type) => {
    setFilters({
      ...filters,
      replyType: type
    });
  };
  
  // Clear a specific filter
  const handleClearFilter = (filterName) => {
    setFilters({
      ...filters,
      [filterName]: ""
    });
    
    if (filterName === 'search') {
      setSearchInput("");
    }
  };
  
  // Clear all filters
  const handleClearAllFilters = () => {
    setFilters({
      platform: "",
      replyType: "",
      search: ""
    });
    setSearchInput("");
  };
  
  // Apply filters to the comments list
  const filteredComments = comments.filter(comment => {
    // Filter by platform
    if (filters.platform && comment.platform_id != filters.platform) {
      return false;
    }
    
    // Filter by reply type
    if (filters.replyType && comment.reply !== filters.replyType) {
      return false;
    }
    
    // Filter by search term
    if (filters.search && !comment.content.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Filter by tab selection
    if (activeTab === "admin" && comment.reply !== "admin") return false;
    if (activeTab === "auto" && comment.reply !== "auto") return false;
    if (activeTab === "fan" && comment.reply !== "fan") return false;
    
    return true;
  });
  
  // Handle viewing comment details
  const handleViewComment = (comment) => {
    setCurrentComment(comment);
    setViewMode("detail");
  };
  
  // Handle back to list view
  const handleBackToList = () => {
    setViewMode("list");
    setCurrentComment(null);
  };
  
  // Reset to list view when tab changes
  useEffect(() => {
    setViewMode("list");
    setCurrentComment(null);
  }, [activeTab]);
  
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - only show in list view */}
      {viewMode === "list" && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Comment Management</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              View and reply to comments across all your social media platforms.
            </p>
          </div>
        </motion.div>
      )}
      
      {/* Tab content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
        {/* Only show tabs in list view */}
        {viewMode === "list" && (
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All Comments</TabsTrigger>
            <TabsTrigger value="admin">Admin Replies</TabsTrigger>
            <TabsTrigger value="auto">Auto Replies</TabsTrigger>
            <TabsTrigger value="fan">Fan Replies</TabsTrigger>
          </TabsList>
        )}
        
        <TabsContent value={activeTab} className="mt-0">
          {viewMode === "list" ? (
            <>
              {/* Search and filter bar - Only in list view */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search comments..."
                    className="pl-9"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSearch}
                  className="sm:flex-shrink-0"
                >
                  Search
                </Button>
                <Select value={filters.platform} onValueChange={handleFilterPlatform}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Platforms</SelectItem>
                    {Object.entries(platforms).map(([id, name]) => (
                      <SelectItem key={id} value={id}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filters.replyType} onValueChange={handleFilterReplyType}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Reply Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    {replyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Active filters - Only in list view */}
              <ActiveFilters 
                filters={filters} 
                onClearFilter={handleClearFilter} 
                onClearAll={handleClearAllFilters} 
              />
              
              {/* Loading state */}
              {loading && (
                <div className="flex items-center justify-center p-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
              
              {/* Comments list or empty state */}
              {!loading && (
                <>
                  {filteredComments.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">
                          {filteredComments.length} comment{filteredComments.length !== 1 ? 's' : ''}
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        {filteredComments.map((comment) => (
                          <div key={comment.id} className="group">
                            <Card 
                              className="w-full cursor-pointer transition-all hover:border-primary/50"
                              onClick={() => handleViewComment(comment)}
                            >
                              <CardHeader className="pb-2 flex flex-row justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline">{platforms[comment.platform_id] || "Unknown"}</Badge>
                                    <Badge className={
                                      `${replyTypes.find(type => type.value === comment.reply)?.color || "bg-gray-500"} text-white`
                                    }>
                                      {replyTypes.find(type => type.value === comment.reply)?.label || comment.reply}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Comment ID: {comment.comment_id} • {new Date(comment.created_at).toLocaleString()}
                                  </p>
                                </div>
                              </CardHeader>
                              <CardContent className="pb-3">
                                <p className="text-sm font-medium">{comment.content}</p>
                              </CardContent>
                              <CardFooter className="pt-0 flex justify-between">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReply(comment);
                                  }}
                                >
                                  <Send className="h-4 w-4 mr-1.5" />
                                  Reply
                                </Button>
                              </CardFooter>
                            </Card>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <EmptyState />
                  )}
                </>
              )}
            </>
          ) : (
            // Comment details view
            <CommentDetailsView 
              comment={currentComment} 
              onBack={handleBackToList}
              onReply={handleReply}
            />
          )}
        </TabsContent>
      </Tabs>
      
      {/* Reply dialog */}
      <ReplyDialog
        open={replyDialogOpen}
        onOpenChange={setReplyDialogOpen}
        comment={selectedComment}
        onSubmit={handleSubmitReply}
      />
    </div>
  );
}; 