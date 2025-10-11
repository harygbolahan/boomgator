import { motion } from "framer-motion";
import { Play, Image as ImageIcon, Check } from "lucide-react";
import { useAutomation } from "@/contexts/AutomationContext";

const PostSelector = () => {
  const { 
    automationState, 
    selectPost, 
    getAvailablePosts 
  } = useAutomation();

  const posts = getAvailablePosts();

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">
          No posts available for {automationState.platform}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
        {posts.map((post, index) => {
          const isSelected = automationState.selectedPost?.id === post.id;
          
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => selectPost(post)}
              className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                isSelected 
                  ? 'border-purple-500 shadow-lg shadow-purple-200' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Post Image */}
              <div className="aspect-square relative overflow-hidden bg-gray-100">
                <img 
                  src={post.image} 
                  alt={post.caption}
                  className="w-full h-full object-cover"
                />
                
                {/* Post Type Indicator */}
                <div className="absolute top-2 left-2">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    post.type === 'reel' 
                      ? 'bg-black bg-opacity-70 text-white' 
                      : 'bg-white bg-opacity-70 text-gray-800'
                  }`}>
                    {post.type === 'reel' ? (
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
                  {post.caption}
                </p>
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
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={automationState.selectedPost.image} 
                alt="Selected post"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-purple-900">
                  Selected {automationState.selectedPost.type}
                </span>
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              </div>
              <p className="text-sm text-purple-700 line-clamp-2">
                {automationState.selectedPost.caption}
              </p>
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