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

export function UserMenu() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const handleNavigate = (path, e) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      
      <Popover>
        <PopoverTrigger className="flex items-center gap-2">
          <div className="relative">
            <img
              className="h-8 w-8 rounded-full object-cover"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User profile"
            />
            <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 border border-white" />
          </div>
          <span className="hidden md:block text-sm">John Doe</span>
          <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
        </PopoverTrigger>
        
        <PopoverContent className="w-[280px] p-0 rounded-lg shadow-lg border" align="right">
          {/* User profile header */}
          <div className="bg-blue-600 dark:bg-blue-800 p-4">
            <div className="flex items-center space-x-3">
              <img
                className="h-12 w-12 rounded-full object-cover"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User profile"
              />
              <div>
                <h4 className="font-medium text-white">John Doe</h4>
                <p className="text-xs text-blue-100">john.doe@example.com</p>
                <div className="mt-1">
                  <span className="text-xs text-white font-medium">
                    Premium
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Menu items */}
          <div className="py-2 bg-white dark:bg-gray-800">
            <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              ACCOUNT
            </div>
            
            <a
              href="/profile"
              onClick={(e) => handleNavigate('/profile', e)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              tabIndex={0}
              aria-label="Your Profile"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNavigate('/profile', e);
                }
              }}
            >
              <User2Icon className="mr-3 h-4 w-4 text-blue-600 dark:text-blue-400" />
              Your Profile
            </a>
            
            <a
              href="/settings"
              onClick={(e) => handleNavigate('/settings', e)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              tabIndex={0}
              aria-label="Settings"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNavigate('/settings', e);
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
              href="/billing"
              onClick={(e) => handleNavigate('/billing', e)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              tabIndex={0}
              aria-label="Billing"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNavigate('/billing', e);
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
              href="/help"
              onClick={(e) => handleNavigate('/help', e)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              tabIndex={0}
              aria-label="Help Center"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNavigate('/help', e);
                }
              }}
            >
              <LifeBuoyIcon className="mr-3 h-4 w-4 text-blue-600 dark:text-blue-400" />
              Help Center
            </a>
            
            <a
              href="/login"
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