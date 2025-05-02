import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { 
  MessageCircle, 
  Facebook, 
  Instagram, 
  Share, 
  Clock, 
  Target, 
  Hash, 
  X,
  Video,
  MessageSquare,
  CircleDollarSign
} from 'lucide-react';

function CommentAutomationNode({ data, id }) {
  const handleDelete = () => {
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  const platformIcons = {
    'Facebook': <Facebook className="w-4 h-4" />,
    'Instagram': <Instagram className="w-4 h-4" />
  };

  const contentTypeIcons = {
    'Post': <Share className="w-4 h-4" />,
    'Ad': <CircleDollarSign className="w-4 h-4" />,
    'Video': <Video className="w-4 h-4" />
  };

  const platformColors = {
    'Facebook': 'bg-blue-500',
    'Instagram': 'bg-gradient-to-r from-purple-500 to-pink-500',
    'Both': 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'
  };

  const renderTemplatePreview = () => {
    const template = data.commentTemplate || "Thanks for your post! We appreciate your content.";
    return (
      <div className="bg-violet-50/50 p-1.5 rounded border border-violet-100 text-violet-700 mb-2 line-clamp-3">
        {template}
      </div>
    );
  };

  return (
    <div className="relative rounded-lg shadow-md bg-white border-2 border-violet-200 min-w-[220px] max-w-[280px]">
      {/* Delete button */}
      <button
        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-gray-200 hover:bg-red-50 transition-colors"
        onClick={handleDelete}
      >
        <X className="h-3 w-3 text-gray-500 hover:text-red-500" />
      </button>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-3 py-2 rounded-t-lg border-b border-violet-100 flex items-center gap-2">
        <div className="bg-violet-100 p-1.5 rounded-md">
          <MessageCircle className="h-4 w-4 text-violet-600" />
        </div>
        <div className="font-medium text-sm text-violet-800 truncate">
          {data.label || 'Comment Automation'}
        </div>
      </div>
      
      {/* Body */}
      <div className="px-3 py-2 text-xs">
        {/* Platform indicator */}
        <div className="flex items-center mb-2">
          <span className="text-gray-600 mr-2">Platform:</span>
          <div className="flex items-center gap-1.5">
            <div className={`h-2.5 w-2.5 rounded-full ${platformColors[data.platform || 'Both']}`}></div>
            <span className="text-gray-800">{data.platform || 'Both'}</span>
          </div>
        </div>
        
        {/* Content Type */}
        <div className="flex items-center mb-2">
          <span className="text-gray-600 mr-2">Content:</span>
          <div className="flex items-center gap-1.5">
            {contentTypeIcons[data.contentType || 'Post']}
            <span className="text-gray-800">{data.contentType || 'Post'}</span>
          </div>
        </div>
        
        {/* Timing settings */}
        <div className="flex items-center mb-2">
          <span className="text-gray-600 mr-2">Timing:</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-gray-500" />
            <span className="text-gray-800">{data.timing || 'Immediate'}</span>
          </div>
        </div>
        
        {/* Targeting */}
        {data.targeting && (
          <div className="flex items-start mb-2">
            <span className="text-gray-600 mr-2">Target:</span>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <Target className="w-3 h-3 text-gray-500" />
                <span className="text-gray-800">{data.targeting}</span>
              </div>
              {data.hashtags && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.hashtags.split(',').map((tag, i) => (
                    <span key={i} className="text-xs bg-gray-100 px-1.5 py-0.5 rounded flex items-center">
                      <Hash className="w-2.5 h-2.5 mr-0.5 text-gray-500" />
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Comment Template */}
        <div className="mb-2">
          <div className="text-gray-600 mb-1">Comment Template:</div>
          {renderTemplatePreview()}
        </div>
        
        {/* Variables */}
        {data.useDynamicValues && (
          <div className="mb-2">
            <span className="text-gray-600">Variables:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {['{{user}}', '{{post_text}}', '{{time}}'].map((variable, i) => (
                <span key={i} className="text-xs bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded">
                  {variable}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Description */}
        {data.description && (
          <div className="bg-gray-50 p-1.5 rounded border border-gray-100 text-gray-700 mt-1">
            {data.description}
          </div>
        )}
      </div>
      
      {/* Handles for input (top) and output (bottom) */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-violet-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-violet-500"
      />
    </div>
  );
}

export default memo(CommentAutomationNode); 