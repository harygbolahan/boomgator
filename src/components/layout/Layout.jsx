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
  Sparkles,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { UserMenu } from "./UserMenu";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, category: "main" },
  { name: "Content Scheduler", path: "/content-scheduler", icon: <Clock className="w-5 h-5" />, category: "content" },
  { name: "AI Content Creator", path: "/ai-content-creator", icon: <Sparkles className="w-5 h-5" />, category: "content" },
  { name: "Pages Management", path: "/pages-management", icon: <Layers className="w-5 h-5" />, category: "management" },
  { name: "Messenger Broadcast", path: "/messenger-broadcast", icon: <MessageSquare className="w-5 h-5" />, category: "messaging" },
  { name: "Live Messaging", path: "/live-messaging", icon: <MessageSquare className="w-5 h-5" />, category: "messaging" },
  { name: "Automation", path: "/automation", icon: <Zap className="w-5 h-5" />, category: "automation" },
  { name: "Integrations", path: "/integrations", icon: <Link2 className="w-5 h-5" />, category: "settings" },
  { name: "Subscription", path: "/subscription", icon: <Package className="w-5 h-5" />, category: "account" },
  { name: "Account", path: "/account", icon: <UserCircle className="w-5 h-5" />, category: "account" },
  { name: "Support", path: "/support", icon: <LifeBuoy className="w-5 h-5" />, category: "support" },
];

