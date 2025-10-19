import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Play, Image as ImageIcon, Check, RefreshCw } from "lucide-react";
import { useAutomation } from "@/contexts/AutomationContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PostSelector = () => {
  const { 
    automationState, 
    selectPost, 
    getAvailablePosts,
    pages,
    getPages,
    getPagePosts,
    pagePosts,
    loadingPagePosts,
    pagePostsError,
    currentStep
  } = useAutomation();

  const [selectedPageId, setSelectedPageId] = useState('');

  // Load pages on component mount if not already loaded
  useEffect(() => {
    if (!pages || pages.length === 0) {
      console.log('PostSelector - Loading pages...');
      getPages();
    }
  }, [pages, getPages]);

  // Debug logging
  console.log('PostSelector - Debug info:', {
    currentStep,
    pages,
    pagesLength: pages?.length,
    pagePosts,
    pagePostsLength: pagePosts?.length,
    loadingPagePosts,
    pagePostsError,
    automationState
  });

  // Get static posts for fallback
  const staticPosts = getAvailablePosts();

  // Handle page selection and fetch posts
  const handlePageSelect = (pageId) => {
    setSelectedPageId(pageId);
    if (pageId) {
      console.log('PostSelector - Fetching posts for page:', pageId);
      getPagePosts(pageId);
    }
  };

  // Determine which posts to display
  const postsToDisplay = pagePosts && pagePosts.length > 0 ? pagePosts : staticPosts;

  if (loadingPagePosts) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
        <p className="text-gray-500 text-sm">Loading posts...</p>
      </div>
    );
  }

  if (pagePostsError) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-red-500 text-sm mb-4">Failed to load posts</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => selectedPageId && getPagePosts(selectedPageId)}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  if (postsToDisplay.length === 0) {
    return (
      <div className="space-y-4">
        {/* Page Selector */}
        {pages && pages.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Page</label>
            <Select value={selectedPageId} onValueChange={handlePageSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a page to load posts" />
              </SelectTrigger>
              <SelectContent>
                {pages.map((page) => (
                  <SelectItem key={page.page_id} value={page.page_id}>
                    {page.page_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">
            {selectedPageId ? 'No posts available for this page' : `No posts available for ${automationState.platform}`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Page Selector */}
      {pages && pages.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Select Page</label>
          <Select value={selectedPageId} onValueChange={handlePageSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a page to load posts" />
            </SelectTrigger>
            <SelectContent>
              {pages.map((page) => (
                <SelectItem key={page.page_id} value={page.page_id}>
                  {page.page_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">Choose a Post or Reel</h3>
          <p className="text-sm text-gray-600 mt-1">
            Select the content that will trigger your automation when users interact with it
          </p>
        </div>
        {automationState.selectedPost && (
          <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
            <Check className="w-4 h-4" />
            Selected
          </div>
        )}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-2 gap-3">
        {postsToDisplay.map((post, index) => {
          // Handle both API data structure and static data structure
          const postId = post.post_id || post.id;
          const postImage = post.media_url || post.image;
          const postCaption = post.messages || post.caption || "No content";
          const postType = post.type || (postCaption.toLowerCase().includes('reel') ? 'reel' : 'post');
          const createdTime = post.created_time || post.created_at;
          
          // Debug logging - only log first post to avoid spam
          if (index === 0) {
            console.log('PostSelector - First post data:', {
              postId,
              postImage,
              media_url: post.media_url,
              image: post.image,
              postCaption,
              fullPost: post
            });
          }
          
          const isSelected = automationState.selectedPost?.post_id === postId || automationState.selectedPost?.id === postId;
          
          return (
            <motion.div
              key={postId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => selectPost({
                ...post,
                id: postId,
                post_id: postId,
                image: postImage,
                caption: postCaption,
                type: postType
              })}
              className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                isSelected 
                  ? 'border-purple-500 shadow-lg shadow-purple-200' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Post Image */}
              <div className="aspect-square relative overflow-hidden bg-gray-100">
                {postImage && postImage.trim() !== '' ? (
                  <>
                    <img 
                      src={postImage} 
                      alt={postCaption}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                      onLoad={() => console.log('Image loaded successfully:', postImage)}
                      onError={(e) => {
                        console.log('Image failed to load:', postImage, e);
                        // Hide the image and show fallback
                        e.target.style.display = 'none';
                        const fallback = e.target.parentElement.querySelector('.fallback-container');
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    {/* Fallback for failed images */}
                    <div 
                      className="fallback-container absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
                      style={{ display: 'none' }}
                    >
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Facebook Post</p>
                        <p className="text-xs text-red-500 mt-1">Failed to load image</p>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Fallback for missing images */
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Facebook Post</p>
                      <p className="text-xs text-gray-500 mt-1">No media available</p>
                    </div>
                  </div>
                )}
                
                {/* Post Type Indicator */}
                <div className="absolute top-2 left-2">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    postType === 'reel' 
                      ? 'bg-black bg-opacity-70 text-white' 
                      : 'bg-blue-600 bg-opacity-90 text-white'
                  }`}>
                    {postType === 'reel' ? (
                      <div className="flex items-center gap-1">
                        <Play className="w-3 h-3" />
                        REEL
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        POST
                      </div>
                    )}
                  </div>
                </div>

                {/* Date Badge */}
                {createdTime && (
                  <div className="absolute bottom-2 left-2">
                    <div className="px-2 py-1 rounded text-xs font-medium bg-white bg-opacity-90 text-gray-700">
                      {new Date(createdTime).toLocaleDateString()}
                    </div>
                  </div>
                )}

                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}

                {/* Hover Overlay */}
                <div className={`absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 ${
                  isSelected ? 'bg-purple-500 bg-opacity-10' : ''
                }`} />
              </div>

              {/* Post Caption */}
              <div className="p-3">
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {postCaption}
                </p>
                {post.page_name && (
                  <p className="text-xs text-blue-600 mt-1 font-medium">
                    {post.page_name}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Post Info */}
      {automationState.selectedPost && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 relative">
              {(automationState.selectedPost.media_url || automationState.selectedPost.image) && 
               (automationState.selectedPost.media_url || automationState.selectedPost.image).trim() !== '' ? (
                <>
                  <img 
                    src={automationState.selectedPost.media_url || automationState.selectedPost.image} 
                    alt="Selected post"
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                    onLoad={() => console.log('Selected post image loaded:', automationState.selectedPost.media_url || automationState.selectedPost.image)}
                    onError={(e) => {
                      console.log('Selected post image failed to load:', automationState.selectedPost.media_url || automationState.selectedPost.image, e);
                      e.target.style.display = 'none';
                      const fallback = e.target.parentElement.querySelector('.selected-fallback-container');
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div 
                    className="selected-fallback-container absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200"
                    style={{ display: 'none' }}
                  >
                    <ImageIcon className="w-6 h-6 text-purple-400" />
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200">
                  <ImageIcon className="w-6 h-6 text-purple-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-purple-900">
                  Selected {automationState.selectedPost.type || 'post'}
                </span>
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              </div>
              <p className="text-sm text-purple-700 line-clamp-2">
                {automationState.selectedPost.caption || automationState.selectedPost.messages || "No content"}
              </p>
              {automationState.selectedPost.page_name && (
                <p className="text-xs text-purple-600 mt-1 font-medium">
                  From: {automationState.selectedPost.page_name}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Help Text */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Choose posts that are likely to receive comments with your target keywords. 
          The automation will trigger when users comment on this specific post.
        </p>
      </div>
    </div>
  );
};

export default PostSelector;