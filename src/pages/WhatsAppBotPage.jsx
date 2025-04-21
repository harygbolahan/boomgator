import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Users, Bot, MessageCircle, Play, PauseCircle, Settings, CheckCircle, AlertTriangle, Clock, Smartphone, Loader2 } from "lucide-react";

export function WhatsAppBotPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Bot settings state
  const [botSettings, setBotSettings] = useState({
    name: "Main Support Bot",
    isActive: true,
    welcomeMessage: "Hello! Welcome to our WhatsApp support. How can I help you today?",
    responseDelay: "instant",
    collectUserData: true,
    notifyEmail: "support@example.com"
  });

  // Message templates state
  const [templates, setTemplates] = useState([
    {
      id: "template1",
      name: "Welcome Message",
      content: "Hello {{name}}! Thank you for contacting us. Our team will respond shortly.",
      isActive: true,
      triggers: ["welcome", "initial"]
    },
    {
      id: "template2",
      name: "Support Request",
      content: "We've received your support request (#{{requestId}}). A team member will assist you soon.",
      isActive: true,
      triggers: ["support"]
    },
    {
      id: "template3",
      name: "Order Confirmation",
      content: "Your order #{{orderId}} has been confirmed! It will ship within 2 business days.",
      isActive: true,
      triggers: ["order"]
    }
  ]);

  // Metrics and stats
  const metrics = {
    totalMessages: 1248,
    activeChats: 37,
    responseRate: 93,
    avgResponseTime: "5 minutes",
    messagesLastWeek: 342
  };

  // Mock conversations
  const [conversations, setConversations] = useState([
    {
      id: "conv1",
      contact: {
        name: "John Doe",
        phone: "+1234567890",
        avatar: "https://ui-avatars.com/api/?name=John+Doe"
      },
      lastMessage: "Thanks for the quick response!",
      lastMessageTime: "10:25 AM",
      unread: 0,
      status: "active"
    },
    {
      id: "conv2",
      contact: {
        name: "Sarah Williams",
        phone: "+0987654321",
        avatar: "https://ui-avatars.com/api/?name=Sarah+Williams"
      },
      lastMessage: "Can you help me track my order?",
      lastMessageTime: "Yesterday",
      unread: 2,
      status: "active"
    },
    {
      id: "conv3",
      contact: {
        name: "Mike Johnson",
        phone: "+1122334455",
        avatar: "https://ui-avatars.com/api/?name=Mike+Johnson"
      },
      lastMessage: "I'd like to request a refund for my purchase.",
      lastMessageTime: "2 days ago",
      unread: 0,
      status: "closed"
    }
  ]);

  const handleConnectWhatsApp = () => {
    setIsConnecting(true);
    
    // Simulate API connection
    setTimeout(() => {
      setWhatsappConnected(true);
      setIsConnecting(false);
    }, 2000);
  };

  const handleBotSettingChange = (field, value) => {
    setBotSettings({
      ...botSettings,
      [field]: value
    });
  };

  const handleSaveSettings = () => {
    setSaveLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaveLoading(false);
    }, 1500);
  };

  const handleTemplateChange = (id, field, value) => {
    setTemplates(templates.map(template => 
      template.id === id ? { ...template, [field]: value } : template
    ));
  };

  const handleRefreshConversations = () => {
    setIsRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">WhatsApp Bot Automation</h1>
          <p className="text-muted-foreground">
            Automate customer interactions on WhatsApp with customizable bot responses
          </p>
        </div>
        
        <div>
          {whatsappConnected ? (
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Connected
              </Badge>
              <span className="text-sm text-muted-foreground">Business Account: +1-800-555-0123</span>
            </div>
          ) : (
            <Button onClick={handleConnectWhatsApp} disabled={isConnecting}>
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4 mr-2" />
                  Connect WhatsApp Business
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted w-full justify-start border-b rounded-none h-auto p-0">
          <TabsTrigger 
            value="overview" 
            className={`data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-3 font-medium`}
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="conversations" 
            className={`data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-3 font-medium`}
          >
            Conversations
          </TabsTrigger>
          <TabsTrigger 
            value="templates" 
            className={`data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-3 font-medium`}
          >
            Message Templates
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className={`data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-3 font-medium`}
          >
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {!whatsappConnected ? (
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Connect WhatsApp Business Account</CardTitle>
                <CardDescription>
                  Connect your WhatsApp Business account to start automating customer communications
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4 pb-6">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Smartphone className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-center max-w-md">
                  The WhatsApp Business API allows your business to communicate with customers on WhatsApp in an automated way.
                </p>
                <Button onClick={handleConnectWhatsApp} disabled={isConnecting} size="lg">
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Phone className="w-4 h-4 mr-2" />
                      Connect WhatsApp Business
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Messages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{metrics.totalMessages.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      +{metrics.messagesLastWeek} last week
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Active Conversations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{metrics.activeChats}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Currently being managed
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Response Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{metrics.responseRate}%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Messages responded to
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Avg. Response Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{metrics.avgResponseTime}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Time to first response
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Recent Conversations</CardTitle>
                    <CardDescription>
                      Latest customer interactions via WhatsApp
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {conversations.slice(0, 3).map((conversation) => (
                        <div key={conversation.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img 
                              src={conversation.contact.avatar} 
                              alt={conversation.contact.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div className="font-medium">{conversation.contact.name}</div>
                              <div className="text-xs text-muted-foreground">{conversation.lastMessageTime}</div>
                            </div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {conversation.lastMessage}
                            </div>
                          </div>
                          {conversation.unread > 0 && (
                            <div className="w-5 h-5 bg-primary rounded-full text-xs flex items-center justify-center text-primary-foreground">
                              {conversation.unread}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab("conversations")}>
                        View All Conversations
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Bot Status</CardTitle>
                    <CardDescription>
                      Current WhatsApp bot configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{botSettings.name}</h4>
                          <p className="text-xs text-muted-foreground">WhatsApp Business Bot</p>
                        </div>
                        <div>
                          {botSettings.isActive ? (
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Active Templates:</span>
                          <span className="text-sm font-medium">{templates.filter(t => t.isActive).length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Response Delay:</span>
                          <span className="text-sm font-medium capitalize">{botSettings.responseDelay}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Collect User Data:</span>
                          <span className="text-sm font-medium">{botSettings.collectUserData ? "Yes" : "No"}</span>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t flex gap-2">
                        {botSettings.isActive ? (
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            onClick={() => handleBotSettingChange("isActive", false)}
                          >
                            <PauseCircle className="w-4 h-4 mr-2" />
                            Pause Bot
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            onClick={() => handleBotSettingChange("isActive", true)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Activate Bot
                          </Button>
                        )}
                        <Button 
                          variant="default" 
                          className="w-full" 
                          onClick={() => setActiveTab("settings")}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Conversations Tab */}
        <TabsContent value="conversations" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>WhatsApp Conversations</CardTitle>
                <CardDescription>
                  Manage and monitor all your WhatsApp customer conversations
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleRefreshConversations} disabled={isRefreshing}>
                {isRefreshing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Refresh"
                )}
              </Button>
            </CardHeader>
            <CardContent>
              {whatsappConnected ? (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Contact</th>
                          <th className="text-left py-3 px-4 font-medium">Last Message</th>
                          <th className="text-left py-3 px-4 font-medium">Time</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                          <th className="text-right py-3 px-4 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {conversations.map((conversation) => (
                          <tr key={conversation.id} className="hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full overflow-hidden">
                                  <img 
                                    src={conversation.contact.avatar} 
                                    alt={conversation.contact.name} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-medium">{conversation.contact.name}</div>
                                  <div className="text-xs text-muted-foreground">{conversation.contact.phone}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-sm truncate max-w-xs">{conversation.lastMessage}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-sm">{conversation.lastMessageTime}</div>
                            </td>
                            <td className="py-3 px-4">
                              {conversation.status === "active" ? (
                                <Badge className="bg-green-100 text-green-800">Active</Badge>
                              ) : (
                                <Badge className="bg-gray-100 text-gray-800">Closed</Badge>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button variant="ghost" size="sm">View</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No WhatsApp Connection</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-4">
                    Connect your WhatsApp Business account to view and manage conversations.
                  </p>
                  <Button onClick={handleConnectWhatsApp} disabled={isConnecting}>
                    {isConnecting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Phone className="w-4 h-4 mr-2" />
                        Connect WhatsApp Business
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Message Templates</CardTitle>
              <CardDescription>
                Create and manage templates for automated WhatsApp responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {whatsappConnected ? (
                <div className="space-y-6">
                  {templates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{template.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex flex-wrap gap-1">
                              {template.triggers.map((trigger, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {trigger}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Switch
                              checked={template.isActive}
                              onCheckedChange={(checked) => handleTemplateChange(template.id, "isActive", checked)}
                              id={`active-${template.id}`}
                            />
                            <Label htmlFor={`active-${template.id}`} className="ml-2">
                              {template.isActive ? "Active" : "Inactive"}
                            </Label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm">{template.content}</p>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button className="w-full">
                    <span className="mr-2">+</span> Add New Template
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No WhatsApp Connection</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-4">
                    Connect your WhatsApp Business account to create and manage message templates.
                  </p>
                  <Button onClick={handleConnectWhatsApp} disabled={isConnecting}>
                    {isConnecting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Phone className="w-4 h-4 mr-2" />
                        Connect WhatsApp Business
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Bot Settings</CardTitle>
              <CardDescription>
                Configure your WhatsApp Business API bot settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {whatsappConnected ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="bot-name">Bot Name</Label>
                      <Input
                        id="bot-name"
                        value={botSettings.name}
                        onChange={(e) => handleBotSettingChange("name", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="response-delay">Response Delay</Label>
                      <Select
                        value={botSettings.responseDelay}
                        onValueChange={(value) => handleBotSettingChange("responseDelay", value)}
                      >
                        <SelectTrigger id="response-delay">
                          <SelectValue placeholder="Select response delay" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instant">Instant</SelectItem>
                          <SelectItem value="15s">15 seconds</SelectItem>
                          <SelectItem value="30s">30 seconds</SelectItem>
                          <SelectItem value="1m">1 minute</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="welcome-message">Welcome Message</Label>
                    <Textarea
                      id="welcome-message"
                      value={botSettings.welcomeMessage}
                      onChange={(e) => handleBotSettingChange("welcomeMessage", e.target.value)}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      This message will be sent automatically when a new conversation starts.
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="collect-data"
                      checked={botSettings.collectUserData}
                      onCheckedChange={(checked) => handleBotSettingChange("collectUserData", checked)}
                    />
                    <Label htmlFor="collect-data">Collect User Data (Name & Email)</Label>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="notify-email">Notification Email</Label>
                    <Input
                      id="notify-email"
                      type="email"
                      value={botSettings.notifyEmail}
                      onChange={(e) => handleBotSettingChange("notifyEmail", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Receive email notifications when human intervention is needed.
                    </p>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleSaveSettings} disabled={saveLoading}>
                      {saveLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Settings className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No WhatsApp Connection</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-4">
                    Connect your WhatsApp Business account to configure bot settings.
                  </p>
                  <Button onClick={handleConnectWhatsApp} disabled={isConnecting}>
                    {isConnecting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Phone className="w-4 h-4 mr-2" />
                        Connect WhatsApp Business
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default WhatsAppBotPage; 