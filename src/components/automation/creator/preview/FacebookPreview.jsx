import { motion } from "framer-motion";
import { ThumbsUp, MessageCircle, Share, MoreHorizontal } from "lucide-react";
import { useAutomation } from "@/contexts/AutomationContext";

const FacebookPreview = () => {
  const { automationState } = useAutomation();

  const renderPostView = () => {
    if (!automationState.selectedPost) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 px-6 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            📘
          </div>
          <p className="text-sm">You haven't picked a post for your automation yet</p>
        </div>
      );
    }

    const post = automationState.selectedPost;
    
    return (
      <div className="h-full bg-gray-100">
        {/* Facebook Header */}
        <div className="bg-blue-600 p-3 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold">facebook</h1>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full"></div>
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Post Container */}
        <div className="bg-white m-2 rounded-lg shadow-sm">
          {/* Post Header */}
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">L</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Loomsuite Marketing</p>
                <p className="text-xs text-gray-500">2 hours ago • 🌍</p>
              </div>
            </div>
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </div>

          {/* Post Content */}
          <div className="px-3 pb-3">
            <p className="text-sm text-gray-900 mb-3">{post.caption}</p>
          </div>

          {/* Post Image */}
          <div className="relative">
            <img 
              src={post.image} 
              alt="Post content"
              className="w-full aspect-video object-cover"
            />
          </div>

          {/* Engagement Stats */}
          <div className="px-3 py-2 border-b border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                  <ThumbsUp className="w-2 h-2 text-white" />
                </div>
                <span>You and 127 others</span>
              </div>
              <span>23 comments • 5 shares</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-around py-2 px-3">
            <button className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-gray-100 flex-1 justify-center">
              <ThumbsUp className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600 font-medium">Like</span>
            </button>
            <button className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-gray-100 flex-1 justify-center">
              <MessageCircle className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600 font-medium">Comment</span>
            </button>
            <button className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-gray-100 flex-1 justify-center">
              <Share className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600 font-medium">Share</span>
            </button>
          </div>
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
      <div className="h-full bg-gray-100">
        {/* Facebook Header */}
        <div className="bg-blue-600 p-3 text-white">
          <h1 className="text-lg font-bold">facebook</h1>
        </div>

        {/* Post Container */}
        <div className="bg-white m-2 rounded-lg shadow-sm">
          {/* Post Header - Compact */}
          <div className="flex items-center gap-3 p-3 border-b border-gray-100">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">L</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Loomsuite Marketing</p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="p-3">
            <p className="text-sm font-semibold text-gray-900 mb-3">Comments</p>
            
            {/* Sample Comment with Keyword */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-2xl px-3 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">John Doe</span>
                  </div>
                  <p className="text-sm text-gray-900">{firstKeyword}</p>
                </div>
                <div className="flex items-center gap-4 mt-1 px-3">
                  <button className="text-xs text-gray-500 font-medium">Like</button>
                  <button className="text-xs text-gray-500 font-medium">Reply</button>
                  <span className="text-xs text-gray-500">2m</span>
                </div>
              </div>
            </motion.div>

            <div className="text-xs text-gray-500 text-center mt-3">
              ↑ When users comment "{firstKeyword}", automation will trigger
            </div>
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
        {/* Messenger Header */}
        <div className="bg-blue-600 p-3 text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full"></div>
            <div>
              <p className="text-sm font-semibold">Loomsuite Marketing</p>
              <p className="text-xs opacity-80">Active now</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-3 space-y-3 bg-gray-50">
          {/* User Message */}
          <div className="flex justify-end">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl max-w-xs">
              <p className="text-sm">{automationState.keywords[0] || "Hello"}</p>
            </div>
          </div>

          {/* Bot Response */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl max-w-xs shadow-sm">
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
                <p className="text-sm text-gray-900">{automationState.dmConfig.message}</p>
              )}
              {automationState.dmConfig.buttons.length > 0 && (
                <div className="mt-2 space-y-1">
                  {automationState.dmConfig.buttons.map((button, index) => (
                    <button
                      key={index}
                      className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg text-xs font-medium"
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
        <div className="p-3 bg-white border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
              <p className="text-sm text-gray-500">Aa</p>
            </div>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">→</span>
            </div>
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

        {/* Facebook Story Header */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">L</span>
              </div>
              <span className="text-white text-sm font-semibold">Loomsuite Marketing</span>
              <span className="text-white text-xs opacity-75">2h</span>
            </div>
            <div className="text-white">⋯</div>
          </div>
        </div>

        {/* Story Content */}
        <div className="absolute bottom-20 left-4 right-4 z-10">
          <p className="text-white text-lg font-medium mb-2">{post.caption}</p>
          
          {/* Story Call-to-Action */}
          {automationState.keywords.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-600 rounded-lg px-4 py-3 mb-3"
            >
              <p className="text-white text-sm font-medium">
                💬 Comment "{automationState.keywords[0]}" to get started!
              </p>
            </motion.div>
          )}
        </div>

        {/* Story Actions */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">👍</span>
                </div>
                <span className="text-white text-xs">{post.engagement?.reactions || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">💬</span>
                </div>
                <span className="text-white text-xs">{post.engagement?.replies || 0}</span>
              </div>
            </div>
            
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">📤</span>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white bg-opacity-20 rounded-full px-4 py-2">
              <p className="text-white text-sm opacity-75">Write a comment...</p>
            </div>
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">👍</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderConversationView = () => {
    const { openingMessage, publicReply } = automationState.advancedSettings;
    
    return (
      <div className="h-full bg-white">
        {/* Messenger Header */}
        <div className="bg-blue-600 p-3 text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xs font-bold">L</span>
            </div>
            <div>
              <p className="text-sm font-semibold">Loomsuite Marketing</p>
              <p className="text-xs opacity-80">Active now</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-3 space-y-3 bg-gray-50">
          {/* User Message */}
          <div className="flex justify-end">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl max-w-xs">
              <p className="text-sm">{automationState.keywords[0] || "Hello"}</p>
            </div>
          </div>

          {/* Public Reply (if enabled) */}
          {publicReply.enabled && publicReply.replies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-3"
            >
              <p className="text-xs text-blue-600 font-medium mb-1">Public Comment Reply:</p>
              <p className="text-sm text-blue-800">"{publicReply.replies[0]}"</p>
            </motion.div>
          )}

          {/* Opening Message */}
          {openingMessage.enabled && openingMessage.message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl max-w-xs shadow-sm">
                <p className="text-sm text-gray-900">{openingMessage.message}</p>
              </div>
            </motion.div>
          )}

          {/* Main DM Response */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-start"
          >
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl max-w-xs shadow-sm">
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
                <p className="text-sm text-gray-900">{automationState.dmConfig.message}</p>
              )}
              {automationState.dmConfig.buttons.length > 0 && (
                <div className="mt-2 space-y-1">
                  {automationState.dmConfig.buttons.map((button, index) => (
                    <button
                      key={index}
                      className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg text-xs font-medium"
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
        <div className="p-3 bg-white border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
              <p className="text-sm text-gray-500">Aa</p>
            </div>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">→</span>
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
        {/* Messenger Header */}
        <div className="bg-blue-600 p-3 text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xs font-bold">L</span>
            </div>
            <div>
              <p className="text-sm font-semibold">Loomsuite Marketing</p>
              <p className="text-xs opacity-80">Active now</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-3 space-y-3 bg-gray-50">
          {/* User Message */}
          <div className="flex justify-end">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl max-w-xs">
              <p className="text-sm">{automationState.keywords[0] || "Hello"}</p>
            </div>
          </div>

          {/* Follow Prompt */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl max-w-xs shadow-sm">
              <p className="text-sm text-gray-900 mb-2">
                Thanks for your interest! Please follow our page to receive your exclusive content.
              </p>
              <div className="bg-blue-600 text-white py-2 px-4 rounded-lg text-center">
                <p className="text-sm font-medium">Follow Loomsuite Marketing</p>
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
            <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl max-w-xs">
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
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl max-w-xs shadow-sm">
              <p className="text-sm text-gray-900 mb-2">
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
                <p className="text-sm text-gray-900">{automationState.dmConfig.message}</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Message Input */}
        <div className="p-3 bg-white border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
              <p className="text-sm text-gray-500">Aa</p>
            </div>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">→</span>
            </div>
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
    <div className="w-full h-full">
      {renderPreviewContent()}
    </div>
  );
};

export default FacebookPreview;