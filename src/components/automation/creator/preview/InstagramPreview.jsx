import { motion } from "framer-motion";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { useAutomation } from "@/contexts/AutomationContext";

const InstagramPreview = () => {
  const { automationState } = useAutomation();

  const renderPostView = () => {
    if (!automationState.selectedPost) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 px-6 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            📷
          </div>
          <p className="text-sm">You haven't picked a post or reel for your automation yet</p>
        </div>
      );
    }

    const post = automationState.selectedPost;
    
    return (
      <div className="h-full bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">@</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-black">loomsuitemarketng</p>
              <p className="text-xs text-gray-500">Sponsored</p>
            </div>
          </div>
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </div>

        {/* Post Image */}
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          <img 
            src={post.image} 
            alt="Post content"
            className="w-full h-full object-cover"
          />
          {post.type === 'reel' && (
            <div className="absolute bottom-3 left-3">
              <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                REEL
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <Heart className="w-6 h-6 text-gray-800" />
              <MessageCircle className="w-6 h-6 text-gray-800" />
              <Send className="w-6 h-6 text-gray-800" />
            </div>
            <Bookmark className="w-6 h-6 text-gray-800" />
          </div>

          <p className="text-sm font-semibold text-black mb-1">1,234 likes</p>
          
          <div className="text-sm text-black">
            <span className="font-semibold">loomsuitemarketng</span>
            <span className="ml-2">{post.caption}</span>
          </div>

          <p className="text-sm text-gray-500 mt-2">View all 45 comments</p>
        </div>
      </div>
    );
  };

  const renderCommentView = () => {
    if (!automationState.selectedPost || automationState.keywords.length === 0) {
      return renderPostView();
    }

    const post = automationState.selectedPost;
    const firstKeyword = automationState.keywords[0];
    
    return (
      <div className="h-full bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">@</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-black">loomsuitemarketng</p>
            </div>
          </div>
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </div>

        {/* Post Image - Smaller */}
        <div className="h-48 bg-gray-100 relative overflow-hidden">
          <img 
            src={post.image} 
            alt="Post content"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Comments Section */}
        <div className="flex-1 p-3">
          <div className="mb-4">
            <p className="text-sm font-semibold text-black mb-2">Comments</p>
            
            {/* Sample Comment with Keyword */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-2 bg-blue-50 rounded-lg border border-blue-200"
            >
              <div className="w-6 h-6 bg-gray-300 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-black">User</span>
                  <span className="text-xs text-gray-500">2m</span>
                </div>
                <p className="text-sm text-black">{firstKeyword}</p>
                <div className="flex items-center gap-4 mt-1">
                  <button className="text-xs text-gray-500">Reply</button>
                  <Heart className="w-3 h-3 text-gray-500" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="text-xs text-gray-500 text-center">
            ↑ When users comment "{firstKeyword}", automation will trigger
          </div>
        </div>
      </div>
    );
  };

  const renderDMView = () => {
    if (!automationState.dmConfig.message && !automationState.dmConfig.image) {
      return renderCommentView();
    }

    return (
      <div className="h-full bg-white">
        {/* DM Header */}
        <div className="flex items-center gap-3 p-3 border-b border-gray-100">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div>
            <p className="text-sm font-semibold text-black">loomsuitemarketng</p>
            <p className="text-xs text-gray-500">Active now</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-3 space-y-3">
          {/* User Message */}
          <div className="flex justify-end">
            <div className="bg-blue-500 text-white px-3 py-2 rounded-2xl max-w-xs">
              <p className="text-sm">{automationState.keywords[0] || "Hello"}</p>
            </div>
          </div>

          {/* Bot Response */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 px-3 py-2 rounded-2xl max-w-xs">
              {automationState.dmConfig.image && (
                <div className="mb-2">
                  <img 
                    src={automationState.dmConfig.image} 
                    alt="DM content"
                    className="w-full rounded-lg"
                  />
                </div>
              )}
              {automationState.dmConfig.message && (
                <p className="text-sm text-black">{automationState.dmConfig.message}</p>
              )}
              {automationState.dmConfig.buttons.length > 0 && (
                <div className="mt-2 space-y-1">
                  {automationState.dmConfig.buttons.map((button, index) => (
                    <button
                      key={index}
                      className="w-full bg-blue-500 text-white py-1 px-3 rounded text-xs"
                    >
                      {button.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Message Input */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-full px-3 py-2">
              <p className="text-sm text-gray-500">Message...</p>
            </div>
            <Send className="w-5 h-5 text-blue-500" />
          </div>
        </div>
      </div>
    );
  };

  const renderConversationView = () => {
    const { openingMessage, publicReply } = automationState.advancedSettings;
    
    return (
      <div className="h-full bg-white">
        {/* DM Header */}
        <div className="flex items-center gap-3 p-3 border-b border-gray-100">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div>
            <p className="text-sm font-semibold text-black">loomsuitemarketng</p>
            <p className="text-xs text-gray-500">Active now</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-3 space-y-3">
          {/* User Message */}
          <div className="flex justify-end">
            <div className="bg-blue-500 text-white px-3 py-2 rounded-2xl max-w-xs">
              <p className="text-sm">{automationState.keywords[0] || "Hello"}</p>
            </div>
          </div>

          {/* Opening Message */}
          {openingMessage.enabled && openingMessage.message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 px-3 py-2 rounded-2xl max-w-xs">
                <p className="text-sm text-black">{openingMessage.message}</p>
              </div>
            </motion.div>
          )}

          {/* Main DM Response */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 px-3 py-2 rounded-2xl max-w-xs">
              {automationState.dmConfig.image && (
                <div className="mb-2">
                  <img 
                    src={automationState.dmConfig.image} 
                    alt="DM content"
                    className="w-full rounded-lg"
                  />
                </div>
              )}
              {automationState.dmConfig.message && (
                <p className="text-sm text-black">{automationState.dmConfig.message}</p>
              )}
              {automationState.dmConfig.buttons.length > 0 && (
                <div className="mt-2 space-y-1">
                  {automationState.dmConfig.buttons.map((button, index) => (
                    <button
                      key={index}
                      className="w-full bg-blue-500 text-white py-1 px-3 rounded text-xs"
                    >
                      {button.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Message Input */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-full px-3 py-2">
              <p className="text-sm text-gray-500">Message...</p>
            </div>
            <Send className="w-5 h-5 text-blue-500" />
          </div>
        </div>
      </div>
    );
  };

  const renderStoryView = () => {
    if (!automationState.selectedPost || automationState.selectedPost.type !== 'story') {
      return renderPostView();
    }

    const post = automationState.selectedPost;
    
    return (
      <div className="h-full bg-black relative overflow-hidden">
        {/* Story Image */}
        <div className="absolute inset-0">
          <img 
            src={post.image} 
            alt="Story content"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>

        {/* Story Header */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">@</span>
              </div>
              <span className="text-white text-sm font-semibold">loomsuitemarketng</span>
              <span className="text-white text-xs opacity-75">2h</span>
            </div>
            <div className="text-white">⋯</div>
          </div>
          
          {/* Story Progress Bar */}
          <div className="mt-2 h-0.5 bg-white bg-opacity-30 rounded-full">
            <div className="h-full bg-white rounded-full w-3/4"></div>
          </div>
        </div>

        {/* Story Content */}
        <div className="absolute bottom-20 left-4 right-4 z-10">
          <p className="text-white text-lg font-medium mb-2">{post.caption}</p>
          
          {/* Story Reactions */}
          {automationState.keywords.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black bg-opacity-50 rounded-full px-4 py-2 mb-3"
            >
              <p className="text-white text-sm">
                💬 Reply with "{automationState.keywords[0]}" to get started!
              </p>
            </motion.div>
          )}
        </div>

        {/* Story Actions */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">❤️</span>
                </div>
                <span className="text-white text-xs">{post.engagement?.reactions || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">💬</span>
                </div>
                <span className="text-white text-xs">{post.engagement?.replies || 0}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">📤</span>
              </div>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white bg-opacity-20 rounded-full px-4 py-2">
              <p className="text-white text-sm opacity-75">Send message</p>
            </div>
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">❤️</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFollowPromptView = () => {
    if (!automationState.advancedSettings.requireFollow) {
      return renderDMView();
    }

    return (
      <div className="h-full bg-white">
        {/* DM Header */}
        <div className="flex items-center gap-3 p-3 border-b border-gray-100">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div>
            <p className="text-sm font-semibold text-black">loomsuitemarketng</p>
            <p className="text-xs text-gray-500">Active now</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-3 space-y-3">
          {/* User Message */}
          <div className="flex justify-end">
            <div className="bg-blue-500 text-white px-3 py-2 rounded-2xl max-w-xs">
              <p className="text-sm">{automationState.keywords[0] || "Hello"}</p>
            </div>
          </div>

          {/* Follow Prompt */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 px-3 py-2 rounded-2xl max-w-xs">
              <p className="text-sm text-black mb-2">
                Thanks for your interest! Please follow our account to receive your exclusive content.
              </p>
              <div className="bg-blue-500 text-white py-2 px-4 rounded-lg text-center">
                <p className="text-sm font-medium">Follow @loomsuitemarketng</p>
              </div>
            </div>
          </motion.div>

          {/* Follow Confirmation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end"
          >
            <div className="bg-blue-500 text-white px-3 py-2 rounded-2xl max-w-xs">
              <p className="text-sm">✅ Followed!</p>
            </div>
          </motion.div>

          {/* Automated Response After Follow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 px-3 py-2 rounded-2xl max-w-xs">
              <p className="text-sm text-black mb-2">
                Awesome! Thanks for following. Here's your exclusive content:
              </p>
              {automationState.dmConfig.image && (
                <div className="mb-2">
                  <img 
                    src={automationState.dmConfig.image} 
                    alt="DM content"
                    className="w-full rounded-lg"
                  />
                </div>
              )}
              {automationState.dmConfig.message && (
                <p className="text-sm text-black">{automationState.dmConfig.message}</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Message Input */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-full px-3 py-2">
              <p className="text-sm text-gray-500">Message...</p>
            </div>
            <Send className="w-5 h-5 text-blue-500" />
          </div>
        </div>
      </div>
    );
  };

  const renderPreviewContent = () => {
    switch (automationState.previewMode) {
      case 'story':
        return renderStoryView();
      case 'comment':
        return renderCommentView();
      case 'dm':
        return renderDMView();
      case 'conversation':
        return renderConversationView();
      case 'follow-prompt':
        return renderFollowPromptView();
      default:
        return renderPostView();
    }
  };

  return (
    <div className="w-full h-full bg-white">
      {renderPreviewContent()}
    </div>
  );
};

export default InstagramPreview;