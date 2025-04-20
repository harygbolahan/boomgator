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
  ChevronRight 
} from 'lucide-react';

function ActionNode({ data }) {
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
    'ExecuteProcess': <Play className="w-4 h-4" />
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
    'ExecuteProcess': 'bg-violet-50 border-violet-200 text-violet-700'
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

  return (
    <div className={`bg-white shadow-md rounded-lg border ${getBorderClass(data.actionType)} w-64`}>
      <div className={`p-2 rounded-t-lg ${getColorClassNames(data.actionType)} flex items-center`}>
        <div className="p-1.5 bg-white rounded-full mr-2 border border-current shadow-sm">
          {actionTypeIcons[data.actionType] || <FileEdit className="w-4 h-4" />}
        </div>
        <span className="font-medium text-sm">{data.label || 'Action'}</span>
      </div>
      
      <div className="p-3">
        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-1">Action Type</div>
          <div className="text-sm font-medium">
            {data.actionType || 'Custom Action'}
          </div>
        </div>
        
        {data.target && (
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-1">Target</div>
            <div className="text-sm font-medium">{data.target}</div>
          </div>
        )}
        
        {data.duration !== undefined && (
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-1">Duration</div>
            <div className="text-sm font-medium">{formatDuration(data.duration)}</div>
          </div>
        )}
        
        {data.description && (
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-1">Description</div>
            <div className="text-sm text-gray-700">{data.description}</div>
          </div>
        )}
        
        {data.parameters && Object.keys(data.parameters).length > 0 && (
          <div>
            <div className="text-xs text-gray-500 mb-1.5">Parameters</div>
            {renderParameters()}
          </div>
        )}

        {data.retryStrategy && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center">
              <div className="text-xs text-gray-500 mr-2">Retry:</div>
              <div className="text-xs px-1.5 py-0.5 bg-gray-100 rounded">
                {data.retryStrategy.attempts} attempts, {data.retryStrategy.interval}s interval
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Handle for input */}
      <Handle
        type="target"
        position={Position.Top}
        className={`w-3 h-3 bg-white border-2 ${getHandleClass(data.actionType)}`}
      />
      
      {/* Handle for output */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={`w-3 h-3 bg-white border-2 ${getHandleClass(data.actionType)}`}
      />
      
      {/* Visual indicators for input/output */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-1">
        <ChevronRight className={`w-3 h-3 rotate-90 ${actionTypeColors[data.actionType]?.split(' ').find(cls => cls.startsWith('text-')) || 'text-gray-700'}`} />
      </div>
      
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rounded-full bg-white p-1">
        <ChevronRight className={`w-3 h-3 -rotate-90 ${actionTypeColors[data.actionType]?.split(' ').find(cls => cls.startsWith('text-')) || 'text-gray-700'}`} />
      </div>
    </div>
  );
}

export default ActionNode; 