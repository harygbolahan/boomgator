import { motion } from "framer-motion";
import { useAutomation } from "@/contexts/AutomationContext";
import InstagramPreview from "./InstagramPreview";
import FacebookPreview from "./FacebookPreview";

const MobilePreview = () => {
  const { automationState } = useAutomation();

  const renderPreview = () => {
    if (automationState.platform === 'instagram') {
      return <InstagramPreview />;
    } else if (automationState.platform === 'facebook') {
      return <FacebookPreview />;
    }
    return <div className="text-gray-500">Select a platform to see preview</div>;
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        {/* iPhone Frame */}
        <div className="relative w-[280px] h-[580px] bg-black rounded-[40px] p-2 shadow-2xl">
          {/* Screen */}
          <div className="w-full h-full bg-white rounded-[32px] overflow-hidden relative">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>
            
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-white z-5 flex items-center justify-between px-6 pt-2">
              <div className="text-xs font-semibold text-black">9:41</div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-2 border border-black rounded-sm">
                  <div className="w-3 h-1 bg-black rounded-sm m-0.5"></div>
                </div>
              </div>
            </div>
            
            {/* Content Area */}
            <div className="pt-12 h-full overflow-hidden">
              {renderPreview()}
            </div>
          </div>
        </div>
        
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full"></div>
      </motion.div>
    </div>
  );
};

export default MobilePreview;