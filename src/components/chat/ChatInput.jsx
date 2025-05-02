import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Smile, Paperclip } from 'lucide-react';

const ChatInput = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    onSendMessage(inputValue);
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-center w-full gap-2 p-3 border-t">
      <Button 
        size="icon" 
        variant="ghost" 
        className="text-gray-500 hover:text-gray-700"
        aria-label="Insert emoji"
        tabIndex="0"
      >
        <Smile className="h-5 w-5" />
      </Button>
      
      <Button 
        size="icon" 
        variant="ghost" 
        className="text-gray-500 hover:text-gray-700"
        aria-label="Attach file"
        tabIndex="0"
      >
        <Paperclip className="h-5 w-5" />
      </Button>
      
      <Input
        ref={inputRef}
        type="text"
        placeholder="Type a message..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1"
        aria-label="Message input"
      />
      
      <Button 
        size="icon" 
        onClick={handleSendMessage}
        disabled={inputValue.trim() === ''}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
        aria-label="Send message"
        tabIndex="0"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ChatInput; 