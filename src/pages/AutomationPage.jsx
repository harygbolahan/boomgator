import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Filter, X, LayoutDashboard, MessageCircle, RefreshCcw, Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";

// Import our custom components
import { AutomationCard } from "@/components/automation/AutomationCard";
import { FilterDrawer } from "@/components/automation/FilterDrawer";
import { CommentReplies } from '@/components/comments/CommentReplies';

// Import Boom context
import { useBoom } from "@/contexts/BoomContext";

// Constants
const PLATFORMS = {
  twitter: "Twitter",
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  youtube: "YouTube"
};

const ITEMS_PER_PAGE_OPTIONS = [5, 10];

// Enhanced EmptyState component
const EmptyState = ({ searchQuery }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="flex flex-col items-center justify-center p-8 sm:p-16"
  >
    <Card className="p-8 sm:p-12 max-w-md w-full text-center border-dashed border-2">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="rounded-full bg-gradient-to-br from-primary/20 to-primary/10 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-6 mx-auto"
      >
        <Search className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
      </motion.div>
      <h3 className="font-semibold text-lg sm:text-xl mb-3 text-foreground">
        {searchQuery ? "No automations found" : "No automations available"}
      </h3>
      <p className="text-muted-foreground mb-6 text-sm sm:text-base leading-relaxed">
        {searchQuery 
          ? "Try adjusting your search query or filters to find what you're looking for."
          : "Get started by creating your first automation to streamline your social media management."
        }
      </p>
      {!searchQuery && (
        <Button 
          onClick={() => window.location.href = '/flow'}
          className="mt-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Your First Automation
        </Button>
      )}
    </Card>
  </motion.div>
);

// Enhanced ActiveFilters component
const ActiveFilters = ({ filters, setFilters }) => {
  const getReadableFilter = (key, value) => {
    if (key === "platform" && value !== "all") return `Platform: ${value}`;
    if (key === "type" && value !== "all") return `Type: ${value}`;
    if (key === "status" && value !== "all") return `Status: ${value}`;
    return null;
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== "all");
  
  if (!hasActiveFilters) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 mb-6 p-4 bg-muted/30 rounded-lg border"
    >
      <span className="text-sm font-medium text-muted-foreground mr-2">Active filters:</span>
      {Object.entries(filters).map(([key, value]) => {
        const label = getReadableFilter(key, value);
        if (!label) return null;
        
        return (
          <Badge key={key} variant="secondary" className="flex items-center gap-1 px-3 py-1">
            {label}
            <X 
              className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors" 
              onClick={() => setFilters({...filters, [key]: "all"})}
            />
          </Badge>
        );
      })}
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 px-3 text-xs hover:bg-destructive/10 hover:text-destructive"
        onClick={() => setFilters({
          platform: "all",
          type: "all",
          status: "all"
        })}
      >
        Clear all
      </Button>
    </motion.div>
  );
};

// Enhanced Pagination component
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage, 
  onItemsPerPageChange,
  totalItems 
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <Card className="p-4 sm:p-6 mt-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Items per page selector */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Show</span>
          <Select value={itemsPerPage.toString()} onValueChange={(value) => onItemsPerPageChange(parseInt(value))}>
            <SelectTrigger className="w-16 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ITEMS_PER_PAGE_OPTIONS.map(option => (
                <SelectItem key={option} value={option.toString()}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>per page</span>
        </div>

        {/* Page info */}
        <div className="text-sm text-muted-foreground">
          Showing {startItem}-{endItem} of {totalItems} results
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>First page</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Previous page</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {getPageNumbers().map((page, index) => (
            <Button
              key={index}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
              className="h-8 w-8 p-0"
            >
              {page}
            </Button>
          ))}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Next page</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Last page</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </Card>
  );
};

