import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { initFacebookSdk } from "@/lib/socialMediaAuth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Search, Filter, X, LayoutDashboard, MessageCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "react-toastify";

// Import our custom components
import { AutomationCard } from "@/components/automation/AutomationCard";
import { AutomationTypeCard } from "@/components/automation/AutomationTypeCard";
import { FilterDrawer } from "@/components/automation/FilterDrawer";
import { AutomationDialog } from "@/components/automation/AutomationDialog";
import { CommentReplies } from '@/components/comments/CommentReplies';

// Import API services
import { automationService } from "@/lib/api";

// Define platform mapping consistently
const PLATFORMS = {
  "398280132": "Facebook",
  "398280133": "Instagram",
  "398280134": "Twitter",
  "398280135": "LinkedIn"
};

// EmptyState component
const EmptyState = ({ searchQuery, onCreateClick, isLoading }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center p-6 sm:p-12 border border-dashed rounded-xl text-center"
  >
    <div className="rounded-full bg-primary/10 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-4">
      {searchQuery ? (
        <Search className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
      ) : (
        <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
      )}
    </div>
    <h3 className="font-medium text-base sm:text-lg mb-2">
      {searchQuery ? "No automations found" : "Create your first automation"}
    </h3>
    <p className="text-muted-foreground mb-6 max-w-md text-sm sm:text-base">
      {searchQuery 
        ? "Try adjusting your search query or filters to find what you're looking for."
        : "Start building powerful automations to engage with your audience and save time managing your social presence."
      }
    </p>
    {!searchQuery && (
      <Button onClick={onCreateClick} disabled={isLoading}>
        {isLoading ? (
          <><span className="mr-1.5 h-4 w-4 animate-spin inline-block">◌</span> Creating...</>
        ) : (
          <><Plus className="mr-1.5 h-4 w-4" /> Create Automation</>
        )}
      </Button>
    )}
  </motion.div>
);

// ActiveFilters component
const ActiveFilters = ({ filters, setFilters }) => {
  // Helper to get readable filter names
  const getReadableFilter = (key, value) => {
    if (key === "platform" && value !== "all") return `Platform: ${value}`;
    if (key === "type" && value !== "all") return `Type: ${value}`;
    if (key === "status" && value !== "all") return `Status: ${value}`;
    return null;
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value !== "all");
  
  if (!hasActiveFilters) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {Object.entries(filters).map(([key, value]) => {
        const label = getReadableFilter(key, value);
        if (!label) return null;
        
        return (
          <Badge key={key} variant="outline" className="flex items-center gap-1">
            {label}
            <X 
              className="h-3 w-3 cursor-pointer ml-1" 
              onClick={() => setFilters({...filters, [key]: "all"})}
            />
          </Badge>
        );
      })}
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-6 px-2 text-xs"
        onClick={() => setFilters({
          platform: "all",
          type: "all",
          status: "all"
        })}
      >
        Clear all
      </Button>
    </div>
  );
};

