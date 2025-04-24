import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Send, 
  MessageSquare, 
  FileEdit, 
  MailCheck, 
  Database, 
  Calendar, 
  Webhook, 
  Upload, 
  Download, 
  ListTodo, 
  FileText, 
  CheckCircle2, 
  Bell, 
  Play, 
  ChevronRight,
  MessageCircle,
  Save,
  Share,
  Image,
  Link,
  Bot,
  Users,
  CreditCard,
  X,
  Tag,
  Globe
} from 'lucide-react';

function ActionNode({ data, id }) {
  const handleDelete = () => {
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  const actionTypeIcons = {
    'SendEmail': <Send className="w-4 h-4" />,
    'SendMessage': <MessageSquare className="w-4 h-4" />,
    'UpdateRecord': <FileEdit className="w-4 h-4" />,
    'NotifyUser': <Bell className="w-4 h-4" />,
    'CreateRecord': <Database className="w-4 h-4" />,
    'ScheduleEvent': <Calendar className="w-4 h-4" />,
    'CallWebhook': <Webhook className="w-4 h-4" />,
    'UploadFile': <Upload className="w-4 h-4" />,
    'DownloadFile': <Download className="w-4 h-4" />,
    'CreateTask': <ListTodo className="w-4 h-4" />,
    'GenerateDocument': <FileText className="w-4 h-4" />,
    'MarkComplete': <CheckCircle2 className="w-4 h-4" />,
    'ExecuteProcess': <Play className="w-4 h-4" />,
    'ReplyToComment': <MessageCircle className="w-4 h-4" />,
    'SendPrivateMessage': <MessageSquare className="w-4 h-4" />,
    'CollectUserData': <Save className="w-4 h-4" />,
    'PostContent': <Share className="w-4 h-4" />,
    'SendImageReply': <Image className="w-4 h-4" />,
    'SendLinkReply': <Link className="w-4 h-4" />,
    'StartWhatsAppBot': <Bot className="w-4 h-4" />,
    'BroadcastToUsers': <Users className="w-4 h-4" />,
    'ProcessPayment': <CreditCard className="w-4 h-4" />
  };

  const actionTypeColors = {
    'SendEmail': 'bg-blue-50 border-blue-200 text-blue-700',
    'SendMessage': 'bg-indigo-50 border-indigo-200 text-indigo-700',
    'UpdateRecord': 'bg-amber-50 border-amber-200 text-amber-700',
    'NotifyUser': 'bg-red-50 border-red-200 text-red-700',
    'CreateRecord': 'bg-emerald-50 border-emerald-200 text-emerald-700',
    'ScheduleEvent': 'bg-purple-50 border-purple-200 text-purple-700',
    'CallWebhook': 'bg-sky-50 border-sky-200 text-sky-700',
    'UploadFile': 'bg-pink-50 border-pink-200 text-pink-700',
    'DownloadFile': 'bg-teal-50 border-teal-200 text-teal-700',
    'CreateTask': 'bg-lime-50 border-lime-200 text-lime-700',
    'GenerateDocument': 'bg-orange-50 border-orange-200 text-orange-700',
    'MarkComplete': 'bg-green-50 border-green-200 text-green-700',
    'ExecuteProcess': 'bg-violet-50 border-violet-200 text-violet-700',
    'ReplyToComment': 'bg-blue-50 border-blue-200 text-blue-700',
    'SendPrivateMessage': 'bg-violet-50 border-violet-200 text-violet-700',
    'CollectUserData': 'bg-emerald-50 border-emerald-200 text-emerald-700',
    'PostContent': 'bg-rose-50 border-rose-200 text-rose-700',
    'SendImageReply': 'bg-pink-50 border-pink-200 text-pink-700',
    'SendLinkReply': 'bg-sky-50 border-sky-200 text-sky-700',
    'StartWhatsAppBot': 'bg-green-50 border-green-200 text-green-700',
    'BroadcastToUsers': 'bg-indigo-50 border-indigo-200 text-indigo-700',
    'ProcessPayment': 'bg-amber-50 border-amber-200 text-amber-700'
  };

  const getColorClassNames = (actionType) => {
    return actionTypeColors[actionType] || 'bg-gray-50 border-gray-200 text-gray-700';
  };

  const getBorderClass = (actionType) => {
    const colorClass = actionTypeColors[actionType] || 'border-gray-200';
    return colorClass.split(' ').find(cls => cls.startsWith('border-'));
  };

  const getHandleClass = (actionType) => {
    const textColor = actionTypeColors[actionType]?.split(' ').find(cls => cls.startsWith('text-')) || 'text-gray-700';
    return textColor.replace('text-', 'border-');
  };

  const formatDuration = (durationMs) => {
    if (!durationMs) return '';
    
    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  };

  const renderParameters = () => {
    if (!data.parameters || Object.keys(data.parameters).length === 0) {
      return <div className="text-xs italic text-gray-500">No parameters defined</div>;
    }

    return Object.entries(data.parameters).map(([key, value], index) => (
      <div key={index} className="mb-2 last:mb-0 flex items-start">
        <div className="min-w-[80px] text-xs text-gray-500 mr-2 pt-0.5">{key}:</div>
        <div className="text-xs font-medium break-words flex-1">
          {typeof value === 'object' 
            ? JSON.stringify(value).slice(0, 50) + (JSON.stringify(value).length > 50 ? '...' : '')
            : String(value)}
        </div>
      </div>
    ));
  };

  const renderActionTypeSpecificContent = () => {
    if (!data.actionType) return null;

    switch (data.actionType) {
      case 'ReplyToComment':
        return (
          <div className="mt-2">
            <div className="text-xs text-gray-500 mb-1">Reply Template</div>
            <div className="text-sm p-1.5 bg-muted/50 rounded">
              {data.replyTemplate || "Thanks for your comment! We appreciate your feedback."}
            </div>
            {data.useDynamicValues && (
              <div className="mt-2">
                <div className="text-xs text-gray-500 mb-1">Dynamic Values</div>
                <div className="flex flex-wrap gap-1">
                  {['{{user_name}}', '{{comment_text}}', '{{post_title}}'].map((tag, i) => (
                    <span key={i} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
        
      case 'SendPrivateMessage':
        return (
          <div className="mt-2">
            <div className="text-xs text-gray-500 mb-1">Message Template</div>
            <div className="text-sm p-1.5 bg-muted/50 rounded">
              {data.messageTemplate || "Hi there! Thanks for engaging with our content."}
            </div>
            {data.includeButtons && (
              <div className="mt-2">
                <div className="text-xs text-gray-500 mb-1">Buttons</div>
                <div className="flex flex-wrap gap-1">
                  {(data.buttons || [{text: 'Visit Website', url: 'https://example.com'}]).map((btn, i) => (
                    <span key={i} className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                      {btn.text}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'CollectUserData':
        return (
          <div className="mt-2">
            <div className="text-xs text-gray-500 mb-1">Data to Collect</div>
            <div className="flex flex-wrap gap-1">
              {(data.dataFields || ['Name', 'Email']).map((field, i) => (
                <span key={i} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                  {field}
                </span>
              ))}
            </div>
            {data.apiEndpoint && (
              <div className="mt-2 text-xs">
                <span className="text-gray-500">API Endpoint:</span> {data.apiEndpoint}
              </div>
            )}
          </div>
        );

      case 'ProcessPayment':
        return (
          <div className="mt-2">
            <div className="text-xs text-gray-500 mb-1">Payment Provider</div>
            <div className="text-sm font-medium">{data.provider || 'Stripe'}</div>
            {data.isRecurring && (
              <div className="mt-1">
                <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                  Recurring Payment
                </span>
              </div>
            )}
            {data.amount && (
              <div className="mt-1 text-xs">
                <span className="text-gray-500">Amount:</span> {data.amount}
              </div>
            )}
          </div>
        );
        
      // Add more cases as needed for other action types
      
      default:
        return null;
    }
  };

  // Action type icon mapping
  const getActionIcon = () => {
    const actionType = data.actionType?.toLowerCase() || 'reply';
    
    switch (actionType) {
      case 'reply': return <MessageCircle className="h-4 w-4 text-emerald-600" />;
      case 'dm': return <Mail className="h-4 w-4 text-emerald-600" />;
      case 'tag': return <Tag className="h-4 w-4 text-emerald-600" />;
      case 'notification': return <Bell className="h-4 w-4 text-emerald-600" />;
      case 'webhook': return <Globe className="h-4 w-4 text-emerald-600" />;
      default: return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
    }
  };

  return (
    <div className="relative rounded-lg shadow-md bg-white border-2 border-emerald-200 min-w-[180px] max-w-[250px]">
      {/* Delete button */}
      <button
        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-gray-200 hover:bg-red-50 transition-colors"
        onClick={handleDelete}
      >
        <X className="h-3 w-3 text-gray-500 hover:text-red-500" />
      </button>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-3 py-2 rounded-t-lg border-b border-emerald-100 flex items-center gap-2">
        <div className="bg-emerald-100 p-1.5 rounded-md">
          {getActionIcon()}
        </div>
        <div className="font-medium text-sm text-emerald-800 truncate">
          {data.label || 'Action'}
        </div>
      </div>
      
      {/* Body */}
      <div className="px-3 py-2 text-xs">
        {/* Action Type */}
        <div className="flex items-center mb-2">
          <span className="text-gray-600 mr-2">Type:</span>
          <span className="text-gray-800">{data.actionType || 'reply'}</span>
        </div>
        
        {/* Message */}
        {data.message && (
          <div className="bg-emerald-50/50 p-1.5 rounded border border-emerald-100 text-emerald-700 mb-2 line-clamp-3">
            {data.message}
          </div>
        )}
        
        {/* Description */}
        {data.description && (
          <div className="bg-gray-50 p-1.5 rounded border border-gray-100 text-gray-700">
            {data.description}
          </div>
        )}
      </div>
      
      {/* Handle for input (top) */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-emerald-500"
      />
    </div>
  );
}

export default memo(ActionNode); 