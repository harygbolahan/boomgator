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
import { Facebook, AlertCircle, CheckCircle, Info, Trash2, Send, Users, MessageSquare, Loader2, RefreshCw } from "lucide-react";
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
      header: "Name"
    },
    {
      accessorKey: "label",
      header: "Label"
    },
    {
      accessorKey: "created_at",
      header: "Subscribed Date",
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString()
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDeleteSubscriber(row.original.id)}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      )
    }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messenger Broadcasts</h1>
          <p className="text-muted-foreground">
            Manage your subscribers and send targeted broadcasts
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          {isConnected ? (
            <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Connected to Facebook
            </Badge>
          ) : (
            <Button onClick={() => setIsConnected(true)}>
              <Facebook className="w-4 h-4 mr-2" />
              Connect Facebook Page
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Subscribers {selectedPage && (
                <span className="text-sm font-normal text-muted-foreground">
                  for {pages.find(p => p.page_id === selectedPage)?.page_name || 'Selected Page'}
                </span>
              )}
            </CardTitle>
            <CardDescription>
              Manage your messenger subscribers and their labels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 flex items-center gap-4">
                  <Select value={selectedPage} onValueChange={setSelectedPage}>
                    <SelectTrigger className="w-[250px]">
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

                  <Select value={selectedLabel} onValueChange={handleLabelChange}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by label" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Labels</SelectItem>
                      {uniqueLabels.map(label => (
                        <SelectItem key={label} value={label}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Badge variant="secondary">
                  {subscribers.length} subscribers
                </Badge>
              </div>

              <DataTable 
                columns={columns} 
                data={subscribers}
                loading={loading}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              New Broadcast
            </CardTitle>
            <CardDescription>
              Send a new broadcast message to your subscribers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleBroadcastSend(); }}>
              <div className="space-y-2">
                <Label htmlFor="page">Facebook Page</Label>
                <Select value={selectedPage} onValueChange={setSelectedPage}>
                  <SelectTrigger>
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
                  <p className="text-sm text-muted-foreground mt-1">
                    Broadcasting as {pages.find(p => p.page_id === selectedPage)?.page_name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="label">Target Label</Label>
                <Select value={selectedLabel} onValueChange={setSelectedLabel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select label" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueLabels.map(label => (
                      <SelectItem key={label} value={label}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedLabel && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Targeting {subscribers.filter(s => s.label === selectedLabel).length} subscribers with label "{selectedLabel}"
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your broadcast message..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  rows={4}
                />
                <p className="text-sm text-muted-foreground">
                  {broadcastMessage.length} characters
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !selectedPage || !broadcastMessage}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Broadcast
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Broadcast Guidelines</AlertTitle>
        <AlertDescription>
          According to Facebook's Messenger Platform Policy, businesses can send standard messages to subscribers at any time, but promotional messages must be sent within 24 hours of the last user interaction.
        </AlertDescription>
      </Alert>
    </div>
  );
}

export default MessengerBroadcastPage; 