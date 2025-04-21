import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ChevronDown, Clock, Eye, ImagePlus, Link2, Send, Smile, Loader2, Check, CalendarClock, Users } from "lucide-react";
import { format } from "date-fns";

export function MessengerBroadcast({ onBroadcastSend }) {
  const [activeTab, setActiveTab] = useState("compose");
  const [messageText, setMessageText] = useState("");
  const [messageTitle, setMessageTitle] = useState("");
  const [includeImage, setIncludeImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [includeButton, setIncludeButton] = useState(false);
  const [buttonText, setButtonText] = useState("");
  const [buttonUrl, setButtonUrl] = useState("");
  const [audienceSegment, setAudienceSegment] = useState("all");
  const [audienceSize, setAudienceSize] = useState(1250); // Mock audience size
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [scheduledTime, setScheduledTime] = useState("12:00");
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // Audience segments for demonstration
  const audienceSegments = [
    { id: "all", name: "All Subscribers", count: 1250 },
    { id: "active", name: "Active Subscribers (Last 30 Days)", count: 873 },
    { id: "new", name: "New Subscribers (Last 7 Days)", count: 126 },
    { id: "inactive", name: "Inactive Subscribers (90+ Days)", count: 347 },
    { id: "engaged", name: "Highly Engaged", count: 512 },
    { id: "custom", name: "Custom Segment", count: 678 }
  ];
  
  // Previous broadcasts for history
  const [broadcasts, setBroadcasts] = useState([
    {
      id: "b1",
      title: "Summer Sale Announcement",
      message: "Don't miss our summer sale! Up to 50% off on all products for a limited time.",
      sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      audience: "All Subscribers",
      audienceSize: 1243,
      opens: 756,
      clicks: 423,
      status: "Completed"
    },
    {
      id: "b2",
      title: "New Product Launch",
      message: "We're excited to announce our new product! Check it out now.",
      sentAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
      audience: "Active Subscribers",
      audienceSize: 865,
      opens: 612,
      clicks: 348,
      status: "Completed"
    },
    {
      id: "b3",
      title: "Welcome to Our Community",
      message: "Thank you for joining our community! Here's what you can expect...",
      sentAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days in future
      audience: "New Subscribers",
      audienceSize: 130,
      status: "Scheduled"
    }
  ]);
  
  const handleSendBroadcast = () => {
    // Validate the form
    if (!messageText.trim()) {
      setError("Please enter a message");
      return;
    }
    
    setIsSending(true);
    setError(null);
    
    // Simulate sending the broadcast
    setTimeout(() => {
      try {
        // In a real app, this would call your API to send or schedule the broadcast
        
        // Create a new broadcast record
        const newBroadcast = {
          id: `b${Date.now()}`,
          title: messageTitle || "Broadcast",
          message: messageText,
          sentAt: isScheduled ? new Date(`${format(scheduledDate, "yyyy-MM-dd")}T${scheduledTime}`) : new Date(),
          audience: audienceSegments.find(s => s.id === audienceSegment)?.name || "All Subscribers",
          audienceSize: audienceSegments.find(s => s.id === audienceSegment)?.count || 0,
          status: isScheduled ? "Scheduled" : "Completed",
          opens: 0,
          clicks: 0,
          hasImage: includeImage && !!imageUrl,
          hasButton: includeButton && !!buttonText && !!buttonUrl
        };
        
        setBroadcasts([newBroadcast, ...broadcasts]);
        
        setSendSuccess(true);
        setIsSending(false);
        
        // Notify parent component
        if (onBroadcastSend) {
          onBroadcastSend(newBroadcast);
        }
        
        // Reset the form after 2 seconds
        setTimeout(() => {
          setSendSuccess(false);
          if (isScheduled) {
            setActiveTab("history");
          } else {
            resetForm();
          }
        }, 2000);
      } catch (err) {
        setError("Failed to send broadcast. Please try again.");
        setIsSending(false);
      }
    }, 1500);
  };
  
  const resetForm = () => {
    setMessageText("");
    setMessageTitle("");
    setIncludeImage(false);
    setImageUrl("");
    setIncludeButton(false);
    setButtonText("");
    setButtonUrl("");
    setAudienceSegment("all");
    setIsScheduled(false);
    setScheduledDate(new Date());
    setScheduledTime("12:00");
  };
  
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><Check className="w-3 h-3 mr-1" /> {status}</span>;
      case "scheduled":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><CalendarClock className="w-3 h-3 mr-1" /> {status}</span>;
      case "sending":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> {status}</span>;
      case "failed":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" /> {status}</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };
  
  return (
    <div>
      <Tabs 
        defaultValue="compose" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="compose" className="flex items-center gap-1">
            <Send className="w-4 h-4" />
            <span>Compose Broadcast</span>
          </TabsTrigger>
          <TabsTrigger value="audience" className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>Audience</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>Broadcast History</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="compose" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compose Broadcast Message</CardTitle>
              <CardDescription>
                Create a message to send to your Facebook Messenger subscribers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sendSuccess ? (
                <div className="bg-green-50 p-6 rounded-md text-center">
                  <Check className="w-12 h-12 text-green-600 mx-auto mb-2" />
                  <h3 className="text-lg font-medium mb-1">Broadcast {isScheduled ? 'Scheduled' : 'Sent'} Successfully!</h3>
                  <p className="text-green-700">
                    {isScheduled 
                      ? `Your broadcast has been scheduled for ${format(scheduledDate, "MMMM d, yyyy")} at ${scheduledTime}.` 
                      : `Your broadcast has been sent to ${audienceSegments.find(s => s.id === audienceSegment)?.count || 0} subscribers.`}
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <Label htmlFor="title">Broadcast Title (Optional)</Label>
                    <Input
                      id="title"
                      placeholder="E.g., Weekly Newsletter, Product Announcement, etc."
                      value={messageTitle}
                      onChange={(e) => setMessageTitle(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      For your reference only. Recipients won't see this title.
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <div className="border rounded-md">
                      <Textarea
                        id="message"
                        placeholder="Type your broadcast message here..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="border-0 focus-visible:ring-0 rounded-b-none min-h-[120px]"
                      />
                      <div className="flex items-center p-2 border-t">
                        <button className="p-1.5 rounded-full hover:bg-muted">
                          <Smile className="w-5 h-5 text-muted-foreground" />
                        </button>
                        <button 
                          className={`p-1.5 rounded-full ${includeImage ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-muted'}`}
                          onClick={() => setIncludeImage(!includeImage)}
                        >
                          <ImagePlus className="w-5 h-5" />
                        </button>
                        <button 
                          className={`p-1.5 rounded-full ${includeButton ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-muted'}`}
                          onClick={() => setIncludeButton(!includeButton)}
                        >
                          <Link2 className="w-5 h-5" />
                        </button>
                        <div className="flex-grow"></div>
                        <span className="text-xs text-muted-foreground">
                          {messageText.length} / 2000
                        </span>
                      </div>
                    </div>
                  </div>
                
                  {includeImage && (
                    <div>
                      <Label htmlFor="image-url">Image URL</Label>
                      <Input
                        id="image-url"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                      />
                    </div>
                  )}
                
                  {includeButton && (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="button-text">Button Text</Label>
                        <Input
                          id="button-text"
                          placeholder="Learn More, Shop Now, etc."
                          value={buttonText}
                          onChange={(e) => setButtonText(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="button-url">Button URL</Label>
                        <Input
                          id="button-url"
                          placeholder="https://yourdomain.com/landing-page"
                          value={buttonUrl}
                          onChange={(e) => setButtonUrl(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3 pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="scheduled"
                          checked={isScheduled}
                          onCheckedChange={setIsScheduled}
                        />
                        <Label htmlFor="scheduled">Schedule for later</Label>
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="text-muted-foreground">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-3">
                            <h3 className="font-medium">Message Preview</h3>
                            <div className="border rounded-lg p-3 bg-gray-50">
                              <p className="text-sm">{messageText}</p>
                              {includeImage && imageUrl && (
                                <div className="mt-2 bg-muted h-32 rounded flex items-center justify-center">
                                  <ImagePlus className="w-6 h-6 text-muted-foreground" />
                                </div>
                              )}
                              {includeButton && buttonText && (
                                <button className="mt-2 w-full bg-blue-600 text-white rounded py-1.5 text-sm">
                                  {buttonText}
                                </button>
                              )}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  
                    {isScheduled && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="date">Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarClock className="w-4 h-4 mr-2" />
                                {format(scheduledDate, "PPP")}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={scheduledDate}
                                onSelect={setScheduledDate}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <Label htmlFor="time">Time</Label>
                          <Input
                            id="time"
                            type="time"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center py-2">
                    <div className="mr-2 text-sm">
                      <span className="font-medium">Audience:</span> {audienceSegments.find(s => s.id === audienceSegment)?.name}
                    </div>
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => setActiveTab("audience")}>
                      Change
                    </Button>
                    <div className="flex-grow"></div>
                    <div className="text-sm">
                      <span className="font-medium">Recipients:</span> {audienceSegments.find(s => s.id === audienceSegment)?.count.toLocaleString()}
                    </div>
                  </div>
                  
                  {error && (
                    <div className="bg-red-50 text-red-800 p-3 rounded-md">
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {error}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={resetForm}>Cancel</Button>
                    <Button 
                      onClick={handleSendBroadcast} 
                      disabled={isSending || !messageText.trim()}
                    >
                      {isSending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {isScheduled ? 'Scheduling...' : 'Sending...'}
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          {isScheduled ? 'Schedule Broadcast' : 'Send Broadcast'}
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audience" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Audience</CardTitle>
              <CardDescription>
                Choose which subscribers will receive your broadcast message.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {audienceSegments.map((segment) => (
                  <div 
                    key={segment.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      audienceSegment === segment.id ? 'border-primary bg-primary/5' : 'hover:bg-accent'
                    }`}
                    onClick={() => setAudienceSegment(segment.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{segment.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {segment.count.toLocaleString()} subscribers
                        </p>
                      </div>
                      <div className={`w-5 h-5 rounded-full ${audienceSegment === segment.id ? 'bg-primary' : 'border'} flex items-center justify-center`}>
                        {audienceSegment === segment.id && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button onClick={() => setActiveTab("compose")}>
                  Continue to Compose
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Broadcast History</CardTitle>
              <CardDescription>
                View past and scheduled broadcasts to your subscribers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {broadcasts.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground">
                    No broadcasts have been sent or scheduled yet.
                  </div>
                ) : (
                  <div className="divide-y">
                    {broadcasts.map((broadcast) => (
                      <div key={broadcast.id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{broadcast.title}</h3>
                            <div className="text-sm text-muted-foreground mt-1">
                              {broadcast.status !== "Scheduled" ? (
                                <>Sent on {format(new Date(broadcast.sentAt), "MMMM d, yyyy 'at' h:mm a")}</>
                              ) : (
                                <>Scheduled for {format(new Date(broadcast.sentAt), "MMMM d, yyyy 'at' h:mm a")}</>
                              )}
                            </div>
                          </div>
                          <div>
                            {getStatusBadge(broadcast.status)}
                          </div>
                        </div>
                        <p className="text-sm">{broadcast.message.length > 100 ? `${broadcast.message.substring(0, 100)}...` : broadcast.message}</p>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs">
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1 text-muted-foreground" />
                            <span>{broadcast.audience} ({broadcast.audienceSize.toLocaleString()})</span>
                          </div>
                          
                          {broadcast.status === "Completed" && (
                            <>
                              <div className="flex items-center">
                                <Eye className="w-3 h-3 mr-1 text-muted-foreground" />
                                <span>{broadcast.opens.toLocaleString()} opens ({Math.round(broadcast.opens / broadcast.audienceSize * 100)}%)</span>
                              </div>
                              
                              {broadcast.clicks !== undefined && (
                                <div className="flex items-center">
                                  <Link2 className="w-3 h-3 mr-1 text-muted-foreground" />
                                  <span>{broadcast.clicks.toLocaleString()} clicks ({Math.round(broadcast.clicks / broadcast.audienceSize * 100)}%)</span>
                                </div>
                              )}
                            </>
                          )}
                          
                          {broadcast.hasImage && (
                            <div className="flex items-center">
                              <ImagePlus className="w-3 h-3 mr-1 text-muted-foreground" />
                              <span>Has image</span>
                            </div>
                          )}
                          
                          {broadcast.hasButton && (
                            <div className="flex items-center">
                              <Link2 className="w-3 h-3 mr-1 text-muted-foreground" />
                              <span>Has button</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default MessengerBroadcast; 