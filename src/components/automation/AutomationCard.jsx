import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Play, Pause, Edit, MoreHorizontal, X, ExternalLink, Copy } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { format } from "date-fns";

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
              <button 
                type="button" 
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${getPlatformColor(platform)}`}
              />
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Format created date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    try {
      // Handle ISO date strings
      if (dateString.includes('T')) {
        return format(new Date(dateString), 'MMM d, yyyy');
      }
      
      // Handle already formatted dates
      return dateString;
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString;
    }
  };
  
  // Get icon based on type
  const getTypeIcon = (type) => {
    const types = {
      "Comment": { icon: "💬", bg: "bg-blue-100" },
      "Message": { icon: "📨", bg: "bg-green-100" },
      "Keyword": { icon: "🔑", bg: "bg-yellow-100" },
      "Story": { icon: "📱", bg: "bg-purple-100" }
    };
    
    return types[type] || { icon: "🤖", bg: "bg-gray-100" };
  };
  
  // Get the display name for platform IDs
  const getPlatformName = (platformId) => {
    const platforms = {
      "398280132": "Facebook",
      "398280133": "Instagram",
      "398280134": "Twitter",
      "398280135": "LinkedIn"
    };
    
    return platforms[platformId] || platformId;
  };
  
  // Status toggle function
  const toggleStatus = () => {
    const newStatus = automation.status === "Active" ? "Paused" : "Active";
    onStatusChange(automation.id, newStatus);
  };
  
  // Delete confirmation
  const confirmDelete = () => {
    setDeleteDialogOpen(false);
    onDelete(automation.id);
  };
  
  // Get the icon info
  const { icon, bg } = getTypeIcon(automation.type);

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
      <Card className="overflow-hidden border border-border">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className={`rounded-full h-10 w-10 flex items-center justify-center ${bg}`}>
                <span className="text-lg">{icon}</span>
              </div>
              <div>
                <CardTitle className="text-lg">{automation.name}</CardTitle>
                <CardDescription className="flex items-center flex-wrap gap-1.5 mt-1">
                  <span className="truncate max-w-[150px] sm:max-w-none">
                    {getPlatformName(automation.platform)}
                  </span>
                  <span className="text-xs">•</span>
                  <span>{automation.type}</span>
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant={automation.status === "Active" ? "success" : 
                        automation.status === "Paused" ? "warning" : "secondary"}
                className="h-6"
              >
                {automation.status}
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <span><MoreHorizontal className="h-4 w-4" /></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={toggleStatus} className="cursor-pointer">
                    {automation.status === "Active" ? (
                      <><Pause className="mr-2 h-4 w-4" /> Pause</>
                    ) : (
                      <><Play className="mr-2 h-4 w-4" /> Activate</>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(automation)} className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onView(automation)} className="cursor-pointer">
                    <ExternalLink className="mr-2 h-4 w-4" /> View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Copy className="mr-2 h-4 w-4" /> Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setDeleteDialogOpen(true)} 
                    className="text-destructive cursor-pointer"
                  >
                    <X className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
          <CardContent className="pb-3">
          <div className="grid gap-4">
            {/* Label */}
            {automation.label && (
              <div>
                <h4 className="text-sm font-medium mb-1">Label:</h4>
                <p className="text-sm text-muted-foreground">{automation.label}</p>
              </div>
            )}
            
            {/* Service Type */}
            <div>
              <h4 className="text-sm font-medium mb-1">Service Type:</h4>
              <div className="flex flex-wrap gap-2">
                {automation.service_id === "1" && (
                  <Badge variant="secondary">Comment Only</Badge>
                )}
                {automation.service_id === "2" && (
                  <Badge variant="secondary">DM Only</Badge>
                )}
                {automation.service_id === "5" && (
                  <Badge variant="secondary">Comment & DM</Badge>
                )}
              </div>
            </div>

            {/* Trigger */}
            <div>
              <h4 className="text-sm font-medium mb-1">Trigger Keywords:</h4>
              <p className="text-sm text-muted-foreground">{automation.incoming}</p>
            </div>
            
            {/* Responses */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Responses:</h4>
              {automation.comment_content && (
                <div className="bg-muted/50 p-2 rounded-md">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Comment Reply:</p>
                  <p className="text-sm">{automation.comment_content}</p>
                </div>
              )}
              {automation.dm_content && (
                <div className="bg-muted/50 p-2 rounded-md">
                  <p className="text-xs font-medium text-muted-foreground mb-1">DM Reply:</p>
                  <p className="text-sm">{automation.dm_content}</p>
                </div>
              )}
            </div>

            {/* Statistics */}
            <div className="flex flex-wrap gap-3">
              {automation.trigger_count !== undefined && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">Triggers:</h4>
                  <p className="text-sm font-medium">{automation.trigger_count}</p>
                </div>
              )}
              {automation.action_count !== undefined && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">Actions:</h4>
                  <p className="text-sm font-medium">{automation.action_count}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 border-t flex justify-between items-center text-xs text-muted-foreground">
          <span>Created: {formatDate(automation.created_at || automation.created)}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="h-5 flex items-center">
                  <span>{automation.triggers} Triggers</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="text-xs">Number of times this automation has been triggered</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </Card>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this automation?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the "{automation.name}" automation
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}; 