// Main Page Component
export function AutomationPage() {
  // State
  const [activeTab, setActiveTab] = useState("automations");
  const [automationsList, setAutomationsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    platform: "all",
    type: "all",
    status: "all"
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [showAutomationDialog, setShowAutomationDialog] = useState(false);
  const [currentAutomation, setCurrentAutomation] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  
  // Loading states for various actions
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingStatusChanges, setLoadingStatusChanges] = useState({});
  const [loadingDelete, setLoadingDelete] = useState({});
  const [loadingView, setLoadingView] = useState({});
  const [loadingDuplicate, setLoadingDuplicate] = useState({});
  
  // Fetch automations on component mount
  useEffect(() => {
    fetchAutomations();
  }, []);
  
  // Fetch automations from API
  const fetchAutomations = async () => {
    try {
      setLoading(true);
      const data = await automationService.getAllAutomations();
      console.log('Fetched automations:', data);
      
      // Ensure each automation has all required fields
      const validatedData = Array.isArray(data) ? data.map(automation => ({
        id: automation.id || `auto-${Date.now()}`,
        name: automation.name || 'Unnamed Automation',
        type: automation.type || 'Comment',
        platform: automation.platform || '398280132',
        incoming: automation.incoming || '',
        content: automation.content || '',
        status: automation.status || 'Paused',
        triggers: automation.triggers || 0,
        actions: automation.actions || 0,
        created_at: automation.created_at || new Date().toISOString(),
        ...automation
      })) : [];
      
      setAutomationsList(validatedData);
      setError(null);
    } catch (err) {
      console.error("Error fetching automations:", err);
      setError("Failed to load automations. Please try again later.");
      toast.error("Failed to load automations");
    } finally {
      setLoading(false);
    }
  };
  
  // Initialize Facebook SDK
  useEffect(() => {
    initFacebookSdk().catch(error => console.error("Failed to initialize Facebook SDK:", error));
  }, []);
  
  // Filter and search automations
  const filteredAutomations = automationsList.filter(automation => {
    // Search query filter
    const matchesSearch = !searchQuery || 
      automation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      automation.incoming.toLowerCase().includes(searchQuery.toLowerCase()) ||
      automation.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Other filters
    const matchesPlatform = filters.platform === "all" || 
      automation.platform === filters.platform;
    const matchesType = filters.type === "all" || 
      automation.type === filters.type;
    const matchesStatus = filters.status === "all" || 
      automation.status === filters.status;
    
    return matchesSearch && matchesPlatform && matchesType && matchesStatus;
  });
  
  // Improved automation creation process
  const handleOpenAutomationDialog = (type = null) => {
    setLoadingCreate(true);
    
    try {
      if (type) {
        setSelectedType(type);
        setCurrentAutomation({
          name: `New ${type} Automation`,
          type: type,
          platform: "398280132", // Default to Facebook
          incoming: type === "Comment" ? "New comment on post" : 
                    type === "Message" ? "Direct message received" : 
                    type === "Keyword" ? "Message contains keywords" : 
                    "Story mention",
          content: `Thank you for your ${type.toLowerCase()}! We'll get back to you shortly.`,
          status: "Active",
          triggers: 0,
          actions: 0,
          isNew: true
        });
      } else {
        setSelectedType(null);
        setCurrentAutomation({
          name: "New Automation",
          type: "Comment",
          platform: "398280132", // Default to Facebook
          incoming: "New comment on post",
          content: "Thank you for your comment! We'll get back to you shortly.",
          status: "Active",
          triggers: 0,
          actions: 0,
          isNew: true
        });
      }
      
      setShowAutomationDialog(true);
    } finally {
      setLoadingCreate(false);
    }
  };
  
  // Open the automation dialog for editing an existing automation
  const handleEditAutomation = (automation) => {
    try {
      setLoadingEdit(true);
      setCurrentAutomation({
        ...automation,
        isNew: false
      });
      setShowAutomationDialog(true);
    } finally {
      setLoadingEdit(false);
    }
  };
  
  // View automation details (could expand to a new page or modal)
  const handleViewAutomation = (automation) => {
    try {
      setLoadingView(prev => ({ ...prev, [automation.id]: true }));
      toast.info(`Viewing details for "${automation.name}"`);
      // Implementation for viewing details would go here
    } finally {
      setLoadingView(prev => ({ ...prev, [automation.id]: false }));
    }
  };
  
  // Save a new or edited automation
  const handleSaveAutomation = async (automation) => {
    try {
      setLoadingSave(true);
      
      if (automation.isNew) {
        // Create new automation
        const { isNew, ...autoData } = automation;
        
        // Ensure all required fields
        const completeData = {
          id: autoData.id || `auto-${Date.now()}`,
          name: autoData.name || 'Unnamed Automation',
          type: autoData.type || 'Comment',
          platform: autoData.platform || '398280132',
          incoming: autoData.incoming || '',
          content: autoData.content || '',
          status: autoData.status || 'Active',
          triggers: autoData.triggers || 0,
          actions: autoData.actions || 0,
          created_at: autoData.created_at || new Date().toISOString(),
          ...autoData
        };
        
        const response = await automationService.createAutomation(completeData);
        
        // Update the automations list with the new item
        setAutomationsList([response, ...automationsList]);
        
        toast.success(`"${response.name}" has been created successfully.`);
      } else {
        // Update existing automation
        const { isNew, ...autoData } = automation;
        
        // Ensure all required fields
        const completeData = {
          name: autoData.name || 'Unnamed Automation',
          type: autoData.type || 'Comment',
          platform: autoData.platform || '398280132',
          incoming: autoData.incoming || '',
          content: autoData.content || '',
          status: autoData.status || 'Active',
          triggers: autoData.triggers || 0,
          actions: autoData.actions || 0,
          ...autoData
        };
        
        const response = await automationService.updateAutomation(completeData);
        
        // Update the automations list
        const updatedList = automationsList.map(item => 
          item.id === response.id ? response : item
        );
        
        setAutomationsList(updatedList);
        
        toast.success(`"${response.name}" has been updated successfully.`);
      }
    } catch (err) {
      console.error("Error saving automation:", err);
      toast.error(`Failed to ${automation.isNew ? 'create' : 'update'} automation: ${err.message}`);
    } finally {
      setLoadingSave(false);
      setShowAutomationDialog(false);
    }
  };
  
  // Change the status of an automation
  const handleStatusChange = async (id, newStatus) => {
    try {
      // Set loading state for this specific automation
      setLoadingStatusChanges(prev => ({ ...prev, [id]: true }));
      
      const automation = automationsList.find(item => item.id === id);
      if (!automation) return;
      
      const response = await automationService.updateAutomation({
        ...automation,
        status: newStatus
      });
      
      // Update the automations list
      const updatedAutomations = automationsList.map(item => 
        item.id === id ? response : item
      );
      
      setAutomationsList(updatedAutomations);
      
      toast.info(`"${response.name}" is now ${newStatus.toLowerCase()}.`);
    } catch (err) {
      console.error("Error updating automation status:", err);
      toast.error(`Failed to update status: ${err.message}`);
    } finally {
      // Clear loading state for this specific automation
      setLoadingStatusChanges(prev => ({ ...prev, [id]: false }));
    }
  };
  
  // Delete an automation
  const handleDeleteAutomation = async (id) => {
    try {
      // Set loading state for this specific deletion
      setLoadingDelete(prev => ({ ...prev, [id]: true }));
      
      const automation = automationsList.find(item => item.id === id);
      if (!automation) return;
      
      await automationService.deleteAutomation(id);
      
      // Update the automations list
      const updatedList = automationsList.filter(item => item.id !== id);
      setAutomationsList(updatedList);
      
      toast.success(`"${automation.name}" has been deleted.`);
    } catch (err) {
      console.error("Error deleting automation:", err);
      toast.error(`Failed to delete automation: ${err.message}`);
    } finally {
      // Clear loading state
      setLoadingDelete(prev => ({ ...prev, [id]: false }));
    }
  };
  
  // Duplicate an automation
  const handleDuplicateAutomation = async (automation) => {
    try {
      setLoadingDuplicate(prev => ({ ...prev, [automation.id]: true }));
      
      // Create a new automation based on the existing one
      const duplicatedAutomation = {
        ...automation,
        id: undefined, // Remove ID so a new one is generated
        name: `Copy of ${automation.name}`,
        isNew: true,
        created_at: new Date().toISOString()
      };
      
      const response = await automationService.createAutomation(duplicatedAutomation);
      
      // Update the automations list with the new item
      setAutomationsList([response, ...automationsList]);
      
      toast.success(`"${response.name}" has been created as a duplicate.`);
    } catch (err) {
      console.error("Error duplicating automation:", err);
      toast.error(`Failed to duplicate automation: ${err.message}`);
    } finally {
      setLoadingDuplicate(prev => ({ ...prev, [automation.id]: false }));
    }
  };
  
  // Main tabs definition (removed flow-builder and accounts)
  const mainTabs = [
    { id: "automations", name: "Automations", icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
    { id: "comments", name: "Comments", icon: <MessageCircle className="h-4 w-4 mr-2" /> }
  ];
  
  // Automation types data
  const automationTypes = [
    {
      id: "Comment",
      icon: "💬",
      title: "Comment Automation",
      description: "Auto-reply to comments on your posts and ads."
    },
    {
      id: "Message",
      icon: "📨",
      title: "Message Automation",
      description: "Set up responses for direct messages and inquiries."
    },
    {
      id: "Keyword",
      icon: "🔑",
      title: "Keyword Triggers",
      description: "Create automated flows based on specific keywords."
    },
    {
      id: "Story",
      icon: "📱",
      title: "Story Automation",
      description: "Respond to story mentions and interactions."
    }
  ];
  
  return (
    <>
      <div className="space-y-4 sm:space-y-6 mx-auto max-w-[350px] sm:max-w-none">
        {/* Header with animation - Improved responsive layout */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Automation Center</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Configure and manage your social media automations across all platforms.
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={() => handleOpenAutomationDialog()}
                  className="w-full sm:w-auto mt-2 sm:mt-0"
                  disabled={loadingCreate}
                >
                  {loadingCreate ? (
                    <><span className="mr-1.5 h-4 w-4 animate-spin inline-block">◌</span> Creating...</>
                  ) : (
                    <><Plus className="mr-1.5 h-4 w-4" /> Create Automation</>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="text-sm">Create a new automation flow</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
        
        {/* Main tabs navigation - Improved for mobile */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4 sm:mt-6">
          <TabsList className="grid grid-cols-2 mb-4 sm:mb-8 w-full">
            {mainTabs.map(tab => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id} 
                className="flex items-center justify-center px-1 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm"
              >
                {tab.icon}
                <span className="truncate ml-1">{tab.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {/* Automations Tab */}
          <TabsContent value="automations" className="animate-in fade-in-50 duration-300">
            {/* Search and filter bar - Improved for mobile */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4 sm:mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search automations..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setShowFilterDrawer(true)}
                      className="relative sm:flex-shrink-0 h-10 w-10"
                    >
                      <Filter className="h-4 w-4" />
                      {(filters.platform !== "all" || filters.type !== "all" || filters.status !== "all") && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p className="text-sm">Filter automations</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {/* Active filters */}
            <ActiveFilters filters={filters} setFilters={setFilters} />
            
            {/* Loading state */}
            {loading && (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
            
            {/* Error state */}
            {error && !loading && (
              <div className="p-6 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Button variant="outline" onClick={fetchAutomations}>
                  Retry
                </Button>
              </div>
            )}
            
            {/* Automation cards or empty state */}
            {!loading && !error && (
              <div className="space-y-4 sm:space-y-6">
                {filteredAutomations.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-base sm:text-lg">Your Automations</h3>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {filteredAutomations.length} automation{filteredAutomations.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                      <AnimatePresence>
                        {filteredAutomations.map((automation) => {
                          // Skip rendering if missing critical data
                          if (!automation || !automation.id) {
                            console.warn('Invalid automation data:', automation);
                            return null;
                          }
                          
                          return (
                            <AutomationCard
                              key={automation.id}
                              automation={automation}
                              onStatusChange={handleStatusChange}
                              onEdit={handleEditAutomation}
                              onDelete={handleDeleteAutomation}
                              onView={handleViewAutomation}
                              onDuplicate={handleDuplicateAutomation}
                              isLoadingStatus={loadingStatusChanges[automation.id]}
                              isLoadingDelete={loadingDelete[automation.id]}
                              isLoadingView={loadingView[automation.id]}
                              isLoadingEdit={loadingEdit}
                              isLoadingDuplicate={loadingDuplicate[automation.id]}
                            />
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </>
                ) : (
                  <EmptyState 
                    searchQuery={searchQuery} 
                    onCreateClick={() => handleOpenAutomationDialog()} 
                    isLoading={loadingCreate}
                  />
                )}
              </div>
            )}
            
            {/* Automation types section - Improved for mobile */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t"
            >
              <h3 className="font-medium text-base sm:text-lg mb-4 sm:mb-6">Create New Automation</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {automationTypes.map((type) => (
                  <AutomationTypeCard
                    key={type.id}
                    type={type}
                    onCreateClick={handleOpenAutomationDialog}
                    isLoading={loadingCreate}
                  />
                ))}
              </div>
            </motion.div>
          </TabsContent>
          
          {/* Comments Tab */}
          <TabsContent value="comments" className="animate-in fade-in-50 duration-300">
            <CommentReplies />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Filter drawer */}
      <AnimatePresence>
        {showFilterDrawer && (
          <FilterDrawer
            isOpen={showFilterDrawer}
            onClose={() => setShowFilterDrawer(false)}
            filters={filters}
            setFilters={setFilters}
            platforms={Object.entries(PLATFORMS).map(([id, name]) => ({ id, name }))}
          />
        )}
      </AnimatePresence>
      
      {/* Improved Automation dialog with better defaults */}
      <AutomationDialog
        open={showAutomationDialog}
        onOpenChange={setShowAutomationDialog}
        automation={currentAutomation}
        setAutomation={setCurrentAutomation}
        onSave={handleSaveAutomation}
        selectedType={selectedType}
        platforms={Object.entries(PLATFORMS).map(([id, name]) => ({ id, name }))}
        isLoading={loadingSave}
      />
    </>
  );
} 