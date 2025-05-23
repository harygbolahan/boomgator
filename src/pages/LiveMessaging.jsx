import { useState, useEffect } from 'react';
import { useBoom } from '../contexts/BoomContext';
import { format, parseISO } from 'date-fns';
import { RefreshCw, Send, ArrowDownCircle, Menu, X, Search, ChevronLeft } from 'lucide-react';

const LiveMessaging = () => {
  const { 
    pages,
    loadingPages,
    getPages,
    chats,
    currentChat,
    loadingChats,
    loadingCurrentChat,
    chatsError,
    currentChatError,
    getAllChats,
    openChat,
    replyToChat
  } = useBoom();

  const [selectedPage, setSelectedPage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPageInfo, setSelectedPageInfo] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sortedMessages, setSortedMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useState(null);

  // Fetch pages when component mounts
  useEffect(() => {
    fetchPages();
  }, []);

  // Sort messages chronologically when currentChat changes
  useEffect(() => {
    if (currentChat && currentChat.length > 0) {
      // Sort messages by date (oldest first)
      const sorted = [...currentChat].sort((a, b) => {
        return new Date(a.created_time) - new Date(b.created_time);
      });
      setSortedMessages(sorted);
    } else {
      setSortedMessages([]);
    }
  }, [currentChat]);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sortedMessages]);

  // Handle window resize to show/hide sidebar based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // On mobile, hide sidebar when a chat is selected
        if (selectedChat) {
          setSidebarVisible(false);
        }
      } else {
        // Always show sidebar on desktop
        setSidebarVisible(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once on component mount

    return () => window.removeEventListener('resize', handleResize);
  }, [selectedChat]);

  const fetchPages = async () => {
    try {
      setRefreshing(true);
      const pagesData = await getPages();
      console.log('pagesData', pagesData);
      
      // If pages are loaded and there's at least one page, select the first one
      if (pagesData && pagesData.length > 0 && !selectedPage) {
        handlePageChange(pagesData[0].page_id);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handlePageChange = async (pageId) => {
    if (pageId) {
      setSelectedPage(pageId);
      
      // Find selected page info for displaying page name
      const pageInfo = pages.find(page => page.page_id === pageId);
      setSelectedPageInfo(pageInfo);
      
      await getAllChats(pageId);
      setSelectedChat(null);
    }
  };

  const handleChatSelect = async (chat) => {
    setSelectedChat(chat);
    setRecipientId(chat.sender_id);
    await openChat(selectedPage, chat.thread_id);
    
    // On mobile, hide sidebar when a chat is selected
    if (window.innerWidth < 768) {
      setSidebarVisible(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && selectedPage && recipientId) {
      await replyToChat(selectedPage, recipientId, message);
      setMessage('');
      
      // Refresh chat messages after sending
      if (selectedChat) {
        await openChat(selectedPage, selectedChat.thread_id);
      }
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return timestamp;
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Filter chats based on search query
  const filteredChats = chats.filter(chat =>
    chat.sender_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (chat.message && chat.message.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full min-h-screen bg-gray-50">
      {/* Main Header */}
      <div className="py-4 px-4 sm:px-6 lg:px-8 bg-white shadow flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Live Messaging</h1>
        
        {/* Mobile sidebar toggle */}
        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
          onClick={toggleSidebar}
          aria-expanded={sidebarVisible}
        >
          <span className="sr-only">{sidebarVisible ? 'Close sidebar' : 'Open sidebar'}</span>
          {sidebarVisible ? (
            <X className="block h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="block h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div 
          className={`
            ${sidebarVisible ? 'block' : 'hidden'} 
            md:block w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-gray-200 bg-white
            ${sidebarVisible && 'md:block absolute md:relative z-10 h-[calc(100vh-64px)] md:h-auto w-full md:w-80 lg:w-96'}
          `}
        >
          <div className="flex flex-col h-full">
            {/* Page Selection */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="page-select" className="block text-sm font-medium text-gray-700">
                  Select Page
                </label>
                <button 
                  onClick={fetchPages}
                  disabled={loadingPages || refreshing}
                  className="p-1 rounded-md text-gray-500 hover:text-indigo-600 hover:bg-gray-100 transition-colors"
                  aria-label="Refresh pages"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing || loadingPages ? 'animate-spin' : ''}`} />
                </button>
              </div>
              {loadingPages || refreshing ? (
                <div className="flex items-center space-x-2 h-10">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
                  <span className="text-sm text-gray-500">Loading pages...</span>
                </div>
              ) : (
                <select
                  id="page-select"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedPage}
                  onChange={(e) => handlePageChange(e.target.value)}
                  disabled={loadingPages || refreshing}
                >
                  <option value="">Select a page</option>
                  {pages && pages.length > 0 ? (
                    pages.map((page) => (
                      <option key={page.page_id} value={page.page_id}>
                        {page.page_name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No pages available</option>
                  )}
                </select>
              )}
            </div>

            {/* Conversations Header and Search */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-3">Conversations</h2>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Chat List - Fixed height with scrolling */}
            <div className="overflow-y-auto flex-1" style={{ maxHeight: 'calc(100vh - 220px)' }}>
              {loadingChats ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
                </div>
              ) : chatsError ? (
                <div className="text-red-500 text-sm py-4 px-4">{chatsError}</div>
              ) : filteredChats.length === 0 ? (
                <div className="text-gray-500 text-sm py-4 px-4">
                  {selectedPage 
                    ? searchQuery 
                      ? 'No conversations found matching your search' 
                      : 'No conversations found' 
                    : 'Select a page to see conversations'}
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {filteredChats.map((chat) => (
                    <li
                      key={chat.thread_id}
                      className={`py-3 px-4 hover:bg-gray-50 cursor-pointer ${
                        selectedChat?.thread_id === chat.thread_id ? 'bg-indigo-50' : ''
                      }`}
                      onClick={() => handleChatSelect(chat)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center">
                            <span className="text-indigo-700 font-medium">
                              {chat.sender_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {chat.sender_name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {chat.message || 'No message preview available'}
                          </p>
                        </div>
                        <div className="text-xs text-gray-400 whitespace-nowrap">
                          {formatTimestamp(chat.created_time)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${!sidebarVisible ? 'block' : 'hidden md:flex'} bg-white`}>
          {!selectedChat ? (
            <div className="flex-1 flex items-center justify-center p-6 text-gray-500">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p>Select a conversation to start messaging</p>
                {selectedPageInfo && (
                  <p className="mt-2 text-sm text-gray-400">
                    You are logged in as {selectedPageInfo.page_name}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Mobile Chat Header - Fixed at top */}
              <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm md:hidden">
                <div className="p-3 flex items-center">
                  <button
                    className="p-1 mr-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
                    onClick={() => setSidebarVisible(true)}
                    aria-label="Back to conversations"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-indigo-200 flex-shrink-0 flex items-center justify-center mr-2">
                      <span className="text-indigo-700 font-medium">
                        {selectedChat.sender_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="truncate">
                      <h2 className="text-base font-medium text-gray-900 truncate">{selectedChat.sender_name}</h2>
                      {selectedPageInfo && (
                        <p className="text-xs text-gray-500 truncate">
                          You are replying as {selectedPageInfo.page_name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Chat Header - Non-sticky */}
              <div className="hidden md:block p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center">
                        <span className="text-indigo-700 font-medium">
                          {selectedChat.sender_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">{selectedChat.sender_name}</h2>
                      {selectedPageInfo && (
                        <p className="text-xs text-gray-500">
                          You are replying as {selectedPageInfo.page_name}
                        </p>
                      )}
                    </div>
                  </div>
                  {sortedMessages && sortedMessages.length > 5 && (
                    <button 
                      onClick={scrollToBottom}
                      className="p-1 rounded-md text-gray-500 hover:text-indigo-600 hover:bg-gray-100 transition-colors"
                      aria-label="Scroll to bottom"
                    >
                      <ArrowDownCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {loadingCurrentChat ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
                  </div>
                ) : currentChatError ? (
                  <div className="text-red-500 text-sm py-4">{currentChatError}</div>
                ) : sortedMessages.length === 0 ? (
                  <div className="text-gray-500 text-sm py-4">No messages in this conversation</div>
                ) : (
                  <div className="space-y-4">
                    {sortedMessages.map((msg, index) => {
                      const isOwnMessage = msg.from.id === selectedPage;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isOwnMessage && (
                            <div className="flex-shrink-0 mr-2 self-end mb-1">
                              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-600 font-medium text-xs">
                                  {msg.from.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                          )}
                          <div className="flex flex-col max-w-[220px] sm:max-w-[260px] md:max-w-[300px] lg:max-w-[380px]">
                            {!isOwnMessage && (
                              <span className="text-xs text-gray-500 mb-1 ml-1">
                                {msg.from.name}
                              </span>
                            )}
                            <div
                              className={`px-4 py-2 rounded-lg ${
                                isOwnMessage
                                  ? 'bg-indigo-600 text-white rounded-br-none'
                                  : 'bg-gray-200 text-gray-900 rounded-bl-none'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap break-words overflow-hidden">{msg.message}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  isOwnMessage ? 'text-indigo-200' : 'text-gray-500'
                                }`}
                              >
                                {formatTimestamp(msg.created_time)}
                              </p>
                            </div>
                          </div>
                          {isOwnMessage && (
                            <div className="flex-shrink-0 ml-2 self-end mb-1">
                              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                                <span className="text-white font-medium text-xs">
                                  {selectedPageInfo?.page_name.charAt(0).toUpperCase() || ''}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div ref={el => messagesEndRef.current = el} />
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={loadingCurrentChat}
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    disabled={!message.trim() || loadingCurrentChat}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// MessageSquare component for empty state
const MessageSquare = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

export default LiveMessaging; 