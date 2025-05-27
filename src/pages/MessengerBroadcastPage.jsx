import { useState, useEffect, useCallback } from "react";
import { useBoom } from "@/contexts/BoomContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { Facebook, AlertCircle, CheckCircle, Info, Trash2, Send, Users, MessageSquare, Loader2, RefreshCw, Zap, Target, Globe } from "lucide-react";
import { toast } from "react-toastify";

export function MessengerBroadcastPage() {
  const { 
    getSubscribers, 
    getSubscribersByLabel, 
    deleteSubscriber, 
    sendBroadcast,
    getPages
  } = useBoom();

  const [isConnected, setIsConnected] = useState(true);
  const [activeTab, setActiveTab] = useState("broadcast");
  const [subscribers, setSubscribers] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [uniqueLabels, setUniqueLabels] = useState([]);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [selectedPage, setSelectedPage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState([]);

  // Move loadData to useCallback so it can be reused
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Load subscribers
      const subscribersData = await getSubscribers();
      setSubscribers(subscribersData);
      
      // Extract unique labels
      const labels = [...new Set(subscribersData.map(sub => sub.label))];
      setUniqueLabels(labels);
      
      // Load pages
      const pagesData = await getPages();
      // console.log('Full pages response:', pagesData);
      
      if (Array.isArray(pagesData)) {
        // Create a Map to store unique pages using page_id as the key
        const uniquePagesMap = new Map();
        
        pagesData.forEach(page => {
          // console.log('Processing page:', page);
          if (!uniquePagesMap.has(page.id)) {
            uniquePagesMap.set(page.id, {
              page_id: page.id,
              page_name: page.name,
              picture: page.picture,
              ...page
            });
          }
        });
        
        // Convert Map values back to array
        const formattedPages = Array.from(uniquePagesMap.values());
        // console.log('Formatted pages:', formattedPages);
        
        // Sort pages by name for better organization
        formattedPages.sort((a, b) => a.page_name.localeCompare(b.page_name));
        
        setPages(formattedPages);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error loading data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [getSubscribers, getPages]);

  // Use loadData in useEffect
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle refresh click
  const handleRefresh = async () => {
    await loadData();
    toast.success('Data refreshed successfully');
  };

  // Handle label change
  const handleLabelChange = async (label) => {
    setSelectedLabel(label);
    setLoading(true);
    try {
      const filteredSubscribers = await getSubscribersByLabel(label);
      setSubscribers(filteredSubscribers);
    } catch (error) {
      console.error('Error filtering subscribers:', error);
      toast.error('Error filtering subscribers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle subscriber deletion
  const handleDeleteSubscriber = async (subscriberId) => {
    if (window.confirm('Are you sure you want to delete this subscriber?')) {
      const success = await deleteSubscriber(subscriberId);
      if (success) {
        setSubscribers(subscribers.filter(sub => sub.id !== subscriberId));
        toast.success('Subscriber deleted successfully');
      }
    }
  };

  // Handle broadcast send
  const handleBroadcastSend = async () => {
    if (!selectedPage || !broadcastMessage) {
      toast.error('Please select a page and enter a message');
      return;
    }

    const selectedPageData = pages.find(page => page.page_id === selectedPage);
    if (!selectedPageData) {
      toast.error('Selected page not found');
      return;
    }

    setLoading(true);
    try {
      const success = await sendBroadcast({
        lebel: selectedLabel,
        page_id: selectedPage,
        message: broadcastMessage
      });

      if (success) {
        setBroadcastMessage("");
        setSelectedLabel("");
        toast.success(`Broadcast sent successfully via ${selectedPageData.page_name}`);
      }
    } catch (error) {
      console.error('Error sending broadcast:', error);
      toast.error('Error sending broadcast. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Subscriber table columns
  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
            {row.original.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <span className="font-medium text-gray-900">{row.original.name}</span>
        </div>
      )
    },
    {
      accessorKey: "label",
      header: "Label",
      cell: ({ row }) => (
        <Badge variant="secondary" className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200">
          {row.original.label}
        </Badge>
      )
    },
    {
      accessorKey: "created_at",
      header: "Subscribed Date",
      cell: ({ row }) => (
        <span className="text-gray-600">
          {new Date(row.original.created_at).toLocaleDateString()}
        </span>
      )
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDeleteSubscriber(row.original.id)}
          className="hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )
    }
  ];

      return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Header Section */}
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-4 sm:p-6 lg:p-8 text-white shadow-xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-0">
              <div className="space-y-2 flex-1">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="p-2 sm:p-3 bg-white/20 rounded-lg sm:rounded-xl backdrop-blur-sm">
                    <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Messenger Broadcasts</h1>
                    <p className="text-blue-100 text-sm sm:text-base lg:text-lg mt-1">
                      Connect, engage, and grow your audience with targeted messaging
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={loading}
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-200 min-h-[44px] sm:min-h-auto"
                >
                  <RefreshCw className={`w-4 h-4 sm:mr-2 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>

                {isConnected ? (
                  <Badge className="bg-green-500/20 text-green-100 border-green-400/30 px-3 sm:px-4 py-2 text-xs sm:text-sm justify-center min-h-[44px] sm:min-h-auto">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Connected to </span>Facebook
                  </Badge>
                ) : (
                  <Button 
                    onClick={() => setIsConnected(true)}
                    className="bg-white text-blue-600 hover:bg-gray-50 transition-colors min-h-[44px] sm:min-h-auto"
                  >
                    <Facebook className="w-4 h-4 mr-1 sm:mr-2" />
                    Connect<span className="hidden sm:inline"> Facebook Page</span>
                  </Button>
                )}
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-200 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-blue-200 truncate">Total Subscribers</p>
                    <p className="text-xl sm:text-2xl font-bold">{subscribers.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-purple-200 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-purple-200 truncate">Connected Pages</p>
                    <p className="text-xl sm:text-2xl font-bold">{pages.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-200 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-indigo-200 truncate">Unique Labels</p>
                    <p className="text-xl sm:text-2xl font-bold">{uniqueLabels.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Subscribers Section */}
            <Card className="xl:col-span-2 shadow-xl border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white flex-shrink-0">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-lg sm:text-xl truncate">Subscriber Management</CardTitle>
                      <CardDescription className="text-gray-600 text-sm hidden sm:block">
                        View and manage your messenger subscribers
                      </CardDescription>
                    </div>
                  </div>
                  
                  {selectedPage && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs sm:text-sm self-start sm:self-auto">
                      <span className="truncate max-w-[150px] sm:max-w-none">
                        {pages.find(p => p.page_id === selectedPage)?.page_name || 'Selected Page'}
                      </span>
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                {/* Filters */}
                <div className="flex flex-col gap-4 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg sm:rounded-xl border border-blue-100">
                  <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Facebook Page</Label>
                      <Select value={selectedPage} onValueChange={setSelectedPage}>
                                                <SelectTrigger className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400 h-11">
                          <SelectValue placeholder="Select Facebook page">
                            {selectedPage && pages.find(p => p.page_id === selectedPage)?.page_name}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {pages.map(page => (
                            <SelectItem 
                              key={page.page_id} 
                              value={page.page_id}
                              className="flex items-center gap-2"
                            >
                              <div className="flex items-center gap-2">
                                {page.picture && (
                                  <img 
                                    src={page.picture} 
                                    alt={page.page_name} 
                                    className="w-5 h-5 rounded-full"
                                  />
                                )}
                                {page.page_name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Filter by Label</Label>
                      <Select value={selectedLabel} onValueChange={handleLabelChange}>
                        <SelectTrigger className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400 h-11">
                          <SelectValue placeholder="All labels" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Labels</SelectItem>
                          {uniqueLabels.map(label => (
                            <SelectItem key={label} value={label}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                    
                  <div className="flex items-center justify-center sm:justify-start">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 sm:px-4 py-2 text-xs sm:text-sm">
                      {subscribers.length} subscribers
                    </Badge>
                  </div>
                </div>

                              {/* Data Table */}
                <div className="border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <DataTable 
                      columns={columns} 
                      data={subscribers}
                      loading={loading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Broadcast Form */}
            <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg text-white flex-shrink-0">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-lg sm:text-xl truncate">Create Broadcast</CardTitle>
                    <CardDescription className="text-gray-600 text-sm hidden sm:block">
                      Send targeted messages to your audience
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <form className="space-y-4 sm:space-y-6" onSubmit={(e) => { e.preventDefault(); handleBroadcastSend(); }}>
                  {/* Page Selection */}
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="page" className="text-sm font-medium text-gray-700">Facebook Page</Label>
                    <Select value={selectedPage} onValueChange={setSelectedPage}>
                      <SelectTrigger className="bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400 h-11">
                        <SelectValue placeholder="Select a page">
                          {selectedPage && pages.find(p => p.page_id === selectedPage)?.page_name}
                        </SelectValue>
                      </SelectTrigger>
                    <SelectContent>
                      {pages.map(page => (
                        <SelectItem 
                          key={page.page_id} 
                          value={page.page_id}
                          className="flex items-center gap-2"
                        >
                          <div className="flex items-center gap-2">
                            {page.picture && (
                              <img 
                                src={page.picture} 
                                alt={page.page_name} 
                                className="w-5 h-5 rounded-full"
                              />
                            )}
                            {page.page_name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                                        </Select>
                      {selectedPage && (
                        <div className="p-2 sm:p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <p className="text-xs sm:text-sm text-purple-700 flex items-center gap-2">
                            <Facebook className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="truncate">
                              Broadcasting as <span className="font-medium">{pages.find(p => p.page_id === selectedPage)?.page_name}</span>
                            </span>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Label Selection */}
                    <div className="space-y-2 sm:space-y-3">
                      <Label htmlFor="label" className="text-sm font-medium text-gray-700">Target Audience</Label>
                      <Select value={selectedLabel} onValueChange={setSelectedLabel}>
                        <SelectTrigger className="bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400 h-11">
                          <SelectValue placeholder="Select label" />
                        </SelectTrigger>
                        <SelectContent>
                          {uniqueLabels.map(label => (
                            <SelectItem key={label} value={label}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedLabel && (
                        <div className="p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs sm:text-sm text-blue-700 flex items-center gap-2">
                            <Target className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="truncate">
                              Targeting <span className="font-medium">{subscribers.filter(s => s.label === selectedLabel).length}</span> subscribers with label "{selectedLabel}"
                            </span>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Message */}
                    <div className="space-y-2 sm:space-y-3">
                      <Label htmlFor="message" className="text-sm font-medium text-gray-700">Broadcast Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Craft your message to engage your audience..."
                        value={broadcastMessage}
                        onChange={(e) => setBroadcastMessage(e.target.value)}
                        rows={4}
                        className="bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400 resize-none min-h-[100px]"
                      />
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 text-xs sm:text-sm">
                        <span className="text-gray-500">
                          {broadcastMessage.length} characters
                        </span>
                        {broadcastMessage.length > 1000 && (
                          <span className="text-amber-600 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span className="text-xs sm:text-sm">Long messages may be truncated</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Send Button */}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 sm:py-4 h-12 sm:h-auto transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                      disabled={loading || !selectedPage || !broadcastMessage}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                          <span className="hidden sm:inline">Sending Broadcast...</span>
                          <span className="sm:hidden">Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          <span className="hidden sm:inline">Send Broadcast</span>
                          <span className="sm:hidden">Send</span>
                        </>
                      )}
                    </Button>
              </form>
            </CardContent>
          </Card>
        </div>

                  {/* Guidelines Section */}
          <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
            <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-1 flex-shrink-0" />
            <div className="ml-2 sm:ml-0">
              <AlertTitle className="text-blue-800 font-semibold text-sm sm:text-base">
                📋 Broadcast Guidelines & Best Practices
              </AlertTitle>
              <AlertDescription className="text-blue-700 mt-2 space-y-2 text-xs sm:text-sm">
                <p>
                  <strong>Compliance:</strong> According to Facebook's Messenger Platform Policy, businesses can send standard messages to subscribers at any time, but promotional messages must be sent within 24 hours of the last user interaction.
                </p>
                <p>
                  <strong>Best Practices:</strong> Keep messages personal, valuable, and relevant. Avoid excessive frequency and always provide clear opt-out options to maintain subscriber trust.
                </p>
              </AlertDescription>
            </div>
          </Alert>
        </div>
      </div>
    );
}

export default MessengerBroadcastPage; 