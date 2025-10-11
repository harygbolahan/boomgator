import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useAutomation } from "@/contexts/AutomationContext";

const TemplateSelector = () => {
  const { 
    selectTemplate, 
    automationState, 
    setCurrentStep,
    getAvailableTemplates 
  } = useAutomation();

  const templates = getAvailableTemplates();

  const handleBack = () => {
    setCurrentStep('platform');
  };

  const getPlatformInfo = () => {
    return automationState.platform === 'instagram' 
      ? { name: 'Instagram', icon: '📷', color: 'from-purple-500 to-pink-500' }
      : { name: 'Facebook', icon: '📘', color: 'from-blue-600 to-blue-700' };
  };

  const platformInfo = getPlatformInfo();

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
        </motion.div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="h-full cursor-pointer border-2 border-transparent hover:border-purple-200 transition-all duration-300 hover:shadow-xl bg-white">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
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
                    onClick={() => selectTemplate(template.id)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 transition-all duration-300 shadow-lg hover:shadow-xl"
                    size="lg"
                  >
                    Use This Template
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

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
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TemplateSelector;