import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Play, Pause, MoreHorizontal, X, Activity, MessageSquare, Send, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { format } from "date-fns";

// Simplified Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    const configs = {
      "Active": {
        className: "bg-green-100 text-green-800 border-green-200",
        icon: <Activity className="w-3 h-3 mr-1" />
      },
      "Paused": {
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <Pause className="w-3 h-3 mr-1" />
      },
      "Inactive": {
        className: "bg-gray-100 text-gray-800 border-gray-200",
        icon: <X className="w-3 h-3 mr-1" />
      }
    };
    
    return configs[status] || configs["Inactive"];
  };

  const config = getStatusConfig(status);
  
  return (
    <Badge className={`${config.className} border flex items-center gap-1 px-2 py-1 text-xs font-medium`}>
      {config.icon}
      {status}
    </Badge>
  );
};

// Simple Metric Display
const MetricDisplay = ({ icon, label, value }) => (
  <div className="text-center">
    <div className="flex items-center justify-center gap-1 mb-1">
      <div className="text-muted-foreground">
        {icon}
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
    <p className="text-sm font-semibold">{value}</p>
  </div>
);

export const AutomationCard = ({ automation, onStatusChange, onEdit, onDelete, onView }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Format created date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    try {
      if (dateString.includes('T')) {
        return format(new Date(dateString), 'MMM d, yyyy');
      }
      return dateString;
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString;
    }
  };
  
  // Get simple type icon
  const getTypeIcon = (type) => {
    const configs = {
      "Comment": <MessageSquare className="w-4 h-4" />,
      "Message": <Send className="w-4 h-4" />,
      "Keyword": <Activity className="w-4 h-4" />,
      "Story": <TrendingUp className="w-4 h-4" />
    };
    
    return configs[type] || <Activity className="w-4 h-4" />;
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
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full border border-border hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3 flex-1">
              {/* Simple icon */}
              <div className="rounded-lg h-10 w-10 bg-muted flex items-center justify-center text-muted-foreground">
                {getTypeIcon(automation.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base font-semibold leading-tight truncate">
                  {automation.name}
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  {getPlatformName(automation.platform)} • {automation.type}
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <StatusBadge status={automation.status} />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={toggleStatus} className="cursor-pointer">
                    {automation.status === "Active" ? (
                      <><Pause className="mr-2 h-4 w-4" /> Pause</>
                    ) : (
                      <><Play className="mr-2 h-4 w-4" /> Activate</>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setDeleteDialogOpen(true)} 
                    className="text-destructive cursor-pointer focus:text-destructive"
                  >
                    <X className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pb-3">
          {/* Service Type Badge */}
          {(automation.service_id === "1" || automation.service_id === "2" || automation.service_id === "5") && (
            <div>
              {automation.service_id === "1" && (
                <Badge variant="secondary" className="text-xs">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Comment Only
                </Badge>
              )}
              {automation.service_id === "2" && (
                <Badge variant="secondary" className="text-xs">
                  <Send className="w-3 h-3 mr-1" />
                  DM Only
                </Badge>
              )}
              {automation.service_id === "5" && (
                <Badge variant="secondary" className="text-xs">
                  <Activity className="w-3 h-3 mr-1" />
                  Comment & DM
                </Badge>
              )}
            </div>
          )}

          {/* Trigger Keywords */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-1">Trigger Keywords</h4>
            <div className="bg-muted rounded p-2">
              <p className="text-xs font-mono">{automation.incoming}</p>
            </div>
          </div>
          
          {/* Responses */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">Response Templates</h4>
            
            {automation.comment_content && (
              <div className="bg-blue-50 border border-blue-100 rounded p-2">
                <div className="flex items-center gap-1 mb-1">
                  <MessageSquare className="w-3 h-3 text-blue-600" />
                  <span className="text-xs font-medium text-blue-700">COMMENT REPLY</span>
                </div>
                <p className="text-xs text-blue-900">{automation.comment_content}</p>
              </div>
            )}
            
            {automation.dm_content && (
              <div className="bg-green-50 border border-green-100 rounded p-2">
                <div className="flex items-center gap-1 mb-1">
                  <Send className="w-3 h-3 text-green-600" />
                  <span className="text-xs font-medium text-green-700">DIRECT MESSAGE</span>
                </div>
                <p className="text-xs text-green-900">{automation.dm_content}</p>
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <MetricDisplay 
              icon={<TrendingUp className="w-3 h-3" />}
              label="Triggers"
              value={automation.trigger_count || automation.triggers || 0}
            />
            <MetricDisplay 
              icon={<Activity className="w-3 h-3" />}
              label="Actions"
              value={automation.action_count || 0}
            />
          </div>
        </CardContent>
        
        <CardFooter className="pt-2 border-t bg-muted/20 text-xs text-muted-foreground">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Created {formatDate(automation.created_at || automation.created)}</span>
            </div>
            
            <Badge variant="outline" className="text-xs">
              {automation.triggers || 0} Executions
            </Badge>
          </div>
        </CardFooter>
      </Card>
      
      {/* Simple Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Automation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{automation.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}; 