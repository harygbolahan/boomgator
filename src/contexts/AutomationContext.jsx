import { createContext, useContext, useState, useCallback } from 'react';

// Mock data for development
const MOCK_POSTS = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
    caption: 'Check out our amazing new product! 🔥',
    type: 'post',
    platform: 'instagram',
    engagement: { likes: 1234, comments: 45, shares: 12 }
  },
  {
    id: '2', 
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
    caption: 'Behind the scenes of our latest campaign',
    type: 'reel',
    platform: 'instagram',
    engagement: { likes: 2567, comments: 89, shares: 34 }
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=400&fit=crop',
    caption: 'Summer collection is here! Don\'t miss out 🌞',
    type: 'post',
    platform: 'facebook',
    engagement: { likes: 892, comments: 23, shares: 8 }
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    caption: 'New arrivals just dropped! Shop now 👟',
    type: 'post',
    platform: 'instagram',
    engagement: { likes: 3421, comments: 156, shares: 67 }
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop',
    caption: 'Story time! Swipe up for exclusive deals ✨',
    type: 'story',
    platform: 'instagram',
    engagement: { views: 5432, reactions: 234, replies: 12 }
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop',
    caption: 'Limited time offer! Get yours before it\'s gone 🎯',
    type: 'story',
    platform: 'facebook',
    engagement: { views: 2876, reactions: 145, replies: 8 }
  }
];

const MOCK_TEMPLATES = [
  {
    id: 'comments',
    title: 'Instant DM from Comments',
    description: 'Send links instantly when people comment on your posts or reel',
    icon: '💬'
  },
  {
    id: 'stories',
    title: 'Instant DM from Stories', 
    description: 'Send links instantly when users react or reply to your Stories',
    icon: '📱'
  },
  {
    id: 'dm',
    title: 'Respond to all DMs',
    description: 'Auto-send customized replies when people DM you',
    icon: '📩'
  }
];

// Create the Automation Context
const AutomationContext = createContext(null);

