import React from 'react';
import { Handle, Position } from 'reactflow';
import { Settings, Trash2, CheckCircle, AlertCircle, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';

const KeywordsNode = ({ data, id }) => {
  const handleConfigure = (e) => {
    e.preventDefault();
    e.stopPropagation();
    data.onConfigure?.(id);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    data.onDelete?.(id);
  };

  const handleNodeClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className={`relative bg-white rounded-lg border-2 shadow-lg min-w-[280px] ${
        data.isConfigured ? 'border-purple-500' : 'border-gray-300'
      }`}
      onClick={handleNodeClick}
      style={{ pointerEvents: 'all' }}
    >
      {/* Header */}
      <div className={`px-4 py-3 rounded-t-lg flex items-center justify-between ${
        data.isConfigured ? 'bg-purple-50' : 'bg-gray-50'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            data.isConfigured ? 'bg-purple-100' : 'bg-gray-200'
          }`}>
            <Hash className={`w-5 h-5 ${data.isConfigured ? 'text-purple-600' : 'text-gray-500'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{data.label}</h3>
            <p className="text-xs text-gray-500">Set trigger keywords</p>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          {data.isConfigured ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-orange-500" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {data.isConfigured ? (
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Keywords:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {data.configData?.keywords?.slice(0, 3).map((keyword, index) => (
                <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                  {keyword}
                </span>
              ))}
              {data.configData?.keywords?.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{data.configData.keywords.length - 3} more
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              Triggers when comments contain these keywords
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 mb-3">Not setup yet</p>
            <Button
              onClick={handleConfigure}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white nodrag"
              disabled={!data.isEnabled}
              style={{ pointerEvents: 'all' }}
            >
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
          </div>
        )}

        {/* Actions */}
        {data.isConfigured && (
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
            <Button
              onClick={handleConfigure}
              variant="outline"
              size="sm"
              className="text-xs nodrag"
              style={{ pointerEvents: 'all' }}
            >
              <Settings className="w-3 h-3 mr-1" />
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50 text-xs nodrag"
              style={{ pointerEvents: 'all' }}
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* React Flow Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
        style={{ top: -6 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
        style={{ bottom: -6 }}
      />
    </div>
  );
};

export default KeywordsNode; 