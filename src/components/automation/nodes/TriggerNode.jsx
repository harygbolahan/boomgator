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
  ChevronRight
} from 'lucide-react';

function TriggerNode({ data }) {
  const triggerTypeIcons = {
    'Webhook': <Webhook className="w-4 h-4" />,
    'Schedule': <Clock className="w-4 h-4" />,
    'Calendar': <Calendar className="w-4 h-4" />,
    'Database': <Database className="w-4 h-4" />,
    'Notification': <BellRing className="w-4 h-4" />,
    'Email': <Mail className="w-4 h-4" />,
    'Message': <MessageSquare className="w-4 h-4" />,
    'Event': <Zap className="w-4 h-4" />
  };

  const triggerTypeColors = {
    'Webhook': 'bg-pink-50 border-pink-200 text-pink-700',
    'Schedule': 'bg-amber-50 border-amber-200 text-amber-700',
    'Calendar': 'bg-indigo-50 border-indigo-200 text-indigo-700',
    'Database': 'bg-cyan-50 border-cyan-200 text-cyan-700',
    'Notification': 'bg-orange-50 border-orange-200 text-orange-700',
    'Email': 'bg-sky-50 border-sky-200 text-sky-700',
    'Message': 'bg-violet-50 border-violet-200 text-violet-700',
    'Event': 'bg-red-50 border-red-200 text-red-700'
  };

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

  return (
    <div className={`bg-white shadow-md rounded-lg border ${getBorderClass(data.triggerType)} w-60`}>
      <div className={`px-3 py-2.5 rounded-t-lg ${getColorClassNames(data.triggerType)} flex items-center`}>
        <div className="p-1.5 bg-white rounded-full mr-2 border border-current shadow-sm">
          {triggerTypeIcons[data.triggerType] || <Zap className="w-4 h-4" />}
        </div>
        <span className="font-medium">{data.label || 'Trigger'}</span>
      </div>
      
      <div className="p-3">
        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-1">Trigger Type</div>
          <div className="text-sm font-medium">{data.triggerType || 'Webhook'}</div>
        </div>
        
        {data.description && (
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-1">Description</div>
            <div className="text-sm">{data.description}</div>
          </div>
        )}

        {renderTriggerDetails()}
      </div>
      
      {/* Handle for output only */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={`w-3 h-3 bg-white border-2 ${getBorderClass(data.triggerType)}`}
      />
      
      {/* Visual indicator for connection */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rounded-full bg-white p-1">
        <ChevronRight className={`w-3 h-3 ${triggerTypeColors[data.triggerType]?.split(' ').find(cls => cls.startsWith('text-')) || 'text-gray-700'}`} />
      </div>
    </div>
  );
}

export default TriggerNode;