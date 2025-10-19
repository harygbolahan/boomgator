import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAutomation } from "@/contexts/AutomationContext";
import { useBoom } from "@/contexts/BoomContext";
import PlatformSelector from "./PlatformSelector";
import TemplateSelector from "./TemplateSelector";
import AutomationEditor from "./AutomationEditor";

const AutomationCreator = () => {
  const navigate = useNavigate();
  const { currentStep, automationState, resetAutomation } = useAutomation();
  
  // BoomContext integration for API calls
  const {
    createAutomation,
    getPlatforms,
    getPages,
    getPagePosts,
    getAutoReplyServices,
    platforms,
    pages,
    autoReplyServices,
    loadingPlatforms,
    loadingPages,
    loadingServices,
    loadingAutomations
  } = useBoom();

  // Configuration data state (similar to Flow.jsx)
  const [configData, setConfigData] = useState({
    servicePlatform: null,
    pagePost: null,
    keywords: [],
    responseConfig: {
      service_id: null,
      lebel: '',
      tittle: '',
      url: '',
      comment_content: '',
      dm_content: '',
      status: 'active'
    }
  });

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Debug logging to understand current state
  console.log('AutomationCreator - Debug info:', {
    currentStep,
    configData,
    platforms: platforms?.length,
    pages: pages?.length,
    autoReplyServices: autoReplyServices?.length,
    isLoading,
    loadingPlatforms,
    loadingPages,
    loadingServices
  });

  // Sync AutomationContext state with configData
  useEffect(() => {
    console.log('🔄 Syncing AutomationContext to configData:', {
      automationKeywords: automationState.keywords,
      configKeywords: configData.keywords,
      selectedPost: automationState.selectedPost,
      dmConfig: automationState.dmConfig
    });

    setConfigData(prev => ({
      ...prev,
      keywords: automationState.keywords || [],
      pagePost: automationState.selectedPost,
      responseConfig: {
        ...prev.responseConfig,
        dm_content: automationState.dmConfig?.message || '',
        comment_content: automationState.dmConfig?.message || '' // For now, use same content
      }
    }));
  }, [automationState.keywords, automationState.selectedPost, automationState.dmConfig]);

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          getPlatforms(),
          getPages(),
          getAutoReplyServices()
        ]);
      } catch (error) {
        console.error('Error initializing data:', error);
        toast.error('Failed to load initial data');
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [getPlatforms, getPages, getAutoReplyServices]);

  // Validation function (similar to Flow.jsx validateStepConfig)
  const validateStepConfig = useCallback((step) => {
    console.log(`🔍 Validating step: ${step}`);
    console.log('📊 Current configData:', configData);
    
    switch (step) {
      case 'platform':
        const platformValid = configData.servicePlatform !== null;
        console.log(`✅ Platform validation: ${platformValid}`, configData.servicePlatform);
        return platformValid;
      case 'template':
        const templateValid = configData.pagePost !== null;
        console.log(`✅ Template validation: ${templateValid}`, configData.pagePost);
        return templateValid;
      case 'editor':
        console.log('🔍 Editor validation - checking required fields...');
        
        // Check if required fields are present
        if (!configData.keywords || configData.keywords.length === 0) {
          console.log('❌ Keywords validation failed:', configData.keywords);
          return false;
        }
        console.log('✅ Keywords validation passed:', configData.keywords);
        
        if (!configData.responseConfig) {
          console.log('❌ ResponseConfig validation failed - no responseConfig');
          return false;
        }
        console.log('✅ ResponseConfig exists:', configData.responseConfig);
        
        // Service-specific validation - get service_id from servicePlatform instead of responseConfig
        const service_id = configData.servicePlatform?.service_id || configData.servicePlatform?.id;
        if (!service_id) {
          console.log('❌ Service ID validation failed:', service_id);
          console.log('   servicePlatform:', configData.servicePlatform);
          return false;
        }
        console.log('✅ Service ID validation passed:', service_id);
        
        // Either comment_content or dm_content must be provided
        const { comment_content, dm_content } = configData.responseConfig;
        if (!comment_content && !dm_content) {
          console.log('❌ Content validation failed - no comment_content or dm_content');
          console.log('   comment_content:', comment_content);
          console.log('   dm_content:', dm_content);
          return false;
        }
        console.log('✅ Content validation passed');
        console.log('   comment_content:', comment_content);
        console.log('   dm_content:', dm_content);
        
        console.log('🎉 All editor validations passed!');
        return true;
      default:
        console.log(`❌ Unknown step: ${step}`);
        return false;
    }
  }, [configData]);

  // Handle save automation (matching Flow.jsx handleSaveAutomation)
  const handleSaveAutomation = useCallback(async () => {
    // Validate all steps
    const requiredSteps = ['platform', 'template', 'editor'];
    for (const step of requiredSteps) {
      if (!validateStepConfig(step)) {
        toast.error(`Please complete the ${step} configuration`);
        return false;
      }
    }

    setIsSaving(true);
    try {
      // Prepare automation data in the exact format expected by Flow.jsx (matching the working payload)
      const automationData = {
        status: configData.responseConfig.status || "active",
        service_id: configData.servicePlatform?.service_id || configData.servicePlatform?.id,
        incoming: Array.isArray(configData.keywords) ? configData.keywords.join(', ') : (configData.keywords || ''),
        platform_id: configData.servicePlatform?.platform_id || configData.servicePlatform?.platformId,
        page_id: configData.pagePost?.page_id || configData.pagePost?.id,
        post_id: configData.pagePost?.post_id || configData.pagePost?.post?.id || "",
        lebel: configData.responseConfig.dm_content || '',
        comment_content: configData.responseConfig.comment_content || "",
        dm_content: configData.responseConfig.dm_content || "",
        tittle: configData.responseConfig.dm_content || '',
        url: configData.quickLinks && configData.quickLinks.length > 0 
          ? configData.quickLinks[0].url 
          : (configData.responseConfig.url || 'https://google.com'),
        status:  "Active",
      };

      console.log('Saving automation with data:', automationData);

      const result = await createAutomation(automationData);
      
      if (result) {
        toast.success('Automation created successfully!');
        resetAutomation();
        setConfigData({
          servicePlatform: null,
          pagePost: null,
          keywords: [],
          responseConfig: {
            service_id: null,
            lebel: '',
            tittle: '',
            url: '',
            comment_content: '',
            dm_content: '',
            status: 'active'
          }
        });
        navigate('/automation');
        return true;
      } else {
        toast.error('Failed to create automation');
        return false;
      }
    } catch (error) {
      console.error('Error saving automation:', error);
      toast.error('Error saving automation: ' + (error.message || 'Unknown error'));
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [configData, validateStepConfig, createAutomation, resetAutomation, navigate]);

  // Update configuration data
  const updateConfigData = useCallback((updates) => {
    setConfigData(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  // Update response configuration
  const updateResponseConfig = useCallback((updates) => {
    setConfigData(prev => ({
      ...prev,
      responseConfig: {
        ...prev.responseConfig,
        ...updates
      }
    }));
  }, []);

  const renderCurrentStep = () => {
    const commonProps = {
      configData,
      updateConfigData,
      updateResponseConfig,
      platforms,
      pages,
      autoReplyServices,
      loadingPlatforms,
      loadingPages,
      loadingServices,
      validateStepConfig,
      handleSaveAutomation,
      isSaving
    };

    switch (currentStep) {
      case 'platform':
        return <PlatformSelector {...commonProps} />;
      case 'template':
        return <TemplateSelector {...commonProps} />;
      case 'editor':
        return <AutomationEditor {...commonProps} />;
      default:
        return <PlatformSelector {...commonProps} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading automation creator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="automation-creator">
      {renderCurrentStep()}
    </div>
  );
};

export default AutomationCreator;