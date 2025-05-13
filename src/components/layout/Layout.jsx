import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { useTheme } from "@/lib/ThemeContext";
import { toast } from "react-toastify";
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
  Sparkles,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Type
} from "lucide-react";
import { UserMenu } from "./UserMenu";
import SubscriptionStatus from "../ui/SubscriptionStatus";

// Group nav items by category for better organization
const navItems = [
  { 
    category: "Main",
    items: [
      { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-3 h-3" /> },
      { name: "Integrations", path: "/integrations", icon: <Link2 className="w-3 h-3" /> },

    ]
  },
  {
    category: "Tools",
    items: [
      { name: "Automation", path: "/automation", icon: <Zap className="w-3 h-3" /> },
      { name: "Content Scheduler", path: "/content-scheduler", icon: <Clock className="w-3 h-3" /> },
      { name: "Comment Management", path: "/comment-management", icon: <MessageSquare className="w-3 h-3" /> },
      { name: "Live Chat", path: "/live-chat", icon: <MessageCircle className="w-3 h-3" /> },
      // { name: "Ad Comments", path: "/ad-comments", icon: <MessageSquare className="w-5 h-5" /> },
      // { name: "Caption Generator", path: "/caption-generator", icon: <Type className="w-5 h-5" /> },
    ]
  },
  {
    category: "Account",
    items: [
      { name: "Logout", path: "/logout", icon: <LogOut className="w-3 h-3" /> }
    ]
  }
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

// Memoized navigation item component with tooltip for collapsed mode
const NavItem = memo(({ item, isActive, onClick, isCollapsed, isDarkMode }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const handleClick = useCallback(() => {
    onClick(item);
  }, [item, onClick]);
  
  const handleMouseEnter = useCallback(() => {
    if (isCollapsed) setShowTooltip(true);
  }, [isCollapsed]);
  
  const handleMouseLeave = useCallback(() => {
    setShowTooltip(false);
  }, []);
  
  return (
    <div className="relative">
      <button
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
          isActive 
            ? `bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-medium ring-1 ring-indigo-200 dark:ring-indigo-800` 
            : `text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white`
        } ${item.path === '/logout' ? (isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700') : ''}`}
        aria-label={item.name}
      >
        <span className={`${isCollapsed ? 'mx-auto' : ''}`}>
          {item.icon}
        </span>
        {!isCollapsed && <span className="text-base">{item.name}</span>}
      </button>
      
      {/* Tooltip for collapsed mode */}
      {isCollapsed && showTooltip && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50">
          <div className="bg-gray-900 text-white text-sm px-2 py-1 rounded shadow-lg whitespace-nowrap">
            {item.name}
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </div>
      )}
    </div>
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
  const [isOpen, setIsOpen] = useState(false);
  
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
    // Clear all localStorage data
    localStorage.clear();
    
    // Reset any in-memory state
    setUserNotifications([]);
    setNotificationsOpen(false);
    setMobileMenuOpen(false);
    setIsPageLoading(false);
    
    // Show success toast notification
    toast.info('Logged out successfully');
    
    // Perform a page refresh and redirect to login
    window.location.href = "/login";
  }, []);

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
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <nav className="px-4 space-y-6">
                {navItems.map((section, index) => (
                  <div key={`section-${index}`} className="space-y-2">
                    <h3 className="text-sm uppercase font-semibold text-gray-500 dark:text-gray-400 px-4">
                      {section.category}
                    </h3>
                    {section.items.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => handleNavItemClick(item)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          location.pathname === item.path 
                            ? `bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-medium ring-1 ring-indigo-200 dark:ring-indigo-800` 
                            : `text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white`
                        } ${item.path === '/logout' ? (isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700') : ''}`}
                      >
                        {item.icon}
                        <span className="text-sm">{item.name}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </nav>
            </div>

            {/* <div className={`p-4 ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'} border-t`}>
              <button
                onClick={toggleDarkMode}
                className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 ${
                  isDarkMode 
                    ? 'text-yellow-300 hover:bg-gray-700/70' 
                    : 'text-gray-600 hover:bg-gray-100/70'
                } transition-colors`}
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div> */}
          </div>
        </aside>
        
        {/* Sidebar - desktop - hardware accelerated transitions */}
        <aside 
          className={`hidden md:block fixed h-screen ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border-r shadow-sm overflow-y-auto z-20 flex-shrink-0 transition-all duration-300 ease-in-out`}
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
                } p-2 rounded-lg transition-colors`}
                aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <nav className={`px-3 space-y-6 ${isSidebarCollapsed ? 'text-center' : ''}`}>
                {navItems.map((section, index) => (
                  <div key={`section-${index}`} className="space-y-2">
                    {!isSidebarCollapsed && (
                      <h3 className="text-sm uppercase font-semibold text-gray-500 dark:text-gray-400 px-4 mb-2">
                        {section.category}
                      </h3>
                    )}
                    {section.items.map((item) => (
                      <NavItem 
                        key={item.path}
                        item={item}
                        isActive={location.pathname === item.path}
                        onClick={handleNavItemClick}
                        isCollapsed={isSidebarCollapsed}
                        isDarkMode={isDarkMode}
                      />
                    ))}
                    {!isSidebarCollapsed && index < navItems.length - 1 && (
                      <div className="h-px bg-gray-200 dark:bg-gray-700 mx-3 my-2"></div>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* <div className={`p-4 ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'} border-t transition-colors`}>
              <button
                onClick={toggleDarkMode}
                className={`w-full ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg flex items-center ${
                  isDarkMode 
                    ? 'text-yellow-300 hover:bg-gray-700/70' 
                    : 'text-gray-600 hover:bg-gray-100/70'
                } transition-colors`}
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                <span className={`${isSidebarCollapsed ? 'mx-auto' : ''}`}>
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </span>
                {!isSidebarCollapsed && <span className="text-xs">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
              </button>
            </div> */}
          </div>
        </aside>
        
        {/* Main content area */}
        <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-72' // Adjust margin based on sidebar state
        }`}>
          
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/90 dark:bg-gray-800/90 px-4 sm:px-6 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-800/60 shadow-sm">
            <div className="flex items-center gap-2">
              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 md:hidden mr-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              {/* Logo and toggle button for larger screens */}
              
            </div>
            
            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Subscription Status */}
              {/* <div className="hidden sm:block">
                <div className="flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-md text-xs font-medium border border-indigo-200 dark:border-indigo-800">
                  PRO PACKAGE
                </div>
              </div>
               */}
              
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={toggleNotifications}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-[-8px] right-[-4px]  flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white ring-2 ring-white dark:ring-gray-800">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                
                {/* Notifications dropdown */}
                {notificationsOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-30" 
                      onClick={() => setNotificationsOpen(false)}
                      aria-hidden="true"
                    />
                    <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-lg border bg-white dark:bg-gray-800 shadow-lg z-40 animate-in fade-in-05 slide-in-from-top-2 dark:border-gray-700">
                      <div className="flex items-center justify-between border-b px-4 py-3 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            aria-label="Mark all as read"
                          >
                            Mark all read
                          </button>
                          <button
                            onClick={toggleNotifications}
                            className="rounded-full p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                            aria-label="Close notifications"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="divide-y dark:divide-gray-700 max-h-[60vh] overflow-auto">
                        {userNotifications.length > 0 ? (
                          userNotifications.map(notification => (
                            <NotificationItem 
                              key={notification.id} 
                              notification={notification}
                              onMarkAsRead={markAsRead}
                            />
                          ))
                        ) : (
                          <div className="py-8 text-center">
                            <p className="text-gray-500 dark:text-gray-400">No notifications</p>
                          </div>
                        )}
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-3 text-center border-t dark:border-gray-700">
                        <Link
                          to="/notifications"
                          onClick={() => setNotificationsOpen(false)}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {/* User menu */}
              <UserMenu />
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

// Export using memo directly for optimal performance
export default memo(Layout); 