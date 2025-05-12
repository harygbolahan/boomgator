import { Video } from 'lucide-react';

const FacebookPreview = ({ content, scheduledDate, scheduledTime, media }) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="p-3 border-b flex items-center">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
          <span className="text-xl font-bold">ⓕ</span>
        </div>
        <div>
          <p className="font-medium">Your Page</p>
          <p className="text-xs text-gray-500">
            {scheduledDate && scheduledTime 
              ? `Scheduled for ${scheduledDate} at ${scheduledTime}`
              : "Just now"
            }
          </p>
        </div>
      </div>
      <div className="p-3">
        <p className="whitespace-pre-wrap mb-3">{content || "Your post content will appear here"}</p>
        {media && media.length > 0 && (
          <div className={`grid ${media.length > 1 ? 'grid-cols-2 gap-1' : 'grid-cols-1'}`}>
            {media.map((item, index) => (
              <div key={index} className="aspect-video bg-gray-100 rounded overflow-hidden">
                {item.type === 'image' ? (
                  <img src={item.url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <Video className="w-8 h-8 text-gray-500" />
                  </div>
                )}
              </div>
            ))}
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

export default FacebookPreview; 