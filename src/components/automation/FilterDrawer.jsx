import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Check } from "lucide-react";

export const FilterDrawer = ({ isOpen, onClose, filters, setFilters }) => {
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
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
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
                <SelectItem value="comment">Comment</SelectItem>
                <SelectItem value="message">Message</SelectItem>
                <SelectItem value="keyword">Keyword</SelectItem>
                <SelectItem value="story">Story</SelectItem>
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