import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SocialMediaConnect } from "@/components/SocialMediaConnect";
import { initFacebookSdk } from "@/lib/socialMediaAuth";
import { AutomationFlowBuilder } from "@/components/automation/AutomationFlowBuilder";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Search, Filter, X, LayoutDashboard, Wand2, Sparkles, MessageCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "react-toastify";

// Import our custom components
import { AutomationCard } from "@/components/automation/AutomationCard";
import { AutomationTypeCard } from "@/components/automation/AutomationTypeCard";
import { FilterDrawer } from "@/components/automation/FilterDrawer";
import { AutomationDialog } from "@/components/automation/AutomationDialog";
import { CommentReplies } from '@/components/comments/CommentReplies';

// Import API services
import { automationService, commentRepliesService } from "@/lib/api";

// EmptyState component
const EmptyState = ({ searchQuery, onCreateClick }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center p-6 sm:p-12 border border-dashed rounded-xl text-center"
  >
    <div className="rounded-full bg-primary/10 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-4">
      {searchQuery ? (
        <Search className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
      ) : (
        <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
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
      <Button onClick={onCreateClick}>
        <Plus className="mr-1.5 h-4 w-4" />
        Create Automation
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
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  
  // Fetch automations on component mount
  useEffect(() => {
    fetchAutomations();
  }, []);
  
  // Fetch automations from API
  const fetchAutomations = async () => {
    try {
      setLoading(true);
      const data = await automationService.getAllAutomations();
      setAutomationsList(Array.isArray(data) ? data : []);
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
  
  // Open the automation dialog for creating a new automation
  const handleOpenAutomationDialog = (type = null) => {
    if (type) {
      setCurrentAutomation({
        name: "",
        type: type,
        platform: "398280132", // Default to Facebook
        incoming: "",
        content: "",
        status: "Active",
        triggers: 0,
        actions: 0,
        isNew: true
      });
    } else {
      setCurrentAutomation({
        name: "",
        type: "Comment",
        platform: "398280132", // Default to Facebook
        incoming: "",
        content: "",
        status: "Active",
        triggers: 0,
        actions: 0,
        isNew: true
      });
    }
    
    setShowAutomationDialog(true);
  };
  
  // Open the automation dialog for editing an existing automation
  const handleEditAutomation = (automation) => {
    setCurrentAutomation({
      ...automation,
      isNew: false
    });
    setShowAutomationDialog(true);
  };
  
  // View automation details (could expand to a new page or modal)
  const handleViewAutomation = (automation) => {
    toast.info(`Viewing details for "${automation.name}"`);
    // Implementation for viewing details would go here
  };
  
  // Save a new or edited automation
  const handleSaveAutomation = async (automation) => {
    try {
      if (automation.isNew) {
        // Create new automation
        const { isNew, ...autoData } = automation;
        const response = await automationService.createAutomation(autoData);
        
        // Update the automations list with the new item
        setAutomationsList([response, ...automationsList]);
        
        toast.success(`"${response.name}" has been created successfully.`);
      } else {
        // Update existing automation
        const { isNew, ...autoData } = automation;
        const response = await automationService.updateAutomation(autoData);
        
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
    }
    
    setShowAutomationDialog(false);
  };
  
  // Change the status of an automation
  const handleStatusChange = async (id, newStatus) => {
    try {
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
    }
  };
  
  // Delete an automation
  const handleDeleteAutomation = async (id) => {
    try {
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
    }
  };
  
  // Save an automation from the flow builder
  const handleFlowBuilderSave = async (automationFlow) => {
    try {
      const newAutomation = {
        name: automationFlow.name,
        type: automationFlow.type || "Custom",
        platform: automationFlow.platform || "398280132", // Default to Facebook
        status: "Active",
        incoming: automationFlow.trigger || "Custom trigger",
        content: automationFlow.response || "Custom action",
        triggers: 0,
        actions: 0
      };
      
      const response = await automationService.createAutomation(newAutomation);
      
      // Update the automations list
      setAutomationsList([response, ...automationsList]);
      setActiveTab("automations");
      
      toast.success(`"${response.name}" has been created successfully.`);
    } catch (err) {
      console.error("Error creating automation from flow builder:", err);
      toast.error(`Failed to create automation: ${err.message}`);
    }
  };
  
  // Main tabs definition
  const mainTabs = [
    { id: "automations", name: "Automations", icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
    { id: "flow-builder", name: "Flow Builder", icon: <Wand2 className="h-4 w-4 mr-2" /> },
    { id: "comments", name: "Comments", icon: <MessageCircle className="h-4 w-4 mr-2" /> },
    { id: "accounts", name: "Connected Accounts", icon: <Sparkles className="h-4 w-4 mr-2" /> }
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
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  Create Automation
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
          <TabsList className="grid grid-cols-4 mb-4 sm:mb-8 w-full">
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
                        {filteredAutomations.map((automation) => (
                          <AutomationCard
                            key={automation.id}
                            automation={automation}
                            onStatusChange={handleStatusChange}
                            onEdit={handleEditAutomation}
                            onDelete={handleDeleteAutomation}
                            onView={handleViewAutomation}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </>
                ) : (
                  <EmptyState 
                    searchQuery={searchQuery} 
                    onCreateClick={() => handleOpenAutomationDialog()} 
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
                  />
                ))}
              </div>
            </motion.div>
          </TabsContent>
          
          {/* Flow Builder Tab */}
          <TabsContent value="flow-builder" className="animate-in fade-in-50 duration-300">
            <AutomationFlowBuilder onSave={handleFlowBuilderSave} />
          </TabsContent>
          
          {/* Comments Tab */}
          <TabsContent value="comments" className="animate-in fade-in-50 duration-300">
            <CommentReplies />
          </TabsContent>
          
          {/* Connected Accounts Tab */}
          <TabsContent value="accounts" className="animate-in fade-in-50 duration-300">
            <SocialMediaConnect onAccountConnected={setConnectedAccounts} />
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
            platforms={[
              { id: "398280132", name: "Facebook" },
              { id: "398280133", name: "Instagram" },
              { id: "398280134", name: "Twitter" },
              { id: "398280135", name: "LinkedIn" }
            ]}
          />
        )}
      </AnimatePresence>
      
      {/* Automation dialog */}
      <AutomationDialog
        open={showAutomationDialog}
        onOpenChange={setShowAutomationDialog}
        automation={currentAutomation}
        setAutomation={setCurrentAutomation}
        onSave={handleSaveAutomation}
        platforms={[
          { id: "398280132", name: "Facebook" },
          { id: "398280133", name: "Instagram" },
          { id: "398280134", name: "Twitter" },
          { id: "398280135", name: "LinkedIn" }
        ]}
      />
    </>
  );
} 