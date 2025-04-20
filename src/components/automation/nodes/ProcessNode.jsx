import { Handle, Position } from 'reactflow';
import { Settings, Cpu, Cog, Code, Database, FileText, Filter, Send, Workflow } from 'lucide-react';

function ProcessNode({ data }) {
  const processTypeIcons = {
    'Transform': <Cog className="w-4 h-4" />,
    'Filter': <Filter className="w-4 h-4" />,
    'Compute': <Cpu className="w-4 h-4" />,
    'API': <Send className="w-4 h-4" />,
    'Database': <Database className="w-4 h-4" />,
    'Code': <Code className="w-4 h-4" />,
    'Document': <FileText className="w-4 h-4" />,
    'Workflow': <Workflow className="w-4 h-4" />
  };

  const processTypeColors = {
    'Transform': 'bg-blue-50 border-blue-200 text-blue-700',
    'Filter': 'bg-yellow-50 border-yellow-200 text-yellow-700',
    'Compute': 'bg-indigo-50 border-indigo-200 text-indigo-700',
    'API': 'bg-purple-50 border-purple-200 text-purple-700',
    'Database': 'bg-cyan-50 border-cyan-200 text-cyan-700',
    'Code': 'bg-emerald-50 border-emerald-200 text-emerald-700',
    'Document': 'bg-orange-50 border-orange-200 text-orange-700',
    'Workflow': 'bg-violet-50 border-violet-200 text-violet-700'
  };

  const getColorClassNames = (processType) => {
    return processTypeColors[processType] || 'bg-gray-50 border-gray-200 text-gray-700';
  };

  const getBorderClass = (processType) => {
    const colorClass = processTypeColors[processType] || 'border-gray-200';
    return colorClass.split(' ').find(cls => cls.startsWith('border-'));
  };

  const renderProcessDetails = () => {
    if (!data.processDetails) return null;

    return (
      <div className="mt-3">
        {data.processDetails.input && (
          <div className="flex items-start mb-2">
            <div className="text-xs text-gray-500 min-w-[80px]">Input:</div>
            <div className="text-xs font-medium">{data.processDetails.input}</div>
          </div>
        )}
        
        {data.processDetails.output && (
          <div className="flex items-start mb-2">
            <div className="text-xs text-gray-500 min-w-[80px]">Output:</div>
            <div className="text-xs font-medium">{data.processDetails.output}</div>
          </div>
        )}

        {data.processDetails.endpoint && (
          <div className="flex items-start mb-2">
            <div className="text-xs text-gray-500 min-w-[80px]">Endpoint:</div>
            <div className="text-xs font-medium">{data.processDetails.endpoint}</div>
          </div>
        )}

        {data.processDetails.method && (
          <div className="flex items-start mb-2">
            <div className="text-xs text-gray-500 min-w-[80px]">Method:</div>
            <div className="text-xs font-medium">{data.processDetails.method}</div>
          </div>
        )}

        {data.processDetails.query && (
          <div className="flex items-start mb-2">
            <div className="text-xs text-gray-500 min-w-[80px]">Query:</div>
            <div className="text-xs font-medium">{data.processDetails.query}</div>
          </div>
        )}

        {data.processDetails.transformation && (
          <div className="flex items-start mb-2">
            <div className="text-xs text-gray-500 min-w-[80px]">Transform:</div>
            <div className="text-xs font-medium">{data.processDetails.transformation}</div>
          </div>
        )}

        {data.processDetails.condition && (
          <div className="flex items-start mb-2">
            <div className="text-xs text-gray-500 min-w-[80px]">Condition:</div>
            <div className="text-xs font-medium">{data.processDetails.condition}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white shadow-md rounded-lg border ${getBorderClass(data.processType)} w-60`}>
      <div className={`px-3 py-2.5 rounded-t-lg ${getColorClassNames(data.processType)} flex items-center`}>
        <div className="p-1.5 bg-white rounded-full mr-2 border border-current shadow-sm">
          {processTypeIcons[data.processType] || <Settings className="w-4 h-4" />}
        </div>
        <span className="font-medium">{data.label || 'Process'}</span>
      </div>
      
      <div className="p-3">
        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-1">Process Type</div>
          <div className="text-sm font-medium">{data.processType || 'Transform'}</div>
        </div>
        
        {data.description && (
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-1">Description</div>
            <div className="text-sm text-gray-700">{data.description}</div>
          </div>
        )}

        {renderProcessDetails()}
      </div>
      
      {/* Handle for input */}
      <Handle
        type="target"
        position={Position.Top}
        className={`w-3 h-3 bg-white border-2 ${getBorderClass(data.processType)}`}
      />
      
      {/* Handle for output */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={`w-3 h-3 bg-white border-2 ${getBorderClass(data.processType)}`}
      />
      
      {/* Visual indicator for connection */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-1">
        <Settings className={`w-3 h-3 ${processTypeColors[data.processType]?.split(' ').find(cls => cls.startsWith('text-')) || 'text-gray-700'}`} />
      </div>
      
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rounded-full bg-white p-1">
        <Settings className={`w-3 h-3 ${processTypeColors[data.processType]?.split(' ').find(cls => cls.startsWith('text-')) || 'text-gray-700'}`} />
      </div>
    </div>
  );
}

export default ProcessNode; 