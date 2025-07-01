import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { 
  ChevronDownIcon, 
  User2Icon, 
  LifeBuoyIcon, 
  LogOutIcon, 
  SettingsIcon, 
  BellIcon, 
  CreditCardIcon,
  PackageIcon,
  WalletIcon
} from "lucide-react"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"

export function UserMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
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

  const handleNavigate = (path, e) => {
    e.preventDefault();
    navigate(path);
    setIsOpen(false);
  };

  // Get user initials for avatar placeholder
  const getUserInitials = () => {
    if (!user) return "?";
    
    const firstInitial = user.first_name ? user.first_name.charAt(0) : "";
    const lastInitial = user.last_name ? user.last_name.charAt(0) : "";
    
    return (firstInitial + lastInitial).toUpperCase();
  };

  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100/70 dark:hover:bg-gray-800/50 transition-all duration-200 group">
            <div className="relative">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg group-hover:scale-105 transition-all duration-200">
                {getUserInitials()}
              </div>
              <div className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 border-2 border-white dark:border-gray-900 shadow-sm" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium">{user?.first_name || "User"} {user?.last_name || ""}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
            </div>
            <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </PopoverTrigger>
        
        <PopoverContent className="w-80 p-0 rounded-2xl shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl" align="end">
          {/* User profile header */}
          {/* <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 rounded-t-2xl">
            <div className="flex items-center space-x-4">
              <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {getUserInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white text-lg truncate">
                  {user?.first_name || "User"} {user?.last_name || ""}
                </h4>
                <p className="text-sm text-white/80 truncate">{user?.email || "user@example.com"}</p>
                {user?.wallet !== undefined && (
                  <div className="mt-2 flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg">
                    <WalletIcon className="h-3 w-3 text-white/90" />
                    <span className="text-xs text-white font-medium">
                      Balance: ₦{user.wallet.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div> */}
          
          {/* Menu items */}
          {/* <div className="py-2">
            <div className="px-4 py-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Account
              </h3>
            </div>
            
            <MenuItem
              icon={<User2Icon className="h-4 w-4" />}
              label="Your Profile"
              description="Manage your account settings"
              onClick={(e) => handleNavigate('/account', e)}
            />
            
            <MenuItem
              icon={<PackageIcon className="h-4 w-4" />}
              label="Subscriptions"
              description="View and manage plans"
              onClick={(e) => handleNavigate('/subscription', e)}
            />
            
            <div className="my-2 border-t border-gray-200/50 dark:border-gray-700/50"></div>
            
            <div className="px-4 py-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Support
              </h3>
            </div>
            
            <MenuItem
              icon={<LifeBuoyIcon className="h-4 w-4" />}
              label="Help Center"
              description="Get help and support"
              onClick={(e) => handleNavigate('/support', e)}
            />
            
            <div className="my-2 border-t border-gray-200/50 dark:border-gray-700/50"></div>
            
            <MenuItem
              icon={<LogOutIcon className="h-4 w-4" />}
              label="Sign out"
              description="Log out of your account"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
              variant="danger"
            />
          </div> */}
        </PopoverContent>
      </Popover>
    </div>
  )
}

// Helper component for menu items
function MenuItem({ icon, label, description, onClick, variant = "default" }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 group text-left ${
        variant === "danger"
          ? "hover:bg-red-50/80 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
          : "hover:bg-gray-100/80 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-200"
      }`}
    >
      <div className={`transition-all duration-200 group-hover:scale-105 ${
        variant === "danger"
          ? "text-red-600 dark:text-red-400"
          : "text-indigo-600 dark:text-indigo-400"
      }`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{description}</p>
      </div>
    </button>
  );
}