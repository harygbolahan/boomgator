import { motion } from "framer-motion";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useAutomation } from "@/contexts/AutomationContext";

const TemplateSelector = ({ 
  configData, 
  updateConfigData, 
  pages, 
  loadingPages, 
  validateStepConfig 
}) => {
  const { 
    selectTemplate, 
    automationState, 
    setCurrentStep,
    getAvailableTemplates
  } = useAutomation();

  // Get available templates
  const templates = getAvailableTemplates();

  const handleBack = () => {
    setCurrentStep('platform');
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

  const platformInfo = getPlatformInfo();

  // Filter pages based on selected platform
  const availablePages = pages?.filter(page => {
    if (!configData.servicePlatform) return true;
    return page.platform_name?.toLowerCase() === configData.servicePlatform.name?.toLowerCase();
  }) || [];

  const handleTemplateSelect = (templateId) => {
    const selectedTemplate = templates.find(t => t.id === templateId);
    
    // For now, we'll use the first available page as a default
    // In a real implementation, you might want to show a page selector
    const defaultPage = availablePages[0];
    
    if (defaultPage) {
      // Update configData with selected template/page
      updateConfigData({
        pagePost: {
          page_id: defaultPage.page_id,
          id: defaultPage.id,
          page_name: defaultPage.page_name,
          platform_name: defaultPage.platform_name,
          template: selectedTemplate
        }
      });
    }
    
    // Also update AutomationContext for step navigation
    selectTemplate(templateId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Platform Selection
          </Button>
          
          <Badge 
            variant="secondary" 
            className={`px-4 py-2 text-sm font-medium bg-gradient-to-r ${platformInfo.color} text-white`}
          >
            {platformInfo.icon} {platformInfo.name}
          </Badge>
        </motion.div>

        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Template
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select an automation template to get started. Each template is designed for specific use cases and can be customized to fit your needs.
          </p>
          
          {/* Show current selection */}
          {configData.pagePost && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium"
            >
              ✓ Selected: {configData.pagePost.template?.title || 'Template Selected'}
            </motion.div>
          )}
        </motion.div>

        {/* Available Pages Info */}
        {availablePages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <p className="text-blue-800 text-sm">
              <strong>Available Pages:</strong> {availablePages.length} page(s) found for {platformInfo.name}
              {availablePages.length > 0 && (
                <span className="ml-2">
                  ({availablePages.map(p => p.page_name).join(', ')})
                </span>
              )}
            </p>
          </motion.div>
        )}

        {/* Templates Grid */}
        {loadingPages ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading available pages...</p>
          </div>
        ) : availablePages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">No pages found for {platformInfo.name}. Please connect your {platformInfo.name} account first.</p>
            <Button variant="outline" onClick={() => setCurrentStep('platform')}>
              Go Back to Platform Selection
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {templates.map((template, index) => {
              const isSelected = configData.pagePost?.template?.id === template.id;
              
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className={`h-full cursor-pointer border-2 transition-all duration-300 hover:shadow-xl bg-white ${
                    isSelected 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-transparent hover:border-purple-200'
                  }`}>
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 ${
                        isSelected ? 'ring-4 ring-green-300' : ''
                      }`}>
                        {template.icon}
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                        {template.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="pt-0 pb-6">
                      <p className="text-gray-600 text-center mb-6 leading-relaxed">
                        {template.description}
                      </p>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Sparkles className="w-4 h-4 text-purple-500" />
                          <span>Instant automation</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Sparkles className="w-4 h-4 text-purple-500" />
                          <span>Customizable responses</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Sparkles className="w-4 h-4 text-purple-500" />
                          <span>Real-time triggers</span>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => handleTemplateSelect(template.id)}
                        className={`w-full font-semibold py-3 transition-all duration-300 shadow-lg hover:shadow-xl ${
                          isSelected
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                        }`}
                        size="lg"
                      >
                        {isSelected ? '✓ Selected' : 'Use This Template'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Need help choosing?
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                <strong>Instant DM from Comments:</strong> Perfect for lead generation and customer engagement through post comments.<br/>
                <strong>Instant DM from Stories:</strong> Great for story interactions and quick responses to story reactions.<br/>
                <strong>Respond to all DMs:</strong> Ideal for customer support and automated welcome messages.
              </p>
              
              {/* Validation status */}
              {configData.pagePost && validateStepConfig && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {validateStepConfig('template') ? (
                    <p className="text-green-600 text-sm font-medium">
                      ✓ Template selection complete. You can proceed to the next step.
                    </p>
                  ) : (
                    <p className="text-red-600 text-sm font-medium">
                      Please select a template to continue.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TemplateSelector;