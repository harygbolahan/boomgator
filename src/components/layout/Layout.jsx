import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { useTheme } from "@/lib/ThemeContext";
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
  Bot,
  CreditCard,
  Instagram,
  BookOpen,
  Sparkles
} from "lucide-react";
import { PageNavigation } from "../PageNavigation";
import { UserMenu } from "./UserMenu";

// Memoize the nav items to prevent recreating the array on each render
const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  // { name: "Social Hub", path: "/social-hub", icon: <Share2 className="w-5 h-5" /> },
  { name: "Content Scheduler", path: "/content-scheduler", icon: <Clock className="w-5 h-5" /> },
  { name: "AI Content Creator", path: "/ai-content-creator", icon: <Sparkles className="w-5 h-5" /> },
  { name: "Automation", path: "/automation", icon: <Zap className="w-5 h-5" /> },
  // { name: "Calendar", path: "/calendar", icon: <Calendar className="w-5 h-5" /> },
  // { name: "Analytics", path: "/analytics", icon: <BarChart2 className="w-5 h-5" /> },
  { name: "Instagram Viral Finder", path: "/instagram-viral-finder", icon: <Instagram className="w-5 h-5" /> },
  { name: "Integrations", path: "/integrations", icon: <Link2 className="w-5 h-5" /> },
  { name: "Messenger Broadcast", path: "/messenger-broadcast", icon: <MessageSquare className="w-5 h-5" /> },
  // { name: "Notifications", path: "/notifications", icon: <Bell className="w-5 h-5" /> },
  // { name: "Payment Plans", path: "/payment-plans", icon: <CreditCard className="w-5 h-5" /> },
  // { name: "Setup Guide", path: "/setup-guide", icon: <BookOpen className="w-5 h-5" /> },
  // { name: "Account", path: "/account", icon: <UserCircle className="w-5 h-5" /> },
  // { name: "Support", path: "/support", icon: <LifeBuoy className="w-5 h-5" /> },
  { name: "WhatsApp Bot", path: "/whatsapp-bot", icon: <Bot className="w-5 h-5" /> },
  { name: "Logout", path: "/logout", icon: <LogOut className="w-5 h-5" /> },
];

// Fake notifications data - moved outside component to prevent recreation
const notifications = [
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
  }
];

