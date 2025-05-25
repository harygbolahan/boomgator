import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBoom } from '@/contexts/BoomContext';
import { toast } from 'react-toastify';

const PlatformConfig = ({ configData, setConfigData, flowData }) => {
  const { getPlatforms, platforms } = useBoom();
  const [isLoading, setIsLoading] = useState(true);

  // Load platforms on component mount
  useEffect(() => {
    const loadPlatforms = async () => {
      try {
        setIsLoading(true);
        if (!platforms || platforms.length === 0) {
          await getPlatforms();
        }
        console.log('Platforms loaded:', platforms);
      } catch (error) {
        console.error('Error loading platforms:', error);
        toast.error('Failed to load platforms');
      } finally {
        setIsLoading(false);
      }
    };

    loadPlatforms();
  }, [getPlatforms, platforms]);

  // Handle platform selection
  const handlePlatformSelect = (platformId) => {
    const selectedPlatform = platforms.find(p => p.platform_id === platformId);
    if (selectedPlatform) {
      setConfigData({
        ...configData,
        platform_id: platformId,
        platformName: selectedPlatform.platform_name,
        platformDescription: `Platform configuration for ${selectedPlatform.platform_name}`,
      });
      console.log('Platform selected:', selectedPlatform);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Select the social media platform where you want to run this automation.
      </div>

      <div className="space-y-2">
        <Label htmlFor="platform_id">Platform</Label>
        <Select
          value={configData.platform_id || ""}
          onValueChange={handlePlatformSelect}
          disabled={isLoading}
        >
          <SelectTrigger id="platform_id">
            <SelectValue placeholder={isLoading ? "Loading platforms..." : "Select platform"} />
          </SelectTrigger>
          <SelectContent>
            {platforms?.map((platform) => (
              <SelectItem key={platform.id} value={platform.platform_id}>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{platform.platform_name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Platform Description */}
        {configData.platform_id && (
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="text-sm">
              <div className="font-medium text-blue-900">
                {configData.platformName}
              </div>
              <div className="text-blue-700 text-xs mt-1">
                This automation will work on {configData.platformName}
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500">
          Choose the platform where your automation will be active
        </p>
      </div>
    </div>
  );
};

export default PlatformConfig; 