const categoryLabels = {
  main: "Overview",
  content: "Content",
  management: "Management", 
  messaging: "Messaging",
  automation: "Automation",
  settings: "Settings",
  account: "Account",
  support: "Support"
};

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

  // Group navigation items by category
  const groupedNavItems = navItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});
  
  // Save read announcements to localStorage
  useEffect(() => {
    localStorage.setItem('readAnnouncements', JSON.stringify([...readAnnouncements]));
  }, [readAnnouncements]);

  // Add loading state on route change
  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setNotificationsOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Page transition loader */}
      {isPageLoading && (
        <div className="fixed inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-800 rounded-full animate-spin border-t-indigo-600 dark:border-t-indigo-400"></div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-ping border-t-indigo-400"></div>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      )}
      
      <div className={`flex min-h-screen ${isDarkMode ? 'dark bg-gray-950' : 'bg-gray-50'} transition-colors duration-300`}>
        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
        
        {/* Sidebar - mobile */}
        <aside 
          className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-all duration-300 ease-out md:hidden ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } ${isDarkMode 
            ? 'bg-gray-900/95 border-gray-800/50' 
            : 'bg-white/95 border-gray-200/50'
          } backdrop-blur-xl border-r shadow-2xl`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className={`flex items-center justify-between p-6 ${isDarkMode ? 'border-gray-800/50' : 'border-gray-200/50'} border-b`}>
              <Link to="/dashboard" className="flex items-center gap-3 group" onClick={() => setMobileMenuOpen(false)}>
                <div className="relative">
                  <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-all duration-200">
                    B
                  </div>
                  <div className="absolute inset-0 h-10 w-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity duration-200"></div>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Boomgator
                </h1>
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  isDarkMode 
                    ? 'text-gray-400 hover:bg-gray-800/50 hover:text-white' 
                    : 'text-gray-500 hover:bg-gray-100/70 hover:text-gray-700'
                }`}
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-4">
              <nav className="space-y-6">
                {Object.entries(groupedNavItems).map(([category, items]) => (
                  <div key={category} className="space-y-2">
                    <h3 className={`px-3 text-xs font-semibold uppercase tracking-wider ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {categoryLabels[category]}
                    </h3>
                    <div className="space-y-1">
                      {items.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                          <button
                            key={item.path}
                            onClick={() => handleNavItemClick(item)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group text-left ${
                              isActive
                                ? `${isDarkMode 
                                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30' 
                                  : 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200/50'
                                } shadow-lg backdrop-blur-sm` 
                                : `${isDarkMode 
                                  ? 'text-gray-300 hover:bg-gray-800/50 hover:text-white' 
                                  : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                                } hover:shadow-md`
                            }`}
                          >
                            <div className={`transition-all duration-200 ${
                              isActive ? 'scale-110 text-current' : 'group-hover:scale-105'
                            }`}>
                              {item.icon}
                            </div>
                            <span className="font-medium">{item.name}</span>
                            {isActive && (
                              <div className="ml-auto w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                
                {/* Logout button */}
                <div className="pt-4 border-t border-gray-200/50 dark:border-gray-800/50">
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group text-left ${
                      isDarkMode 
                        ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300' 
                        : 'text-red-600 hover:bg-red-50/80 hover:text-red-700'
                    } hover:shadow-md`}
                  >
                    <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </nav>
            </div>

            {/* Footer */}
            <div className={`p-4 ${isDarkMode ? 'border-gray-800/50' : 'border-gray-200/50'} border-t`}>
              <button
                onClick={toggleDarkMode}
                className={`w-full px-3 py-3 rounded-xl flex items-center gap-3 font-medium transition-all duration-200 group ${
                  isDarkMode 
                    ? 'text-amber-400 hover:bg-gray-800/50 hover:text-amber-300' 
                    : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-800'
                } hover:shadow-md`}
              >
                <div className="transition-transform duration-200 group-hover:scale-110">
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </div>
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </div>
        </aside>
        
        {/* Sidebar - desktop */}
        <aside 
          className={`${
            isSidebarCollapsed ? 'w-20' : 'w-72'
          } hidden md:block fixed h-screen ${
            isDarkMode 
              ? 'bg-gray-900/95 border-gray-800/50' 
              : 'bg-white/95 border-gray-200/50'
          } border-r backdrop-blur-xl shadow-xl z-20 transition-all duration-300 ease-in-out`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className={`p-6 ${isDarkMode ? 'border-gray-800/50' : 'border-gray-200/50'} border-b flex items-center justify-between`}>
              <Link to="/dashboard" className={`flex items-center gap-3 group ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                <div className="relative">
                  <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-all duration-200">
                    B
                  </div>
                  <div className="absolute inset-0 h-10 w-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity duration-200"></div>
                </div>
                {!isSidebarCollapsed && (
                  <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Boomgator
                  </h1>
                )}
              </Link>
              <button 
                onClick={toggleSidebar}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  isDarkMode ? 'text-gray-400 hover:bg-gray-800/50 hover:text-white' : 'text-gray-500 hover:bg-gray-100/70 hover:text-gray-700'
                }`}
                aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-4">
              <nav className={`space-y-6 ${isSidebarCollapsed ? 'space-y-8' : ''}`}>
                {Object.entries(groupedNavItems).map(([category, items]) => (
                  <div key={category} className="space-y-2">
                    {!isSidebarCollapsed && (
                      <h3 className={`px-3 text-xs font-semibold uppercase tracking-wider ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {categoryLabels[category]}
                      </h3>
                    )}
                    <div className={`space-y-1 ${isSidebarCollapsed ? 'space-y-3' : ''}`}>
                      {items.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                          <button
                            key={item.path}
                            onClick={() => handleNavItemClick(item)}
                            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3'} py-3 rounded-xl transition-all duration-200 group text-left ${
                              isActive
                                ? `${isDarkMode 
                                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30' 
                                  : 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200/50'
                                } shadow-lg backdrop-blur-sm` 
                                : `${isDarkMode 
                                  ? 'text-gray-300 hover:bg-gray-800/50 hover:text-white' 
                                  : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                                } hover:shadow-md`
                            }`}
                            title={isSidebarCollapsed ? item.name : ''}
                          >
                            <div className={`transition-all duration-200 ${
                              isActive ? 'scale-110 text-current' : 'group-hover:scale-105'
                            }`}>
                              {item.icon}
                            </div>
                            {!isSidebarCollapsed && (
                              <>
                                <span className="font-medium">{item.name}</span>
                                {isActive && (
                                  <div className="ml-auto w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
                                )}
                              </>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                
                {/* Logout button */}
                <div className={`pt-4 border-t border-gray-200/50 dark:border-gray-800/50 ${isSidebarCollapsed ? 'pt-6' : ''}`}>
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3'} py-3 rounded-xl transition-all duration-200 group text-left ${
                      isDarkMode 
                        ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300' 
                        : 'text-red-600 hover:bg-red-50/80 hover:text-red-700'
                    } hover:shadow-md`}
                    title={isSidebarCollapsed ? 'Logout' : ''}
                  >
                    <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
                    {!isSidebarCollapsed && <span className="font-medium">Logout</span>}
                  </button>
                </div>
              </nav>
            </div>

            {/* Footer */}
            <div className={`p-4 ${isDarkMode ? 'border-gray-800/50' : 'border-gray-200/50'} border-t`}>
              <button
                onClick={toggleDarkMode}
                className={`w-full ${isSidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3'} py-3 rounded-xl flex items-center font-medium transition-all duration-200 group ${
                  isDarkMode 
                    ? 'text-amber-400 hover:bg-gray-800/50 hover:text-amber-300' 
                    : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-800'
                } hover:shadow-md`}
                title={isSidebarCollapsed ? (isDarkMode ? 'Light Mode' : 'Dark Mode') : ''}
              >
                <div className="transition-transform duration-200 group-hover:scale-110">
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </div>
                {!isSidebarCollapsed && <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
              </button>
            </div>
          </div>
        </aside>
        
        {/* Main content area */}
        <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-72'
        }`}>
          {/* Header */}
          <header className={`sticky top-0 z-30 ${
            isDarkMode ? 'bg-gray-950/90 border-gray-800/50' : 'bg-white/90 border-gray-200/50'
          } backdrop-blur-xl border-b h-16 flex items-center justify-between px-4 sm:px-6 shadow-sm`}>
            {/* Mobile menu button */}
            <button 
              onClick={toggleMobileMenu}
              className={`p-2.5 rounded-xl md:hidden transition-all duration-200 ${
                isDarkMode ? 'text-gray-400 hover:bg-gray-800/50 hover:text-white' : 'text-gray-500 hover:bg-gray-100/70 hover:text-gray-700'
              }`}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Spacer for desktop */}
            <div className="hidden md:block flex-1"></div>
            
            {/* Header Right Section */}
            <div className="relative flex items-center gap-3 sm:gap-4">
              {/* Notifications Button */}
              <div className="relative"> 
                <button
                  onClick={toggleNotifications}
                  className={`p-2.5 rounded-xl relative transition-all duration-200 group ${
                    isDarkMode ? 'text-gray-300 hover:bg-gray-800/50 hover:text-white' : 'text-gray-600 hover:bg-gray-100/70 hover:text-gray-700'
                  } ${unreadCount > 0 ? 'animate-pulse' : ''}`}
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-xs font-bold text-white shadow-lg animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              </div>

              {/* User Menu */}
              <UserMenu />

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setNotificationsOpen(false)}
                  />
                  <div 
                    className={`absolute right-0 top-full mt-3 w-96 ${
                      isDarkMode ? 'bg-gray-900/95 border-gray-800/50' : 'bg-white/95 border-gray-200/50'
                    } backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-50 border`}
                  >
                    <div className={`flex justify-between items-center p-5 ${isDarkMode ? 'border-gray-800/50' : 'border-gray-200/50'} border-b bg-gradient-to-r from-indigo-500/10 to-purple-500/10`}>
                      <div>
                        <h3 className="font-semibold text-lg">Announcements</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Stay updated with the latest news</p>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors duration-200 px-3 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {loadingAnnouncements ? (
                        <div className="p-8 text-center">
                          <div className="relative mx-auto w-12 h-12 mb-4">
                            <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-800 rounded-full animate-spin border-t-indigo-600 dark:border-t-indigo-400"></div>
                            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-ping border-t-indigo-400"></div>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Loading announcements...</p>
                        </div>
                      ) : announcements.length === 0 ? (
                        <div className="p-8 text-center">
                          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <Bell className="h-8 w-8 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">No announcements yet</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Check back later for updates</p>
                        </div>
                      ) : (
                        announcements
                          .filter(announcement => announcement.status === 'active')
                          .map((announcement) => (
                            <div 
                              key={announcement.id} 
                              className={`flex items-start p-4 gap-4 transition-all duration-200 border-b border-gray-100/50 dark:border-gray-800/50 last:border-b-0 ${
                                readAnnouncements.has(announcement.id) 
                                  ? '' 
                                  : (isDarkMode ? 'bg-indigo-500/10 border-l-4 border-l-indigo-500' : 'bg-indigo-50/80 border-l-4 border-l-indigo-500')
                              } ${isDarkMode ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50/80'}`}
                            >
                              <div className="flex-shrink-0 mt-1 p-2 rounded-lg bg-white/50 dark:bg-gray-800/50">
                                {getAnnouncementIcon(announcement.title)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm">{announcement.title}</p>
                                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {announcement.message}
                                </p>
                                <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {formatAnnouncementTime(announcement.created_at)}
                                </p>
                              </div>
                              {!readAnnouncements.has(announcement.id) && (
                                <button 
                                  onClick={() => markAsRead(announcement.id)}
                                  className="flex-shrink-0 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 group"
                                  aria-label="Mark as read"
                                >
                                  <span className="block h-2 w-2 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform duration-200"></span>
                                </button>
                              )}
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </header>
          
          {/* Main content with improved styling */}
          <main className={`flex-1 overflow-y-auto ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
            <div className="h-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 