// Enhanced LoadingState component
const LoadingState = () => (
  <div className="space-y-4 sm:space-y-6">
    {[...Array(3)].map((_, i) => (
      <Card key={i} className="p-6">
        <div className="animate-pulse">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
            <div className="h-8 w-20 bg-muted rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
          <div className="flex gap-2 mt-4">
            <div className="h-8 w-16 bg-muted rounded"></div>
            <div className="h-8 w-16 bg-muted rounded"></div>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Get automation functions from BoomContext
  const { getAllAutomations, updateAutomation, deleteAutomation } = useBoom();
  
  // Fetch automations on component mount
  useEffect(() => {
    fetchAutomations();
  }, []);
  
  // Reset to first page when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);
  
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
  
  // Pagination calculations
  const totalPages = Math.ceil(filteredAutomations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAutomations = filteredAutomations.slice(startIndex, endIndex);
  
  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };
  
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
      <div className="space-y-6 sm:space-y-8 mx-auto max-w-[350px] sm:max-w-none">
        {/* Enhanced Header with gradient background */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-6 sm:p-8"
        >
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Automation Center
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl">
                Streamline your social media management with intelligent automations
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={() => navigate("/flow")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Automation
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-sm">Create a new automation workflow</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline"
                      className="w-full sm:w-auto border-2 hover:border-primary/50 transition-all duration-200"
                      onClick={fetchAutomations}
                      disabled={loading}
                    >
                      <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-sm">Refresh automation list</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </motion.div>
        
        {/* Enhanced Main tabs navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6 sm:mt-8">
          <Card className="p-1">
            <TabsList className="grid grid-cols-2 h-12 bg-transparent p-1">
              {mainTabs.map(tab => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id} 
                  className="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
                >
                  {tab.icon}
                  <span className="ml-1">{tab.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Card>
          
          {/* Automations Tab */}
          <TabsContent value="automations" className="animate-in fade-in-50 duration-500 mt-6">
            {/* Enhanced Search and filter bar */}
            <Card className="p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, platform, or content..."
                    className="pl-10 h-11 border-2 focus:border-primary/50 transition-colors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="relative sm:flex-shrink-0 h-11 px-4 border-2 hover:border-primary/50 transition-all duration-200"
                        onClick={() => setShowFilterDrawer(true)}
                      >
                        <div className="relative flex items-center">
                          <Filter className="h-4 w-4 mr-2" />
                          <span>Filters</span>
                          {(filters.platform !== "all" || filters.type !== "all" || filters.status !== "all") && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p className="text-sm">Filter automations by platform, type, or status</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </Card>
            
            {/* Active filters */}
            <ActiveFilters filters={filters} setFilters={setFilters} />
            
            {/* Loading state */}
            {loading && <LoadingState />}
            
            {/* Error state */}
            {error && !loading && (
              <Card className="p-8 text-center border-destructive/50">
                <div className="space-y-4">
                  <div className="rounded-full bg-destructive/10 w-16 h-16 flex items-center justify-center mx-auto">
                    <X className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Something went wrong</h3>
                    <p className="text-destructive text-sm mb-4">{error}</p>
                    <Button variant="outline" onClick={fetchAutomations}>
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Try Again
                    </Button>
                  </div>
                </div>
              </Card>
            )}
            
            {/* Automation cards or empty state */}
            {!loading && !error && (
              <div className="space-y-6">
                {filteredAutomations.length > 0 ? (
                  <>
                    {/* Results header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-muted/30 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-lg">Your Automations</h3>
                        <p className="text-sm text-muted-foreground">
                          {filteredAutomations.length} automation{filteredAutomations.length !== 1 ? 's' : ''} found
                          {searchQuery && ` matching "${searchQuery}"`}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </div>
                    </div>
                    
                    {/* Enhanced automation cards grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                      <AnimatePresence mode="popLayout">
                        {paginatedAutomations.map((automation, index) => (
                          <motion.div
                            key={automation.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ 
                              duration: 0.3, 
                              delay: index * 0.1,
                              type: "spring",
                              stiffness: 100
                            }}
                          >
                            <AutomationCard
                              automation={automation}
                              onStatusChange={handleStatusChange}
                              onEdit={null}
                              onDelete={handleDeleteAutomation}
                              onView={handleViewAutomation}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                    
                    {/* Pagination */}
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      itemsPerPage={itemsPerPage}
                      onItemsPerPageChange={handleItemsPerPageChange}
                      totalItems={filteredAutomations.length}
                    />
                  </>
                ) : (
                  <EmptyState searchQuery={searchQuery} />
                )}
              </div>
            )}
          </TabsContent>
          
          {/* Comments Tab */}
          <TabsContent value="comments" className="animate-in fade-in-50 duration-500 mt-6">
            <Card className="p-6">
              <CommentReplies />
            </Card>
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