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
  CreditCardIcon 
} from "lucide-react"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"

export function UserMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    try {
      // Call the auth context logout function
      logout();
      console.log('Logout successful, redirecting to login page');
      
      // Delay navigation slightly to ensure logout completes
      setTimeout(() => {
        // Use replace instead of navigate to prevent going back to dashboard
        navigate("/auth/login", { replace: true });
      }, 100);
    } catch (error) {
      console.error('Error during logout:', error);
      // Force navigation to login page even if there's an error
      navigate("/auth/login", { replace: true });
    }
  };

  const handleNavigate = (path, e) => {
    e.preventDefault();
    navigate(path);
  };

  // Get user initials for avatar placeholder
  const getUserInitials = () => {
    if (!user) return "?";
    
    const firstInitial = user.first_name ? user.first_name.charAt(0) : "";
    const lastInitial = user.last_name ? user.last_name.charAt(0) : "";
    
    return (firstInitial + lastInitial).toUpperCase();
  };

  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      
      <Popover>
        <PopoverTrigger className="flex items-center gap-2">
          <div className="relative">
            {/* If we had a user profile image, we'd use it here */}
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-200 font-medium">
              {getUserInitials()}
            </div>
            <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 border border-white" />
          </div>
          <span className="hidden md:block text-sm">{user?.first_name || "User"} {user?.last_name || ""}</span>
          <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
        </PopoverTrigger>
        
        <PopoverContent className="w-[280px] p-0 rounded-lg shadow-lg border" align="right">
          {/* User profile header */}
          <div className="bg-blue-600 dark:bg-blue-800 p-4">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-white font-medium">
                {getUserInitials()}
              </div>
              <div>
                <h4 className="font-medium text-white">{user?.first_name || "User"} {user?.last_name || ""}</h4>
                <p className="text-xs text-blue-100">{user?.email || "user@example.com"}</p>
                {user?.wallet !== undefined && (
                  <div className="mt-1">
                    <span className="text-xs text-white font-medium">
                      Balance: ${user.wallet.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Menu items */}
          <div className="py-2 bg-white dark:bg-gray-800">
            <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              ACCOUNT
            </div>
            
            <a
              href="/account"
              onClick={(e) => handleNavigate('/account', e)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              tabIndex={0}
              aria-label="Your Profile"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNavigate('/account', e);
                }
              }}
            >
              <User2Icon className="mr-3 h-4 w-4 text-blue-600 dark:text-blue-400" />
              Your Profile
            </a>
            
            <a
              href="/account"
              onClick={(e) => handleNavigate('/account', e)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              tabIndex={0}
              aria-label="Settings"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNavigate('/account', e);
                }
              }}
            >
              <SettingsIcon className="mr-3 h-4 w-4 text-blue-600 dark:text-blue-400" />
              Settings
            </a>
            
            <a
              href="/notifications"
              onClick={(e) => handleNavigate('/notifications', e)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              tabIndex={0}
              aria-label="Notifications"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNavigate('/notifications', e);
                }
              }}
            >
              <BellIcon className="mr-3 h-4 w-4 text-blue-600 dark:text-blue-400" />
              Notifications
            </a>
            
            <a
              href="/payment-plans"
              onClick={(e) => handleNavigate('/payment-plans', e)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              tabIndex={0}
              aria-label="Billing"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNavigate('/payment-plans', e);
                }
              }}
            >
              <CreditCardIcon className="mr-3 h-4 w-4 text-blue-600 dark:text-blue-400" />
              Billing
            </a>
            
            <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              SUPPORT
            </div>
            
            <a
              href="/support"
              onClick={(e) => handleNavigate('/support', e)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              tabIndex={0}
              aria-label="Help Center"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNavigate('/support', e);
                }
              }}
            >
              <LifeBuoyIcon className="mr-3 h-4 w-4 text-blue-600 dark:text-blue-400" />
              Help Center
            </a>
            
            <a
              href="/auth/login"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
              className="flex items-center px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              tabIndex={0}
              aria-label="Sign out"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleLogout();
                }
              }}
            >
              <LogOutIcon className="mr-3 h-4 w-4 text-red-600 dark:text-red-400" />
              Sign out
            </a>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}