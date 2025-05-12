import FacebookPreview from './FacebookPreview';
import InstagramPreview from './InstagramPreview';
import TwitterPreview from './TwitterPreview';
import LinkedInPreview from './LinkedInPreview';

const PlatformPreview = ({ platformId, content, scheduledDate, scheduledTime, media, platformName = '' }) => {
  // Determine which preview to render based on platform name or ID
  const getPlatformComponent = () => {
    // First try to match by platform name (case insensitive)
    const normalizedName = platformName.toLowerCase();
    
    if (normalizedName.includes('facebook')) {
      return (
        <FacebookPreview 
          content={content} 
          scheduledDate={scheduledDate} 
          scheduledTime={scheduledTime} 
          media={media} 
        />
      );
    } else if (normalizedName.includes('instagram')) {
      return (
        <InstagramPreview 
          content={content} 
          scheduledDate={scheduledDate} 
          media={media} 
        />
      );
    } else if (normalizedName.includes('twitter') || normalizedName.includes('x')) {
      return (
        <TwitterPreview 
          content={content} 
          media={media} 
        />
      );
    } else if (normalizedName.includes('linkedin')) {
      return (
        <LinkedInPreview 
          content={content} 
          scheduledDate={scheduledDate} 
          media={media} 
        />
      );
    }
    
    // Fallback to checking by ID if name matching didn't work
    // Return appropriate preview component based on platform ID
    switch (platformId) {
      case "1":
        return (
          <FacebookPreview 
            content={content} 
            scheduledDate={scheduledDate} 
            scheduledTime={scheduledTime} 
            media={media} 
          />
        );
      case "2":
        return (
          <InstagramPreview 
            content={content} 
            scheduledDate={scheduledDate} 
            media={media} 
          />
        );
      case "3":
        return (
          <TwitterPreview 
            content={content} 
            media={media} 
          />
        );
      case "4":
        return (
          <LinkedInPreview 
            content={content} 
            scheduledDate={scheduledDate} 
            media={media} 
          />
        );
      default:
        return (
          <div className="p-4 border rounded-lg bg-gray-50 text-center">
            <p className="text-gray-500">Select a platform to see preview</p>
          </div>
        );
    }
  };

  return getPlatformComponent();
};

export default PlatformPreview; 