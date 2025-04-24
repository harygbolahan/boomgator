import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Zap, 
  Clock, 
  Calendar, 
  Webhook, 
  Database, 
  BellRing, 
  Mail, 
  MessageSquare,
  ChevronRight,
  UserPlus,
  Heart,
  MessageCircle,
  Share,
  X
} from 'lucide-react';

function TriggerNode({ data, id }) {
  const triggerTypeIcons = {
    'Webhook': <Webhook className="w-4 h-4" />,
    'Schedule': <Clock className="w-4 h-4" />,
    'Calendar': <Calendar className="w-4 h-4" />,
    'Database': <Database className="w-4 h-4" />,
    'Notification': <BellRing className="w-4 h-4" />,
    'Email': <Mail className="w-4 h-4" />,
    'Message': <MessageSquare className="w-4 h-4" />,
    'Event': <Zap className="w-4 h-4" />,
    'FollowUs': <UserPlus className="w-4 h-4" />,
    'Comment': <MessageCircle className="w-4 h-4" />,
    'StoryReply': <Share className="w-4 h-4" />,
    'StoryMention': <Heart className="w-4 h-4" />
  };

  const triggerTypeColors = {
    'Webhook': 'bg-pink-50 border-pink-200 text-pink-700',
    'Schedule': 'bg-amber-50 border-amber-200 text-amber-700',
    'Calendar': 'bg-indigo-50 border-indigo-200 text-indigo-700',
    'Database': 'bg-cyan-50 border-cyan-200 text-cyan-700',
    'Notification': 'bg-orange-50 border-orange-200 text-orange-700',
    'Email': 'bg-sky-50 border-sky-200 text-sky-700',
    'Message': 'bg-violet-50 border-violet-200 text-violet-700',
    'Event': 'bg-red-50 border-red-200 text-red-700',
    'FollowUs': 'bg-green-50 border-green-200 text-green-700',
    'Comment': 'bg-blue-50 border-blue-200 text-blue-700',
    'StoryReply': 'bg-purple-50 border-purple-200 text-purple-700',
    'StoryMention': 'bg-rose-50 border-rose-200 text-rose-700'
  };

  const platformColors = {
    'Facebook': 'bg-blue-500',
    'Instagram': 'bg-gradient-to-r from-purple-500 to-pink-500',
    'Twitter': 'bg-sky-500',
    'LinkedIn': 'bg-blue-700',
    'All Platforms': 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
  };

  const platformColor = platformColors[data.platform] || platformColors['All Platforms'];

  const getColorClassNames = (triggerType) => {
    return triggerTypeColors[triggerType] || 'bg-gray-50 border-gray-200 text-gray-700';
  };

  const getBorderClass = (triggerType) => {
    const colorClass = triggerTypeColors[triggerType] || 'border-gray-200';
    return colorClass.split(' ').find(cls => cls.startsWith('border-'));
  };

  const renderTriggerDetails = () => {
    if (!data) return null;

    // Different details based on trigger type
    switch (data.triggerType) {
      case 'Webhook':
        return (
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">Endpoint</div>
            <div className="text-sm font-medium truncate">{data.endpoint || '/api/webhook/trigger'}</div>
            <div className="text-xs text-gray-500 mt-2 mb-1">Method</div>
            <div className="text-sm font-medium">{data.method || 'POST'}</div>
          </div>
        );
      case 'Schedule':
        return (
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">Schedule</div>
            <div className="text-sm font-medium">{data.schedule || 'Every day at 9:00 AM'}</div>
          </div>
        );
      case 'Calendar':
        return (
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">Event</div>
            <div className="text-sm font-medium">{data.event || 'New meeting scheduled'}</div>
          </div>
        );
      case 'Database':
        return (
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">Condition</div>
            <div className="text-sm font-medium">{data.condition || 'Record updated'}</div>
          </div>
        );
      case 'FollowUs':
        return (
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">Platform</div>
            <div className="text-sm font-medium">{data.platform || 'All Platforms'}</div>
            <div className="text-xs text-gray-500 mt-2 mb-1">Action</div>
            <div className="text-sm font-medium">User followed account</div>
          </div>
        );
      case 'Comment':
        return (
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">Post Type</div>
            <div className="text-sm font-medium">{data.postType || 'All Posts'}</div>
            <div className="text-xs text-gray-500 mt-2 mb-1">Reply Strategy</div>
            <div className="text-sm font-medium">{data.replyStrategy || 'Comment & Message'}</div>
          </div>
        );
      case 'StoryReply':
        return (
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">Keyword</div>
            <div className="text-sm font-medium">{data.keyword || 'Any reply'}</div>
            <div className="text-xs text-gray-500 mt-2 mb-1">Action</div>
            <div className="text-sm font-medium">{data.action || 'Start DM conversation'}</div>
          </div>
        );
      case 'StoryMention':
        return (
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">Response</div>
            <div className="text-sm font-medium">{data.response || 'Instant reply'}</div>
          </div>
        );
      case 'Notification':
      case 'Email':
      case 'Message':
      case 'Event':
        return (
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">Source</div>
            <div className="text-sm font-medium">{data.source || 'System'}</div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleDelete = () => {
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  return (
    <div className="relative rounded-lg shadow-md bg-white border-2 border-blue-200 min-w-[180px] max-w-[250px]">
      {/* Delete button */}
      <button
        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-gray-200 hover:bg-red-50 transition-colors"
        onClick={handleDelete}
      >
        <X className="h-3 w-3 text-gray-500 hover:text-red-500" />
      </button>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded-t-lg border-b border-blue-100 flex items-center gap-2">
        <div className="bg-blue-100 p-1.5 rounded-md">
          <Zap className="h-4 w-4 text-blue-600" />
        </div>
        <div className="font-medium text-sm text-blue-800 truncate">
          {data.label || 'Trigger'}
        </div>
      </div>
      
      {/* Body */}
      <div className="px-3 py-2 text-xs">
        {/* Platform indicator */}
        <div className="flex items-center mb-2">
          <span className="text-gray-600 mr-2">Platform:</span>
          <div className="flex items-center gap-1.5">
            <div className={`h-2.5 w-2.5 rounded-full ${platformColor}`}></div>
            <span className="text-gray-800">{data.platform}</span>
          </div>
        </div>
        
        {/* Type indicator */}
        <div className="mb-2">
          <span className="text-gray-600 mr-2">Type:</span>
          <span className="text-gray-800">{data.triggerType}</span>
        </div>
        
        {/* Description */}
        {data.description && (
          <div className="bg-gray-50 p-1.5 rounded border border-gray-100 text-gray-700 mt-1">
            {data.description}
          </div>
        )}
      </div>
      
      {/* Source handle at the bottom (output) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500"
      />
    </div>
  );
}

export default memo(TriggerNode);