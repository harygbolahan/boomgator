import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Settings, Bot, Send, Paperclip, X, Clock } from 'lucide-react';

const LiveChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      text: 'Hello! How can I assist you today?',
      timestamp: new Date(new Date().getTime() - 120000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatStatus, setChatStatus] = useState('active'); // active, ended
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Save chat history to localStorage
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);
  
  // Load chat history from localStorage on initial render
  useEffect(() => {
    const savedChat = localStorage.getItem('chatHistory');
    if (savedChat) {
      setMessages(JSON.parse(savedChat));
    }
  }, []);
  
  const handleSendMessage = () => {
    if (!inputMessage.trim() || chatStatus === 'ended') return;
    
    // Add user message
    const newUserMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate agent response after delay
    setTimeout(() => {
      const agentResponses = [
        "I understand your concern. Could you provide more details so I can help you better?",
        "Thank you for sharing that information. Let me look into this for you.",
        "I'm checking our resources to find a solution for you. This will just take a moment.",
        "Have you tried restarting the application? Sometimes that resolves the issue.",
        "I appreciate your patience. Is there anything else you'd like me to help with?"
      ];
      
      const randomResponse = agentResponses[Math.floor(Math.random() * agentResponses.length)];
      
      const newAgentMessage = {
        id: Date.now() + 1,
        sender: 'agent',
        text: randomResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, newAgentMessage]);
      setIsTyping(false);
    }, 2000);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleAttachFile = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const fileMessage = {
          id: Date.now(),
          sender: 'user',
          text: `Attached file: ${file.name}`,
          isFile: true,
          fileName: file.name,
          fileSize: `${(file.size / 1024).toFixed(2)} KB`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, fileMessage]);
        
        // Simulate agent response to file
        setIsTyping(true);
        setTimeout(() => {
          const fileResponse = {
            id: Date.now() + 1,
            sender: 'agent',
            text: `I've received your file "${file.name}". I'll review it and get back to you shortly.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, fileResponse]);
          setIsTyping(false);
        }, 2000);
      }
    };
    fileInput.click();
  };
  
  const handleEndChat = () => {
    setChatStatus('ended');
    const endMessage = {
      id: Date.now(),
      sender: 'system',
      text: 'Chat has ended. Thank you for using our support service.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, endMessage]);
  };
  
  const handleStartNewChat = () => {
    setChatStatus('active');
    const initialMessage = {
      id: Date.now(),
      sender: 'agent',
      text: 'Hello! How can I assist you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([initialMessage]);
  };
  
  const clearChatHistory = () => {
    if (window.confirm('Are you sure you want to clear chat history?')) {
      localStorage.removeItem('chatHistory');
      handleStartNewChat();
    }
  };

  return (
    <div className="container mx-auto py-6">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Live Chat Support</h1>
          <p className="text-muted-foreground mt-2">
            Engage with our support team in real-time for immediate assistance
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 focus:ring-2 focus:ring-blue-500/50 transition-colors duration-200"
            aria-label="Start new chat"
            tabIndex={0}
            onClick={handleStartNewChat}
          >
            New Chat
          </button>
          <button 
            className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 focus:ring-2 focus:ring-red-500/50 transition-colors duration-200"
            aria-label="Clear chat history"
            tabIndex={0}
            onClick={clearChatHistory}
          >
            Clear History
          </button>
        </div>
      </header>
      
      <Card className="shadow-lg border-0 overflow-hidden">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl text-blue-700">Support Chat</CardTitle>
              <CardDescription>
                {chatStatus === 'active' ? (
                  <span className="flex items-center">
                    <span className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    <span className="text-green-600">Agent is online</span>
                  </span>
                ) : (
                  <span className="flex items-center">
                    <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
                    <span className="text-red-600">Chat ended</span>
                  </span>
                )}
              </CardDescription>
            </div>
            {chatStatus === 'active' && (
              <button
                className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors duration-200"
                onClick={handleEndChat}
                aria-label="End chat"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent className="min-h-[600px] relative flex flex-col p-0 bg-gradient-to-b from-gray-50 to-white">
          <div className="flex-grow p-4 overflow-y-auto mb-4 max-h-[500px]" role="log" aria-label="Chat messages">
            <div className="space-y-4">
              {messages.map(message => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : message.sender === 'system' ? 'justify-center' : 'justify-start'}`}>
                  {message.sender === 'system' ? (
                    <div className="bg-gray-100 p-2 rounded-lg max-w-[80%] text-center shadow-sm border border-gray-200">
                      <p className="text-sm text-gray-600">{message.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
                    </div>
                  ) : message.isFile ? (
                    <div className={`${message.sender === 'user' 
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'bg-white border border-gray-200 shadow-sm'} 
                      p-3 rounded-lg max-w-[70%]`}>
                      <p className="text-sm font-medium">{message.sender === 'user' ? 'You' : 'Support Agent'}</p>
                      <div className={`flex items-center gap-2 p-2 rounded mt-1 ${message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-100'}`}>
                        <Paperclip size={16} className={message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'} />
                        <div>
                          <p className="text-sm">{message.fileName}</p>
                          <p className={`text-xs ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>{message.fileSize}</p>
                        </div>
                      </div>
                      <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>{message.timestamp}</p>
                    </div>
                  ) : (
                    <div className={`${message.sender === 'user' 
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'bg-white border border-gray-200 shadow-sm'} 
                      p-3 rounded-lg max-w-[70%]`}>
                      <p className="text-sm font-medium">{message.sender === 'user' ? 'You' : 'Support Agent'}</p>
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>{message.timestamp}</p>
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-700">Support Agent</p>
                    <div className="flex gap-1 items-center py-1">
                      <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          <div className={`border-t p-4 ${chatStatus === 'ended' ? 'bg-gray-50' : 'bg-white'}`}>
            {chatStatus === 'active' ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type your message here..."
                  className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                  aria-label="Message input"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={chatStatus === 'ended'}
                />
                <button
                  className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 transition-colors duration-200"
                  aria-label="Send message"
                  tabIndex={0}
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || chatStatus === 'ended'}
                >
                  <Send size={18} />
                </button>
                <button
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 transition-colors duration-200"
                  aria-label="Attach file"
                  tabIndex={0}
                  onClick={handleAttachFile}
                  disabled={chatStatus === 'ended'}
                >
                  <Paperclip size={18} className="text-gray-600" />
                </button>
              </div>
            ) : (
              <button
                className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                onClick={handleStartNewChat}
              >
                Start New Chat
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveChatPage; 