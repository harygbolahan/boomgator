import { motion } from "framer-motion";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Settings, Save, Eye } from "lucide-react";
import { useAutomation } from "@/contexts/AutomationContext";
import MobilePreview from "./preview/MobilePreview";
import PreviewControls from "./preview/PreviewControls";
import ActionsPane from "./actions/ActionsPane";

const AutomationEditor = ({ 
  configData, 
  updateConfigData, 
  updateResponseConfig,
  handleSaveAutomation,
  validateStepConfig,
  isLoading,
  pages,
  loadingPages 
}) => {
  const { 
    automationState, 
    setCurrentStep
  } = useAutomation();

  const handleBack = () => {
    setCurrentStep('template');
  };

  const handleSave = async () => {
    try {
      // Validate all configurations before saving
      const isValid = validateStepConfig && validateStepConfig('editor');
      
      if (!isValid) {
        console.warn('Validation failed, cannot save automation');
        return;
      }

      const result = await handleSaveAutomation();
      if (result?.success) {
        console.log('Automation saved successfully');
        // Could navigate to automations list or show success message
      }
    } catch (error) {
      console.error('Failed to save automation:', error);
    }
  };

  const getPlatformInfo = () => {
    if (configData.servicePlatform) {
      return {
        name: configData.servicePlatform.name,
        icon: configData.servicePlatform.icon,
        color: configData.servicePlatform.gradient
      };
    }
    
    return automationState.platform === 'instagram' 
      ? { name: 'Instagram', icon: '📷', color: 'from-purple-500 to-pink-500' }
      : { name: 'Facebook', icon: '📘', color: 'from-blue-600 to-blue-700' };
  };

  const getTemplateInfo = () => {
    if (configData.pagePost?.template) {
      return configData.pagePost.template.title;
    }
    
    const templates = {
      comments: 'Instant DM from Comments',
      stories: 'Instant DM from Stories', 
      dm: 'Respond to all DMs'
    };
    return templates[automationState.template] || 'Unknown Template';
  };

  const getPageInfo = () => {
    if (configData.pagePost) {
      return {
        name: configData.pagePost.page_name,
        platform: configData.pagePost.platform_name
      };
    }
    return null;
  };

  const platformInfo = getPlatformInfo();
  const pageInfo = getPageInfo();

  // Check if configuration is complete
  const isConfigComplete = configData.servicePlatform && configData.pagePost;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 px-6 py-4"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            
            <div className="flex items-center gap-3">
              <Badge 
                variant="secondary" 
                className={`px-3 py-1 text-sm font-medium bg-gradient-to-r ${platformInfo.color} text-white`}
              >
                {platformInfo.icon} {platformInfo.name}
              </Badge>
              
              <span className="text-gray-300 hidden sm:inline">•</span>
              
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                {getTemplateInfo()}
              </span>
              
              {pageInfo && (
                <>
                  <span className="text-gray-300 hidden md:inline">•</span>
                  <span className="text-xs text-gray-500 hidden md:inline">
                    {pageInfo.name}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              size="sm"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Preview</span>
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={isLoading || !isConfigComplete}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
              size="sm"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">{isLoading ? 'Saving...' : 'Save Automation'}</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Configuration Status Banner */}
      {!isConfigComplete && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border-b border-yellow-200 px-6 py-3"
        >
          <div className="max-w-7xl mx-auto">
            <p className="text-yellow-800 text-sm">
              ⚠️ Complete your platform and template selection to enable automation configuration.
            </p>
          </div>
        </motion.div>
      )}

      {/* Main Editor Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 h-[calc(100vh-120px)]">
          {/* Left Pane - Mobile Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 flex flex-col order-2 lg:order-1"
          >
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Live Preview
              </h2>
              <Badge variant="outline" className="text-xs">
                {automationState.previewMode || 'DM'}
              </Badge>
            </div>
            
            <div className="flex-1 flex items-center justify-center min-h-0 mb-4">
              <MobilePreview 
                configData={configData}
                platformInfo={platformInfo}
              />
            </div>
            
            {/* Preview Controls */}
            <div className="flex-shrink-0">
              <PreviewControls 
                configData={configData}
                updateConfigData={updateConfigData}
              />
            </div>
          </motion.div>

          {/* Right Pane - Actions Configuration */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col order-1 lg:order-2 min-h-0"
          >
            <div className="p-4 md:p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Automation Setup
                </h2>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Configure your automation triggers and responses
              </p>
              
              {/* Configuration Progress */}
              {isConfigComplete && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-800 text-sm font-medium">
                    ✓ Platform and template configured. Set up your automation responses below.
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-h-0">
              <ActionsPane 
                configData={configData}
                updateConfigData={updateConfigData}
                updateResponseConfig={updateResponseConfig}
                validateStepConfig={validateStepConfig}
                platformInfo={platformInfo}
                pageInfo={pageInfo}
                isConfigComplete={isConfigComplete}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AutomationEditor;