import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { useChat } from '@/contexts/ChatContext';

const ChatWindow = () => {
  const { 
    isOpen, 
    isMinimized, 
    isMaximized, 
    activeContact, 
    closeChat, 
    toggleMinimize, 
    toggleMaximize, 
    sendMessage 
  } = useChat();
  
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen || !activeContact) return null;

  // Handle sending a message
  const handleSendMessage = (text) => {
    sendMessage(activeContact.id, text);
    
    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 3000);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          className="rounded-full h-14 w-14 p-0 flex items-center justify-center shadow-lg group"
          onClick={toggleMinimize}
          aria-label={`Open chat with ${activeContact.name}`}
          tabIndex="0"
        >
          <Avatar className="h-12 w-12 border-2 border-white">
            <AvatarImage src={activeContact.avatar} alt={activeContact.name} />
            <AvatarFallback>{activeContact.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {activeContact.unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-red-500 text-white">{activeContact.unreadCount}</Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <Card className={`fixed z-50 shadow-lg transition-all duration-300 ${
      isMaximized 
        ? 'inset-4' 
        : 'bottom-4 right-4 w-80 h-[500px]'
    } flex flex-col`}>
      <ChatHeader 
        contact={activeContact}
        onClose={closeChat}
        onMinimize={toggleMinimize}
        onMaximize={toggleMaximize}
        isMaximized={isMaximized}
      />
      
      <CardContent className="p-0 flex-grow overflow-hidden">
        <ChatMessages 
          messages={activeContact.messages}
          isTyping={isTyping}
        />
      </CardContent>
      
      <ChatInput onSendMessage={handleSendMessage} />
    </Card>
  );
};

export default ChatWindow; 