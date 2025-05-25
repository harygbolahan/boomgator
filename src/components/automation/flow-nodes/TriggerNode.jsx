import React from 'react';
import { Handle, Position } from 'reactflow';
import { Settings, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TriggerNode = ({ data, id }) => {
  const handleConfigure = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Configure button clicked for node:', id);
    if (data.onConfigure) {
      data.onConfigure(id);
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Delete button clicked for node:', id);
    if (data.onDelete) {
      data.onDelete(id);
    }
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
          {/* Instagram-like icon */}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            data.isConfigured ? 'bg-purple-100' : 'bg-gray-200'
          }`}>
            <svg className={`w-5 h-5 ${data.isConfigured ? 'text-purple-600' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{data.label}</h3>
            <p className="text-xs text-gray-500">Select service type</p>
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
              <span className="font-medium">Service:</span> {data.configData?.serviceName || 'Configured'}
            </div>
            <div className="text-xs text-gray-500">
              {data.configData?.serviceDescription || 'Trigger configuration completed'}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 mb-3">Not setup yet</p>
            <Button
              onClick={handleConfigure}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white nodrag"
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
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
        style={{ bottom: -6 }}
      />
    </div>
  );
};

export default TriggerNode; 