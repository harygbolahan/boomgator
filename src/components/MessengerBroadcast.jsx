import { useState, useCallback, useMemo, memo } from "react";
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
import { debounce } from "@/lib/utils";

// Memoized BroadcastForm component
const BroadcastForm = memo(({ 
  messageText,
  setMessageText,
  messageTitle,
  setMessageTitle,
  includeImage,
  setIncludeImage,
  imageUrl,
  setImageUrl,
  includeButton,
  setIncludeButton,
  buttonText,
  setButtonText,
  buttonUrl,
  setButtonUrl,
  error
}) => {
  // Debounced handlers for text inputs to avoid excessive renders
  const handleMessageTextChange = useCallback(
    debounce((e) => setMessageText(e.target.value), 300),
    [setMessageText]
  );

  const handleMessageTitleChange = useCallback(
    debounce((e) => setMessageTitle(e.target.value), 300),
    [setMessageTitle]
  );

  const handleImageUrlChange = useCallback(
    debounce((e) => setImageUrl(e.target.value), 300),
    [setImageUrl]
  );

  const handleButtonTextChange = useCallback(
    debounce((e) => setButtonText(e.target.value), 300),
    [setButtonText]
  );

  const handleButtonUrlChange = useCallback(
    debounce((e) => setButtonUrl(e.target.value), 300),
    [setButtonUrl]
  );

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 rounded-md bg-red-50 text-red-800 text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      
      <div>
        <Label htmlFor="messageTitle">Message Title (Optional)</Label>
        <Input 
          id="messageTitle" 
          placeholder="Enter message title" 
          defaultValue={messageTitle}
          onChange={handleMessageTitleChange}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="messageText">Message Text</Label>
        <Textarea 
          id="messageText" 
          placeholder="Write your broadcast message here..." 
          defaultValue={messageText}
          onChange={handleMessageTextChange}
          className="mt-1 h-32"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch 
            id="includeImage" 
            checked={includeImage} 
            onCheckedChange={setIncludeImage}
          />
          <Label htmlFor="includeImage" className="cursor-pointer">Include Image</Label>
        </div>
      </div>
      
      {includeImage && (
        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input 
            id="imageUrl" 
            placeholder="https://example.com/image.jpg" 
            defaultValue={imageUrl}
            onChange={handleImageUrlChange}
            className="mt-1"
          />
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch 
            id="includeButton" 
            checked={includeButton} 
            onCheckedChange={setIncludeButton}
          />
          <Label htmlFor="includeButton" className="cursor-pointer">Include Button</Label>
        </div>
      </div>
      
      {includeButton && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="buttonText">Button Text</Label>
            <Input 
              id="buttonText" 
              placeholder="Learn More" 
              defaultValue={buttonText}
              onChange={handleButtonTextChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="buttonUrl">Button URL</Label>
            <Input 
              id="buttonUrl" 
              placeholder="https://example.com" 
              defaultValue={buttonUrl}
              onChange={handleButtonUrlChange}
              className="mt-1"
            />
          </div>
        </div>
      )}
    </div>
  );
});

// Memoized ScheduleSettings component
const ScheduleSettings = memo(({ 
  isScheduled, 
  setIsScheduled, 
  scheduledDate, 
  setScheduledDate, 
  scheduledTime, 
  setScheduledTime 
}) => {
  const handleTimeChange = useCallback((e) => {
    setScheduledTime(e.target.value);
  }, [setScheduledTime]);

  return (
    <div className="space-y-4 mt-6">
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch 
              id="scheduleMessage" 
              checked={isScheduled} 
              onCheckedChange={setIsScheduled}
            />
            <Label htmlFor="scheduleMessage" className="cursor-pointer">Schedule for Later</Label>
          </div>
        </div>
      </div>
      
      {isScheduled && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Schedule Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left mt-1"
                >
                  <CalendarClock className="mr-2 h-4 w-4" />
                  {format(scheduledDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={scheduledDate}
                  onSelect={setScheduledDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="scheduleTime">Schedule Time</Label>
            <Input 
              id="scheduleTime" 
              type="time" 
              value={scheduledTime}
              onChange={handleTimeChange}
              className="mt-1"
            />
          </div>
        </div>
      )}
    </div>
  );
});

// Memoized AudienceSelector component
const AudienceSelector = memo(({ 
  audienceSegment, 
  setAudienceSegment, 
  audienceSegments 
}) => {
  const selectedSegment = useMemo(() => 
    audienceSegments.find(s => s.id === audienceSegment),
  [audienceSegment, audienceSegments]);

  return (
    <div className="space-y-4">
      <div>
        <Label>Select Audience</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between mt-1"
            >
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span>{selectedSegment?.name} ({selectedSegment?.count.toLocaleString()} subscribers)</span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <div className="overflow-y-auto max-h-80">
              {audienceSegments.map((segment) => (
                <button
                  key={segment.id}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 flex justify-between items-center"
                  onClick={() => setAudienceSegment(segment.id)}
                >
                  <span>{segment.name}</span>
                  <span className="text-sm text-gray-500">{segment.count.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
});

// Memoized BroadcastHistory component
const BroadcastHistory = memo(({ broadcasts }) => {
  const getStatusBadge = useCallback((status) => {
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
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {broadcasts.map((broadcast) => (
          <Card key={broadcast.id}>
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{broadcast.title}</CardTitle>
                {getStatusBadge(broadcast.status)}
              </div>
              <CardDescription>
                {broadcast.status === "Scheduled" 
                  ? `Scheduled for ${format(new Date(broadcast.sentAt), "PPP p")}`
                  : `Sent ${format(new Date(broadcast.sentAt), "PPP p")}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="text-sm mb-3 line-clamp-2">{broadcast.message}</p>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  <span>{broadcast.audience} ({broadcast.audienceSize.toLocaleString()})</span>
                </div>
                {broadcast.status === "Completed" && (
                  <>
                    <div className="flex items-center">
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      <span>{broadcast.opens.toLocaleString()} opens ({Math.round(broadcast.opens / broadcast.audienceSize * 100)}%)</span>
                    </div>
                    <div className="flex items-center">
                      <Link2 className="h-3.5 w-3.5 mr-1" />
                      <span>{broadcast.clicks.toLocaleString()} clicks ({Math.round(broadcast.clicks / broadcast.audienceSize * 100)}%)</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
});

// Main component using memoized subcomponents
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
  const audienceSegments = useMemo(() => [
    { id: "all", name: "All Subscribers", count: 1250 },
    { id: "active", name: "Active Subscribers (Last 30 Days)", count: 873 },
    { id: "new", name: "New Subscribers (Last 7 Days)", count: 126 },
    { id: "inactive", name: "Inactive Subscribers (90+ Days)", count: 347 },
    { id: "engaged", name: "Highly Engaged", count: 512 },
    { id: "custom", name: "Custom Segment", count: 678 }
  ], []);
  
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
  
  const handleSendBroadcast = useCallback(() => {
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
        // Create a new broadcast record
        const selectedSegment = audienceSegments.find(s => s.id === audienceSegment);
        const newBroadcast = {
          id: `b${Date.now()}`,
          title: messageTitle || "Broadcast",
          message: messageText,
          sentAt: isScheduled ? new Date(`${format(scheduledDate, "yyyy-MM-dd")}T${scheduledTime}`) : new Date(),
          audience: selectedSegment?.name || "All Subscribers",
          audienceSize: selectedSegment?.count || 0,
          status: isScheduled ? "Scheduled" : "Completed",
          opens: 0,
          clicks: 0,
          hasImage: includeImage && !!imageUrl,
          hasButton: includeButton && !!buttonText && !!buttonUrl
        };
        
        setBroadcasts(prev => [newBroadcast, ...prev]);
        
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
  }, [
    messageText, 
    messageTitle, 
    audienceSegment, 
    audienceSegments, 
    isScheduled, 
    scheduledDate, 
    scheduledTime, 
    includeImage, 
    imageUrl, 
    includeButton, 
    buttonText, 
    buttonUrl, 
    onBroadcastSend
  ]);
  
  const resetForm = useCallback(() => {
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
  }, []);
  
  const handleTabChange = useCallback((value) => {
    setActiveTab(value);
  }, []);
  
  return (
    <div>
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
                  : 'Your broadcast has been sent to your subscribers.'}
              </p>
            </div>
          ) : (
            <>
              <BroadcastForm 
                messageText={messageText}
                setMessageText={setMessageText}
                messageTitle={messageTitle}
                setMessageTitle={setMessageTitle}
                includeImage={includeImage}
                setIncludeImage={setIncludeImage}
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                includeButton={includeButton}
                setIncludeButton={setIncludeButton}
                buttonText={buttonText}
                setButtonText={setButtonText}
                buttonUrl={buttonUrl}
                setButtonUrl={setButtonUrl}
                error={error}
              />
              
              <ScheduleSettings 
                isScheduled={isScheduled}
                setIsScheduled={setIsScheduled}
                scheduledDate={scheduledDate}
                setScheduledDate={setScheduledDate}
                scheduledTime={scheduledTime}
                setScheduledTime={setScheduledTime}
              />
              
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSendBroadcast} 
                  disabled={isSending}
                  className="relative"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span>{isScheduled ? 'Scheduling...' : 'Sending...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      <span>{isScheduled ? 'Schedule' : 'Send'} Broadcast</span>
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Export a memoized version for better performance
export default memo(MessengerBroadcast);