// Memoized notification item component for better performance
const NotificationItem = memo(({ notification, onMarkAsRead }) => {
  const handleClick = useCallback(() => {
    onMarkAsRead(notification.id);
  }, [notification.id, onMarkAsRead]);

  return (
    <div 
      onClick={handleClick}
      className={`px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer ${
        notification.read ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {notification.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">
            {notification.title}
            {!notification.read && (
              <span className="inline-block w-2 h-2 ml-2 bg-blue-500 rounded-full"></span>
            )}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
            {notification.message}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {notification.time}
          </p>
        </div>
      </div>
    </div>
  );
});

// Memoized navigation item component
const NavItem = memo(({ item, isActive, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(item);
  }, [item, onClick]);
  
  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive 
          ? `bg-indigo-900/40 text-indigo-400 dark:bg-indigo-900/40 dark:text-indigo-400 font-medium` 
          : `text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white`
      }`}
    >
      {item.icon}
      <span>{item.name}</span>
    </button>
  );
});

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userNotifications, setUserNotifications] = useState(notifications);
  const [isPageLoading, setIsPageLoading] = useState(false);
  
  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);
  
  const toggleNotifications = useCallback(() => {
    setNotificationsOpen(prev => !prev);
  }, []);
  
  const handleLogout = useCallback(() => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("hasCompletedSetup");
    navigate("/login");
  }, [navigate]);

  const handleNavItemClick = useCallback((item) => {
    if (item.path === "/logout") {
      handleLogout();
    } else {
      navigate(item.path);
    }
    setMobileMenuOpen(false);
  }, [navigate, handleLogout]);
  
  const markAllAsRead = useCallback(() => {
    setUserNotifications(prev => prev.map(notification => ({
      ...notification,
      read: true
    })));
  }, []);
  
  const markAsRead = useCallback((id) => {
    setUserNotifications(prev => prev.map(notification => 
      notification.id === id ? {...notification, read: true} : notification
    ));
  }, []);
  
  // Memoize unread count calculation
  const unreadCount = useMemo(() => 
    userNotifications.filter(notification => !notification.read).length,
  [userNotifications]);
  
  // Optimize page transition loading with a safer effect cleanup
  useEffect(() => {
    let isMounted = true;
    
    if (isMounted) {
      setIsPageLoading(true);
    }
    
    // Reduced timeout from 500ms to 100ms for better responsiveness
    const timer = setTimeout(() => {
      if (isMounted) {
        setIsPageLoading(false);
      }
    }, 100);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [location.pathname]);

  // Memoize sidebar styles to avoid object recreation on every render
  const mobileSidebarStyles = useMemo(() => ({
    willChange: 'transform',
    transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)'
  }), [mobileMenuOpen]);

  // Memoize desktop sidebar styles
  const desktopSidebarStyles = useMemo(() => ({
    willChange: 'width',
    width: isSidebarCollapsed ? '5rem' : '18rem',
    transition: 'width 200ms cubic-bezier(0.4, 0, 0.2, 1)'
  }), [isSidebarCollapsed]);

  // Memoize loader styles
  const loaderStyles = useMemo(() => ({ 
    transition: 'opacity 150ms ease-in-out',
    opacity: isPageLoading ? 1 : 0,
  }), [isPageLoading]);

  // Memoize overlay styles
  const overlayStyles = useMemo(() => ({ 
    willChange: 'opacity',
    transition: 'opacity 200ms ease' 
  }), []);

  return (
    <div className="relative min-h-screen">
      {/* Page transition loader */}
      {isPageLoading && (
        <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 z-50 flex items-center justify-center will-change-opacity" style={loaderStyles}>
          <div className="flex flex-col items-center gap-2">
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}
      
      <div className={`flex min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        {/* Mobile menu overlay - hardware accelerated with will-change */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-gray-800 bg-opacity-75 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            style={overlayStyles}
          />
        )}
        
        {/* Sidebar - mobile - hardware accelerated transform */}
        <aside 
          className={`fixed inset-y-0 left-0 z-50 w-[80%] sm:w-72 md:hidden flex flex-col ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } shadow-lg overflow-hidden`}
          style={mobileSidebarStyles}
        >
          <div className="flex flex-col h-full">
            <div className={`flex items-center justify-between p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
              <Link to="/dashboard" className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-md flex items-center justify-center text-white font-bold text-xl">
                  B
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Boomgator
                </h1>
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2 rounded-lg ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <nav className="px-4 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavItemClick(item)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === item.path 
                        ? `${isDarkMode 
                          ? 'bg-indigo-900/40 text-indigo-400' 
                          : 'bg-indigo-50 text-indigo-700'} font-medium` 
                        : `${isDarkMode 
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className={`p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
              <button
                onClick={toggleDarkMode}
                className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 ${
                  isDarkMode 
                    ? 'text-yellow-300 hover:bg-gray-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </div>
        </aside>
        
        {/* Sidebar - desktop - hardware accelerated transitions */}
        <aside 
          className={`hidden md:block fixed h-screen ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border-r shadow-sm overflow-y-auto z-20 flex-shrink-0`}
          style={desktopSidebarStyles}
        >
          <div className="flex flex-col h-full">
            <div className={`p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b flex justify-between items-center`}>
              <Link to="/dashboard" className="flex items-center gap-2 overflow-hidden">
                <div className="h-8 w-8 flex-shrink-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-md flex items-center justify-center text-white font-bold text-xl">
                  B
                </div>
                {!isSidebarCollapsed && (
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
                    Boomgator
                  </h1>
                )}
              </Link>
              <button 
                onClick={toggleSidebar}
                className={`${
                  isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'
                } p-2 rounded-lg`}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <nav className={`px-3 space-y-2 ${isSidebarCollapsed ? 'text-center' : ''}`}>
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavItemClick(item)}
                    className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === item.path 
                        ? `${isDarkMode 
                          ? 'bg-indigo-900/40 text-indigo-400' 
                          : 'bg-indigo-50 text-indigo-700'} font-medium` 
                        : `${isDarkMode 
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
                    } ${item.path === '/logout' ? (isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700') : ''}`}
                  >
                    {item.icon}
                    {!isSidebarCollapsed && <span>{item.name}</span>}
                  </button>
                ))}
              </nav>
            </div>

            <div className={`p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
              <button
                onClick={toggleDarkMode}
                className={`w-full ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg flex items-center ${
                  isDarkMode 
                    ? 'text-yellow-300 hover:bg-gray-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                {!isSidebarCollapsed && <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
              </button>
            </div>
          </div>
        </aside>
        
        {/* Main content area */}
        <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-72' // Adjust margin based on sidebar state
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
                    <h3 className="text-sm font-medium">Notifications</h3>
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
                    {userNotifications.length === 0 ? (
                      <p className={`p-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No new notifications</p>
                    ) : (
                      userNotifications.map((notification) => (
                        <NotificationItem 
                          key={notification.id} 
                          notification={notification}
                          onMarkAsRead={markAsRead}
                        />
                      ))
                    )}
                  </div>
                  <div className={`p-3 text-center ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
                    <button
                      onClick={() => {
                        navigate('/notifications');
                        setNotificationsOpen(false);
                      }}
                      className={`text-sm ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                    >
                      View all notifications
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
          
          {/* Page navigation for development - keep at bottom */}
          <PageNavigation />
        </div>
      </div>
    </div>
  );
}

// Export using memo directly for optimal performance
export default memo(Layout); 