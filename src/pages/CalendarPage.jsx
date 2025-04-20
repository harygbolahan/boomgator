import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, getDay, isSameDay, addDays, isWithinInterval, parseISO } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon, ImageIcon, CalendarIcon, CameraIcon, VideoIcon, LinkIcon, Trash2Icon, PlusIcon, MoreHorizontalIcon, ClockIcon, CheckCircleIcon, TimerIcon } from "lucide-react";

export function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("12:00");
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [postMedia, setPostMedia] = useState([]);
  const [scheduledPosts, setScheduledPosts] = useState(sampleScheduledPosts);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [editingPost, setEditingPost] = useState(null);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowScheduleModal(true);
  };

  const handleAddPost = () => {
    const newPost = {
      id: Date.now().toString(),
      content: postContent,
      platforms: selectedPlatforms,
      scheduledFor: new Date(`${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}`),
      status: "scheduled",
      media: postMedia,
      createdAt: new Date()
    };

    if (editingPost) {
      setScheduledPosts(scheduledPosts.map(post => 
        post.id === editingPost.id ? newPost : post
      ));
    } else {
      setScheduledPosts([...scheduledPosts, newPost]);
    }

    handleCloseScheduleModal();
  };

  const handleCloseScheduleModal = () => {
    setShowScheduleModal(false);
    setSelectedPlatforms([]);
    setPostContent("");
    setPostMedia([]);
    setEditingPost(null);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setSelectedDate(new Date(post.scheduledFor));
    setSelectedTime(format(new Date(post.scheduledFor), "HH:mm"));
    setSelectedPlatforms(post.platforms);
    setPostContent(post.content);
    setPostMedia(post.media || []);
    setShowScheduleModal(true);
  };

  const handleDeletePost = (postId) => {
    setScheduledPosts(scheduledPosts.filter(post => post.id !== postId));
  };

  const handleTogglePlatform = (platform) => {
    setSelectedPlatforms(
      selectedPlatforms.includes(platform)
        ? selectedPlatforms.filter(p => p !== platform)
        : [...selectedPlatforms, platform]
    );
  };

  const handleAddMedia = (type) => {
    const newMedia = {
      id: Date.now().toString(),
      type: type,
      url: type === 'image' ? '/placeholder-image.jpg' : 
           type === 'video' ? '/placeholder-video.mp4' : '',
      thumbnail: type === 'image' ? '/placeholder-image.jpg' : 
                type === 'video' ? '/placeholder-video-thumb.jpg' : ''
    };
    setPostMedia([...postMedia, newMedia]);
  };

  const handleRemoveMedia = (mediaId) => {
    setPostMedia(postMedia.filter(media => media.id !== mediaId));
  };

  const getPostsForDate = (date) => {
    return scheduledPosts.filter(post => isSameDay(new Date(post.scheduledFor), date));
  };

  const getUpcomingPosts = () => {
    const now = new Date();
    return scheduledPosts
      .filter(post => new Date(post.scheduledFor) > now)
      .sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor));
  };

  const getPublishedPosts = () => {
    const now = new Date();
    return scheduledPosts
      .filter(post => new Date(post.scheduledFor) <= now || post.status === "published")
      .sort((a, b) => new Date(b.scheduledFor) - new Date(a.scheduledFor));
  };

  const getFailedPosts = () => {
    return scheduledPosts
      .filter(post => post.status === "failed")
      .sort((a, b) => new Date(b.scheduledFor) - new Date(a.scheduledFor));
  };

  const getDraftPosts = () => {
    return scheduledPosts
      .filter(post => post.status === "draft")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const renderPostCardActions = (post) => (
    <div className="flex items-center gap-2 mt-2">
      {post.status === "scheduled" && (
        <Button size="sm" variant="outline" onClick={() => handleEditPost(post)}>
          Edit
        </Button>
      )}
      <Button size="sm" variant="outline" className="text-red-500" onClick={() => handleDeletePost(post.id)}>
        Delete
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="ghost">
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2">
          <div className="grid gap-1">
            {post.status === "scheduled" && (
              <Button variant="ghost" size="sm" className="justify-start">
                Publish now
              </Button>
            )}
            <Button variant="ghost" size="sm" className="justify-start">
              Duplicate
            </Button>
            <Button variant="ghost" size="sm" className="justify-start text-red-500">
              Cancel schedule
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );

  const renderPostCard = (post) => (
    <Card key={post.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              {post.platforms.map(platform => (
                <div 
                  key={platform} 
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                    platform === "facebook" ? "bg-blue-600" :
                    platform === "instagram" ? "bg-pink-600" :
                    platform === "twitter" ? "bg-sky-500" :
                    platform === "linkedin" ? "bg-blue-800" :
                    "bg-gray-600"
                  }`}
                >
                  {platform.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <ClockIcon className="h-3 w-3 mr-1" /> 
              {format(new Date(post.scheduledFor), "MMM d, yyyy • h:mm a")}
            </div>
          </div>
          <Badge 
            variant={
              post.status === "published" ? "success" :
              post.status === "scheduled" ? "outline" :
              post.status === "failed" ? "destructive" :
              "secondary"
            }
          >
            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{post.content}</p>
        {post.media && post.media.length > 0 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            {post.media.map(media => (
              <div key={media.id} className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded bg-muted flex items-center justify-center overflow-hidden">
                  {media.type === 'image' && (
                    <img 
                      src={media.thumbnail} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  )}
                  {media.type === 'video' && (
                    <div className="relative w-full h-full">
                      <img 
                        src={media.thumbnail} 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-black/50 flex items-center justify-center">
                          <VideoIcon className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        {renderPostCardActions(post)}
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Content Calendar</h2>
          <p className="text-muted-foreground">
            Schedule and manage your social media content across platforms.
          </p>
        </div>
        <Button onClick={() => setShowScheduleModal(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setView(view === "month" ? "week" : "month")}
                  >
                    {view === "month" ? "Month" : "Week"}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setDate(prevDate => addDays(prevDate, -7))}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setDate(prevDate => addDays(prevDate, 7))}
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                  <h3 className="text-lg font-semibold">
                    {format(date, "MMMM yyyy")}
                  </h3>
                </div>
                <Button variant="outline" size="sm" onClick={() => setDate(new Date())}>
                  Today
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="multiple"
                selected={scheduledPosts.map(post => new Date(post.scheduledFor))}
                onDayClick={handleDateSelect}
                month={date}
                className="rounded-md border"
              />
              
              <div className="mt-6">
                <h4 className="font-medium mb-3">
                  Posts for {format(date, "MMMM d, yyyy")}
                </h4>
                {getPostsForDate(date).length > 0 ? (
                  getPostsForDate(date).map(post => renderPostCard(post))
                ) : (
                  <div className="text-center py-8 border rounded-lg">
                    <p className="text-muted-foreground">No posts scheduled for this date</p>
                    <Button variant="outline" className="mt-2" onClick={() => handleDateSelect(date)}>
                      Schedule a Post
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Content Queue</CardTitle>
              <CardDescription>
                Manage your scheduled and published content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="published">Published</TabsTrigger>
                  <TabsTrigger value="drafts">Drafts</TabsTrigger>
                  <TabsTrigger value="failed">Failed</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming" className="space-y-4">
                  {getUpcomingPosts().length > 0 ? (
                    getUpcomingPosts().map(post => renderPostCard(post))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No upcoming posts</p>
                      <Button variant="outline" className="mt-2" onClick={() => setShowScheduleModal(true)}>
                        Schedule a Post
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="published" className="space-y-4">
                  {getPublishedPosts().length > 0 ? (
                    getPublishedPosts().map(post => renderPostCard(post))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No published posts</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="drafts" className="space-y-4">
                  {getDraftPosts().length > 0 ? (
                    getDraftPosts().map(post => renderPostCard(post))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No drafts saved</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="failed" className="space-y-4">
                  {getFailedPosts().length > 0 ? (
                    getFailedPosts().map(post => renderPostCard(post))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No failed posts</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Schedule Post Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPost ? "Edit Post" : "Schedule New Post"}</DialogTitle>
            <DialogDescription>
              Create and schedule your post across multiple platforms.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-4">
                <Textarea 
                  placeholder="What would you like to share?" 
                  className="min-h-[100px]"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />
              </div>
              
              {postMedia.length > 0 && (
                <div className="col-span-4 flex gap-3 overflow-x-auto pb-2">
                  {postMedia.map(media => (
                    <div key={media.id} className="relative flex-shrink-0">
                      <div className="w-24 h-24 rounded bg-muted flex items-center justify-center overflow-hidden">
                        {media.type === 'image' && (
                          <img 
                            src={media.thumbnail} 
                            alt="" 
                            className="w-full h-full object-cover"
                          />
                        )}
                        {media.type === 'video' && (
                          <div className="relative w-full h-full">
                            <img 
                              src={media.thumbnail} 
                              alt="" 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                                <VideoIcon className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <Button 
                        size="icon" 
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={() => handleRemoveMedia(media.id)}
                      >
                        <Trash2Icon className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="col-span-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleAddMedia('image')}>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Image
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAddMedia('video')}>
                  <VideoIcon className="h-4 w-4 mr-2" />
                  Video
                </Button>
                <Button variant="outline" size="sm">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Link
                </Button>
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Platforms</label>
                <div className="space-y-2">
                  {socialPlatforms.map(platform => (
                    <div key={platform.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={platform.id} 
                        checked={selectedPlatforms.includes(platform.id)}
                        onCheckedChange={() => handleTogglePlatform(platform.id)}
                      />
                      <label 
                        htmlFor={platform.id} 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white mr-2 ${platform.bgColor}`}>
                          {platform.icon}
                        </div>
                        {platform.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="col-span-2">
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(selectedDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <Select defaultValue={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }).map((_, hour) => (
                        <>
                          <SelectItem key={`${hour}:00`} value={`${hour.toString().padStart(2, '0')}:00`}>
                            {format(new Date().setHours(hour, 0), "h:mm a")}
                          </SelectItem>
                          <SelectItem key={`${hour}:30`} value={`${hour.toString().padStart(2, '0')}:30`}>
                            {format(new Date().setHours(hour, 30), "h:mm a")}
                          </SelectItem>
                        </>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseScheduleModal}>
              Cancel
            </Button>
            <Button onClick={handleAddPost} disabled={!postContent || selectedPlatforms.length === 0}>
              {editingPost ? "Update" : "Schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const socialPlatforms = [
  { 
    id: "facebook", 
    name: "Facebook", 
    icon: "f", 
    bgColor: "bg-blue-600" 
  },
  { 
    id: "instagram", 
    name: "Instagram", 
    icon: "i", 
    bgColor: "bg-pink-600" 
  },
  { 
    id: "twitter", 
    name: "Twitter", 
    icon: "t", 
    bgColor: "bg-sky-500" 
  },
  { 
    id: "linkedin", 
    name: "LinkedIn", 
    icon: "in", 
    bgColor: "bg-blue-800" 
  }
];

const sampleScheduledPosts = [
  {
    id: "1",
    content: "Excited to announce our new product launch! Check out our website for more details. #newproduct #launch",
    platforms: ["facebook", "twitter", "linkedin"],
    scheduledFor: addDays(new Date(), 2).toISOString(),
    status: "scheduled",
    media: [
      {
        id: "media1",
        type: "image",
        url: "/placeholder-image.jpg",
        thumbnail: "/placeholder-image.jpg"
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    content: "Behind the scenes look at our design team working on the new UI. #design #behindthescenes",
    platforms: ["instagram"],
    scheduledFor: addDays(new Date(), -2).toISOString(),
    status: "published",
    media: [
      {
        id: "media2",
        type: "image",
        url: "/placeholder-image.jpg",
        thumbnail: "/placeholder-image.jpg"
      },
      {
        id: "media3",
        type: "image",
        url: "/placeholder-image.jpg",
        thumbnail: "/placeholder-image.jpg"
      }
    ],
    createdAt: addDays(new Date(), -3).toISOString()
  },
  {
    id: "3",
    content: "Check out our CEO's interview on the future of remote work. #remotework #future",
    platforms: ["linkedin", "twitter"],
    scheduledFor: addDays(new Date(), 5).toISOString(),
    status: "scheduled",
    media: [
      {
        id: "media4",
        type: "video",
        url: "/placeholder-video.mp4",
        thumbnail: "/placeholder-video-thumb.jpg"
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "4",
    content: "We're looking for talented developers to join our team! Apply now through our website. #hiring #jobs",
    platforms: ["facebook", "linkedin"],
    scheduledFor: new Date().toISOString(),
    status: "scheduled",
    media: [],
    createdAt: addDays(new Date(), -1).toISOString()
  },
  {
    id: "5",
    content: "Draft post about our upcoming webinar series.",
    platforms: ["facebook", "linkedin"],
    scheduledFor: null,
    status: "draft",
    media: [],
    createdAt: addDays(new Date(), -1).toISOString()
  },
  {
    id: "6",
    content: "Our system was down yesterday. We apologize for the inconvenience and are working to ensure it doesn't happen again.",
    platforms: ["twitter"],
    scheduledFor: addDays(new Date(), -1).toISOString(),
    status: "failed",
    media: [],
    createdAt: addDays(new Date(), -1).toISOString()
  }
]; 