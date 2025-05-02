import { useState } from "react";
import { MessengerBroadcast } from "@/components/MessengerBroadcast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Facebook, AlertCircle, CheckCircle, Info, Users, Calendar, Clock, Send, History } from "lucide-react";

export function MessengerBroadcastPage() {
  const [isConnected, setIsConnected] = useState(true);
  const [recentBroadcast, setRecentBroadcast] = useState(null);
  const [activeTab, setActiveTab] = useState("broadcast");
  const [broadcastSubTab, setBroadcastSubTab] = useState("compose");
  
  // Statistics for the dashboard
  const stats = {
    totalSubscribers: 1250,
    newSubscribers: 67,
    openRate: 28.4,
    clickRate: 12.7,
    reachRate: 94.3
  };

  const handleBroadcastSend = (broadcastData) => {
    setRecentBroadcast(broadcastData);
    
    // In a real app, this would call an API to send the broadcast
    console.log("Broadcasting message:", broadcastData);
  };

  // Sample audience segments for the audience tab
  const audienceSegments = [
    { id: 1, name: "All Subscribers", count: 1250, description: "Everyone who has messaged your page" },
    { id: 2, name: "Active Users", count: 843, description: "Users who engaged in the last 30 days" },
    { id: 3, name: "New Subscribers", count: 67, description: "Users who subscribed in the last 7 days" }
  ];

  // Sample scheduled broadcasts
  const scheduledBroadcasts = [
    { id: 1, title: "Weekend Promotion", scheduledFor: "2023-11-12T10:00:00", audience: "All Subscribers", status: "scheduled" },
    { id: 2, title: "Product Launch", scheduledFor: "2023-11-15T14:30:00", audience: "Active Users", status: "scheduled" }
  ];

  // Sample broadcast history
  const broadcastHistory = [
    { id: 1, title: "Weekly Newsletter", sentAt: "2023-11-01T10:00:00", audience: "All Subscribers", opened: 680, clicked: 325 },
    { id: 2, title: "Flash Sale", sentAt: "2023-10-25T14:30:00", audience: "Active Users", opened: 412, clicked: 210 }
  ];

  return (
    <div className="container mx-auto py-4 px-3 sm:px-6 sm:py-6 max-w-[350px] sm:max-w-none">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 break-words">Facebook Messenger Broadcasts</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Send targeted messages to your Facebook Messenger subscribers
          </p>
        </div>
        
        <div className="flex items-center mt-2 sm:mt-0">
          {isConnected ? (
            <Badge className="bg-green-100 text-green-800 flex items-center gap-1 text-xs sm:text-sm py-1.5 px-3 rounded-full">
              <CheckCircle className="w-3 h-3" />
              <span>Connected to Facebook</span>
            </Badge>
          ) : (
            <Button onClick={() => setIsConnected(true)} size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
              <Facebook className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Connect Facebook Page
            </Button>
          )}
        </div>
      </div>

      {!isConnected ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Connect Your Facebook Page</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Connect your Facebook Page to send broadcasts to your Messenger subscribers
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-4 sm:py-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Facebook className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <p className="text-center text-sm sm:text-base max-w-md mb-4 sm:mb-6">
              Facebook Messenger broadcasting allows you to send messages to people who have previously interacted with your Facebook Page through Messenger.
            </p>
            <Button size="sm" sm:size="lg" onClick={() => setIsConnected(true)}>
              <Facebook className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Connect Facebook Page
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b mb-4 sm:mb-6">
              <TabsList className="w-full flex flex-wrap justify-start p-0 h-auto bg-transparent">
                <TabsTrigger 
                  value="broadcast" 
                  className="text-xs sm:text-sm py-2 px-3 sm:px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
                >
                  Broadcast
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="text-xs sm:text-sm py-2 px-3 sm:px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
                >
                  Analytics
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="text-xs sm:text-sm py-2 px-3 sm:px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
                >
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="broadcast">
              {recentBroadcast && (
                <Alert className="mb-4 sm:mb-6 bg-green-50 border-green-200">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  <AlertTitle className="text-green-800 text-sm sm:text-base">Broadcast {recentBroadcast.status === "Scheduled" ? "Scheduled" : "Sent"} Successfully</AlertTitle>
                  <AlertDescription className="text-green-700 text-xs sm:text-sm">
                    {recentBroadcast.status === "Scheduled" 
                      ? `Your broadcast has been scheduled for ${new Date(recentBroadcast.sentAt).toLocaleDateString()} at ${new Date(recentBroadcast.sentAt).toLocaleTimeString()}.` 
                      : `Your broadcast has been sent to ${recentBroadcast.audienceSize} subscribers.`}
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Broadcast sub-navigation */}
              <div className="mb-6">
                <div className="mb-4 flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`flex items-center gap-2 rounded-full ${broadcastSubTab === 'compose' ? 'bg-black text-white hover:bg-black' : ''}`}
                    onClick={() => setBroadcastSubTab("compose")}
                  >
                    <Send className="w-4 h-4" />
                    Compose Broadcast
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`flex items-center gap-2 rounded-full ${broadcastSubTab === 'audience' ? 'bg-black text-white hover:bg-black' : ''}`}
                    onClick={() => setBroadcastSubTab("audience")}
                  >
                    <Users className="w-4 h-4" />
                    Audience
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`flex items-center gap-2 rounded-full ${broadcastSubTab === 'schedule' ? 'bg-black text-white hover:bg-black' : ''}`}
                    onClick={() => setBroadcastSubTab("schedule")}
                  >
                    <Calendar className="w-4 h-4" />
                    Schedule
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`flex items-center gap-2 rounded-full ${broadcastSubTab === 'history' ? 'bg-black text-white hover:bg-black' : ''}`}
                    onClick={() => setBroadcastSubTab("history")}
                  >
                    <History className="w-4 h-4" />
                    Broadcast History
                  </Button>
                </div>

                {/* Compose Broadcast Tab */}
                {broadcastSubTab === "compose" && (
                  <MessengerBroadcast onBroadcastSend={handleBroadcastSend} />
                )}

                {/* Audience Tab */}
                {broadcastSubTab === "audience" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg sm:text-xl font-semibold">Audience Segments</h2>
                      <Button size="sm" variant="outline" className="text-xs sm:text-sm">
                        Create Segment
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {audienceSegments.map(segment => (
                        <Card key={segment.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-base sm:text-lg">{segment.name}</CardTitle>
                              <Badge variant="outline" className="text-xs">{segment.count} subscribers</Badge>
                            </div>
                            <CardDescription className="text-xs sm:text-sm">
                              {segment.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" className="text-xs sm:text-sm">Edit</Button>
                              <Button size="sm" variant="default" className="text-xs sm:text-sm">
                                <Send className="w-3 h-3 mr-1" />
                                Send Broadcast
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Schedule Tab */}
                {broadcastSubTab === "schedule" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg sm:text-xl font-semibold">Scheduled Broadcasts</h2>
                      <Button size="sm" variant="outline" className="text-xs sm:text-sm">
                        <Calendar className="w-3 h-3 mr-1" />
                        Schedule New
                      </Button>
                    </div>
                    
                    {scheduledBroadcasts.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4">
                        {scheduledBroadcasts.map(broadcast => (
                          <Card key={broadcast.id}>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-base sm:text-lg">{broadcast.title}</CardTitle>
                                <Badge className="bg-blue-100 text-blue-800 text-xs">Scheduled</Badge>
                              </div>
                              <CardDescription className="text-xs sm:text-sm">
                                Scheduled for {new Date(broadcast.scheduledFor).toLocaleDateString()} at {new Date(broadcast.scheduledFor).toLocaleTimeString()}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="flex items-center justify-between">
                                <div className="text-xs sm:text-sm text-muted-foreground">
                                  Audience: <span className="font-medium">{broadcast.audience}</span>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" className="text-xs sm:text-sm">Edit</Button>
                                  <Button size="sm" variant="destructive" className="text-xs sm:text-sm">Cancel</Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="py-6 text-center">
                          <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                          <p className="text-sm font-medium mb-2">No scheduled broadcasts</p>
                          <p className="text-xs text-muted-foreground mb-4">
                            Schedule a broadcast to send it at the perfect time for your audience.
                          </p>
                          <Button size="sm" className="text-xs sm:text-sm">
                            Schedule a Broadcast
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* Broadcast History Tab */}
                {broadcastSubTab === "history" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg sm:text-xl font-semibold">Broadcast History</h2>
                      <Button size="sm" variant="outline" className="text-xs sm:text-sm">
                        Export Data
                      </Button>
                    </div>
                    
                    {broadcastHistory.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4">
                        {broadcastHistory.map(broadcast => (
                          <Card key={broadcast.id}>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-base sm:text-lg">{broadcast.title}</CardTitle>
                                <Badge className="bg-green-100 text-green-800 text-xs">Sent</Badge>
                              </div>
                              <CardDescription className="text-xs sm:text-sm">
                                Sent on {new Date(broadcast.sentAt).toLocaleDateString()} at {new Date(broadcast.sentAt).toLocaleTimeString()}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="flex items-center justify-between">
                                <div className="text-xs sm:text-sm text-muted-foreground">
                                  Audience: <span className="font-medium">{broadcast.audience}</span>
                                </div>
                                <div className="flex gap-4">
                                  <div className="text-xs flex flex-col items-center">
                                    <span className="font-semibold text-sm">{broadcast.opened}</span>
                                    <span className="text-muted-foreground">Opened</span>
                                  </div>
                                  <div className="text-xs flex flex-col items-center">
                                    <span className="font-semibold text-sm">{broadcast.clicked}</span>
                                    <span className="text-muted-foreground">Clicked</span>
                                  </div>
                                  <Button size="sm" variant="outline" className="text-xs sm:text-sm">View Details</Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="py-6 text-center">
                          <History className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                          <p className="text-sm font-medium mb-2">No broadcast history</p>
                          <p className="text-xs text-muted-foreground mb-4">
                            Your sent broadcasts will appear here.
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 gap-3 sm:gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                        Total Subscribers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl sm:text-3xl font-bold">{stats.totalSubscribers.toLocaleString()}</div>
                      <p className="text-xs text-green-600 mt-1">
                        +{stats.newSubscribers} in the last 30 days
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                        Average Open Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl sm:text-3xl font-bold">{stats.openRate}%</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Industry avg: 22.1%
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                        Average Click Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl sm:text-3xl font-bold">{stats.clickRate}%</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Industry avg: 9.6%
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                        Message Delivery Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl sm:text-3xl font-bold">{stats.reachRate}%</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Successfully delivered messages
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <Alert>
                  <Info className="h-3 w-3 sm:h-4 sm:w-4" />
                  <AlertTitle className="text-sm sm:text-base">Analytics Dashboard</AlertTitle>
                  <AlertDescription className="text-xs sm:text-sm">
                    The full analytics dashboard is currently in development. This will include detailed performance metrics, subscriber growth trends, and engagement data.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Messenger Broadcast Settings</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Configure your Facebook Messenger broadcast preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Connected Account</h3>
                    <div className="bg-muted p-3 sm:p-4 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
                          <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div>
                          <p className="font-medium text-sm sm:text-base">Business Page Name</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">facebook.com/yourbusinesspage</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">Disconnect</Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Message Settings</h3>
                    <Alert className="bg-yellow-50 border-yellow-200">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />
                      <AlertTitle className="text-yellow-800 text-sm sm:text-base">Facebook Messenger Policy Update</AlertTitle>
                      <AlertDescription className="text-yellow-700 text-xs sm:text-sm">
                        According to Facebook's Messenger Platform Policy, businesses can send standard messages to subscribers at any time, but promotional messages must be sent within 24 hours of the last user interaction.
                      </AlertDescription>
                    </Alert>
                  </div>
                  
                  <div>
                    <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Subscriber Management</h3>
                    <div className="space-y-3 sm:space-y-4">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Your subscriber list is automatically maintained based on user interactions with your Facebook Page. Users who message your Page are automatically added as subscribers.
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Users can unsubscribe at any time by sending "stop" or by blocking your Page on Messenger.
                      </p>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">Export Subscriber List</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

export default MessengerBroadcastPage; 