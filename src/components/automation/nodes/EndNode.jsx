import { Handle, Position } from 'reactflow';
import { StopCircle, CheckCircle, XCircle, AlertCircle, Clock, RotateCcw } from 'lucide-react';

function EndNode({ data }) {
  const endTypeIcons = {
    'Complete': <CheckCircle className="w-4 h-4" />,
    'Error': <XCircle className="w-4 h-4" />,
    'Terminate': <StopCircle className="w-4 h-4" />,
    'Wait': <Clock className="w-4 h-4" />,
    'Retry': <RotateCcw className="w-4 h-4" />,
    'Alert': <AlertCircle className="w-4 h-4" />
  };

  const endTypeColors = {
    'Complete': 'bg-green-50 border-green-200 text-green-700',
    'Error': 'bg-red-50 border-red-200 text-red-700',
    'Terminate': 'bg-slate-50 border-slate-200 text-slate-700',
    'Wait': 'bg-blue-50 border-blue-200 text-blue-700',
    'Retry': 'bg-amber-50 border-amber-200 text-amber-700',
    'Alert': 'bg-orange-50 border-orange-200 text-orange-700'
  };

  const getColorClassNames = (endType) => {
    return endTypeColors[endType] || 'bg-gray-50 border-gray-200 text-gray-700';
  };

  const getBorderClass = (endType) => {
    const colorClass = endTypeColors[endType] || 'border-gray-200';
    return colorClass.split(' ').find(cls => cls.startsWith('border-'));
  };

  const renderEndDetails = () => {
    if (!data.endDetails) return null;

    return (
      <div className="mt-3">
        {data.endDetails.message && (
          <div className="flex items-start mb-2">
            <div className="text-xs text-gray-500 min-w-[80px]">Message:</div>
            <div className="text-xs font-medium">{data.endDetails.message}</div>
          </div>
        )}
        
        {data.endDetails.code && (
          <div className="flex items-start mb-2">
            <div className="text-xs text-gray-500 min-w-[80px]">Code:</div>
            <div className="text-xs font-medium">{data.endDetails.code}</div>
          </div>
        )}

        {data.endDetails.waitTime && (
          <div className="flex items-start mb-2">
            <div className="text-xs text-gray-500 min-w-[80px]">Wait Time:</div>
            <div className="text-xs font-medium">{data.endDetails.waitTime}</div>
          </div>
        )}

        {data.endDetails.retryCount && (
          <div className="flex items-start mb-2">
            <div className="text-xs text-gray-500 min-w-[80px]">Retries:</div>
            <div className="text-xs font-medium">{data.endDetails.retryCount}</div>
          </div>
        )}

        {data.endDetails.alertLevel && (
          <div className="flex items-start mb-2">
            <div className="text-xs text-gray-500 min-w-[80px]">Alert Level:</div>
            <div className="text-xs font-medium">{data.endDetails.alertLevel}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white shadow-md rounded-lg border ${getBorderClass(data.endType)} w-60`}>
      <div className={`px-3 py-2.5 rounded-t-lg ${getColorClassNames(data.endType)} flex items-center`}>
        <div className="p-1.5 bg-white rounded-full mr-2 border border-current shadow-sm">
          {endTypeIcons[data.endType] || <StopCircle className="w-4 h-4" />}
        </div>
        <span className="font-medium">End: {data.label || 'Finish'}</span>
      </div>
      
      <div className="p-3">
        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-1">End Type</div>
          <div className="text-sm font-medium">{data.endType || 'Complete'}</div>
        </div>
        
        {data.description && (
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-1">Description</div>
            <div className="text-sm text-gray-700">{data.description}</div>
          </div>
        )}

        {renderEndDetails()}
      </div>
      
      {/* Handle for input */}
      <Handle
        type="target"
        position={Position.Top}
        className={`w-3 h-3 bg-white border-2 ${getBorderClass(data.endType)}`}
      />
      
      {/* Visual indicator for input */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-1">
        <StopCircle className={`w-3 h-3 ${endTypeColors[data.endType]?.split(' ').find(cls => cls.startsWith('text-')) || 'text-gray-700'}`} />
      </div>
    </div>
  );
}

export default EndNode; 