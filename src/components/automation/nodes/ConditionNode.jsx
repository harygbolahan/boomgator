import React, { memo } from 'react';
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

function ConditionNode({ data, id }) {
  const handleDelete = () => {
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

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

  // Helper function to get human-readable condition text
  const getConditionText = () => {
    const field = data.field || 'message';
    const type = data.conditionType || 'contains';
    const value = data.value || '';
    
    const typeMap = {
      'contains': 'contains',
      'equals': 'equals',
      'startsWith': 'starts with',
      'endsWith': 'ends with',
      'regex': 'matches pattern'
    };
    
    return `${field} ${typeMap[type]} "${value}"`;
  };

  return (
    <div className="relative rounded-lg shadow-md bg-white border-2 border-amber-200 min-w-[180px] max-w-[250px]">
      {/* Delete button */}
      <button
        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-gray-200 hover:bg-red-50 transition-colors"
        onClick={handleDelete}
      >
        <X className="h-3 w-3 text-gray-500 hover:text-red-500" />
      </button>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-3 py-2 rounded-t-lg border-b border-amber-100 flex items-center gap-2">
        <div className="bg-amber-100 p-1.5 rounded-md">
          {conditionTypeIcons[data.conditionType] || <Filter className="h-4 w-4 text-amber-600" />}
        </div>
        <div className="font-medium text-sm text-amber-800 truncate">
          {data.label || 'Condition'}
        </div>
      </div>
      
      {/* Body */}
      <div className="px-3 py-2 text-xs">
        {/* Condition details */}
        <div className="bg-amber-50/50 p-1.5 rounded border border-amber-100 text-amber-700 mb-2">
          {getConditionText()}
        </div>
        
        {/* Description */}
        {data.description && (
          <div className="bg-gray-50 p-1.5 rounded border border-gray-100 text-gray-700">
            {data.description}
          </div>
        )}
      </div>
      
      {/* Handles for input (top) and output (bottom) */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-amber-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-amber-500"
        id="true"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-amber-500"
        id="false"
        style={{ top: '50%', right: '-8px' }}
      />
      
      {/* Labels for the handles */}
      <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 text-[10px] text-amber-600 font-medium">
        Yes
      </div>
      <div className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 text-[10px] text-amber-600 font-medium">
        No
      </div>
    </div>
  );
}

export default memo(ConditionNode); 