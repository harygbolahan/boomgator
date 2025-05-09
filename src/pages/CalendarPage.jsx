import React, { useState, useEffect, useMemo, Fragment } from "react";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, getDay, isSameDay, addDays, isWithinInterval, parseISO, subDays, isToday, addWeeks, startOfWeek, endOfWeek, eachDayOfInterval, isAfter } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon, ImageIcon, CalendarIcon, CameraIcon, VideoIcon, LinkIcon, Trash2Icon, PlusIcon, MoreHorizontalIcon, ClockIcon, CheckCircleIcon, TimerIcon, RefreshCwIcon, CopyIcon, FileTextIcon, EyeIcon, BookmarkIcon, AlertTriangleIcon, RepeatIcon, BellIcon, HashIcon, BarChart2Icon, BarChartIcon, ArrowUpRightIcon, GripVertical, SortDescIcon, FolderIcon, PackageIcon, SearchIcon, Calendar as CalendarBoxIcon, UsersIcon, BookIcon, MenuIcon, XIcon, FilterIcon } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Components for DnD functionality
function SortablePostCard({ post, renderPostCard }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: post.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 p-1 cursor-move text-gray-400 hover:text-gray-600">
        <GripVertical className="h-3 w-3 md:h-4 md:w-4" />
      </div>
      <div className="pl-4 md:pl-6">
        {renderPostCard(post)}
      </div>
    </div>
  );
}

// Platforms with proper branding colors and icons
const socialPlatforms = [
  { 
    id: "facebook", 
    name: "Facebook", 
    icon: "f", 
    bgColor: "bg-[#1877F2]",
    iconColor: "text-white" 
  },
  { 
    id: "instagram", 
    name: "Instagram", 
    icon: "i", 
    bgColor: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
    iconColor: "text-white" 
  },
  { 
    id: "twitter", 
    name: "Twitter", 
    icon: "𝕏", 
    bgColor: "bg-black",
    iconColor: "text-white" 
  },
  { 
    id: "linkedin", 
    name: "LinkedIn", 
    icon: "in", 
    bgColor: "bg-[#0A66C2]",
    iconColor: "text-white" 
  },
  { 
    id: "tiktok", 
    name: "TikTok", 
    icon: "t", 
    bgColor: "bg-black",
    iconColor: "text-white" 
  },
  { 
    id: "pinterest", 
    name: "Pinterest", 
    icon: "p", 
    bgColor: "bg-[#E60023]",
    iconColor: "text-white" 
  }
];

// Post templates to help users quickly create content
const postTemplates = [
  {
    id: "announcement",
    name: "Announcement",
    icon: <BellIcon className="h-3 w-3 md:h-4 md:w-4" />,
    content: "Excited to announce [announcement]! [additional details]. #[topic] #announcement"
  },
  {
    id: "product",
    name: "Product Launch",
    icon: <PackageIcon className="h-3 w-3 md:h-4 md:w-4" />,
    content: "Introducing our newest [product/service]: [name]. [key benefit]. Learn more at [link]. #[product] #launch"
  },
  {
    id: "event",
    name: "Event Promotion",
    icon: <CalendarBoxIcon className="h-3 w-3 md:h-4 md:w-4" />,
    content: "Join us for [event name] on [date] at [time]. [brief description]. Register now: [link]. #event #[topic]"
  },
  {
    id: "tip",
    name: "Quick Tip",
    icon: <BookIcon className="h-3 w-3 md:h-4 md:w-4" />,
    content: "[Number] quick tips for [topic]: 1. [tip one] 2. [tip two] 3. [tip three]. #tips #[topic]"
  },
  {
    id: "question",
    name: "Engagement Question",
    icon: <UsersIcon className="h-3 w-3 md:h-4 md:w-4" />,
    content: "[Thought-provoking question about industry/topic]? Share your thoughts below! #discussion #[topic]"
  }
];

// Sample best times to post for different platforms
const bestTimesToPost = {
  facebook: ["9:00", "13:00", "15:00"],
  instagram: ["11:00", "13:00", "19:00"],
  twitter: ["8:00", "12:00", "17:00", "20:00"],
  linkedin: ["8:00", "10:00", "12:00", "17:00"],
  tiktok: ["9:00", "12:00", "19:00", "21:00"],
  pinterest: ["15:00", "20:00", "21:00"]
};

// Sample content categories for better organization
const contentCategories = [
  { id: "general", name: "General", color: "bg-gray-500" },
  { id: "promotion", name: "Promotion", color: "bg-blue-500" },
  { id: "event", name: "Event", color: "bg-purple-500" },
  { id: "education", name: "Education", color: "bg-green-500" },
  { id: "engagement", name: "Engagement", color: "bg-orange-500" }
];

