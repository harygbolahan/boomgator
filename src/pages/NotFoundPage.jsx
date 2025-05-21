import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { Home, ArrowLeft, ExternalLink } from "lucide-react";

export function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  
  const goBack = () => {
    navigate(-1);
  };
  
  const goHome = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`max-w-md w-full rounded-lg shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                404
              </div>
              <div className="absolute -bottom-4 w-full text-center">
                <div className={`h-1 mx-auto w-24 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600`}></div>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              The page you were looking for doesn't exist or has been moved.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
              <button
                onClick={goBack}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors w-full ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
              
              <button
                onClick={goHome}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all w-full"
              >
                <Home className="w-4 h-4" />
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
        
        <div className={`px-6 py-4 ${isDarkMode ? 'bg-gray-900/50 text-gray-400 border-gray-700' : 'bg-gray-50 text-gray-600 border-gray-200'} border-t`}>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              Requested URL: <span className="font-mono text-xs">{location.pathname}</span>
            </div>
            <a 
              href="https://support.boomgator.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm hover:underline"
            >
              Help <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 