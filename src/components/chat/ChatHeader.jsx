import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MinusCircle, XCircle, Maximize2, Minimize2 } from 'lucide-react';

const ChatHeader = ({ 
  contact, 
  onClose, 
  onMinimize, 
  onMaximize, 
  isMaximized 
}) => {
  return (
    <div className="p-3 border-b flex flex-row items-center space-x-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={contact.avatar} alt={contact.name} />
        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="font-medium text-sm">{contact.name}</div>
        <div className="flex items-center">
          <div className={`h-1.5 w-1.5 rounded-full ${
            contact.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
          } mr-1.5`}></div>
          <span className="text-xs text-gray-500">
            {contact.status === 'online' ? 'Online' : contact.lastSeen}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {isMaximized ? (
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-7 w-7" 
            onClick={onMaximize}
            aria-label="Minimize window"
            tabIndex="0"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-7 w-7" 
            onClick={onMaximize}
            aria-label="Maximize window" 
            tabIndex="0"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        )}
        
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-7 w-7" 
          onClick={onMinimize}
          aria-label="Minimize chat"
          tabIndex="0"
        >
          <MinusCircle className="h-4 w-4" />
        </Button>
        
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-7 w-7" 
          onClick={onClose}
          aria-label="Close chat"
          tabIndex="0"
        >
          <XCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader; 