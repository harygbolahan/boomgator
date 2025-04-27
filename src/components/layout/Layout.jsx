import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
  Loader
} from "lucide-react";
import { PageNavigation } from "../PageNavigation";
import { UserMenu } from "./UserMenu";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: "Social Hub", path: "/social-hub", icon: <Share2 className="w-5 h-5" /> },
  { name: "Content Scheduler", path: "/content-scheduler", icon: <Clock className="w-5 h-5" /> },
  { name: "Automation", path: "/automation", icon: <Zap className="w-5 h-5" /> },
  { name: "Schedule", path: "/calendar", icon: <Calendar className="w-5 h-5" /> },
  { name: "Analytics", path: "/analytics", icon: <BarChart2 className="w-5 h-5" /> },
  { name: "Integrations", path: "/integrations", icon: <Link2 className="w-5 h-5" /> },
  { name: "Account", path: "/account", icon: <UserCircle className="w-5 h-5" /> },
  { name: "Support", path: "/support", icon: <LifeBuoy className="w-5 h-5" /> },
  { name: "Logout", path: "/logout", icon: <LogOut className="w-5 h-5" /> },
];

// Fake notifications data
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

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userNotifications, setUserNotifications] = useState(notifications);
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
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("hasCompletedSetup");
    navigate("/login");
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
    setUserNotifications(userNotifications.map(notification => ({
      ...notification,
      read: true
    })));
  };
  
  const markAsRead = (id) => {
    setUserNotifications(userNotifications.map(notification => 
      notification.id === id ? {...notification, read: true} : notification
    ));
  };
  
  const unreadCount = userNotifications.filter(notification => !notification.read).length;
  
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
          className={`fixed inset-y-0 left-0 z-50 w-[80%] sm:w-72 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg overflow-hidden`}
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
        
        {/* Sidebar - desktop */}
        <aside 
          className={`${
            isSidebarCollapsed ? 'w-20' : 'w-72'
          } hidden md:block fixed h-screen ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border-r shadow-sm overflow-y-auto z-20 flex-shrink-0`}
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
                        <div 
                          key={notification.id} 
                          className={`flex items-start p-3 gap-3 transition-colors ${notification.read ? '' : (isDarkMode ? 'bg-gray-700/50' : 'bg-blue-50')} ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                        >
                          <div className="flex-shrink-0 mt-1">{notification.icon}</div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{notification.message}</p>
                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{notification.time}</p>
                          </div>
                          {!notification.read && (
                            <button 
                              onClick={() => markAsRead(notification.id)}
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