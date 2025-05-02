import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const ChatContext = createContext(null);

// Define initial contacts
const initialContacts = [
  {
    id: '1',
    name: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/100?u=1',
    status: 'online',
    lastSeen: 'Just now',
    unreadCount: 0,
    messages: [
      {
        id: 1,
        text: 'Hello! How can I help you today?',
        sender: 'them',
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        status: 'read'
      },
      {
        id: 2,
        text: 'I\'m interested in your social dashboard services',
        sender: 'me',
        timestamp: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
        status: 'read'
      },
      {
        id: 3,
        text: 'Great! I\'d be happy to tell you more about our social dashboard. What specific features are you most interested in?',
        sender: 'them',
        timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
        status: 'read'
      }
    ]
  },
  {
    id: '2',
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/100?u=2',
    status: 'offline',
    lastSeen: '2 hours ago',
    unreadCount: 2,
    messages: [
      {
        id: 1,
        text: 'Hi there, I have a question about automating comments',
        sender: 'them',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        status: 'read'
      },
      {
        id: 2,
        text: 'Sure, I can help with that. What social platforms are you using?',
        sender: 'me',
        timestamp: new Date(Date.now() - 1000 * 60 * 119).toISOString(),
        status: 'read'
      },
      {
        id: 3,
        text: 'Mainly Facebook and Instagram. I need to respond to comments faster.',
        sender: 'them',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        status: 'delivered'
      },
      {
        id: 4,
        text: 'Also, do you support ad comment automation?',
        sender: 'them',
        timestamp: new Date(Date.now() - 1000 * 60 * 29).toISOString(),
        status: 'delivered'
      }
    ]
  }
];

// Create the provider component
export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isMaximized, setIsMaximized] = useState(false);
  const [contacts, setContacts] = useState(initialContacts);
  const [activeContact, setActiveContact] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Effect to handle new message notifications
  useEffect(() => {
    const totalUnread = contacts.reduce((sum, contact) => sum + contact.unreadCount, 0);
    if (totalUnread > 0) {
      // Could implement browser notifications here if permissions are granted
      console.log(`You have ${totalUnread} unread messages`);
    }
  }, [contacts]);

  // Open chat window with a specific contact
  const openChat = (contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      setActiveContact(contact);
      setIsOpen(true);
      setIsMinimized(false);

      // Mark messages as read when opening chat
      if (contact.unreadCount > 0) {
        setContacts(contacts.map(c => 
          c.id === contactId 
            ? { ...c, unreadCount: 0, messages: c.messages.map(m => ({ ...m, status: 'read' })) } 
            : c
        ));
      }
    }
  };

  // Close the chat window
  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(true);
    setIsMaximized(false);
  };

  // Toggle minimize state
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Toggle maximize state
  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  // Send a message to a contact
  const sendMessage = (contactId, text) => {
    if (!text.trim()) return;

    const newMessage = {
      id: Date.now(),
      text,
      sender: 'me',
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    setContacts(contacts.map(contact => 
      contact.id === contactId
        ? { ...contact, messages: [...contact.messages, newMessage] }
        : contact
    ));

    // Simulate response after a delay
    setTimeout(() => {
      const autoReply = {
        id: Date.now() + 1,
        text: "Thanks for your message! Our team will respond shortly.",
        sender: 'them',
        timestamp: new Date().toISOString(),
        status: 'delivered'
      };

      setContacts(prevContacts => 
        prevContacts.map(contact => 
          contact.id === contactId
            ? { ...contact, messages: [...contact.messages, autoReply] }
            : contact
        )
      );

      // If chat is not focused, increment unread count
      if (activeContact?.id !== contactId || isMinimized) {
        setContacts(prevContacts => 
          prevContacts.map(contact => 
            contact.id === contactId
              ? { ...contact, unreadCount: contact.unreadCount + 1 }
              : contact
          )
        );

        // Add notification
        setNotifications(prev => [
          ...prev, 
          { 
            id: Date.now(), 
            contactId, 
            message: autoReply.text, 
            timestamp: autoReply.timestamp 
          }
        ]);
      }
    }, 3000);
  };

  // Clear notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Clear notifications for a specific contact
  const clearContactNotifications = (contactId) => {
    setNotifications(prev => prev.filter(notification => notification.contactId !== contactId));
  };

  // The context value that will be provided
  const contextValue = {
    isOpen,
    isMinimized,
    isMaximized,
    contacts,
    activeContact,
    notifications,
    openChat,
    closeChat,
    toggleMinimize,
    toggleMaximize,
    sendMessage,
    clearNotifications,
    clearContactNotifications
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext; 