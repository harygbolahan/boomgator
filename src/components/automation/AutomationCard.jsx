import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Play, Pause, Edit, MoreHorizontal, X, ExternalLink } from "lucide-react";

// Platform indicator component
const PlatformIndicator = ({ platforms }) => {
  const platformList = typeof platforms === "string" 
    ? platforms.split(/,\s*/).filter(Boolean)
    : platforms;

  const getPlatformColor = (platform) => {
    const colors = {
      facebook: "bg-blue-500",
      instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
      twitter: "bg-sky-500",
      linkedin: "bg-blue-700",
      "all platforms": "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
    };
    
    return colors[platform.toLowerCase()] || "bg-slate-500";
  };

  return (
    <div className="flex items-center gap-1">
      {platformList.map((platform, i) => (
        <TooltipProvider key={i}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${getPlatformColor(platform)}`} />
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">{platform}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export const AutomationCard = ({ automation, onStatusChange, onEdit, onDelete, onView }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get icon for automation type
  const getIconForType = (type) => {
    const icons = {
      comment: "💬",
      message: "📨",
      keyword: "🔑",
      story: "📱"
    };
    return icons[type.toLowerCase()] || "🤖";
  };

  // Get background color for type
  const getBgForType = (type) => {
    const backgrounds = {
      comment: "bg-blue-100",
      message: "bg-green-100",
      keyword: "bg-yellow-100",
      story: "bg-purple-100"
    };
    return backgrounds[type.toLowerCase()] || "bg-slate-100";
  };

  // Status badge variants
  const statusVariants = {
    "Active": "bg-green-100 text-green-800 hover:bg-green-200",
    "Paused": "bg-amber-100 text-amber-800 hover:bg-amber-200",
    "Draft": "bg-slate-100 text-slate-800 hover:bg-slate-200"
  };

  const handleToggleStatus = () => {
    onStatusChange(
      automation.id, 
      automation.status === "Active" ? "Paused" : "Active"
    );
  };

  // Generate automatic card ID
  const id = automation.id || `auto-${automation.name.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ duration: 0.2 }}
      className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden w-full"
    >
      <div className="p-3 sm:p-5">
        <div className="flex justify-between items-start mb-3 sm:mb-4">
          <Badge 
            variant="outline" 
            className={`${statusVariants[automation.status]} cursor-default transition-colors text-[10px] sm:text-xs px-1.5`}
          >
            {automation.status}
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8 rounded-full">
                <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="sr-only">Actions menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(automation)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              {onView && (
                <DropdownMenuItem onClick={() => onView(automation)}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleToggleStatus}>
                {automation.status === "Active" ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(id)} 
                className="text-red-600 focus:text-red-700 focus:bg-red-50"
              >
                <X className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
          <div className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${getBgForType(automation.type)}`}>
            <span className="text-sm sm:text-base">{automation.icon || getIconForType(automation.type)}</span>
          </div>
          <div className="overflow-hidden">
            <h3 className="font-medium text-sm sm:text-base truncate">{automation.name}</h3>
            <div className="flex items-center mt-0.5 sm:mt-1 gap-1.5 sm:gap-2">
              <PlatformIndicator platforms={automation.platform} />
              <span className="text-[10px] sm:text-xs text-muted-foreground">{automation.type}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-4 text-[10px] sm:text-sm">
          <div className="flex gap-1">
            <span className="text-muted-foreground font-medium min-w-[45px] sm:min-w-[60px]">Trigger:</span>
            <span className="truncate">{automation.trigger}</span>
          </div>
          <div className="flex gap-1">
            <span className="text-muted-foreground font-medium min-w-[45px] sm:min-w-[60px]">Response:</span>
            <span className="truncate">{automation.response}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-[10px] sm:text-xs text-muted-foreground">
          <span className="truncate mr-2">Created {automation.created}</span>
          <Badge variant={automation.triggered > 0 ? "default" : "outline"} className="h-4 sm:h-5 text-[10px] sm:text-xs shrink-0">
            {automation.triggered} today
          </Badge>
        </div>
      </div>
      
      <motion.div 
        className="border-t p-1.5 sm:p-3 bg-muted/20 flex items-center justify-between"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: isHovered ? 1 : 0.8 }}
      >
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleToggleStatus}
          className={`text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 h-6 sm:h-7 ${automation.status === "Active" ? "text-amber-600" : "text-emerald-600"}`}
        >
          {automation.status === "Active" ? (
            <>
              <Pause className="mr-0.5 sm:mr-1.5 h-3 w-3" /> Pause
            </>
          ) : (
            <>
              <Play className="mr-0.5 sm:mr-1.5 h-3 w-3" /> Activate
            </>
          )}
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onEdit(automation)}
          className="text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 h-6 sm:h-7"
        >
          <Edit className="mr-0.5 sm:mr-1.5 h-3 w-3" /> Edit
        </Button>
      </motion.div>
    </motion.div>
  );
}; 