import { Link, Outlet, useLocation } from "react-router-dom";
import { UserMenu } from "./UserMenu";
import { useState } from "react";
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
  Search, 
  Bell, 
  X 
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-5 h-5 mr-3" /> },
  { name: "Social Hub", path: "/social-hub", icon: <Share2 className="w-5 h-5 mr-3" /> },
  { name: "Automation", path: "/automation", icon: <Zap className="w-5 h-5 mr-3" /> },
  { name: "Schedule", path: "/calendar", icon: <Calendar className="w-5 h-5 mr-3" /> },
  { name: "Analytics", path: "/analytics", icon: <BarChart2 className="w-5 h-5 mr-3" /> },
  { name: "Integrations", path: "/integrations", icon: <Link2 className="w-5 h-5 mr-3" /> },
  { name: "Account", path: "/account", icon: <UserCircle className="w-5 h-5 mr-3" /> },
  { name: "Support", path: "/support", icon: <LifeBuoy className="w-5 h-5 mr-3" /> },
];

export function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-800 bg-opacity-50 z-20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar - mobile */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-2xl font-bold text-indigo-600">Boomgator</h1>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-3">
          <ul className="space-y-1.5">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`px-4 py-2.5 rounded-lg flex items-center transition-colors hover:bg-indigo-50 hover:text-indigo-700 ${
                    location.pathname === item.path 
                      ? "bg-indigo-50 text-indigo-700 font-medium shadow-sm" 
                      : "text-gray-600"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      
      {/* Sidebar - desktop */}
      <aside className="w-64 border-r bg-white shadow-sm hidden md:block">
        <div className="p-5 border-b">
          <h1 className="text-2xl font-bold text-indigo-600">Boomgator</h1>
        </div>
        <nav className="p-3">
          <ul className="space-y-1.5">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`px-4 py-2.5 rounded-lg flex items-center transition-colors hover:bg-indigo-50 hover:text-indigo-700 ${
                    location.pathname === item.path 
                      ? "bg-indigo-50 text-indigo-700 font-medium shadow-sm" 
                      : "text-gray-600"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <header className="border-b p-4 bg-white shadow-sm flex justify-between items-center">
          <div className="md:hidden">
            <button 
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              onClick={toggleMobileMenu}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 md:flex-none md:ml-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full md:w-64 pl-9 pr-3 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 focus:outline-none transition-colors"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 block w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <UserMenu />
          </div>
        </header>
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
} 