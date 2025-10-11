import { useState } from "react";
import { motion } from "framer-motion";
import { Settings2, Heart, MessageCircle, Share, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAutomation } from "@/contexts/AutomationContext";

const TemplateSpecificSettings = () => {
  const { 
    automationState, 
    updateAdvancedSettings 
  } = useAutomation();

  const [storySettings, setStorySettings] = useState({
    reactionTriggers: ['heart', 'fire', 'clap'],
    swipeUpAction: 'dm',
    storyDuration: '24h',
    autoReplyToReactions: true
  });

  const [dmSettings, setDMSettings] = useState({
    welcomeDelay: '0',
    typingIndicator: true,
    readReceipts: true,
    autoMarkAsRead: false
  });

  const handleStorySettingChange = (key, value) => {
    setStorySettings(prev => ({ ...prev, [key]: value }));
  };

  const handleDMSettingChange = (key, value) => {
    setDMSettings(prev => ({ ...prev, [key]: value }));
  };

  const renderCommentsTemplateSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <MessageCircle className="w-5 h-5 text-blue-500" />
        <h4 className="font-medium text-gray-900">Comment Automation Settings</h4>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Auto-like triggering comments</Label>
            <p className="text-xs text-gray-500">Automatically like comments that trigger the automation</p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Reply publicly before DM</Label>
            <p className="text-xs text-gray-500">Post a public comment reply before sending the DM</p>
          </div>
          <Switch />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Comment response delay</Label>
          <Select defaultValue="instant">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instant">Instant</SelectItem>
              <SelectItem value="30s">30 seconds</SelectItem>
              <SelectItem value="1m">1 minute</SelectItem>
              <SelectItem value="5m">5 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Maximum responses per user</Label>
          <Select defaultValue="1">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 response</SelectItem>
              <SelectItem value="3">3 responses</SelectItem>
              <SelectItem value="5">5 responses</SelectItem>
              <SelectItem value="unlimited">Unlimited</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStoriesTemplateSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Eye className="w-5 h-5 text-purple-500" />
        <h4 className="font-medium text-gray-900">Story Automation Settings</h4>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Reaction triggers</Label>
          <div className="flex flex-wrap gap-2">
            {['❤️', '🔥', '👏', '😍', '🤩', '💯'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  const isSelected = storySettings.reactionTriggers.includes(emoji);
                  const newTriggers = isSelected
                    ? storySettings.reactionTriggers.filter(r => r !== emoji)
                    : [...storySettings.reactionTriggers, emoji];
                  handleStorySettingChange('reactionTriggers', newTriggers);
                }}
                className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg transition-colors ${
                  storySettings.reactionTriggers.includes(emoji)
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500">Select which story reactions will trigger the automation</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Auto-reply to story reactions</Label>
            <p className="text-xs text-gray-500">Send DM when users react to your story</p>
          </div>
          <Switch 
            checked={storySettings.autoReplyToReactions}
            onCheckedChange={(checked) => handleStorySettingChange('autoReplyToReactions', checked)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Story visibility duration</Label>
          <Select 
            value={storySettings.storyDuration}
            onValueChange={(value) => handleStorySettingChange('storyDuration', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 hours (default)</SelectItem>
              <SelectItem value="12h">12 hours</SelectItem>
              <SelectItem value="6h">6 hours</SelectItem>
              <SelectItem value="1h">1 hour</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Track story views</Label>
            <p className="text-xs text-gray-500">Monitor who views your automated stories</p>
          </div>
          <Switch defaultChecked />
        </div>
      </div>
    </div>
  );

  const renderDMTemplateSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <MessageCircle className="w-5 h-5 text-green-500" />
        <h4 className="font-medium text-gray-900">DM Automation Settings</h4>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Welcome message delay</Label>
          <Select 
            value={dmSettings.welcomeDelay}
            onValueChange={(value) => handleDMSettingChange('welcomeDelay', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Instant</SelectItem>
              <SelectItem value="30">30 seconds</SelectItem>
              <SelectItem value="60">1 minute</SelectItem>
              <SelectItem value="300">5 minutes</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">Delay before sending the automated response</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Show typing indicator</Label>
            <p className="text-xs text-gray-500">Display "typing..." before sending messages</p>
          </div>
          <Switch 
            checked={dmSettings.typingIndicator}
            onCheckedChange={(checked) => handleDMSettingChange('typingIndicator', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Send read receipts</Label>
            <p className="text-xs text-gray-500">Show when you've read incoming messages</p>
          </div>
          <Switch 
            checked={dmSettings.readReceipts}
            onCheckedChange={(checked) => handleDMSettingChange('readReceipts', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Auto-mark as read</Label>
            <p className="text-xs text-gray-500">Automatically mark messages as read after responding</p>
          </div>
          <Switch 
            checked={dmSettings.autoMarkAsRead}
            onCheckedChange={(checked) => handleDMSettingChange('autoMarkAsRead', checked)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Response rate limit</Label>
          <Select defaultValue="unlimited">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 per user per day</SelectItem>
              <SelectItem value="3">3 per user per day</SelectItem>
              <SelectItem value="10">10 per user per day</SelectItem>
              <SelectItem value="unlimited">Unlimited</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderTemplateSettings = () => {
    switch (automationState.template) {
      case 'comments':
        return renderCommentsTemplateSettings();
      case 'stories':
        return renderStoriesTemplateSettings();
      case 'dm':
        return renderDMTemplateSettings();
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <Settings2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Select a template to see specific settings</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="font-medium text-gray-900 flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-purple-500" />
          Template-Specific Settings
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Advanced options tailored for your selected automation template
        </p>
      </div>

      {/* Template Settings */}
      <motion.div
        key={automationState.template}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderTemplateSettings()}
      </motion.div>

      {/* Performance Tips */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          💡 Performance Tips
        </h4>
        <div className="text-sm text-blue-700 space-y-1">
          {automationState.template === 'comments' && (
            <>
              <p>• Use specific keywords to reduce false triggers</p>
              <p>• Enable public replies to increase engagement</p>
              <p>• Set response limits to avoid spam detection</p>
            </>
          )}
          {automationState.template === 'stories' && (
            <>
              <p>• Use eye-catching visuals to increase story views</p>
              <p>• Select popular reaction emojis for better engagement</p>
              <p>• Keep story content relevant to your automation</p>
            </>
          )}
          {automationState.template === 'dm' && (
            <>
              <p>• Add typing delays for more natural conversations</p>
              <p>• Use personalized welcome messages</p>
              <p>• Monitor response rates to optimize timing</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateSpecificSettings;