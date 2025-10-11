import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, MessageCircle, Users, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAutomation } from "@/contexts/AutomationContext";

const AdvancedSettings = () => {
  const { 
    automationState, 
    updateAdvancedSettings,
    setPreviewMode 
  } = useAutomation();

  const [newReply, setNewReply] = useState("");

  const handleAdvancedSettingsChange = (settings) => {
    updateAdvancedSettings(settings);
    
    // Auto-switch to conversation preview if advanced settings are configured
    const { openingMessage, publicReply, requireFollow } = { ...automationState.advancedSettings, ...settings };
    if ((openingMessage.enabled && openingMessage.message) || 
        (publicReply.enabled && publicReply.replies.length > 0) || 
        requireFollow) {
      // Use setPreviewMode from context if available
      if (typeof setPreviewMode === 'function') {
        setPreviewMode('conversation');
      }
    }
  };

  const handleOpeningMessageToggle = (enabled) => {
    const settings = {
      openingMessage: {
        ...automationState.advancedSettings.openingMessage,
        enabled
      }
    };
    handleAdvancedSettingsChange(settings);
  };

  const handleOpeningMessageChange = (message) => {
    const settings = {
      openingMessage: {
        ...automationState.advancedSettings.openingMessage,
        message
      }
    };
    handleAdvancedSettingsChange(settings);
  };

  const handlePublicReplyToggle = (enabled) => {
    const settings = {
      publicReply: {
        ...automationState.advancedSettings.publicReply,
        enabled
      }
    };
    handleAdvancedSettingsChange(settings);
  };

  const addPublicReply = () => {
    if (newReply.trim()) {
      const replies = [...automationState.advancedSettings.publicReply.replies, newReply.trim()];
      const settings = {
        publicReply: {
          ...automationState.advancedSettings.publicReply,
          replies
        }
      };
      handleAdvancedSettingsChange(settings);
      setNewReply("");
    }
  };

  const removePublicReply = (index) => {
    const replies = automationState.advancedSettings.publicReply.replies.filter((_, i) => i !== index);
    const settings = {
      publicReply: {
        ...automationState.advancedSettings.publicReply,
        replies
      }
    };
    handleAdvancedSettingsChange(settings);
  };

  const handleRequireFollowToggle = (requireFollow) => {
    handleAdvancedSettingsChange({ requireFollow });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="font-medium text-gray-900 flex items-center gap-2">
          <Settings className="w-4 h-4 text-purple-500" />
          Advanced Automation Settings
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Optional settings to enhance your automation behavior
        </p>
      </div>

      {/* Opening Message */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            <div>
              <h4 className="font-medium text-gray-900">Opening Message</h4>
              <p className="text-sm text-gray-600">Send a welcome message before the main response</p>
            </div>
          </div>
          <Switch
            checked={automationState.advancedSettings.openingMessage.enabled}
            onCheckedChange={handleOpeningMessageToggle}
          />
        </div>

        {automationState.advancedSettings.openingMessage.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <Label htmlFor="opening-message">Welcome Message</Label>
            <Textarea
              id="opening-message"
              placeholder="Hey there! I'm so happy you're here, thanks so much for your interest 😊"
              value={automationState.advancedSettings.openingMessage.message}
              onChange={(e) => handleOpeningMessageChange(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              This message will be sent first, followed by your main DM response
            </p>
          </motion.div>
        )}
      </div>

      {/* Public Reply to Comments */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-green-500" />
            <div>
              <h4 className="font-medium text-gray-900">Publicly Reply to Comments</h4>
              <p className="text-sm text-gray-600">Automatically reply to comments publicly before sending DM</p>
            </div>
          </div>
          <Switch
            checked={automationState.advancedSettings.publicReply.enabled}
            onCheckedChange={handlePublicReplyToggle}
          />
        </div>

        {automationState.advancedSettings.publicReply.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {/* Existing Replies */}
            {automationState.advancedSettings.publicReply.replies.length > 0 && (
              <div className="space-y-2">
                <Label>Public Reply Messages</Label>
                {automationState.advancedSettings.publicReply.replies.map((reply, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-green-900">{reply}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePublicReply(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Add New Reply */}
            <div className="space-y-2">
              <Label htmlFor="new-reply">Add Public Reply</Label>
              <div className="flex gap-2">
                <Input
                  id="new-reply"
                  placeholder="That's sent to you"
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addPublicReply()}
                />
                <Button
                  onClick={addPublicReply}
                  disabled={!newReply.trim()}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                These messages will be posted as public comments before sending the DM
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Require Follow */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-purple-500" />
            <div>
              <h4 className="font-medium text-gray-900">Ask to Follow Before Sending</h4>
              <p className="text-sm text-gray-600">Require users to follow your account before receiving the DM</p>
            </div>
          </div>
          <Switch
            checked={automationState.advancedSettings.requireFollow}
            onCheckedChange={handleRequireFollowToggle}
          />
        </div>

        {automationState.advancedSettings.requireFollow && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 bg-purple-50 border border-purple-200 rounded-lg"
          >
            <p className="text-sm text-purple-800">
              <strong>How it works:</strong> When enabled, users will be asked to follow your account first. 
              Once they follow, they'll automatically receive the DM response.
            </p>
          </motion.div>
        )}
      </div>

      {/* Settings Summary */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Active Settings Summary</h4>
        <div className="space-y-2 text-sm">
          {automationState.advancedSettings.openingMessage.enabled && (
            <div className="flex items-center gap-2 text-blue-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Opening message enabled
            </div>
          )}
          {automationState.advancedSettings.publicReply.enabled && (
            <div className="flex items-center gap-2 text-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Public replies enabled ({automationState.advancedSettings.publicReply.replies.length} messages)
            </div>
          )}
          {automationState.advancedSettings.requireFollow && (
            <div className="flex items-center gap-2 text-purple-700">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Follow requirement enabled
            </div>
          )}
          {!automationState.advancedSettings.openingMessage.enabled && 
           !automationState.advancedSettings.publicReply.enabled && 
           !automationState.advancedSettings.requireFollow && (
            <div className="text-gray-500 italic">No advanced settings enabled</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;