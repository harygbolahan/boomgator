import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function UserProfileMenu({ className }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  
  const handleLogout = () => {
    logout();
    navigate('/auth/login');
    closeMenu();
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      toggleMenu();
    }
  };
  
  return (
    <div className={`relative ${className}`}>
      {/* User avatar button */}
      <button
        className="flex items-center gap-2 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        onClick={toggleMenu}
        onKeyDown={handleKeyDown}
        aria-label="User profile menu"
        tabIndex={0}
      >
        <div className="w-8 h-8 relative flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-primary font-medium">
          {user?.first_name ? user.first_name.charAt(0).toUpperCase() : '?'}
        </div>
        <span className="hidden md:block text-sm font-medium truncate max-w-[100px]">
          {user?.first_name || 'User'}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Dropdown menu */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={closeMenu}
            onKeyDown={(e) => e.key === 'Escape' && closeMenu()}
            tabIndex={-1}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="font-medium">{user?.first_name} {user?.last_name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</div>
              {user?.wallet !== undefined && (
                <div className="mt-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Balance: </span>
                  <span className="font-medium">${user.wallet.toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="py-1">
              <button
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  navigate('/account');
                  closeMenu();
                }}
                tabIndex={0}
              >
                Account Settings
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  navigate('/payment-plans');
                  closeMenu();
                }}
                tabIndex={0}
              >
                Subscription & Billing
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={handleLogout}
                tabIndex={0}
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 