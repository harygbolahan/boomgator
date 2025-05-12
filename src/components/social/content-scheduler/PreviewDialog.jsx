import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PlatformPreview from './platform-preview/PlatformPreview';

const PreviewDialog = ({ 
  isOpen, 
  onClose, 
  platforms = [],
  formData = { 
    platform_id: "", 
    content: "", 
    scheduled_date: "", 
    scheduled_time: "", 
    media: [] 
  } 
}) => {
  // Get platform name for title
  const getPlatformName = () => {
    if (!platforms || platforms.length === 0 || !formData.platform_id) {
      return "social media";
    }
    
    const platform = platforms.find(p => p.platform_id === formData.platform_id);
    return platform ? platform.platform_name : "social media";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Post Preview</DialogTitle>
          <DialogDescription>
            Preview how your post will look on {getPlatformName()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <PlatformPreview 
            platformId={formData.platform_id}
            content={formData.content}
            scheduledDate={formData.scheduled_date}
            scheduledTime={formData.scheduled_time}
            media={formData.media}
            platformName={getPlatformName()}
          />
          
          <div className="text-xs text-gray-500 mt-4 text-center">
            This is a preview and may differ slightly from the actual post appearance
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={onClose}
            className="mt-2"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialog; 