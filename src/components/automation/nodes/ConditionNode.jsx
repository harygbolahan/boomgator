import { Handle, Position } from 'reactflow';
import {
  Check,
  X,
  ChevronRight,
  SplitSquareVertical,
  Filter,
  LayoutList,
  Code,
  Equal,
  UserCheck,
  UserX,
  CircleDot,
  AlertTriangle,
  CalendarCheck
} from 'lucide-react';

function ConditionNode({ data }) {
  const conditionTypeIcons = {
    'IfElse': <SplitSquareVertical className="w-4 h-4" />,
    'Filter': <Filter className="w-4 h-4" />,
    'ValueComparison': <Equal className="w-4 h-4" />,
    'RoleCheck': <UserCheck className="w-4 h-4" />,
    'PermissionCheck': <UserX className="w-4 h-4" />,
    'StateCheck': <CircleDot className="w-4 h-4" />,
    'ListCheck': <LayoutList className="w-4 h-4" />,
    'CustomLogic': <Code className="w-4 h-4" />,
    'DateTimeCheck': <CalendarCheck className="w-4 h-4" />,
    'ErrorCheck': <AlertTriangle className="w-4 h-4" />
  };

  const conditionTypeColors = {
    'IfElse': 'bg-amber-50 border-amber-200 text-amber-700',
    'Filter': 'bg-indigo-50 border-indigo-200 text-indigo-700',
    'ValueComparison': 'bg-sky-50 border-sky-200 text-sky-700',
    'RoleCheck': 'bg-emerald-50 border-emerald-200 text-emerald-700',
    'PermissionCheck': 'bg-orange-50 border-orange-200 text-orange-700',
    'StateCheck': 'bg-purple-50 border-purple-200 text-purple-700',
    'ListCheck': 'bg-cyan-50 border-cyan-200 text-cyan-700',
    'CustomLogic': 'bg-rose-50 border-rose-200 text-rose-700',
    'DateTimeCheck': 'bg-teal-50 border-teal-200 text-teal-700',
    'ErrorCheck': 'bg-red-50 border-red-200 text-red-700'
  };

  const getColorClassNames = (conditionType) => {
    return conditionTypeColors[conditionType] || 'bg-gray-50 border-gray-200 text-gray-700';
  };

  const getBorderClass = (conditionType) => {
    const colorClass = conditionTypeColors[conditionType] || 'border-gray-200';
    return colorClass.split(' ').find(cls => cls.startsWith('border-'));
  };

  const getHandleClass = (conditionType, isTrue = true) => {
    if (isTrue) {
      return 'border-green-500';
    } else {
      return 'border-red-500';
    }
  };

  const renderConditions = () => {
    if (!data.conditions || data.conditions.length === 0) {
      return <div className="text-xs italic text-gray-500">No conditions defined</div>;
    }

    return data.conditions.map((condition, index) => (
      <div key={index} className="mb-2 last:mb-0 p-1.5 bg-gray-50 rounded text-xs">
        <div className="flex items-center gap-1 text-gray-700">
          <span className="font-medium">{condition.field}</span>
          <span className="text-gray-500">{condition.operator}</span>
          <span className="text-gray-900">{condition.value}</span>
        </div>
      </div>
    ));
  };

  const renderOperator = () => {
    const operator = data.operator?.toUpperCase() || 'AND';
    return (
      <div className="text-xs font-medium px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full">
        {operator}
      </div>
    );
  };

  return (
    <div className={`bg-white shadow-md rounded-lg border ${getBorderClass(data.conditionType)} w-64`}>
      <div className={`p-2 rounded-t-lg ${getColorClassNames(data.conditionType)} flex items-center`}>
        <div className="p-1.5 bg-white rounded-full mr-2 border border-current shadow-sm">
          {conditionTypeIcons[data.conditionType] || <SplitSquareVertical className="w-4 h-4" />}
        </div>
        <span className="font-medium text-sm">{data.label || 'Condition'}</span>
      </div>
      
      <div className="p-3">
        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-1">Condition Type</div>
          <div className="text-sm font-medium">
            {data.conditionType || 'Custom Condition'}
          </div>
        </div>
        
        {data.description && (
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-1">Description</div>
            <div className="text-sm text-gray-700">{data.description}</div>
          </div>
        )}

        {data.conditions && data.conditions.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-xs text-gray-500">Conditions</div>
              {data.conditions.length > 1 && renderOperator()}
            </div>
            {renderConditions()}
          </div>
        )}

        {data.customLogic && (
          <div>
            <div className="text-xs text-gray-500 mb-1.5">Custom Logic</div>
            <div className="text-xs font-mono bg-gray-50 p-1.5 rounded border border-gray-200">
              {data.customLogic}
            </div>
          </div>
        )}
      </div>
      
      {/* Handle for input */}
      <Handle
        type="target"
        position={Position.Top}
        className={`w-3 h-3 bg-white border-2 ${getBorderClass(data.conditionType)}`}
      />
      
      {/* Handle for "true" output */}
      <div className="absolute -right-3 top-1/3 flex items-center">
        <div className="mr-6 flex items-center text-xs text-green-600 font-medium">
          <Check className="w-3 h-3 mr-1" />
          <span>True</span>
        </div>
        <Handle
          id="true"
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-white border-2 border-green-500"
        />
      </div>
      
      {/* Handle for "false" output */}
      <div className="absolute -right-3 bottom-1/3 flex items-center">
        <div className="mr-6 flex items-center text-xs text-red-600 font-medium">
          <X className="w-3 h-3 mr-1" />
          <span>False</span>
        </div>
        <Handle
          id="false"
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-white border-2 border-red-500"
        />
      </div>
      
      {/* Visual indicator for the input */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-1">
        <ChevronRight className={`w-3 h-3 rotate-90 ${conditionTypeColors[data.conditionType]?.split(' ').find(cls => cls.startsWith('text-')) || 'text-gray-700'}`} />
      </div>
    </div>
  );
}

export default ConditionNode; 