const sampleScheduledPosts = [
  {
    id: "1",
    content: "Excited to announce our new product launch! Check out our website for more details. #newproduct #launch",
    platforms: ["facebook", "twitter", "linkedin"],
    scheduledFor: addDays(new Date(), 2).toISOString(),
    status: "scheduled",
    category: "promotion",
    tags: ["newproduct", "launch"],
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
    category: "engagement",
    tags: ["design", "behindthescenes"],
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
    category: "education",
    tags: ["remotework", "future"],
    media: [
      {
        id: "media4",
        type: "video",
        url: "/placeholder-video.mp4",
        thumbnail: "/placeholder-video-thumb.jpg"
      }
    ],
    createdAt: new Date().toISOString(),
    isRecurrence: true,
    originalPostId: "3-original"
  },
  {
    id: "4",
    content: "We're looking for talented developers to join our team! Apply now through our website. #hiring #jobs",
    platforms: ["facebook", "linkedin"],
    scheduledFor: new Date().toISOString(),
    status: "scheduled",
    category: "general",
    tags: ["hiring", "jobs"],
    media: [],
    createdAt: addDays(new Date(), -1).toISOString()
  },
  {
    id: "5",
    content: "Draft post about our upcoming webinar series.",
    platforms: ["facebook", "linkedin"],
    scheduledFor: null,
    status: "draft",
    category: "event",
    tags: [],
    media: [],
    createdAt: addDays(new Date(), -1).toISOString()
  },
  {
    id: "6",
    content: "Our system was down yesterday. We apologize for the inconvenience and are working to ensure it doesn't happen again.",
    platforms: ["twitter"],
    scheduledFor: addDays(new Date(), -1).toISOString(),
    status: "failed",
    category: "general",
    tags: [],
    media: [],
    createdAt: addDays(new Date(), -1).toISOString()
  }
];

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
  const [postCategory, setPostCategory] = useState("general");
  const [showPostPreview, setShowPostPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState("weekly");
  const [recurringEndDate, setRecurringEndDate] = useState(addWeeks(new Date(), 4));
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [savedMedia, setSavedMedia] = useState([
    { id: "saved1", type: "image", url: "/placeholder-image.jpg", thumbnail: "/placeholder-image.jpg", name: "Product Banner" },
    { id: "saved2", type: "video", url: "/placeholder-video.mp4", thumbnail: "/placeholder-video-thumb.jpg", name: "Intro Video" }
  ]);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [showHashtagSuggestions, setShowHashtagSuggestions] = useState(false);
  const [postTags, setPostTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState("calendar");
  
  // Sensors for drag and drop functionality
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Listen for hashtags in content
  useEffect(() => {
    if (postContent.includes('#')) {
      setShowHashtagSuggestions(true);
    } else {
      setShowHashtagSuggestions(false);
    }
  }, [postContent]);

  // Filter posts based on search term
  const filteredPosts = useMemo(() => {
    if (!searchTerm) return scheduledPosts;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return scheduledPosts.filter(post => 
      post.content.toLowerCase().includes(lowerSearchTerm) ||
      post.platforms.some(platform => platform.includes(lowerSearchTerm)) ||
      (post.category && post.category.toLowerCase().includes(lowerSearchTerm))
    );
  }, [scheduledPosts, searchTerm]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowScheduleModal(true);
  };

  const handleAddPost = () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newPost = {
        id: Date.now().toString(),
        content: postContent,
        platforms: selectedPlatforms,
        scheduledFor: new Date(`${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}`),
        status: "scheduled",
        media: postMedia,
        createdAt: new Date(),
        category: postCategory,
        tags: postTags
      };

      let postsToAdd = [newPost];
      
      // Handle recurring posts
      if (isRecurring) {
        let currentDate = selectedDate;
        const endDate = recurringEndDate;
        
        while (isAfter(endDate, currentDate)) {
          if (recurringFrequency === "daily") {
            currentDate = addDays(currentDate, 1);
          } else if (recurringFrequency === "weekly") {
            currentDate = addDays(currentDate, 7);
          } else if (recurringFrequency === "biweekly") {
            currentDate = addDays(currentDate, 14);
          } else if (recurringFrequency === "monthly") {
            currentDate = addDays(currentDate, 30);
          }
          
          if (isAfter(endDate, currentDate)) {
            const recurrencePost = {
              ...newPost,
              id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
              scheduledFor: new Date(`${format(currentDate, "yyyy-MM-dd")}T${selectedTime}`),
              isRecurrence: true,
              originalPostId: newPost.id
            };
            
            postsToAdd.push(recurrencePost);
          }
        }
      }
      
      if (editingPost) {
        if (isRecurring && editingPost.isRecurrence) {
          // Update all related recurrences
          setScheduledPosts(prevPosts => 
            prevPosts.map(post => 
              post.originalPostId === editingPost.originalPostId || post.id === editingPost.originalPostId || post.id === editingPost.id
                ? { ...newPost, id: post.id, scheduledFor: post.scheduledFor }
                : post
            )
          );
        } else if (isRecurring) {
          // Delete old post and create new recurrence series
          setScheduledPosts([
            ...scheduledPosts.filter(post => post.id !== editingPost.id),
            ...postsToAdd
          ]);
        } else {
          // Just update the single post
          setScheduledPosts(scheduledPosts.map(post => 
            post.id === editingPost.id ? newPost : post
          ));
        }
      } else {
        // Add new post(s)
        setScheduledPosts([...scheduledPosts, ...postsToAdd]);
      }

      setIsLoading(false);
      handleCloseScheduleModal();
      
      // Show success message (would implement toast notification in a real app)
    }, 1000);
  };

  const handleCloseScheduleModal = () => {
    setShowScheduleModal(false);
    setSelectedPlatforms([]);
    setPostContent("");
    setPostMedia([]);
    setEditingPost(null);
    setPostCategory("general");
    setPostTags([]);
    setIsRecurring(false);
    setRecurringFrequency("weekly");
    setRecurringEndDate(addWeeks(new Date(), 4));
    setSelectedTemplate(null);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setSelectedDate(new Date(post.scheduledFor));
    setSelectedTime(format(new Date(post.scheduledFor), "HH:mm"));
    setSelectedPlatforms(post.platforms);
    setPostContent(post.content);
    setPostMedia(post.media || []);
    setPostCategory(post.category || "general");
    setPostTags(post.tags || []);
    setShowScheduleModal(true);
  };

  const handleDeletePost = (postId) => {
    setScheduledPosts(scheduledPosts.filter(post => post.id !== postId));
  };

  const handleDeleteRecurringPost = (post) => {
    if (post.isRecurrence || post.originalPostId) {
      // Ask user whether to delete all or just this occurrence
      const deleteAll = confirm("Delete all occurrences or just this one?");
      
      if (deleteAll) {
        // Delete all related posts
        const originalId = post.originalPostId || post.id;
        setScheduledPosts(scheduledPosts.filter(p => 
          p.id !== originalId && p.originalPostId !== originalId && p.id !== post.id
        ));
      } else {
        // Delete just this occurrence
        setScheduledPosts(scheduledPosts.filter(p => p.id !== post.id));
      }
    } else {
      // Regular delete for non-recurring posts
      setScheduledPosts(scheduledPosts.filter(p => p.id !== post.id));
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setScheduledPosts(posts => {
        const oldIndex = posts.findIndex(post => post.id === active.id);
        const newIndex = posts.findIndex(post => post.id === over.id);
        
        // Create new array with reordered posts
        const newPosts = [...posts];
        const [movedPost] = newPosts.splice(oldIndex, 1);
        newPosts.splice(newIndex, 0, movedPost);
        
        return newPosts;
      });
    }
  };

  const handleTogglePlatform = (platform) => {
    setSelectedPlatforms(
      selectedPlatforms.includes(platform)
        ? selectedPlatforms.filter(p => p !== platform)
        : [...selectedPlatforms, platform]
    );
  };

  const handleAddMedia = (type) => {
    // In a real app, this would open a file picker
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

  const handleSelectSavedMedia = (media) => {
    setPostMedia([...postMedia, {...media, id: Date.now().toString()}]);
    setShowMediaLibrary(false);
  };

  const handleRemoveMedia = (mediaId) => {
    setPostMedia(postMedia.filter(media => media.id !== mediaId));
  };

  const handleUseTemplate = (template) => {
    setPostContent(template.content);
    setSelectedTemplate(template);
    setShowTemplateSelector(false);
  };

  const handleAddTag = (tag) => {
    if (!postTags.includes(tag)) {
      setPostTags([...postTags, tag]);
      
      // Replace hashtag in content with just the word
      const newContent = postContent.replace(`#${tag}`, tag);
      setPostContent(newContent);
      setShowHashtagSuggestions(false);
    }
  };

  const handleRemoveTag = (tag) => {
    setPostTags(postTags.filter(t => t !== tag));
  };

  const getPostsForDate = (date) => {
    return scheduledPosts.filter(post => isSameDay(new Date(post.scheduledFor), date));
  };

  const getUpcomingPosts = () => {
    const now = new Date();
    return filteredPosts
      .filter(post => new Date(post.scheduledFor) > now)
      .sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor));
  };

  const getPublishedPosts = () => {
    const now = new Date();
    return filteredPosts
      .filter(post => new Date(post.scheduledFor) <= now || post.status === "published")
      .sort((a, b) => new Date(b.scheduledFor) - new Date(a.scheduledFor));
  };

  const getFailedPosts = () => {
    return filteredPosts
      .filter(post => post.status === "failed")
      .sort((a, b) => new Date(b.scheduledFor) - new Date(a.scheduledFor));
  };

  const getDraftPosts = () => {
    return filteredPosts
      .filter(post => post.status === "draft")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getWeekDays = () => {
    const startDay = startOfWeek(date, { weekStartsOn: 0 });
    const endDay = endOfWeek(date, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: startDay, end: endDay });
  };

  // Get formatted dates for calendar visualization
  const calendarDays = useMemo(() => {
    return view === "week" ? getWeekDays() : [];
  }, [view, date]);

  // Get suggested time slots based on platform best practices
  const getSuggestedTimes = () => {
    if (selectedPlatforms.length === 0) return [];
    
    // Get times common to all selected platforms or just first platform
    let times = [];
    
    if (selectedPlatforms.length === 1) {
      times = bestTimesToPost[selectedPlatforms[0]] || [];
    } else {
      const allPlatformTimes = selectedPlatforms.map(platform => bestTimesToPost[platform] || []);
      // Find common times (in a real app, you might use a more sophisticated algorithm)
      times = allPlatformTimes.flat().filter((time, index, array) => 
        array.indexOf(time) === index
      );
    }
    
    return times;
  };

  const renderPostCardActions = (post) => (
    <div className="flex items-center gap-1 md:gap-2 mt-1 md:mt-2">
      {post.status === "scheduled" && (
        <Button size="sm" variant="outline" onClick={() => handleEditPost(post)} className="h-7 text-xs px-2">
          Edit
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost" className="h-7 w-7">
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 md:w-56 p-2">
          {post.status === "scheduled" && (
            <>
              <DropdownMenuItem onClick={() => {
                const updatedPost = {...post, status: "published"};
                setScheduledPosts(scheduledPosts.map(p => p.id === post.id ? updatedPost : p));
              }}>
                <ArrowUpRightIcon className="h-4 w-4 mr-2" />
                Publish now
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                const newPost = {...post, id: Date.now().toString()};
                setScheduledPosts([...scheduledPosts, newPost]);
              }}>
                <CopyIcon className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={() => {
            const newPost = {
              ...post,
              id: Date.now().toString(),
              status: "draft",
              scheduledFor: null
            };
            setScheduledPosts([...scheduledPosts, newPost]);
          }}>
            <FileTextIcon className="h-4 w-4 mr-2" />
            Save as template
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteRecurringPost(post)}>
            <Trash2Icon className="h-4 w-4 mr-2" />
            Delete{post.isRecurrence ? " occurrence" : ""}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const renderPlatformIcons = (platforms) => (
    <div className="flex items-center space-x-1">
      {platforms.map(platformId => {
        const platform = socialPlatforms.find(p => p.id === platformId) || {
          bgColor: "bg-gray-600",
          iconColor: "text-white",
          icon: "?"
        };
        
        return (
          <TooltipProvider key={platformId}>
            <Tooltip>
              <TooltipTrigger>
                <div 
                  className={`w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center ${platform.bgColor} ${platform.iconColor} text-[10px] md:text-xs`}
                >
                  {typeof platform.icon === 'string' ? platform.icon.charAt(0) : platform.icon}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{platform.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );

  const renderPostCard = (post) => {
    const postDate = new Date(post.scheduledFor);
    const category = contentCategories.find(c => c.id === (post.category || "general"));
    
    return (
      <Card key={post.id} className="mb-3 md:mb-4 group shadow-sm">
        <CardHeader className="p-2 md:p-4 md:pb-2">
          <div className="flex justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                {renderPlatformIcons(post.platforms)}
                {post.isRecurrence && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="outline" className="ml-1 text-[10px] md:text-xs py-0 h-5">
                          <RepeatIcon className="h-2 w-2 md:h-3 md:w-3 mr-1" />
                          Recurring
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Part of a recurring schedule</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 text-xs md:text-sm text-muted-foreground">
                <div className="flex items-center">
                  <ClockIcon className="h-3 w-3 mr-1" /> 
                  {format(postDate, "MMM d • h:mm a")}
                </div>
                {category && (
                  <div className="flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${category.color} mr-1`}></span>
                    {category.name}
                  </div>
                )}
              </div>
            </div>
            <Badge 
              variant={
                post.status === "published" ? "success" :
                post.status === "scheduled" ? "outline" :
                post.status === "failed" ? "destructive" :
                "secondary"
              }
              className="capitalize text-[10px] py-0 h-5"
            >
              {post.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-2 md:px-4 pt-0 pb-2 md:pb-4">
          <p className="text-xs md:text-sm mb-1 md:mb-2">{post.content}</p>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1 md:mb-2">
              {post.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-[10px] md:text-xs py-0 h-5">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
          
          {post.media && post.media.length > 0 && (
            <div className="flex gap-1 md:gap-2 mt-2 overflow-x-auto pb-1 md:pb-2">
              {post.media.map(media => (
                <div key={media.id} className="relative flex-shrink-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded bg-muted flex items-center justify-center overflow-hidden">
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
                          <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-black/50 flex items-center justify-center">
                            <VideoIcon className="h-2 w-2 md:h-3 md:w-3 text-white" />
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
        <CardFooter className="px-2 md:px-4 pt-0 pb-2 md:pb-4">
          {renderPostCardActions(post)}
        </CardFooter>
      </Card>
    );
  };

  // Mobile tab navigation
  const handleMobileTabChange = (tab) => {
    setActiveMobileTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="max-w-[350px] sm:max-w-full mx-auto px-2 sm:px-4 space-y-4 sm:space-y-6">
      {/* Mobile Header with Menu */}
      <div className="flex sm:hidden items-center justify-between py-2">
        <h2 className="text-xl font-bold">Content Calendar</h2>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-background border rounded-lg shadow-lg p-4 space-y-2 absolute top-16 right-2 z-50 w-[calc(100%-1rem)]">
          <Button 
            variant={activeMobileTab === "calendar" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => handleMobileTabChange("calendar")}
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Calendar
          </Button>
          <Button 
            variant={activeMobileTab === "queue" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => handleMobileTabChange("queue")}
          >
            <ClockIcon className="h-4 w-4 mr-2" />
            Content Queue
          </Button>
          <Button 
            variant={activeMobileTab === "analytics" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => handleMobileTabChange("analytics")}
          >
            <BarChartIcon className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <div className="pt-2 border-t">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setShowScheduleModal(true);
                setIsMobileMenuOpen(false);
              }}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>
      )}

      {/* Desktop Header */}
      <div className="hidden sm:flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Content Calendar</h2>
          <p className="text-muted-foreground">
            Schedule and manage your social media content across platforms.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search posts..." 
              className="pl-8 w-full sm:w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setShowScheduleModal(true)} className="w-full sm:w-auto">
            <PlusIcon className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="sm:hidden relative">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search posts..." 
          className="pl-8 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Mobile Tab Button (if not in menu) */}
      <div className="sm:hidden flex border rounded-md overflow-hidden">
        <Button 
          variant={activeMobileTab === "calendar" ? "default" : "ghost"} 
          className="flex-1 rounded-none"
          onClick={() => setActiveMobileTab("calendar")}
        >
          Calendar
        </Button>
        <Button 
          variant={activeMobileTab === "queue" ? "default" : "ghost"} 
          className="flex-1 rounded-none"
          onClick={() => setActiveMobileTab("queue")}
        >
          Queue
        </Button>
        <Button 
          variant={activeMobileTab === "analytics" ? "default" : "ghost"} 
          className="flex-1 rounded-none"
          onClick={() => setActiveMobileTab("analytics")}
        >
          Stats
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Calendar Section */}
        <div className={`md:col-span-2 ${activeMobileTab !== "calendar" && "hidden sm:block"}`}>
          <Card className="shadow-sm">
            <CardHeader className="pb-2 space-y-0">
              <div className="flex justify-between items-center">
                <div className="flex flex-wrap items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setView(view === "month" ? "week" : "month")}
                  >
                    {view === "month" ? "Month" : "Week"}
                  </Button>
                  <div className="flex items-center">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setDate(prevDate => addDays(prevDate, view === "month" ? -30 : -7))}
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setDate(prevDate => addDays(prevDate, view === "month" ? 30 : 7))}
                    >
                      <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                    <h3 className="text-sm md:text-base font-semibold px-1">
                      {format(date, "MMM yyyy")}
                    </h3>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setDate(new Date())} className="text-xs h-8">
                  Today
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              {view === "month" ? (
                <Calendar
                  mode="multiple"
                  selected={scheduledPosts.map(post => new Date(post.scheduledFor))}
                  onDayClick={handleDateSelect}
                  month={date}
                  className="rounded-md border w-full mx-auto"
                  components={{
                    Day: ({ day, ...props }) => {
                      const dayHasPosts = scheduledPosts.some(post => 
                        isSameDay(new Date(post.scheduledFor), day)
                      );
                      
                      const postsForDay = scheduledPosts.filter(post => 
                        isSameDay(new Date(post.scheduledFor), day)
                      );
                      
                      const platformsForDay = postsForDay.flatMap(post => post.platforms);
                      const uniquePlatforms = [...new Set(platformsForDay)];
                      
                      return (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div 
                                {...props}
                                className={`${props.className} ${isToday(day) ? "bg-primary/10" : ""} relative`}
                              >
                                {format(day, "d")}
                                {dayHasPosts && (
                                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                                    {uniquePlatforms.slice(0, 3).map((platform, idx) => {
                                      const platformInfo = socialPlatforms.find(p => p.id === platform);
                                      return (
                                        <div 
                                          key={idx} 
                                          className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${platformInfo?.bgColor || "bg-primary"}`}
                                        />
                                      );
                                    })}
                                    {uniquePlatforms.length > 3 && (
                                      <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-gray-400" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </TooltipTrigger>
                            {dayHasPosts && (
                              <TooltipContent>
                                <p>{postsForDay.length} post{postsForDay.length > 1 ? 's' : ''} scheduled</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      );
                    }
                  }}
                />
              ) : (
                <div className="border rounded-md divide-y text-sm">
                  {calendarDays.map(day => {
                    const postsForDay = getPostsForDate(day);
                    
                    return (
                      <div key={day.toString()} className="p-2 md:p-4">
                        <div className={`flex justify-between items-center mb-2 ${isToday(day) ? "text-primary font-medium" : ""}`}>
                          <h4 className="font-medium">{format(day, "EEE")}</h4>
                          <span>{format(day, "MMM d")}</span>
                        </div>
                        
                        {postsForDay.length > 0 ? (
                          <div className="space-y-1 md:space-y-2">
                            {postsForDay.map(post => {
                              const postTime = format(new Date(post.scheduledFor), "h:mm a");
                              
                              return (
                                <div 
                                  key={post.id} 
                                  className="flex items-center p-1 md:p-2 rounded-md border hover:bg-accent group cursor-pointer"
                                  onClick={() => handleEditPost(post)}
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1 md:gap-2">
                                      {renderPlatformIcons(post.platforms)}
                                      <span className="text-xs md:text-sm text-muted-foreground">{postTime}</span>
                                    </div>
                                    <p className="text-xs md:text-sm line-clamp-1 mt-1">{post.content}</p>
                                  </div>
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="ghost" className="h-6 w-6 md:h-7 md:w-7">
                                      <MoreHorizontalIcon className="h-3 w-3 md:h-4 md:w-4" />
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div 
                            className="flex items-center justify-center p-2 md:p-4 border rounded-md border-dashed text-muted-foreground hover:bg-accent/50 cursor-pointer" 
                            onClick={() => handleDateSelect(day)}
                          >
                            <PlusIcon className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                            <span className="text-xs md:text-sm">Add content</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              
              <div className="mt-4 md:mt-6">
                <h4 className="font-medium mb-2 md:mb-3 text-sm md:text-base flex items-center justify-between">
                  <span>Posts for {format(date, "MMM d, yyyy")}</span>
                  {getPostsForDate(date).length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-6 md:h-7 text-xs"
                      onClick={() => handleDateSelect(date)}
                    >
                      <PlusIcon className="h-3 w-3 mr-1" />
                      Add Post
                    </Button>
                  )}
                </h4>
                {getPostsForDate(date).length > 0 ? (
                  <DndContext 
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                  >
                    <SortableContext 
                      items={getPostsForDate(date).map(post => post.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {getPostsForDate(date).map(post => (
                        <SortablePostCard 
                          key={post.id} 
                          post={post} 
                          renderPostCard={renderPostCard} 
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                ) : (
                  <div className="text-center py-6 md:py-8 border rounded-lg">
                    <p className="text-muted-foreground text-sm">No posts scheduled for this date</p>
                    <Button variant="outline" className="mt-2 text-xs md:text-sm" onClick={() => handleDateSelect(date)}>
                      Schedule a Post
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Section (Content Queue and Analytics) */}
        <div className={`${(activeMobileTab === "calendar") && "hidden sm:block"}`}>
          <div className="space-y-4">
            {/* Content Queue */}
            <Card className={`shadow-sm ${activeMobileTab !== "queue" && activeMobileTab !== "calendar" && "hidden sm:block"}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base md:text-lg">Content Queue</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Manage your scheduled and published content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-4 mb-3 h-8">
                    <TabsTrigger value="upcoming" className="text-xs">Upcoming</TabsTrigger>
                    <TabsTrigger value="published" className="text-xs">Published</TabsTrigger>
                    <TabsTrigger value="drafts" className="text-xs">Drafts</TabsTrigger>
                    <TabsTrigger value="failed" className="text-xs">Failed</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upcoming" className="space-y-3">
                    <ScrollArea className="h-[350px] md:h-[500px] pr-2">
                      {getUpcomingPosts().length > 0 ? (
                        <DndContext 
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={handleDragEnd}
                          modifiers={[restrictToVerticalAxis]}
                        >
                          <SortableContext 
                            items={getUpcomingPosts().map(post => post.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {getUpcomingPosts().map(post => (
                              <SortablePostCard 
                                key={post.id} 
                                post={post} 
                                renderPostCard={renderPostCard} 
                              />
                            ))}
                          </SortableContext>
                        </DndContext>
                      ) : (
                        <div className="text-center py-6 md:py-8">
                          <p className="text-muted-foreground text-sm">No upcoming posts</p>
                          <Button variant="outline" className="mt-2 text-xs" onClick={() => setShowScheduleModal(true)}>
                            Schedule a Post
                          </Button>
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="published" className="space-y-3">
                    <ScrollArea className="h-[350px] md:h-[500px] pr-2">
                      {getPublishedPosts().length > 0 ? (
                        getPublishedPosts().map(post => renderPostCard(post))
                      ) : (
                        <div className="text-center py-6 md:py-8">
                          <p className="text-muted-foreground text-sm">No published posts</p>
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="drafts" className="space-y-3">
                    <ScrollArea className="h-[350px] md:h-[500px] pr-2">
                      {getDraftPosts().length > 0 ? (
                        getDraftPosts().map(post => renderPostCard(post))
                      ) : (
                        <div className="text-center py-6 md:py-8">
                          <p className="text-muted-foreground text-sm">No drafts saved</p>
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="failed" className="space-y-3">
                    <ScrollArea className="h-[350px] md:h-[500px] pr-2">
                      {getFailedPosts().length > 0 ? (
                        getFailedPosts().map(post => renderPostCard(post))
                      ) : (
                        <div className="text-center py-6 md:py-8">
                          <p className="text-muted-foreground text-sm">No failed posts</p>
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* Analytics */}
            <Card className={`shadow-sm ${activeMobileTab !== "analytics" && activeMobileTab !== "calendar" && "hidden sm:block"}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base md:text-lg">Analytics</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Performance metrics for your content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs md:text-sm font-medium">Posts this week</div>
                      <div className="text-xl md:text-2xl font-bold">12</div>
                    </div>
                    <BarChartIcon className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
                  </div>
                  
                  <div className="space-y-2">
                    {socialPlatforms.slice(0, 4).map((platform) => (
                      <div key={platform.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${platform.bgColor}`}></div>
                          <span className="text-xs md:text-sm">{platform.name}</span>
                        </div>
                        <span className="text-xs md:text-sm font-medium">
                          {Math.floor(Math.random() * 10) + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full text-xs md:text-sm" size="sm">
                    View detailed analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed right-4 bottom-4 sm:hidden z-10">
        <Button size="icon" className="h-12 w-12 rounded-full shadow-lg" onClick={() => setShowScheduleModal(true)}>
          <PlusIcon className="h-6 w-6" />
        </Button>
      </div>

      {/* Schedule Post Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="w-[95%] max-w-[340px] sm:max-w-xl md:max-w-2xl p-2 sm:p-3 md:p-6 overflow-y-auto max-h-[90vh]">
          <DialogHeader className="space-y-1 sm:space-y-2">
            <DialogTitle className="text-base sm:text-lg">{editingPost ? "Edit Post" : "Schedule New Post"}</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Create and schedule your post across multiple platforms.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-2 sm:gap-3 md:gap-4 py-1 sm:py-2">
            <div className="flex items-center justify-between flex-wrap gap-1 sm:gap-2">
              <div className="flex items-center gap-1 sm:gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowTemplateSelector(true)}
                  className="h-6 sm:h-7 text-[10px] sm:text-xs px-1.5 sm:px-2"
                >
                  <FileTextIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Templates
                </Button>
                {selectedTemplate && (
                  <Badge variant="outline" className="gap-1 text-[10px] sm:text-xs h-6 sm:h-7 truncate max-w-[120px] sm:max-w-none">
                    {selectedTemplate.icon}
                    <span className="truncate">{selectedTemplate.name}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-3 w-3 sm:h-4 sm:w-4 ml-1 hover:bg-transparent" 
                      onClick={() => setSelectedTemplate(null)}
                    >
                      ×
                    </Button>
                  </Badge>
                )}
              </div>
              <Dialog open={showTemplateSelector} onOpenChange={setShowTemplateSelector}>
                <DialogContent className="w-[90%] max-w-[300px] sm:max-w-sm p-2 sm:p-3 md:p-6 overflow-y-auto max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle className="text-sm sm:text-base">Select a Template</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-1 sm:gap-2 mt-1 sm:mt-2">
                    {postTemplates.map(template => (
                      <Button 
                        key={template.id} 
                        variant="outline" 
                        className="justify-start h-auto py-1 sm:py-2 text-[10px] sm:text-xs"
                        onClick={() => handleUseTemplate(template)}
                      >
                        <div className="flex items-center gap-1 sm:gap-2">
                          <div className="p-1 bg-primary/10 rounded">
                            {template.icon}
                          </div>
                          <div className="text-left">
                            <div className="font-medium">{template.name}</div>
                            <div className="text-[8px] sm:text-[10px] md:text-xs text-muted-foreground line-clamp-1">
                              {template.content}
                            </div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:gap-3 md:gap-4">
              <div>
                <div className="relative">
                  <Textarea 
                    placeholder="What would you like to share?" 
                    className="min-h-[60px] sm:min-h-[80px] md:min-h-[100px] text-xs sm:text-sm resize-y p-2 sm:p-3"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                  />
                  
                  {showHashtagSuggestions && (
                    <div className="absolute bottom-2 right-2 z-10">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="secondary" size="sm" className="h-6 sm:h-7 text-[10px] sm:text-xs">
                            <HashIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                            Hashtags
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40 sm:w-48 md:w-56 p-1 sm:p-2">
                          <div className="text-[10px] sm:text-xs md:text-sm font-medium mb-1 sm:mb-2">Suggested Hashtags</div>
                          <div className="grid gap-0.5 sm:gap-1">
                            {["marketing", "socialmedia", "content", "digital", "brand"].map(tag => (
                              <Button 
                                key={tag} 
                                variant="ghost" 
                                size="sm" 
                                className="justify-start text-[10px] sm:text-xs h-6 sm:h-7"
                                onClick={() => handleAddTag(tag)}
                              >
                                #{tag}
                              </Button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
                
                {postTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1 sm:mt-2">
                    {postTags.map(tag => (
                      <Badge key={tag} variant="secondary" className="gap-1 text-[10px] sm:text-xs py-0 h-4 sm:h-5">
                        #{tag}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-2.5 w-2.5 sm:h-3 sm:w-3 ml-0.5 sm:ml-1 hover:bg-transparent" 
                          onClick={() => handleRemoveTag(tag)}
                        >
                          ×
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              {postMedia.length > 0 && (
                <div className="flex gap-1 sm:gap-2 md:gap-3 overflow-x-auto pb-1 sm:pb-2">
                  {postMedia.map(media => (
                    <div key={media.id} className="relative flex-shrink-0">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded bg-muted flex items-center justify-center overflow-hidden">
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
                              <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-black/50 flex items-center justify-center">
                                <VideoIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-white" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <Button 
                        size="icon" 
                        variant="destructive"
                        className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 rounded-full"
                        onClick={() => handleRemoveMedia(media.id)}
                      >
                        <Trash2Icon className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <Button variant="outline" size="sm" onClick={() => handleAddMedia('image')} className="text-[10px] sm:text-xs h-6 sm:h-7 px-1.5 sm:px-2">
                  <ImageIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Image
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAddMedia('video')} className="text-[10px] sm:text-xs h-6 sm:h-7 px-1.5 sm:px-2">
                  <VideoIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Video
                </Button>
                <Button variant="outline" size="sm" className="text-[10px] sm:text-xs h-6 sm:h-7 px-1.5 sm:px-2">
                  <LinkIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Link
                </Button>
                <Dialog open={showMediaLibrary} onOpenChange={setShowMediaLibrary}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-[10px] sm:text-xs h-6 sm:h-7 px-1.5 sm:px-2">
                      <FolderIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                      Media
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[90%] max-w-[300px] sm:max-w-sm md:max-w-md p-2 sm:p-3 md:p-6 overflow-y-auto max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle className="text-sm sm:text-base">Media Library</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-1 sm:gap-2 md:gap-3 mt-1 sm:mt-2">
                      {savedMedia.map(media => (
                        <div 
                          key={media.id} 
                          className="relative cursor-pointer border rounded p-1 hover:bg-accent"
                          onClick={() => handleSelectSavedMedia(media)}
                        >
                          <div className="w-full aspect-square rounded bg-muted flex items-center justify-center overflow-hidden">
                            {media.type === 'image' && (
                              <img 
                                src={media.thumbnail} 
                                alt={media.name} 
                                className="w-full h-full object-cover"
                              />
                            )}
                            {media.type === 'video' && (
                              <div className="relative w-full h-full">
                                <img 
                                  src={media.thumbnail} 
                                  alt={media.name} 
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-black/50 flex items-center justify-center">
                                    <VideoIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-white" />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="text-[8px] sm:text-[10px] md:text-xs truncate mt-1">{media.name}</div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
                
                <div className="ml-auto">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowPostPreview(true)}
                    className="text-[10px] sm:text-xs h-6 sm:h-7 px-1.5 sm:px-2"
                  >
                    <EyeIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mt-1 sm:mt-2">
                <div>
                  <label className="block text-[10px] sm:text-xs md:text-sm font-medium mb-1">Platforms</label>
                  <div className="space-y-1 md:space-y-2 border rounded-md p-1.5 sm:p-2">
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-0.5 sm:gap-1">
                      {socialPlatforms.map(platform => (
                        <div key={platform.id} className="flex items-center space-x-1 sm:space-x-2">
                          <Checkbox 
                            id={platform.id} 
                            checked={selectedPlatforms.includes(platform.id)}
                            onCheckedChange={() => handleTogglePlatform(platform.id)}
                            className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4"
                          />
                          <label 
                            htmlFor={platform.id} 
                            className="text-[10px] sm:text-xs md:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                          >
                            <div className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center ${platform.bgColor} ${platform.iconColor} mr-1 sm:mr-2 text-[8px] sm:text-[10px] md:text-xs`}>
                              {typeof platform.icon === 'string' ? platform.icon.charAt(0) : platform.icon}
                            </div>
                            {platform.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-2 sm:mt-3">
                    <label className="block text-[10px] sm:text-xs md:text-sm font-medium mb-1">Category</label>
                    <Select defaultValue={postCategory} onValueChange={setPostCategory}>
                      <SelectTrigger className="text-[10px] sm:text-xs h-7 sm:h-8 md:h-10">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {contentCategories.map(category => (
                          <SelectItem key={category.id} value={category.id} className="text-[10px] sm:text-xs md:text-sm">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${category.color}`}></div>
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] sm:text-xs md:text-sm font-medium">Schedule</label>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-[8px] sm:text-[10px] md:text-xs text-muted-foreground">Recurring</span>
                      <Switch 
                        checked={isRecurring}
                        onCheckedChange={setIsRecurring}
                        className="h-3 sm:h-4 md:h-6 w-5 sm:w-8 md:w-11 data-[state=checked]:bg-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-2 sm:mb-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal text-[10px] sm:text-xs h-7 sm:h-8 md:h-10"
                        >
                          <CalendarIcon className="mr-1 sm:mr-2 h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
                          {format(selectedDate, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                          className="rounded-md"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="mb-2 sm:mb-3">
                    <Select defaultValue={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger className="text-[10px] sm:text-xs h-7 sm:h-8 md:h-10">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }).map((_, hour) => (
                          <Fragment key={hour}>
                            <SelectItem value={`${hour.toString().padStart(2, '0')}:00`} className="text-[10px] sm:text-xs md:text-sm">
                              {format(new Date().setHours(hour, 0), "h:mm a")}
                            </SelectItem>
                            <SelectItem value={`${hour.toString().padStart(2, '0')}:30`} className="text-[10px] sm:text-xs md:text-sm">
                              {format(new Date().setHours(hour, 30), "h:mm a")}
                            </SelectItem>
                          </Fragment>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {getSuggestedTimes().length > 0 && (
                    <div className="mb-2 sm:mb-3">
                      <label className="block text-[10px] sm:text-xs md:text-sm font-medium mb-1">Suggested times</label>
                      <div className="flex flex-wrap gap-1">
                        {getSuggestedTimes().map(time => (
                          <Badge 
                            key={time} 
                            variant="outline" 
                            className="cursor-pointer hover:bg-primary/10 text-[8px] sm:text-[10px] md:text-xs py-0 h-4 sm:h-5"
                            onClick={() => setSelectedTime(time)}
                          >
                            <CheckCircleIcon className="h-1.5 w-1.5 sm:h-2 sm:w-2 md:h-3 md:w-3 mr-0.5 sm:mr-1" />
                            {format(new Date().setHours(
                              parseInt(time.split(':')[0]), 
                              parseInt(time.split(':')[1] || '0')
                            ), "h:mm a")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {isRecurring && (
                    <div className="space-y-1 sm:space-y-2 md:space-y-3 mt-1 sm:mt-2 border rounded-md p-1.5 sm:p-2">
                      <div>
                        <label className="block text-[10px] sm:text-xs md:text-sm font-medium mb-1">Frequency</label>
                        <Select defaultValue={recurringFrequency} onValueChange={setRecurringFrequency}>
                          <SelectTrigger className="text-[10px] sm:text-xs h-7 sm:h-8 md:h-10">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily" className="text-[10px] sm:text-xs md:text-sm">Daily</SelectItem>
                            <SelectItem value="weekly" className="text-[10px] sm:text-xs md:text-sm">Weekly</SelectItem>
                            <SelectItem value="biweekly" className="text-[10px] sm:text-xs md:text-sm">Bi-weekly</SelectItem>
                            <SelectItem value="monthly" className="text-[10px] sm:text-xs md:text-sm">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-[10px] sm:text-xs md:text-sm font-medium mb-1">End date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal text-[10px] sm:text-xs h-7 sm:h-8 md:h-10"
                            >
                              <CalendarIcon className="mr-1 sm:mr-2 h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
                              {format(recurringEndDate, "PPP")}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={recurringEndDate}
                              onSelect={setRecurringEndDate}
                              disabled={(date) => date < selectedDate}
                              initialFocus
                              className="rounded-md"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-end gap-2 mt-2 sm:mt-3 pt-1 sm:pt-2 border-t">
            <Button variant="outline" onClick={handleCloseScheduleModal} className="text-[10px] sm:text-xs h-6 sm:h-8">
              Cancel
            </Button>
            <Button 
              onClick={handleAddPost} 
              disabled={!postContent || selectedPlatforms.length === 0 || isLoading}
              className="text-[10px] sm:text-xs h-6 sm:h-8"
            >
              {isLoading ? (
                <>
                  <RefreshCwIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 mr-1 md:mr-2 animate-spin" />
                  Processing
                </>
              ) : (
                editingPost ? "Update" : (isRecurring ? "Schedule Series" : "Schedule")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Post Preview Modal */}
      <Dialog open={showPostPreview} onOpenChange={setShowPostPreview}>
        <DialogContent className="w-[90%] max-w-[300px] sm:max-w-sm p-2 sm:p-3 md:p-6 overflow-y-auto max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-sm sm:text-base">Post Preview</DialogTitle>
            <DialogDescription className="text-[10px] sm:text-xs">
              {selectedPlatforms.length > 0 
                ? `Preview for ${socialPlatforms.find(p => p.id === selectedPlatforms[0])?.name}` 
                : "Select a platform to preview"}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlatforms.length > 0 ? (
            <div className="border rounded-lg p-2 sm:p-3 bg-white dark:bg-gray-900">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-[10px] sm:text-xs md:text-sm">Your Business</div>
                  <div className="text-[8px] sm:text-[10px] md:text-xs text-muted-foreground">Just now</div>
                </div>
              </div>
              
              <p className="text-[10px] sm:text-xs md:text-sm my-1 sm:my-2">{postContent}</p>
              
              {postMedia.length > 0 && (
                <div className="mt-1 sm:mt-2 rounded-md overflow-hidden border">
                  {postMedia[0].type === 'image' ? (
                    <img 
                      src={postMedia[0].url} 
                      alt="" 
                      className="w-full aspect-video object-cover"
                    />
                  ) : (
                    <div className="relative w-full aspect-video bg-muted flex items-center justify-center">
                      <VideoIcon className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-muted-foreground" />
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between mt-2 sm:mt-3 text-muted-foreground text-[10px] sm:text-xs">
                <div className="flex items-center gap-2 sm:gap-4">
                  <span>❤️ 0</span>
                  <span>💬 0</span>
                </div>
                <span>🔄 0</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 sm:py-6 md:py-8">
              <p className="text-muted-foreground text-[10px] sm:text-xs">Select a platform to preview your post</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
