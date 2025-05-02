import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';

const ChatButton = () => {
  const { contacts, toggleMinimize, isOpen } = useChat();
  
  // Calculate total unread messages across all contacts
  const totalUnread = contacts.reduce((sum, contact) => sum + contact.unreadCount, 0);
  
  return (
    <div className="fixed bottom-4 right-4 z-40">
      {!isOpen && (
        <Button 
          className="h-14 w-14 rounded-full shadow-lg flex items-center justify-center relative"
          onClick={toggleMinimize}
          aria-label="Open chat"
          tabIndex="0"
        >
          <MessageCircle className="h-6 w-6" />
          
          {totalUnread > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 p-0 flex items-center justify-center rounded-full bg-red-500">
              {totalUnread > 99 ? '99+' : totalUnread}
            </Badge>
          )}
        </Button>
      )}
    </div>
  );
};

export default ChatButton; 