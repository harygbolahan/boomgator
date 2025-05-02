import React from 'react';
import { ChatProvider } from '@/contexts/ChatContext';
import ChatWindow from './ChatWindow';
import ChatButton from './ChatButton';

const ChatContainer = () => {
  return (
    <ChatProvider>
      <ChatButton />
      <ChatWindow />
    </ChatProvider>
  );
};

export default ChatContainer; 