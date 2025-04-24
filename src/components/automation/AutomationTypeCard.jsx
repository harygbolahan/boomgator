import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const AutomationTypeCard = ({ type, onCreateClick }) => {
  // Get background color for type
  const getBgForType = (typeId) => {
    const backgrounds = {
      comment: "bg-blue-100",
      message: "bg-green-100",
      keyword: "bg-yellow-100",
      story: "bg-purple-100"
    };
    return backgrounds[typeId] || "bg-slate-100";
  };
  
  // Get text color for type
  const getTextColorForType = (typeId) => {
    const colors = {
      comment: "text-blue-700",
      message: "text-green-700",
      keyword: "text-yellow-700",
      story: "text-purple-700"
    };
    return colors[typeId] || "text-slate-700";
  };
  
  // Get border color for hover state
  const getBorderColorForType = (typeId) => {
    const borders = {
      comment: "group-hover:border-blue-300",
      message: "group-hover:border-green-300",
      keyword: "group-hover:border-yellow-300",
      story: "group-hover:border-purple-300"
    };
    return borders[typeId] || "group-hover:border-slate-300";
  };
  
  return (
    <motion.div 
      className={`bg-card p-3 sm:p-6 rounded-xl border ${getBorderColorForType(type.id)} group shadow-sm hover:shadow-md transition-all duration-200 w-full`}
      whileHover={{ y: -5 }}
    >
      <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full ${getBgForType(type.id)} ${getTextColorForType(type.id)} flex items-center justify-center mb-2 sm:mb-4 text-base sm:text-xl`}>
        {type.icon}
      </div>
      <h3 className="font-medium mb-1 sm:mb-2 text-xs sm:text-base truncate">{type.title}</h3>
      <p className="text-muted-foreground mb-3 sm:mb-5 text-[10px] sm:text-sm line-clamp-2">{type.description}</p>
      <Button 
        variant="outline" 
        size="sm" 
        className={`w-full py-0.5 sm:py-1 h-6 sm:h-8 text-[10px] sm:text-sm group-hover:bg-${type.id === 'comment' ? 'blue' : type.id === 'message' ? 'green' : type.id === 'keyword' ? 'yellow' : type.id === 'story' ? 'purple' : 'slate'}-50`}
        onClick={() => onCreateClick(type.id)}
      >
        <Plus className="mr-0.5 sm:mr-1.5 h-2.5 w-2.5 sm:h-3 sm:w-3" />
        Create
      </Button>
    </motion.div>
  );
}; 