import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Filter, X, LayoutDashboard, MessageCircle, RefreshCcw, Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "react-toastify";

// Import our custom components
import { AutomationCard } from "@/components/automation/AutomationCard";
import { FilterDrawer } from "@/components/automation/FilterDrawer";
import { CommentReplies } from '@/components/comments/CommentReplies';

// Import Boom context
import { useBoom } from "@/contexts/BoomContext";



// EmptyState component
const EmptyState = ({ searchQuery }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center p-6 sm:p-12 border border-dashed rounded-xl text-center"
  >
    <div className="rounded-full bg-primary/10 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-4">
      <Search className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
    </div>
    <h3 className="font-medium text-base sm:text-lg mb-2">
      {searchQuery ? "No automations found" : "No automations available"}
    </h3>
    <p className="text-muted-foreground mb-6 max-w-md text-sm sm:text-base">
      {searchQuery 
        ? "Try adjusting your search query or filters to find what you're looking for."
        : "There are currently no automations in your account."
      }
    </p>
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
  const navigate = useNavigate();
  
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
  
  // Get automation functions from BoomContext
  const { getAllAutomations, updateAutomation, deleteAutomation } = useBoom();
  
  // Fetch automations on component mount
  useEffect(() => {
    fetchAutomations();
  }, []);
  
  // Fetch automations from API
  const fetchAutomations = async () => {
    try {
      setLoading(true);
      const data = await getAllAutomations();
      console.log("Fetched automations:", data);
      
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
  
  // Filter and search automations
  const filteredAutomations = automationsList.filter(automation => {
    // Search query filter
    const matchesSearch = !searchQuery || 
      automation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      automation.incoming?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      automation.content?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Other filters
    const matchesPlatform = filters.platform === "all" || 
      automation.platform === filters.platform;
    const matchesType = filters.type === "all" || 
      automation.type === filters.type;
    const matchesStatus = filters.status === "all" || 
      automation.status === filters.status;
    
    return matchesSearch && matchesPlatform && matchesType && matchesStatus;
  });
  
  // View automation details
  const handleViewAutomation = (automation) => {
    toast.info(`Viewing details for "${automation.name}"`);
    // Implementation for viewing details would go here
  };
  
  // Change the status of an automation
  const handleStatusChange = async (id, newStatus) => {
    try {
      const automation = automationsList.find(item => item.id === id);
      if (!automation) return;
      
      const response = await updateAutomation({
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
    if (!window.confirm("Are you sure you want to delete this automation?")) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteAutomation(id);
      toast.success("Automation deleted successfully");
      await fetchAutomations();
    } catch (err) {
      console.error("Error deleting automation:", err);
      toast.error("Failed to delete automation");
    } finally {
      setLoading(false);
    }
  };
  
  // Main tabs definition
  const mainTabs = [
    { id: "automations", name: "Automations", icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
    { id: "comments", name: "Comments", icon: <MessageCircle className="h-4 w-4 mr-2" /> }
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
              View and manage your social media automations.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    className="w-full sm:w-auto"
                    onClick={() => navigate("/create-automation")}
                  >
                    <Plus className="mr-1.5 h-4 w-4" />
                    <span>Create Automation</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p className="text-sm">Create a new automation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={fetchAutomations}
                  >
                    <RefreshCcw className="mr-1.5 h-4 w-4" />
                    <span>Refresh</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p className="text-sm">Refresh automation list</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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
                      className="relative sm:flex-shrink-0 h-10 w-10"
                      onClick={() => setShowFilterDrawer(true)}
                    >
                      <div className="relative">
                        <Filter className="h-4 w-4" />
                        {(filters.platform !== "all" || filters.type !== "all" || filters.status !== "all") && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
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
                            onEdit={null}
                            onDelete={handleDeleteAutomation}
                            onView={handleViewAutomation}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </>
                ) : (
                  <EmptyState searchQuery={searchQuery} />
                )}
              </div>
            )}
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
    </>
  );
} 