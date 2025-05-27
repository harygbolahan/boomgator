import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useBoom } from "@/contexts/BoomContext";
import { Bell, CheckCheck, AlertCircle, MessageSquare, Calendar, Check, Filter, Search, Trash2, CheckSquare, Loader, Sparkles } from "lucide-react";

export function NotificationsPage() {
  const { isDarkMode } = useTheme();
  const { announcements, loadingAnnouncements } = useBoom();
  const [readAnnouncements, setReadAnnouncements] = useState(() => {
    const saved = localStorage.getItem('readAnnouncements');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  // Save read announcements to localStorage
  useEffect(() => {
    localStorage.setItem('readAnnouncements', JSON.stringify([...readAnnouncements]));
  }, [readAnnouncements]);

  // Helper function to format announcement time
  const formatAnnouncementTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Helper function to get icon for announcement
  const getAnnouncementIcon = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('maintenance') || titleLower.includes('outage')) {
      return <AlertCircle className="h-5 w-5 text-amber-500" />;
    } else if (titleLower.includes('feature') || titleLower.includes('update')) {
      return <Sparkles className="h-5 w-5 text-blue-500" />;
    } else if (titleLower.includes('security') || titleLower.includes('important')) {
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    } else {
      return <Bell className="h-5 w-5 text-indigo-500" />;
    }
  };
  
  const handleMarkAsRead = (id) => {
    setReadAnnouncements(prev => new Set([...prev, id]));
  };
  
  const handleMarkAllAsRead = () => {
    const allAnnouncementIds = announcements.map(announcement => announcement.id);
    setReadAnnouncements(new Set(allAnnouncementIds));
  };
  
  const toggleSelectNotification = (id) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(notificationId => notificationId !== id)
        : [...prev, id]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredAnnouncements.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredAnnouncements.map(n => n.id));
    }
  };
  
  const handleDeleteSelected = () => {
    // For announcements, we'll just mark them as read instead of deleting
    setReadAnnouncements(prev => new Set([...prev, ...selectedNotifications]));
    setSelectedNotifications([]);
  };
  
  // Filter and search announcements
  const filteredAnnouncements = announcements.filter(announcement => {
    // Only show active announcements
    if (announcement.status !== 'active') return false;
    
    const isRead = readAnnouncements.has(announcement.id);
    const matchesFilter = 
      filter === "all" || 
      (filter === "unread" && !isRead) || 
      (filter === "read" && isRead);
      
    const matchesSearch = 
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      announcement.message.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesFilter && matchesSearch;
  });
  
  const unreadCount = announcements.filter(announcement => 
    announcement.status === 'active' && !readAnnouncements.has(announcement.id)
  ).length;
  
  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Announcements</h1>
          <p className={`mt-1 text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            You have {unreadCount} unread {unreadCount === 1 ? 'announcement' : 'announcements'}
          </p>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <button 
            onClick={handleMarkAllAsRead}
            className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
              isDarkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                : 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-300'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Mark all read</span>
          </button>
        </div>
      </div>
      
      <div className={`p-3 sm:p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between mb-3 sm:mb-4">
          <div className="flex gap-1 sm:gap-2 flex-wrap">
            <button 
              onClick={() => setFilter("all")}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-lg transition-colors ${
                filter === "all" 
                  ? (isDarkMode 
                    ? 'bg-indigo-900/40 text-indigo-400' 
                    : 'bg-indigo-50 text-indigo-700')
                  : (isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600')
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter("unread")}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-lg transition-colors ${
                filter === "unread" 
                  ? (isDarkMode 
                    ? 'bg-indigo-900/40 text-indigo-400' 
                    : 'bg-indigo-50 text-indigo-700')
                  : (isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600')
              }`}
            >
              Unread
            </button>
            <button 
              onClick={() => setFilter("read")}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-lg transition-colors ${
                filter === "read" 
                  ? (isDarkMode 
                    ? 'bg-indigo-900/40 text-indigo-400' 
                    : 'bg-indigo-50 text-indigo-700')
                  : (isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600')
              }`}
            >
              Read
            </button>
          </div>
          
          <div className="flex gap-2 sm:gap-3">
            <div className="relative w-full sm:w-auto">
              <Search className={`absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-7 sm:pl-9 pr-2 sm:pr-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-lg w-full sm:w-64 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                } border focus:outline-none focus:ring-2 ${
                  isDarkMode ? 'focus:ring-indigo-600 focus:border-indigo-600' : 'focus:ring-indigo-200 focus:border-indigo-300'
                }`}
              />
            </div>
          </div>
        </div>
        
        <div className="mb-3 sm:mb-4 flex justify-between items-center">
          <div className="flex items-center gap-1 sm:gap-2">
            <button 
              onClick={handleSelectAll}
              className={`p-1 sm:p-1.5 rounded-md ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <CheckSquare className={`h-3.5 sm:h-4 w-3.5 sm:w-4 ${
                selectedNotifications.length > 0 ? 'text-indigo-500' : 'text-gray-400'
              }`} />
            </button>
            <span className="text-xs sm:text-sm">
              {selectedNotifications.length > 0 ? `${selectedNotifications.length} selected` : 'Select items'}
            </span>
          </div>
          
          {selectedNotifications.length > 0 && (
            <button 
              onClick={handleDeleteSelected}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
                isDarkMode 
                  ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' 
                  : 'bg-red-50 text-red-600 hover:bg-red-100'
              }`}
            >
              <Trash2 className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
              Delete
            </button>
          )}
        </div>
        
        {/* Announcements list */}
        <div className="space-y-2 sm:space-y-3">
          {loadingAnnouncements ? (
            <div className="p-4 text-center">
              <Loader className="h-6 w-6 animate-spin mx-auto text-indigo-600" />
              <p className="text-sm text-gray-500 mt-2">Loading announcements...</p>
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Bell className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p>No announcements found</p>
              {searchQuery && <p className="text-xs sm:text-sm mt-1">Try changing your search query</p>}
              {filter !== "all" && <p className="text-xs sm:text-sm mt-1">Try changing your filter</p>}
            </div>
          ) : (
            filteredAnnouncements.map(announcement => (
              <div 
                key={announcement.id} 
                className={`flex gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg ${
                  !readAnnouncements.has(announcement.id) ? (
                    isDarkMode ? 'bg-indigo-900/20' : 'bg-indigo-50/60'
                  ) : (
                    isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                  )
                } relative transition-colors`}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={selectedNotifications.includes(announcement.id)}
                      onChange={() => toggleSelectNotification(announcement.id)}
                      className={`h-3.5 sm:h-4 w-3.5 sm:w-4 rounded mr-2 sm:mr-3 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 checked:bg-indigo-600 focus:ring-indigo-600' 
                          : 'bg-gray-100 border-gray-300 checked:bg-indigo-600 focus:ring-indigo-500'
                      } focus:ring-offset-0 focus:outline-none focus:ring-1`}
                    />
                    <span className={`flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-full ${
                      isDarkMode ? 'bg-indigo-900/20' : 'bg-indigo-100'
                    }`}>
                      {getAnnouncementIcon(announcement.title)}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h3 className={`font-semibold text-sm sm:text-base truncate ${!readAnnouncements.has(announcement.id) && 'font-bold'}`}>
                      {announcement.title}
                    </h3>
                    <span className="text-xs text-gray-500 mt-0.5 sm:mt-0">
                      {formatAnnouncementTime(announcement.created_at)}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm mt-1 text-gray-600 dark:text-gray-300 line-clamp-2">
                    {announcement.message}
                  </p>
                  <div className="flex justify-end sm:justify-start mt-2">
                    {!readAnnouncements.has(announcement.id) && (
                      <button 
                        onClick={() => handleMarkAsRead(announcement.id)}
                        className={`text-xs sm:text-sm font-medium ${
                          isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
                        }`}
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 