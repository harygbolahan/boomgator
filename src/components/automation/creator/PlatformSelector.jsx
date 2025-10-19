import { motion } from "framer-motion";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAutomation } from "@/contexts/AutomationContext";

const PlatformSelector = ({ 
  configData, 
  updateConfigData, 
  platforms, 
  loadingPlatforms, 
  validateStepConfig 
}) => {
  const { selectPlatform, automationState } = useAutomation();

  // Use live platforms data if available, otherwise fallback to static data
  const platformsData = platforms && platforms.length > 0 ? platforms.map(platform => ({
    id: platform.platform_name?.toLowerCase() || platform.platform_id || platform.id,
    name: platform.platform_name,
    icon: platform.platform_name === 'Instagram' ? '📷' : '📘',
    gradient: platform.platform_name === 'Instagram' ? 'from-purple-500 to-pink-500' : 'from-blue-600 to-blue-700',
    description: `Create automations for ${platform.platform_name} posts, stories, and messages`,
    platformId: platform.platform_id,
    profileName: platform.profile_name,
    platformData: platform
  })) : [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📷',
      gradient: 'from-purple-500 to-pink-500',
      description: 'Create automations for Instagram posts, stories, and DMs'
    },
    {
      id: 'facebook',
      name: 'Facebook', 
      icon: '📘',
      gradient: 'from-blue-600 to-blue-700',
      description: 'Create automations for Facebook posts and messages'
    }
  ];

  const handlePlatformSelect = (platformId) => {
    const selectedPlatform = platformsData.find(p => p.id === platformId);
    
    // Update configData with selected platform
    updateConfigData({
      servicePlatform: selectedPlatform
    });
    
    // Also update AutomationContext for step navigation
    selectPlatform(platformId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Create New Automation
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600"
          >
            Choose the platform where you want to create your automation
          </motion.p>
          
          {/* Show current selection */}
          {configData.servicePlatform && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium"
            >
              ✓ Selected: {configData.servicePlatform.name}
            </motion.div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {loadingPlatforms ? (
            <div className="col-span-2 text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading platforms...</p>
            </div>
          ) : (
            platformsData.map((platform, index) => {
              const isSelected = configData.servicePlatform?.id === platform.id;
              
              return (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className={`h-full cursor-pointer border-2 transition-all duration-300 hover:shadow-xl ${
                    isSelected 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-transparent hover:border-gray-200'
                  }`}>
                    <CardContent className="p-8 text-center h-full flex flex-col justify-between">
                      <div>
                        <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${platform.gradient} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                          isSelected ? 'ring-4 ring-green-300' : ''
                        }`}>
                          {platform.icon}
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          {platform.name}
                        </h3>
                        
                        {platform.profileName && (
                          <p className="text-sm text-gray-500 mb-2">
                            @{platform.profileName}
                          </p>
                        )}
                        
                        <p className="text-gray-600 mb-8 leading-relaxed">
                          {platform.description}
                        </p>
                      </div>
                      
                      <Button
                        onClick={() => handlePlatformSelect(platform.id)}
                        className={`w-full py-3 text-lg font-semibold transition-all duration-300 shadow-lg ${
                          isSelected
                            ? 'bg-green-600 hover:bg-green-700'
                            : `bg-gradient-to-r ${platform.gradient} hover:opacity-90`
                        }`}
                        size="lg"
                      >
                        {isSelected ? '✓ Selected' : `Select ${platform.name}`}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-gray-500">
            You can create automations for both platforms. Start with one and add more later.
          </p>
          
          {/* Validation status */}
          {configData.servicePlatform && validateStepConfig && (
            <div className="mt-4">
              {validateStepConfig('platform') ? (
                <p className="text-green-600 text-sm font-medium">
                  ✓ Platform selection complete. You can proceed to the next step.
                </p>
              ) : (
                <p className="text-red-600 text-sm font-medium">
                  Please select a platform to continue.
                </p>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PlatformSelector;