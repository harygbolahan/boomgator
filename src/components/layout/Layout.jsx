import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useBoom } from "@/contexts/BoomContext";
import { 
  LayoutDashboard, 
  Share2, 
  Zap, 
  Calendar, 
  BarChart2, 
  Link2, 
  UserCircle, 
  LifeBuoy, 
  Menu, 
  Bell, 
  X,
  LogOut,
  Home,
  Settings,
  Sun,
  Moon,
  CheckCheck,
  AlertCircle,
  MessageSquare,
  Clock,
  Loader,
  Layers,
  Package,
  Sparkles
} from "lucide-react";
import { UserMenu } from "./UserMenu";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { name: "Content Scheduler", path: "/content-scheduler", icon: <Clock className="w-4 h-4" /> },
  { name: "AI Content Creator", path: "/ai-content-creator", icon: <Sparkles className="w-4 h-4" /> },
  { name: "Pages Management", path: "/pages-management", icon: <Layers className="w-4 h-4" /> },
  { name: "Messenger Broadcast", path: "/messenger-broadcast", icon: <MessageSquare className="w-4 h-4" /> },
  { name: "Live Messaging", path: "/live-messaging", icon: <MessageSquare className="w-4 h-4" /> },
  { name: "Automation", path: "/automation", icon: <Zap className="w-4 h-4" /> },
  { name: "Integrations", path: "/integrations", icon: <Link2 className="w-4 h-4" /> },
  { name: "Subscription", path: "/subscription", icon: <Package className="w-4 h-4" /> },
  { name: "Account", path: "/account", icon: <UserCircle className="w-4 h-4" /> },
  { name: "Support", path: "/support", icon: <LifeBuoy className="w-4 h-4" /> },
  { name: "Logout", path: "/logout", icon: <LogOut className="w-4 h-4" /> },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { logout } = useAuth();
  const { announcements, loadingAnnouncements } = useBoom();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readAnnouncements, setReadAnnouncements] = useState(() => {
    const saved = localStorage.getItem('readAnnouncements');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [isPageLoading, setIsPageLoading] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };
  
  const handleLogout = () => {
    try {
      logout();
      localStorage.clear();
      navigate("/auth/login", { replace: true });
    } catch (error) {
      console.error('Error during logout:', error);
      localStorage.clear();
      navigate("/auth/login", { replace: true });
    }
  };

  const handleNavItemClick = (item) => {
    if (item.path === "/logout") {
      handleLogout();
    } else {
      navigate(item.path);
    }
    setMobileMenuOpen(false);
  };
  
  const markAllAsRead = () => {
    const allAnnouncementIds = announcements.map(announcement => announcement.id);
    setReadAnnouncements(new Set(allAnnouncementIds));
  };
  
  const markAsRead = (id) => {
    setReadAnnouncements(prev => new Set([...prev, id]));
  };
  
  const getUnreadCount = () => {
    return announcements.filter(announcement => 
      announcement.status === 'active' && !readAnnouncements.has(announcement.id)
    ).length;
  };
  
  const unreadCount = getUnreadCount();

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
  
  // Save read announcements to localStorage
  useEffect(() => {
    localStorage.setItem('readAnnouncements', JSON.stringify([...readAnnouncements]));
  }, [readAnnouncements]);

  // Add loading state on route change
  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 500); // Show loader for at least 500ms for better UX
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen">
      {/* Page transition loader */}
      {isPageLoading && (
        <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}
      
      <div className={`flex min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-gray-800 bg-opacity-75 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
        
        {/* Sidebar - mobile */}
        <aside 
          className={`fixed inset-y-0 left-0 z-50 w-[80%] sm:w-72 transform transition-all duration-300 ease-in-out md:hidden flex flex-col ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } ${isDarkMode 
            ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-gray-700/50' 
            : 'bg-gradient-to-b from-white via-gray-50/50 to-white border-gray-200/50'
          } backdrop-blur-xl shadow-2xl overflow-hidden`}
        >
          <div className="flex flex-col h-full">
            {/* Header with improved design */}
            <div className={`flex items-center justify-between p-4 ${isDarkMode ? 'border-gray-700/30' : 'border-gray-200/30'} border-b backdrop-blur-sm`}>
              <Link to="/dashboard" className="flex items-center gap-2 group">
                <div className="h-8 w-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-200">
                  B
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Boomgator
                </h1>
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDarkMode 
                    ? 'text-gray-400 hover:bg-gray-700/50 hover:text-white' 
                    : 'text-gray-500 hover:bg-gray-100/70 hover:text-gray-700'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation with improved styling */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="px-3 space-y-1">
                {navItems.map((item, index) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavItemClick(item)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                      location.pathname === item.path 
                        ? `${isDarkMode 
                          ? 'bg-gradient-to-r from-indigo-900/50 to-purple-900/50 text-indigo-400 border border-indigo-500/20' 
                          : 'bg-gradient-to-r from-indigo-50 to-purple-50/50 text-indigo-700 border border-indigo-200/50'
                        } font-semibold shadow-lg` 
                        : `${isDarkMode 
                          ? 'text-gray-300 hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-gray-600/50 hover:text-white' 
                          : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-100/80 hover:to-gray-50/80 hover:text-gray-900'
                        } hover:shadow-md`
                    } ${item.path === '/logout' ? (isDarkMode ? 'hover:from-red-900/30 hover:to-red-800/30 text-red-400 hover:text-red-300' : 'hover:from-red-50/80 hover:to-red-100/80 text-red-600 hover:text-red-700') : ''}`}
                  >
                    <div className={`transition-transform duration-200 ${location.pathname === item.path ? 'scale-110' : 'group-hover:scale-105'}`}>
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium">{item.name}</span>
                    {location.pathname === item.path && (
                      <div className="absolute right-2 w-1.5 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Footer with improved theme toggle */}
            <div className={`p-3 ${isDarkMode ? 'border-gray-700/30' : 'border-gray-200/30'} border-t backdrop-blur-sm`}>
              <button
                onClick={toggleDarkMode}
                className={`w-full px-3 py-2.5 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200 group ${
                  isDarkMode 
                    ? 'text-amber-300 hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-gray-600/50 hover:text-amber-200' 
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-100/80 hover:to-gray-50/80 hover:text-gray-800'
                } hover:shadow-md`}
              >
                <div className="transition-transform duration-200 group-hover:scale-110">
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </div>
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </div>
        </aside>
        
        {/* Sidebar - desktop */}
        <aside 
          className={`${
            isSidebarCollapsed ? 'w-16' : 'w-64'
          } hidden md:block fixed h-screen ${
            isDarkMode 
              ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-gray-700/30' 
              : 'bg-gradient-to-b from-white via-gray-50/30 to-white border-gray-200/50'
          } border-r backdrop-blur-xl shadow-2xl overflow-y-auto z-20 flex-shrink-0 transition-all duration-300`}
        >
          <div className="flex flex-col h-full">
            {/* Header with improved design */}
            <div className={`p-4 ${isDarkMode ? 'border-gray-700/30' : 'border-gray-200/30'} border-b flex justify-between items-center backdrop-blur-sm`}>
              <Link to="/dashboard" className="flex items-center gap-2 overflow-hidden group">
                <div className="h-8 w-8 flex-shrink-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-200">
                  B
                </div>
                {!isSidebarCollapsed && (
                  <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent whitespace-nowrap">
                    Boomgator
                  </h1>
                )}
              </Link>
              <button 
                onClick={toggleSidebar}
                className={`${
                  isDarkMode ? 'text-gray-400 hover:bg-gray-700/50 hover:text-white' : 'text-gray-500 hover:bg-gray-100/70 hover:text-gray-700'
                } p-2 rounded-lg transition-all duration-200`}
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation with improved styling */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav className={`px-3 space-y-1 ${isSidebarCollapsed ? 'text-center' : ''}`}>
                {navItems.map((item, index) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavItemClick(item)}
                    className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3'} py-2.5 rounded-lg transition-all duration-200 group relative ${
                      location.pathname === item.path 
                        ? `${isDarkMode 
                          ? 'bg-gradient-to-r from-indigo-900/50 to-purple-900/50 text-indigo-400 border border-indigo-500/20' 
                          : 'bg-gradient-to-r from-indigo-50 to-purple-50/50 text-indigo-700 border border-indigo-200/50'
                        } font-semibold shadow-lg` 
                        : `${isDarkMode 
                          ? 'text-gray-300 hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-gray-600/50 hover:text-white' 
                          : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-100/80 hover:to-gray-50/80 hover:text-gray-900'
                        } hover:shadow-md`
                    } ${item.path === '/logout' ? (isDarkMode ? 'hover:from-red-900/30 hover:to-red-800/30 text-red-400 hover:text-red-300' : 'hover:from-red-50/80 hover:to-red-100/80 text-red-600 hover:text-red-700') : ''}`}
                    title={isSidebarCollapsed ? item.name : ''}
                  >
                    <div className={`transition-transform duration-200 ${location.pathname === item.path ? 'scale-110' : 'group-hover:scale-105'}`}>
                      {item.icon}
                    </div>
                    {!isSidebarCollapsed && (
                      <>
                        <span className="text-sm font-medium">{item.name}</span>
                        {location.pathname === item.path && (
                          <div className="absolute right-2 w-1.5 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
                        )}
                      </>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Footer with improved theme toggle */}
            <div className={`p-3 ${isDarkMode ? 'border-gray-700/30' : 'border-gray-200/30'} border-t backdrop-blur-sm`}>
              <button
                onClick={toggleDarkMode}
                className={`w-full ${isSidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3'} py-2.5 rounded-lg flex items-center text-sm font-medium transition-all duration-200 group ${
                  isDarkMode 
                    ? 'text-amber-300 hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-gray-600/50 hover:text-amber-200' 
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-100/80 hover:to-gray-50/80 hover:text-gray-800'
                } hover:shadow-md`}
                title={isSidebarCollapsed ? (isDarkMode ? 'Light Mode' : 'Dark Mode') : ''}
              >
                <div className="transition-transform duration-200 group-hover:scale-110">
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </div>
                {!isSidebarCollapsed && <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
              </button>
            </div>
          </div>
        </aside>
        
        {/* Main content area */}
        <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64' // Adjust margin based on sidebar state
        }`}>
          
          {/* Header */}
          <header className={`sticky top-0 z-30 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} h-16 flex items-center justify-between px-4 sm:px-6`}>
            {/* Mobile menu button */}
            <button 
              onClick={toggleMobileMenu}
              className={`p-2 rounded-lg md:hidden ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Spacer for desktop (optional) */}
            <div className="hidden md:block flex-1"></div>
            
            {/* Header Right Section (Notifications, User Menu) */}
            <div className="relative flex items-center gap-3 sm:gap-4">
              
              {/* Notifications Button Container (No longer relative) */}
              <div> 
                <button
                  onClick={toggleNotifications}
                  className={`p-2 rounded-full relative ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-gray-800" />
                  )}
                </button>
              </div>

              {/* User avatar and menu (UserMenu component) */}
              <UserMenu />

              {/* Notifications Popover (Moved here, outside the button's div) */}
              {notificationsOpen && (
                <div 
                  className={`absolute right-0 top-full mt-2 w-72 sm:w-80 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden z-40 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                  // Add click outside handling if needed, or rely on the overlay below
                >
                  <div className={`flex justify-between items-center p-3 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                    <h3 className="text-sm font-medium">Announcements</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className={`text-xs ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {loadingAnnouncements ? (
                      <div className="p-4 text-center">
                        <Loader className="h-6 w-6 animate-spin mx-auto text-indigo-600" />
                        <p className="text-sm text-gray-500 mt-2">Loading announcements...</p>
                      </div>
                    ) : announcements.length === 0 ? (
                      <div className="p-4 text-center">
                        <Bell className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No announcements</p>
                      </div>
                    ) : (
                      announcements
                        .filter(announcement => announcement.status === 'active')
                        .map((announcement) => (
                          <div 
                            key={announcement.id} 
                            className={`flex items-start p-3 gap-3 transition-colors ${readAnnouncements.has(announcement.id) ? '' : (isDarkMode ? 'bg-gray-700/50' : 'bg-blue-50')} ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                          >
                            <div className="flex-shrink-0 mt-1">{getAnnouncementIcon(announcement.title)}</div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{announcement.title}</p>
                              <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{announcement.message}</p>
                              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{formatAnnouncementTime(announcement.created_at)}</p>
                            </div>
                            {!readAnnouncements.has(announcement.id) && (
                              <button 
                                onClick={() => markAsRead(announcement.id)}
                                className="p-1 -m-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Mark as read"
                              >
                                <span className="block h-2 w-2 rounded-full bg-blue-500"></span>
                              </button>
                            )}
                          </div>
                        ))
                    )}
                  </div>
                  <div className={`p-3 text-center ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
                    <button
                      onClick={() => {
                        console.log('View all announcements clicked');
                        setNotificationsOpen(false);
                        navigate('/notifications');
                      }}
                      className={`text-sm ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                    >
                      View all announcements
                    </button>
                  </div>
                </div>
              )}
            </div>
          </header>
          
          {/* Page content area */}
          <main className={`flex-1 overflow-auto p-2 sm:p-4 relative`}>
            <Outlet />
          </main>
          
          {/* Notifications overlay */}
          {notificationsOpen && (
            <div 
              className="fixed inset-0 z-30"
              onClick={() => setNotificationsOpen(false)}
            />
          )}
          

        </div>
      </div>
    </div>
  );
} 