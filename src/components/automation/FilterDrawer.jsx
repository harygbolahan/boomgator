import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Check } from "lucide-react";

// Define platform mapping consistently
const PLATFORMS = {
  "398280132": "Facebook",
  "398280133": "Instagram",
  "398280134": "Twitter",
  "398280135": "LinkedIn"
};

export const FilterDrawer = ({ isOpen, onClose, filters, setFilters, platforms = [] }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApplyFilters = () => {
    setFilters(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters = {
      platform: "all",
      type: "all",
      status: "all"
    };
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
    onClose();
  };

  // Get platform name by ID
  const getPlatformName = (platformId) => {
    return PLATFORMS[platformId] || platformId;
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div 
        className="bg-background w-full max-w-sm h-full p-6 shadow-lg flex flex-col"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 20 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Filter Automations</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6 flex-1">
          <div className="space-y-2">
            <Label htmlFor="platform-filter">Platform</Label>
            <Select
              value={localFilters.platform}
              onValueChange={(value) => setLocalFilters({ ...localFilters, platform: value })}
            >
              <SelectTrigger id="platform-filter">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                {platforms.length > 0 ? (
                  platforms.map(platform => (
                    <SelectItem key={platform.id} value={platform.id}>
                      {platform.name}
                    </SelectItem>
                  ))
                ) : (
                  Object.entries(PLATFORMS).map(([id, name]) => (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type-filter">Automation Type</Label>
            <Select
              value={localFilters.type}
              onValueChange={(value) => setLocalFilters({ ...localFilters, type: value })}
            >
              <SelectTrigger id="type-filter">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Comment">Comment</SelectItem>
                <SelectItem value="Message">Message</SelectItem>
                <SelectItem value="Keyword">Keyword</SelectItem>
                <SelectItem value="Story">Story</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status-filter">Status</Label>
            <Select
              value={localFilters.status}
              onValueChange={(value) => setLocalFilters({ ...localFilters, status: value })}
            >
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Paused">Paused</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2 pt-6 border-t">
          <Button 
            onClick={handleApplyFilters} 
            className="w-full"
          >
            <Check className="mr-1.5 h-4 w-4" /> Apply Filters
          </Button>
          <Button 
            variant="outline" 
            onClick={handleResetFilters} 
            className="w-full"
          >
            <X className="mr-1.5 h-4 w-4" /> Reset Filters
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}; 