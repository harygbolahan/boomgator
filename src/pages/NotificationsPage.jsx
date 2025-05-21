import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Bell, CheckCheck, AlertCircle, MessageSquare, Calendar, Check, Filter, Search, Trash2, CheckSquare } from "lucide-react";

// Sample notifications data
const initialNotifications = [
  {
    id: 1,
    type: "alert",
    title: "Account Connected",
    message: "Your Instagram account has been successfully connected.",
    time: "5 minutes ago",
    read: false,
    icon: <CheckCheck className="h-5 w-5 text-green-500" />,
  },
  {
    id: 2,
    type: "warning",
    title: "Automation Paused",
    message: "The DM responder automation has been paused due to API limits.",
    time: "2 hours ago",
    read: false,
    icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
  },
  {
    id: 3,
    type: "message",
    title: "New Comment",
    message: "Someone commented on your latest post: 'Great content! Looking forward to more.'",
    time: "Yesterday",
    read: true,
    icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
  },
  {
    id: 4,
    type: "alert",
    title: "Post Scheduled",
    message: "Your post has been scheduled for tomorrow at 10:00 AM.",
    time: "2 days ago",
    read: true,
    icon: <Calendar className="h-5 w-5 text-indigo-500" />,
  },
  {
    id: 5,
    type: "warning",
    title: "Storage Limit",
    message: "You're approaching your storage limit. Consider upgrading your plan.",
    time: "3 days ago",
    read: true,
    icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
  },
  {
    id: 6,
    type: "message",
    title: "Direct Message",
    message: "You received a new message from a potential client asking about your services.",
    time: "1 week ago",
    read: true,
    icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
  },
  {
    id: 7,
    type: "alert",
    title: "Analytics Report",
    message: "Your weekly analytics report is now available. Your engagement rate has increased by 15%.",
    time: "1 week ago",
    read: true,
    icon: <CheckCheck className="h-5 w-5 text-green-500" />,
  }
];

export function NotificationsPage() {
  const { isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  
  const handleMarkAsRead = (id) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? {...notification, read: true} : notification
      )
    );
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({
        ...notification,
        read: true
      }))
    );
  };
  
  const toggleSelectNotification = (id) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(notificationId => notificationId !== id)
        : [...prev, id]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };
  
  const handleDeleteSelected = () => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => !selectedNotifications.includes(notification.id))
    );
    setSelectedNotifications([]);
  };
  
  // Filter and search notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = 
      filter === "all" || 
      (filter === "unread" && !notification.read) || 
      (filter === "read" && notification.read);
      
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesFilter && matchesSearch;
  });
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  return (
    <div className={`space-y-4 sm:space-y-6 max-w-4xl mx-auto`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
          <p className={`mt-1 text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            You have {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
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
        
        {/* Notifications list */}
        <div className="space-y-2 sm:space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Bell className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p>No notifications found</p>
              {searchQuery && <p className="text-xs sm:text-sm mt-1">Try changing your search query</p>}
              {filter !== "all" && <p className="text-xs sm:text-sm mt-1">Try changing your filter</p>}
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div 
                key={notification.id} 
                className={`flex gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg ${
                  !notification.read ? (
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
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => toggleSelectNotification(notification.id)}
                      className={`h-3.5 sm:h-4 w-3.5 sm:w-4 rounded mr-2 sm:mr-3 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 checked:bg-indigo-600 focus:ring-indigo-600' 
                          : 'bg-gray-100 border-gray-300 checked:bg-indigo-600 focus:ring-indigo-500'
                      } focus:ring-offset-0 focus:outline-none focus:ring-1`}
                    />
                    <span className={`flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-full ${
                      notification.type === 'alert' 
                        ? (isDarkMode ? 'bg-green-900/20' : 'bg-green-100') 
                        : notification.type === 'warning'
                          ? (isDarkMode ? 'bg-amber-900/20' : 'bg-amber-100')
                          : (isDarkMode ? 'bg-blue-900/20' : 'bg-blue-100')
                    }`}>
                      {notification.icon}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h3 className={`font-semibold text-sm sm:text-base truncate ${!notification.read && 'font-bold'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-500 mt-0.5 sm:mt-0">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm mt-1 text-gray-600 dark:text-gray-300 line-clamp-2">
                    {notification.message}
                  </p>
                  <div className="flex justify-end sm:justify-start mt-2">
                    {!notification.read && (
                      <button 
                        onClick={() => handleMarkAsRead(notification.id)}
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