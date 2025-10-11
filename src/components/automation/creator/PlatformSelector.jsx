import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAutomation } from "@/contexts/AutomationContext";

const PlatformSelector = () => {
  const { selectPlatform, automationState } = useAutomation();

  const platforms = [
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
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="h-full cursor-pointer border-2 border-transparent hover:border-gray-200 transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-8 text-center h-full flex flex-col justify-between">
                  <div>
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${platform.gradient} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {platform.icon}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {platform.name}
                    </h3>
                    
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      {platform.description}
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => selectPlatform(platform.id)}
                    className={`w-full py-3 text-lg font-semibold bg-gradient-to-r ${platform.gradient} hover:opacity-90 transition-opacity duration-300 shadow-lg`}
                    size="lg"
                  >
                    Select {platform.name}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
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
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PlatformSelector;