import { Video } from 'lucide-react';

const InstagramPreview = ({ content, scheduledDate, media }) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white max-w-md mx-auto">
      <div className="p-3 border-b flex items-center">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 flex items-center justify-center text-white mr-3">
          <span className="text-xs">📷</span>
        </div>
        <div className="flex-grow">
          <p className="font-medium text-sm">your_instagram</p>
        </div>
        <button className="text-gray-500">•••</button>
      </div>
      
      {media && media.length > 0 ? (
        <div className="aspect-square bg-black">
          {media[0].type === 'image' ? (
            <img src={media[0].url} alt="" className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <Video className="w-12 h-12 text-white" />
            </div>
          )}
        </div>
      ) : (
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          <p className="text-gray-400">No media to display</p>
        </div>
      )}
      
      <div className="p-3">
        <div className="flex justify-between mb-2">
          <div className="flex space-x-4">
            <span>❤️</span>
            <span>💬</span>
            <span>↗️</span>
          </div>
          <span>🔖</span>
        </div>
        <p className="text-sm mb-1"><strong>your_instagram</strong> {content || "Your caption will appear here"}</p>
        <p className="text-xs text-gray-500">
          {scheduledDate 
            ? `Will be posted on ${scheduledDate}`
            : "Just now"
          }
        </p>
      </div>
    </div>
  );
};

export default InstagramPreview; 