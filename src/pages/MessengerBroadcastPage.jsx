import { useState } from "react";
import { MessengerBroadcast } from "@/components/MessengerBroadcast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Facebook, AlertCircle, CheckCircle, Info } from "lucide-react";

export function MessengerBroadcastPage() {
  const [isConnected, setIsConnected] = useState(true);
  const [recentBroadcast, setRecentBroadcast] = useState(null);
  const [activeTab, setActiveTab] = useState("broadcast");
  
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

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Facebook Messenger Broadcasts</h1>
          <p className="text-muted-foreground">
            Send targeted messages to your Facebook Messenger subscribers
          </p>
        </div>
        
        <div className="flex items-center">
          {isConnected ? (
            <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>Connected to Facebook</span>
            </Badge>
          ) : (
            <Button onClick={() => setIsConnected(true)}>
              <Facebook className="w-4 h-4 mr-2" />
              Connect Facebook Page
            </Button>
          )}
        </div>
      </div>

      {!isConnected ? (
        <Card>
          <CardHeader>
            <CardTitle>Connect Your Facebook Page</CardTitle>
            <CardDescription>
              Connect your Facebook Page to send broadcasts to your Messenger subscribers
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-6">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Facebook className="w-10 h-10" />
            </div>
            <p className="text-center max-w-md mb-6">
              Facebook Messenger broadcasting allows you to send messages to people who have previously interacted with your Facebook Page through Messenger.
            </p>
            <Button size="lg" onClick={() => setIsConnected(true)}>
              <Facebook className="w-4 h-4 mr-2" />
              Connect Facebook Page
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="broadcast">
              {recentBroadcast && (
                <Alert className="mb-6 bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Broadcast {recentBroadcast.status === "Scheduled" ? "Scheduled" : "Sent"} Successfully</AlertTitle>
                  <AlertDescription className="text-green-700">
                    {recentBroadcast.status === "Scheduled" 
                      ? `Your broadcast has been scheduled for ${new Date(recentBroadcast.sentAt).toLocaleDateString()} at ${new Date(recentBroadcast.sentAt).toLocaleTimeString()}.` 
                      : `Your broadcast has been sent to ${recentBroadcast.audienceSize} subscribers.`}
                  </AlertDescription>
                </Alert>
              )}
              
              <MessengerBroadcast onBroadcastSend={handleBroadcastSend} />
            </TabsContent>
            
            <TabsContent value="analytics">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Subscribers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats.totalSubscribers.toLocaleString()}</div>
                      <p className="text-xs text-green-600 mt-1">
                        +{stats.newSubscribers} in the last 30 days
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Average Open Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats.openRate}%</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Industry avg: 22.1%
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Average Click Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats.clickRate}%</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Industry avg: 9.6%
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Message Delivery Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats.reachRate}%</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Successfully delivered messages
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Analytics Dashboard</AlertTitle>
                  <AlertDescription>
                    The full analytics dashboard is currently in development. This will include detailed performance metrics, subscriber growth trends, and engagement data.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Messenger Broadcast Settings</CardTitle>
                  <CardDescription>
                    Configure your Facebook Messenger broadcast preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Connected Account</h3>
                    <div className="bg-muted p-4 rounded-lg flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
                          <Facebook className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-medium">Business Page Name</p>
                          <p className="text-sm text-muted-foreground">facebook.com/yourbusinesspage</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Disconnect</Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Message Settings</h3>
                    <Alert className="bg-yellow-50 border-yellow-200">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertTitle className="text-yellow-800">Facebook Messenger Policy Update</AlertTitle>
                      <AlertDescription className="text-yellow-700">
                        According to Facebook's Messenger Platform Policy, businesses can send standard messages to subscribers at any time, but promotional messages must be sent within 24 hours of the last user interaction.
                      </AlertDescription>
                    </Alert>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Subscriber Management</h3>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Your subscriber list is automatically maintained based on user interactions with your Facebook Page. Users who message your Page are automatically added as subscribers.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Users can unsubscribe at any time by sending "stop" or by blocking your Page on Messenger.
                      </p>
                      <Button variant="outline">Export Subscriber List</Button>
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