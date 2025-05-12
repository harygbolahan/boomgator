import { Video } from 'lucide-react';

const TwitterPreview = ({ content, media }) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="p-3 flex">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-400 mr-3">
          <span className="text-xl font-bold">𝕏</span>
        </div>
        <div>
          <div className="flex items-center">
            <p className="font-medium">Your Name</p>
            <p className="text-gray-500 text-sm ml-1">@your_handle</p>
          </div>
          <p className="whitespace-pre-wrap mt-1">{content || "Your tweet will appear here"}</p>
          
          {media && media.length > 0 && (
            <div className="mt-2 rounded-lg overflow-hidden border">
              {media[0].type === 'image' ? (
                <img src={media[0].url} alt="" className="w-full max-h-80 object-cover" />
              ) : (
                <div className="w-full h-60 flex items-center justify-center bg-gray-100">
                  <Video className="w-10 h-10 text-gray-500" />
                </div>
              )}
            </div>
          )}
          
          <div className="mt-3 flex space-x-8 text-gray-500 text-sm">
            <span>💬 0</span>
            <span>🔁 0</span>
            <span>❤️ 0</span>
            <span>📊 0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwitterPreview; 