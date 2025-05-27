import { useState, useEffect } from 'react';
import { useBoom } from '../contexts/BoomContext';
import { format, parseISO } from 'date-fns';
import { RefreshCw, Send, ArrowDownCircle, Menu, X, Search, ChevronLeft, MessageCircle, Users, Clock } from 'lucide-react';

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
    <div className="flex flex-col h-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 max-w-full overflow-x-hidden">
      {/* Main Header */}
      <div className="py-2 px-2 min-[350px]:py-3 min-[350px]:px-3 sm:py-4 sm:px-6 bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/60 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-base min-[350px]:text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Live Messaging
          </h1>
        </div>
        
        {/* Mobile sidebar toggle */}
        <button
          className="md:hidden inline-flex items-center justify-center p-2.5 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none transition-all duration-200"
          onClick={toggleSidebar}
          aria-expanded={sidebarVisible}
        >
          <span className="sr-only">{sidebarVisible ? 'Close sidebar' : 'Open sidebar'}</span>
          {sidebarVisible ? (
            <X className="block h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="block h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-65px)]">
        {/* Sidebar */}
        <div 
          className={`
            ${sidebarVisible ? 'block' : 'hidden'} 
            md:block w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-gray-200/60 bg-white/70 backdrop-blur-sm
            ${sidebarVisible && 'md:block absolute md:relative z-10 h-[calc(100vh-65px)] md:h-auto w-full md:w-80 lg:w-96'}
          `}
        >
          <div className="flex flex-col h-full">
            {/* Page Selection */}
            <div className="p-2 min-[350px]:p-3 sm:p-4 border-b border-gray-200/60">
              <div className="flex justify-between items-center mb-3">
                <label htmlFor="page-select" className="flex items-center text-sm font-semibold text-gray-700">
                  <Users className="w-4 h-4 mr-1.5 text-indigo-500" />
                  Select Page
                </label>
                <button 
                  onClick={fetchPages}
                  disabled={loadingPages || refreshing}
                  className="p-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 disabled:opacity-50"
                  aria-label="Refresh pages"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing || loadingPages ? 'animate-spin' : ''}`} />
                </button>
              </div>
              {loadingPages || refreshing ? (
                <div className="flex items-center space-x-3 h-11 px-3 py-2 bg-gray-50 rounded-xl">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent"></div>
                  <span className="text-sm text-gray-600">Loading pages...</span>
                </div>
              ) : (
                <select
                  id="page-select"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm font-medium transition-all duration-200"
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
            <div className="p-3 sm:p-4 border-b border-gray-200/60">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center">
                <MessageCircle className="w-4 h-4 mr-2 text-indigo-500" />
                Conversations
              </h2>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="pl-10 w-full px-3 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Chat List - Fixed height with scrolling */}
            <div className="overflow-y-auto flex-1" style={{ maxHeight: 'calc(100vh - 240px)' }}>
              {loadingChats ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Loading conversations...</p>
                  </div>
                </div>
              ) : chatsError ? (
                <div className="text-red-500 text-sm py-4 px-4 bg-red-50 mx-3 mt-3 rounded-lg">{chatsError}</div>
              ) : filteredChats.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    {selectedPage 
                      ? searchQuery 
                        ? 'No conversations found matching your search' 
                        : 'No conversations found' 
                      : 'Select a page to see conversations'}
                  </p>
                </div>
              ) : (
                <div className="p-2">
                  {filteredChats.map((chat) => (
                    <div
                      key={chat.thread_id}
                      className={`mb-2 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-sm ${
                        selectedChat?.thread_id === chat.thread_id 
                          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 shadow-sm' 
                          : 'bg-white hover:bg-gray-50 border border-gray-100'
                      }`}
                      onClick={() => handleChatSelect(chat)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                            selectedChat?.thread_id === chat.thread_id 
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                              : 'bg-gradient-to-r from-gray-400 to-gray-500'
                          }`}>
                            <span className="text-white font-semibold text-sm">
                              {chat.sender_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {chat.sender_name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {chat.message || 'No message preview available'}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center text-xs text-gray-400">
                            <Clock className="w-3 h-3 mr-1" />
                            <span className="whitespace-nowrap">
                              {formatTimestamp(chat.created_time)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${!sidebarVisible ? 'block' : 'hidden md:flex'} bg-white/50 backdrop-blur-sm`}>
          {!selectedChat ? (
            <div className="flex-1 flex items-center justify-center p-6 text-gray-500">
              <div className="text-center">
                <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl w-fit mx-auto mb-4">
                  <MessageSquare className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to Live Messaging</h3>
                <p className="text-gray-600 mb-2">Select a conversation to start messaging</p>
                {selectedPageInfo && (
                  <div className="mt-4 p-3 bg-indigo-50 rounded-xl border border-indigo-200">
                    <p className="text-sm text-indigo-700 font-medium">
                      You are logged in as {selectedPageInfo.page_name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Mobile Chat Header - Fixed at top */}
              <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm md:hidden">
                <div className="p-3 flex items-center">
                  <button
                    className="p-2 mr-2 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none transition-all duration-200"
                    onClick={() => setSidebarVisible(true)}
                    aria-label="Back to conversations"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex-shrink-0 flex items-center justify-center mr-3">
                      <span className="text-white font-semibold text-sm">
                        {selectedChat.sender_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="truncate">
                      <h2 className="text-base font-semibold text-gray-900 truncate">{selectedChat.sender_name}</h2>
                      {selectedPageInfo && (
                        <p className="text-xs text-indigo-600 truncate font-medium">
                          Replying as {selectedPageInfo.page_name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Chat Header - Non-sticky */}
              <div className="hidden md:block p-4 border-b border-gray-200/60 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">
                          {selectedChat.sender_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedChat.sender_name}</h2>
                      {selectedPageInfo && (
                        <p className="text-sm text-indigo-600 font-medium">
                          Replying as {selectedPageInfo.page_name}
                        </p>
                      )}
                    </div>
                  </div>
                  {sortedMessages && sortedMessages.length > 5 && (
                    <button 
                      onClick={scrollToBottom}
                      className="p-2.5 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                      aria-label="Scroll to bottom"
                    >
                      <ArrowDownCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-3 sm:p-4 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white/50">
                {loadingCurrentChat ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent mx-auto mb-3"></div>
                      <p className="text-sm text-gray-600">Loading messages...</p>
                    </div>
                  </div>
                ) : currentChatError ? (
                  <div className="text-red-500 text-sm py-4 px-4 bg-red-50 rounded-xl mx-2">{currentChatError}</div>
                ) : sortedMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No messages in this conversation</p>
                    <p className="text-gray-400 text-xs mt-1">Start the conversation by sending a message below</p>
                  </div>
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
                              <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center shadow-sm">
                                <span className="text-white font-semibold text-xs">
                                  {msg.from.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                          )}
                          <div className="flex flex-col max-w-[calc(100vw-120px)] min-[380px]:max-w-[200px] sm:max-w-[240px] md:max-w-[280px] lg:max-w-[320px]">
                            {!isOwnMessage && (
                              <span className="text-xs text-gray-500 mb-1 ml-2 font-medium">
                                {msg.from.name}
                              </span>
                            )}
                            <div
                              className={`px-4 py-3 rounded-2xl shadow-sm ${
                                isOwnMessage
                                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-md'
                                  : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                              <p
                                className={`text-xs mt-2 flex items-center ${
                                  isOwnMessage ? 'text-indigo-100' : 'text-gray-500'
                                }`}
                              >
                                <Clock className="w-3 h-3 mr-1" />
                                {formatTimestamp(msg.created_time)}
                              </p>
                            </div>
                          </div>
                          {isOwnMessage && (
                            <div className="flex-shrink-0 ml-2 self-end mb-1">
                              <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                                <span className="text-white font-semibold text-xs">
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
              <div className="p-3 sm:p-4 border-t border-gray-200/60 bg-white/80 backdrop-blur-sm">
                <form onSubmit={handleSendMessage} className="flex space-x-3">
                  <input
                    type="text"
                    className="flex-1 px-3 sm:px-4 py-3 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all duration-200 text-sm min-[320px]:text-base"
                    style={{ fontSize: window.innerWidth <= 350 ? '16px' : '' }}
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={loadingCurrentChat}
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 sm:px-6 py-3 border border-transparent rounded-2xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    disabled={!message.trim() || loadingCurrentChat}
                  >
                    <Send className="w-4 h-4 sm:mr-2" />
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