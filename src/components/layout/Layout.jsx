import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
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
  MessageSquare
} from "lucide-react";
import { PageNavigation } from "../PageNavigation";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: "Social Hub", path: "/social-hub", icon: <Share2 className="w-5 h-5" /> },
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
  
  return (
    <div className={`min-h-screen flex overflow-hidden ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
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
      
      {/* Main content - with left margin to accommodate sidebar */}
      <main className={`flex-1 flex flex-col ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-72'}`}>
        <header className={`p-2 sm:p-4 flex justify-between items-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm sticky top-0 z-20`}>
          <div className="md:hidden">
            <button 
              className={`p-1.5 sm:p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              onClick={toggleMobileMenu}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1"></div>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className={`p-1.5 sm:p-2 rounded-full ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {isDarkMode ? <Sun className="w-4 sm:w-5 h-4 sm:h-5" /> : <Moon className="w-4 sm:w-5 h-4 sm:h-5" />}
            </button>
            
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={toggleNotifications}
                className={`p-1.5 sm:p-2 rounded-full relative ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                <Bell className="w-4 sm:w-5 h-4 sm:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block w-2 sm:w-2.5 h-2 sm:h-2.5 bg-red-500 rounded-full border border-white dark:border-gray-800"></span>
                )}
              </button>
              
              {/* Notifications dropdown */}
              {notificationsOpen && (
                <div 
                  className={`absolute right-0 mt-2 w-[280px] xs:w-72 sm:w-80 max-w-[calc(100vw-2rem)] rounded-lg shadow-lg overflow-hidden z-50 ${
                    isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className={`flex items-center justify-between p-3 sm:p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                    <h3 className="text-sm sm:text-base font-medium">Notifications</h3>
                    <button 
                      onClick={markAllAsRead}
                      className={`text-xs ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className={`max-h-80 sm:max-h-96 overflow-y-auto`}>
                    {userNotifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      userNotifications.map((notification) => (
                        <div 
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`p-3 sm:p-4 cursor-pointer ${
                            notification.read 
                              ? '' 
                              : isDarkMode ? 'bg-gray-700/40' : 'bg-blue-50'
                          } ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b last:border-b-0 hover:${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex gap-2 sm:gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {notification.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs sm:text-sm font-medium ${!notification.read && 'font-semibold'}`}>
                                {notification.title}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
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
            
            {/* User avatar */}
            <div className="relative">
              <img
                className="h-8 w-8 rounded-full object-cover"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User profile"
              />
              <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 border border-white dark:border-gray-800" />
            </div>
          </div>
        </header>
        <div className={`flex-1 overflow-auto p-2 sm:p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} relative`}>
          <Outlet />
        </div>
      </main>
      
      {/* Notifications overlay */}
      {notificationsOpen && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => setNotificationsOpen(false)}
        />
      )}
      
      {/* Page navigation for development */}
      <PageNavigation />
    </div>
  );
} 