export const AutomationProvider = ({ children }) => {
  // Main automation state
  const [automationState, setAutomationState] = useState({
    platform: null, // 'instagram' | 'facebook'
    template: null, // 'comments' | 'stories' | 'dm'
    selectedPost: null,
    keywords: [],
    dmConfig: {
      message: '',
      image: null,
      buttons: [],
      links: []
    },
    advancedSettings: {
      openingMessage: {
        enabled: false,
        message: ''
      },
      publicReply: {
        enabled: false,
        replies: []
      },
      requireFollow: false
    },
    previewMode: 'post', // 'post' | 'story' | 'comment' | 'dm' | 'conversation' | 'follow-prompt'
  });

  // UI state
  const [currentStep, setCurrentStep] = useState('platform'); // 'platform' | 'template' | 'editor'
  const [isLoading, setIsLoading] = useState(false);

  // Platform selection
  const selectPlatform = useCallback((platform) => {
    setAutomationState(prev => ({
      ...prev,
      platform,
      selectedPost: null // Reset post when platform changes
    }));
    setCurrentStep('template');
  }, []);

  // Template selection
  const selectTemplate = useCallback((template) => {
    setAutomationState(prev => ({
      ...prev,
      template
    }));
    setCurrentStep('editor');
  }, []);

  // Post selection
  const selectPost = useCallback((post) => {
    setAutomationState(prev => ({
      ...prev,
      selectedPost: post,
      previewMode: 'post'
    }));
  }, []);

  // Keyword management
  const addKeyword = useCallback((keyword) => {
    if (!keyword.trim()) return;
    
    setAutomationState(prev => {
      const newState = {
        ...prev,
        keywords: [...prev.keywords, keyword.trim()]
      };
      
      // Auto-switch to comment preview if we have keywords and it's a comment-based template
      if ((prev.template === 'comments' || prev.template === 'stories') && prev.selectedPost) {
        newState.previewMode = 'comment';
      }
      
      return newState;
    });
  }, []);

  const removeKeyword = useCallback((index) => {
    setAutomationState(prev => {
      const newKeywords = prev.keywords.filter((_, i) => i !== index);
      const newState = { ...prev, keywords: newKeywords };
      
      // If no keywords left, switch back to post view
      if (newKeywords.length === 0 && prev.selectedPost) {
        newState.previewMode = 'post';
      }
      
      return newState;
    });
  }, []);

  // DM Configuration
  const updateDMConfig = useCallback((config) => {
    setAutomationState(prev => {
      const newDMConfig = { ...prev.dmConfig, ...config };
      const newState = {
        ...prev,
        dmConfig: newDMConfig
      };
      
      // Auto-switch to DM preview if we have DM content
      if (newDMConfig.message || newDMConfig.image || newDMConfig.buttons.length > 0) {
        newState.previewMode = 'dm';
      }
      
      return newState;
    });
  }, []);

  // Advanced Settings
  const updateAdvancedSettings = useCallback((settings) => {
    setAutomationState(prev => ({
      ...prev,
      advancedSettings: { ...prev.advancedSettings, ...settings }
    }));
  }, []);

  // Preview mode control with smart switching
  const setPreviewMode = useCallback((mode) => {
    setAutomationState(prev => ({
      ...prev,
      previewMode: mode
    }));
  }, []);

  // Smart preview mode switching based on current state
  const updatePreviewMode = useCallback(() => {
    const { selectedPost, keywords, dmConfig, template, advancedSettings } = automationState;
    
    // If no post selected, stay in post mode
    if (!selectedPost) {
      setAutomationState(prev => ({ ...prev, previewMode: 'post' }));
      return;
    }
    
    // If follow requirement is enabled, show follow prompt
    if (advancedSettings.requireFollow && (dmConfig.message || dmConfig.image)) {
      setAutomationState(prev => ({ ...prev, previewMode: 'follow-prompt' }));
      return;
    }
    
    // If advanced settings are configured, show conversation view
    if ((advancedSettings.openingMessage.enabled && advancedSettings.openingMessage.message) ||
        (advancedSettings.publicReply.enabled && advancedSettings.publicReply.replies.length > 0)) {
      setAutomationState(prev => ({ ...prev, previewMode: 'conversation' }));
      return;
    }
    
    // If post is a story and template supports stories, show story mode
    if (selectedPost.type === 'story' && template === 'stories') {
      setAutomationState(prev => ({ ...prev, previewMode: 'story' }));
      return;
    }
    
    // If keywords exist and template involves comments, show comment mode
    if (keywords.length > 0 && (template === 'comments' || template === 'stories')) {
      setAutomationState(prev => ({ ...prev, previewMode: 'comment' }));
      return;
    }
    
    // If DM config exists, show DM mode
    if (dmConfig.message || dmConfig.image || dmConfig.buttons.length > 0) {
      setAutomationState(prev => ({ ...prev, previewMode: 'dm' }));
      return;
    }
    
    // Default to post mode
    setAutomationState(prev => ({ ...prev, previewMode: 'post' }));
  }, [automationState]);

  // Get filtered posts based on selected platform
  const getAvailablePosts = useCallback(() => {
    if (!automationState.platform) return [];
    return MOCK_POSTS.filter(post => post.platform === automationState.platform);
  }, [automationState.platform]);

  // Get available templates
  const getAvailableTemplates = useCallback(() => {
    return MOCK_TEMPLATES;
  }, []);

  // Reset automation
  const resetAutomation = useCallback(() => {
    setAutomationState({
      platform: null,
      template: null,
      selectedPost: null,
      keywords: [],
      dmConfig: {
        message: '',
        image: null,
        buttons: [],
        links: []
      },
      advancedSettings: {
        openingMessage: {
          enabled: false,
          message: ''
        },
        publicReply: {
          enabled: false,
          replies: []
        },
        requireFollow: false
      },
      previewMode: 'post'
    });
    setCurrentStep('platform');
  }, []);

  // Save automation (mock implementation)
  const saveAutomation = useCallback(async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Saving automation:', automationState);
    
    setIsLoading(false);
    return { success: true, id: Date.now().toString() };
  }, [automationState]);

  const value = {
    // State
    automationState,
    currentStep,
    isLoading,
    
    // Actions
    selectPlatform,
    selectTemplate,
    selectPost,
    addKeyword,
    removeKeyword,
    updateDMConfig,
    updateAdvancedSettings,
    setPreviewMode,
    updatePreviewMode,
    resetAutomation,
    saveAutomation,
    
    // Getters
    getAvailablePosts,
    getAvailableTemplates,
    
    // Navigation
    setCurrentStep
  };

  return (
    <AutomationContext.Provider value={value}>
      {children}
    </AutomationContext.Provider>
  );
};

// Custom hook to use the automation context
export const useAutomation = () => {
  const context = useContext(AutomationContext);
  if (!context) {
    throw new Error('useAutomation must be used within an AutomationProvider');
  }
  return context;
};

export default AutomationContext;