import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBoom } from '@/contexts/BoomContext';
import { toast } from 'react-toastify';

const PageConfig = ({ configData, setConfigData, flowData }) => {
  const { getPages, pages } = useBoom();
  const [isLoading, setIsLoading] = useState(true);
  const [filteredPages, setFilteredPages] = useState([]);

  // Load pages and filter by platform
  useEffect(() => {
    const loadPages = async () => {
      try {
        setIsLoading(true);
        if (!pages || pages.length === 0) {
          await getPages();
        }
        
        // Filter pages by selected platform
        const platformId = flowData.platform?.platform_id;
        if (platformId && pages) {
          const filtered = pages.filter(page => page.platform_id === platformId);
          setFilteredPages(filtered);
        } else {
          setFilteredPages(pages || []);
        }
        
        console.log('Pages loaded and filtered:', filteredPages);
      } catch (error) {
        console.error('Error loading pages:', error);
        toast.error('Failed to load pages');
      } finally {
        setIsLoading(false);
      }
    };

    loadPages();
  }, [getPages, pages, flowData.platform]);

  // Handle page selection
  const handlePageSelect = (pageId) => {
    const selectedPage = filteredPages.find(p => p.page_id === pageId);
    if (selectedPage) {
      setConfigData({
        ...configData,
        page_id: pageId,
        pageName: selectedPage.page_name,
        pageDescription: `Page: ${selectedPage.page_name}`,
        // Pass along the service info for next step
        service_id: flowData.trigger?.service_id,
      });
      console.log('Page selected:', selectedPage);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Select the specific page or account where this automation will run.
      </div>

      <div className="space-y-2">
        <Label htmlFor="page_id">Page</Label>
        <Select
          value={configData.page_id || ""}
          onValueChange={handlePageSelect}
          disabled={isLoading}
        >
          <SelectTrigger id="page_id">
            <SelectValue placeholder={isLoading ? "Loading pages..." : "Select page"} />
          </SelectTrigger>
          <SelectContent>
            {filteredPages.map((page) => (
              <SelectItem key={page.id} value={page.page_id}>
                <div className="flex flex-col">
                  <span className="font-medium">{page.page_name}</span>
                  <span className="text-xs text-gray-500">
                    {page.platform_name || 'Page'}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {configData.page_id && (
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="text-sm">
              <div className="font-medium text-green-900">
                {configData.pageName}
              </div>
              <div className="text-green-700 text-xs mt-1">
                Automation will monitor this page
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500">
          Select the page you want to automate
        </p>
      </div>
    </div>
  );
};

export default PageConfig; 