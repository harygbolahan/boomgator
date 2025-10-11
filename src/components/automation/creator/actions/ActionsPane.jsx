import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useAutomation } from "@/contexts/AutomationContext";
import PostSelector from "./PostSelector";
import KeywordSetup from "./KeywordSetup";
import DMConfiguration from "./DMConfiguration";
import AdvancedSettings from "./AdvancedSettings";
import TemplateSpecificSettings from "./TemplateSpecificSettings";

const ActionsPane = () => {
  const { automationState } = useAutomation();
  const [expandedSection, setExpandedSection] = useState('post');

  const toggleSection = (section) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  const sections = [
    {
      id: 'post',
      title: 'Select a Post or Reel',
      subtitle: 'Choose the content that will trigger your automation',
      component: PostSelector,
      required: true,
      completed: !!automationState.selectedPost
    },
    {
      id: 'keywords',
      title: 'Setup Keywords',
      subtitle: 'Define trigger words that activate the automation',
      component: KeywordSetup,
      required: true,
      completed: automationState.keywords.length > 0
    },
    {
      id: 'dm',
      title: 'Send a DM',
      subtitle: 'Configure the automated response message',
      component: DMConfiguration,
      required: true,
      completed: !!(automationState.dmConfig.message || automationState.dmConfig.image)
    },
    {
      id: 'template-specific',
      title: 'Template Settings',
      subtitle: 'Advanced options for your selected template',
      component: TemplateSpecificSettings,
      required: false,
      completed: false
    },
    {
      id: 'advanced',
      title: 'Advanced Settings',
      subtitle: 'Optional settings for enhanced automation',
      component: AdvancedSettings,
      required: false,
      completed: false
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 p-4">
          {sections.map((section, index) => {
            const isExpanded = expandedSection === section.id;
            const Component = section.component;
            
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          section.completed 
                            ? 'bg-green-500 text-white' 
                            : section.required 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-300 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                        {section.completed && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          {section.title}
                          {section.required && (
                            <span className="text-red-500 text-xs">*</span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-600">{section.subtitle}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {section.completed && (
                        <div className="text-green-500 text-xs font-medium">
                          ✓ Complete
                        </div>
                      )}
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Section Content */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200"
                  >
                    <div className="p-4 bg-white max-h-96 overflow-y-auto">
                      <Component />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Progress Indicator - Fixed at bottom */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Setup Progress</span>
          <span className="text-sm text-gray-600">
            {sections.filter(s => s.completed).length} / {sections.filter(s => s.required).length} required
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${(sections.filter(s => s.completed).length / sections.filter(s => s.required).length) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ActionsPane;