import { Handle, Position } from 'reactflow';
import { Clock, Calendar } from 'lucide-react';

function DelayNode({ data }) {
  const delayTypeLabels = {
    'FixedTime': 'Fixed Time',
    'FixedDelay': 'Fixed Delay',
    'UntilDate': 'Until Date',
    'UntilDayOfWeek': 'Until Day of Week',
    'UntilTimeOfDay': 'Until Time of Day',
    'Random': 'Random Delay'
  };

  function getDelayIcon(delayType) {
    if (delayType === 'FixedTime' || delayType === 'UntilTimeOfDay') {
      return <Clock className="w-4 h-4" />;
    }
    return <Calendar className="w-4 h-4" />;
  }

  function formatDuration(duration) {
    if (!duration) return '0 minutes';
    
    const units = [
      { value: 86400, label: 'day' },
      { value: 3600, label: 'hour' },
      { value: 60, label: 'minute' },
      { value: 1, label: 'second' }
    ];
    
    let seconds = typeof duration === 'number' ? duration : 0;
    if (typeof duration === 'string') {
      if (duration.includes(':')) {
        // If in HH:MM:SS format
        const parts = duration.split(':').map(Number);
        if (parts.length === 3) {
          seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
        }
      } else {
        seconds = parseInt(duration, 10);
      }
    }
    
    if (isNaN(seconds)) return '0 minutes';
    
    const result = [];
    for (const unit of units) {
      if (seconds >= unit.value) {
        const count = Math.floor(seconds / unit.value);
        seconds %= unit.value;
        result.push(`${count} ${unit.label}${count !== 1 ? 's' : ''}`);
      }
    }
    
    return result.length > 0 ? result.join(', ') : '0 seconds';
  }

  return (
    <div className="bg-white shadow-md rounded-lg border border-blue-200 w-64">
      <div className="p-2 rounded-t-lg border-b border-blue-200 bg-blue-50 flex items-center">
        <div className="p-1 rounded-full mr-2 text-blue-600">
          {getDelayIcon(data.delayType)}
        </div>
        <span className="font-medium text-sm">{data.label || 'Delay'}</span>
      </div>
      
      <div className="p-3">
        <div className="mb-2">
          <div className="text-xs text-gray-500 mb-1">Delay Type</div>
          <div className="text-sm font-medium">
            {delayTypeLabels[data.delayType] || 'Fixed Delay'}
          </div>
        </div>
        
        {data.duration && (
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">Duration</div>
            <div className="text-sm text-gray-700 font-medium">
              {formatDuration(data.duration)}
            </div>
          </div>
        )}
        
        {data.minDuration && (
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">Minimum Duration</div>
            <div className="text-sm text-gray-700">
              {formatDuration(data.minDuration)}
            </div>
          </div>
        )}
        
        {data.maxDuration && (
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">Maximum Duration</div>
            <div className="text-sm text-gray-700">
              {formatDuration(data.maxDuration)}
            </div>
          </div>
        )}
        
        {data.date && (
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">Date</div>
            <div className="text-sm text-gray-700">{data.date}</div>
          </div>
        )}
        
        {data.time && (
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">Time</div>
            <div className="text-sm text-gray-700">{data.time}</div>
          </div>
        )}
        
        {data.dayOfWeek && (
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">Day of Week</div>
            <div className="text-sm text-gray-700">{data.dayOfWeek}</div>
          </div>
        )}
        
        {data.description && (
          <div>
            <div className="text-xs text-gray-500 mb-1">Description</div>
            <div className="text-sm text-gray-700">{data.description}</div>
          </div>
        )}
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-white border-2 border-blue-300"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-white border-2 border-blue-300"
      />
    </div>
  );
}

export default DelayNode; 