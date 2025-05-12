import { Video } from 'lucide-react';

const LinkedInPreview = ({ content, scheduledDate, media }) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="p-3 border-b flex items-center">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
          <span className="text-xl font-bold">in</span>
        </div>
        <div>
          <p className="font-medium">Your Name</p>
          <p className="text-xs text-gray-500">
            Your Title • {scheduledDate 
              ? `Scheduled for ${scheduledDate}`
              : "Just now"
            }
          </p>
        </div>
      </div>
      <div className="p-3">
        <p className="whitespace-pre-wrap mb-3">{content || "Your post content will appear here"}</p>
        {media && media.length > 0 && (
          <div className="rounded overflow-hidden border">
            {media[0].type === 'image' ? (
              <img src={media[0].url} alt="" className="w-full max-h-80 object-cover" />
            ) : (
              <div className="w-full h-60 flex items-center justify-center bg-gray-100">
                <Video className="w-10 h-10 text-gray-500" />
              </div>
            )}
          </div>
        )}
      </div>
      <div className="p-3 border-t flex justify-around">
        <button className="text-gray-600 flex items-center text-sm">
          <span className="mr-1">👍</span> Like
        </button>
        <button className="text-gray-600 flex items-center text-sm">
          <span className="mr-1">💬</span> Comment
        </button>
        <button className="text-gray-600 flex items-center text-sm">
          <span className="mr-1">↗️</span> Share
        </button>
      </div>
    </div>
  );
};

export default LinkedInPreview; 