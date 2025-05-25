import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

// Import individual config components
import TriggerConfig from './TriggerConfig';
import PlatformConfig from './PlatformConfig';
import PageConfig from './PageConfig';
import PostConfig from './PostConfig';
import KeywordsConfig from './KeywordsConfig';
import ResponseConfig from './ResponseConfig';
import ConfigSettings from './ConfigSettings';

const BlockConfigModal = ({ node, flowData, onSave, onClose }) => {
  const [configData, setConfigData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  // Initialize config data from existing node data
  useEffect(() => {
    if (node?.data?.configData) {
      setConfigData(node.data.configData);
    }
  }, [node]);

  // Handle save action
  const handleSave = async () => {
    const errors = validateConfig();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      // Add any common processing here
      await onSave(node.id, configData);
    } catch (error) {
      console.error('Error saving config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Validate configuration based on node type
  const validateConfig = () => {
    const errors = [];
    
    switch (node.type) {
      case 'trigger':
        if (!configData.service_id) {
          errors.push('Please select a service type');
        }
        break;
      case 'platform':
        if (!configData.platform_id) {
          errors.push('Please select a platform');
        }
        break;
      case 'page':
        if (!configData.page_id) {
          errors.push('Please select a page');
        }
        break;
      case 'keywords':
        if (!configData.keywords || configData.keywords.length === 0) {
          errors.push('Please add at least one keyword');
        }
        break;
      case 'response':
        const hasComment = configData.comment_content?.trim();
        const hasDM = configData.dm_content?.trim();
        if (!hasComment && !hasDM) {
          errors.push('Please configure at least one response message');
        }
        break;
      case 'config':
        if (!configData.label?.trim()) {
          errors.push('Please enter a label for this automation');
        }
        break;
    }
    
    return errors;
  };

  // Render appropriate config component based on node type
  const renderConfigComponent = () => {
    const commonProps = {
      configData,
      setConfigData,
      flowData,
      validationErrors,
    };

    switch (node.type) {
      case 'trigger':
        return <TriggerConfig {...commonProps} />;
      case 'platform':
        return <PlatformConfig {...commonProps} />;
      case 'page':
        return <PageConfig {...commonProps} />;
      case 'post':
        return <PostConfig {...commonProps} />;
      case 'keywords':
        return <KeywordsConfig {...commonProps} />;
      case 'response':
        return <ResponseConfig {...commonProps} />;
      case 'config':
        return <ConfigSettings {...commonProps} />;
      default:
        return <div>Unknown node type</div>;
    }
  };

  // Get modal title based on node type
  const getModalTitle = () => {
    const titles = {
      trigger: 'Setup Service Type',
      platform: 'Select Platform',
      page: 'Select Page',
      post: 'Select Post or Reel',
      keywords: 'Setup Keywords',
      response: 'Setup Response',
      config: 'Final Configuration',
    };
    return titles[node.type] || 'Configure Block';
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg lg:max-w-2xl max-h-[90vh] mx-auto bg-white rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <DialogHeader className="pb-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900">
              {getModalTitle()}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Configure this step in your automation flow
          </p>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 px-1">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="text-sm text-red-800">
                <strong>Please fix the following errors:</strong>
                <ul className="list-disc list-inside mt-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Config Component */}
          {renderConfigComponent()}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200 flex justify-between gap-3 flex-shrink-0">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 flex-1 sm:flex-none min-w-[120px]"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                <span className="hidden sm:inline">Saving...</span>
                <span className="sm:hidden">Save</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Confirm</span>
                <span className="sm:hidden">Save</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlockConfigModal; 