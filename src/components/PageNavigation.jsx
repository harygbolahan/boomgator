import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function PageNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  
  const pages = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Account', path: '/account' },
    { name: 'AI Content Creator', path: '/ai-content-creator' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Automation', path: '/automation' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Instagram Viral Finder', path: '/instagram-viral-finder' },
    { name: 'Integrations', path: '/integrations' },
    { name: 'Messenger Broadcast', path: '/messenger-broadcast' },
    { name: 'Notifications', path: '/notifications' },
    { name: 'Pages Management', path: '/pages-management' },
    { name: 'Payment Plans', path: '/payment-plans' },
    { name: 'Setup Guide', path: '/setup-guide' },
    { name: 'Support', path: '/support' },
    { name: 'WhatsApp Bot', path: '/whatsapp-bot' },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
        >
          Pages {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
        
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-2 w-64 max-h-96 overflow-y-auto">
            <div className="space-y-1">
              {pages.map((page) => (
                <Link
                  key={page.path}
                  to={page.path}
                  className="block px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  {page.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 