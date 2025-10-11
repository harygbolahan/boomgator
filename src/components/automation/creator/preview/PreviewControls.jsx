import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Image, 
  MessageCircle, 
  Send, 
  Users, 
  Eye,
  Smartphone 
} from "lucide-react";
import { useAutomation } from "@/contexts/AutomationContext";

const PreviewControls = () => {
  const { 
    automationState, 
    setPreviewMode 
  } = useAutomation();

  const previewModes = [
    {
      id: 'post',
      label: 'Post View',
      icon: Image,
      description: 'How your post appears in the feed',
      available: !!automationState.selectedPost
    },
    {
      id: 'story',
      label: 'Story View',
      icon: Eye,
      description: 'Story interaction preview',
      available: automationState.selectedPost?.type === 'story' && automationState.template === 'stories'
    },
    {
      id: 'comment',
      label: 'Comment Trigger',
      icon: MessageCircle,
      description: 'How keyword comments appear',
      available: automationState.keywords.length > 0 && (automationState.template === 'comments' || automationState.template === 'stories')
    },
    {
      id: 'dm',
      label: 'DM Response',
      icon: Send,
      description: 'Automated message preview',
      available: !!(automationState.dmConfig.message || automationState.dmConfig.image)
    },
    {
      id: 'conversation',
      label: 'Full Conversation',
      icon: Smartphone,
      description: 'Complete automation flow',
      available: !!(
        (automationState.advancedSettings.openingMessage.enabled && automationState.advancedSettings.openingMessage.message) ||
        (automationState.advancedSettings.publicReply.enabled && automationState.advancedSettings.publicReply.replies.length > 0)
      )
    },
    {
      id: 'follow-prompt',
      label: 'Follow Prompt',
      icon: Users,
      description: 'Follow requirement flow',
      available: automationState.advancedSettings.requireFollow && !!(automationState.dmConfig.message || automationState.dmConfig.image)
    }
  ];

  const availableModes = previewModes.filter(mode => mode.available);

  if (availableModes.length <= 1) {
    return null; // Don't show controls if there's only one or no available modes
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Preview Mode</h4>
        <Badge variant="outline" className="text-xs">
          {availableModes.length} available
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {availableModes.map((mode) => {
          const Icon = mode.icon;
          const isActive = automationState.previewMode === mode.id;
          
          return (
            <motion.button
              key={mode.id}
              onClick={() => setPreviewMode(mode.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                isActive
                  ? 'border-purple-500 bg-purple-50 text-purple-900'
                  : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-gray-500'}`} />
                <span className="text-sm font-medium">{mode.label}</span>
              </div>
              <p className={`text-xs ${isActive ? 'text-purple-700' : 'text-gray-500'}`}>
                {mode.description}
              </p>
            </motion.button>
          );
        })}
      </div>
      
      <div className="text-xs text-gray-500 text-center">
        Click to switch preview modes
      </div>
    </div>
  );
};

export default PreviewControls;