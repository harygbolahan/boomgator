import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from '@/contexts/ChatContext';
import { Search } from 'lucide-react';

const ChatList = () => {
  const { contacts, openChat, activeContact } = useChat();

  return (
    <Card className="w-full h-full">
      <CardHeader className="p-3 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Messages</h3>
          <Badge className="bg-primary">{contacts.length}</Badge>
        </div>
        <div className="relative mt-2">
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search contacts..."
            className="pl-8 w-full h-9 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="p-3 space-y-2">
            {contacts.map((contact) => (
              <Button
                key={contact.id}
                variant="ghost"
                className={`w-full justify-start p-2 h-auto ${
                  activeContact?.id === contact.id ? 'bg-primary/10' : ''
                }`}
                onClick={() => openChat(contact.id)}
              >
                <div className="flex items-center w-full">
                  <div className="relative">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {contact.status === 'online' && (
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{contact.name}</span>
                      {contact.messages.length > 0 && (
                        <span className="text-xs text-gray-500">
                          {new Date(contact.messages[contact.messages.length - 1].timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mt-0.5">
                      {contact.messages.length > 0 && (
                        <span className="text-xs text-gray-500 truncate max-w-[180px]">
                          {contact.messages[contact.messages.length - 1].text}
                        </span>
                      )}
                      
                      {contact.unreadCount > 0 && (
                        <Badge className="ml-1 bg-red-500 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                          {contact.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ChatList; 