import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, addDays, getDay, setHours, setMinutes } from "date-fns";
import { CalendarIcon, Clock, Activity, BarChart3, Users, Check, PlusCircle, PlusIcon } from "lucide-react";

export function SmartScheduler({ accounts }) {
  const [date, setDate] = useState(new Date());
  const [scheduledTime, setScheduledTime] = useState({
    hour: "12",
    minutes: "00",
    ampm: "pm"
  });
  const [platform, setPlatform] = useState("all");
  const [recommendedTimes, setRecommendedTimes] = useState([]);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [publishingCalendar, setPublishingCalendar] = useState([]);
  const [bestTimes, setBestTimes] = useState({});

  useEffect(() => {
    // Generate recommended scheduling times based on platform engagement data
    if (accounts && accounts.length > 0) {
      generateRecommendedTimes(platform);
      generatePublishingCalendar();
      generateBestTimes();
    }
  }, [accounts, platform]);

  const generateRecommendedTimes = (selectedPlatform) => {
    // This would ideally come from actual engagement data analysis
    // For demo, we'll generate some random recommended times
    const times = [];
    const platforms = selectedPlatform === "all" 
      ? accounts.map(a => a.platform) 
      : [selectedPlatform];
    
    platforms.forEach(platform => {
      // Different optimal times per platform based on typical user behavior
      let baseTimes = [];
      
      switch(platform) {
        case "facebook":
          baseTimes = [
            { hour: 9, minute: 0 },
            { hour: 13, minute: 0 },
            { hour: 15, minute: 0 },
            { hour: 19, minute: 0 }
          ];
          break;
        case "instagram":
          baseTimes = [
            { hour: 11, minute: 0 },
            { hour: 13, minute: 0 },
            { hour: 19, minute: 0 },
            { hour: 21, minute: 0 }
          ];
          break;
        case "twitter":
          baseTimes = [
            { hour: 8, minute: 0 },
            { hour: 12, minute: 0 },
            { hour: 17, minute: 0 },
            { hour: 22, minute: 0 }
          ];
          break;
        case "linkedin":
          baseTimes = [
            { hour: 8, minute: 0 },
            { hour: 10, minute: 30 },
            { hour: 12, minute: 0 },
            { hour: 17, minute: 30 }
          ];
          break;
        default:
          baseTimes = [
            { hour: 9, minute: 0 },
            { hour: 12, minute: 0 },
            { hour: 15, minute: 0 },
            { hour: 18, minute: 0 }
          ];
      }
      
      // Add randomness to engagement scores while keeping the pattern
      baseTimes.forEach(time => {
        // Create dates for the next 7 days
        for (let i = 0; i < 3; i++) {
          const scheduleDate = addDays(new Date(), i);
          
          // Skip times in the past
          if (i === 0 && 
              (time.hour < new Date().getHours() || 
              (time.hour === new Date().getHours() && time.minute < new Date().getMinutes()))) {
            continue;
          }
          
          const scheduledDateTime = setMinutes(setHours(scheduleDate, time.hour), time.minute);
          
          // Randomize engagement score but keep within a reasonable range
          // Higher engagement on weekends for some platforms
          const dayOfWeek = getDay(scheduleDate);
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          
          let baseEngagement;
          switch(platform) {
            case "facebook":
              baseEngagement = isWeekend ? 85 : 75;
              break;
            case "instagram":
              baseEngagement = isWeekend ? 90 : 80;
              break;
            case "twitter":
              baseEngagement = 70; // Less affected by weekends
              break;
            case "linkedin":
              baseEngagement = isWeekend ? 50 : 80; // Much better on weekdays
              break;
            default:
              baseEngagement = isWeekend ? 80 : 75;
          }
          
          // Morning/evening premium for certain platforms
          if ((platform === "instagram" || platform === "facebook") && 
              (time.hour >= 18 || time.hour <= 9)) {
            baseEngagement += 5;
          }
          
          // Midday premium for LinkedIn
          if (platform === "linkedin" && time.hour >= 10 && time.hour <= 14) {
            baseEngagement += 10;
          }
          
          // Add randomness
          const engagement = Math.min(100, Math.max(40, 
            baseEngagement + Math.floor(Math.random() * 10) - 5));
          
          times.push({
            platform,
            date: scheduledDateTime,
            engagement,
            formattedTime: format(scheduledDateTime, "h:mm a"),
            formattedDate: format(scheduledDateTime, "EEE, MMM d")
          });
        }
      });
    });
    
    // Sort by engagement score (highest first)
    times.sort((a, b) => b.engagement - a.engagement);
    
    setRecommendedTimes(times);
  };

  const generatePublishingCalendar = () => {
    const calendar = [];
    const now = new Date();
    
    // Generate some sample scheduled posts for the next 14 days
    for (let i = 0; i < 14; i++) {
      const day = addDays(now, i);
      const dayPosts = [];
      
      // Random number of posts per day (0-3)
      const numPosts = Math.floor(Math.random() * 4);
      
      for (let j = 0; j < numPosts; j++) {
        // Random hour between 8 and 20
        const hour = Math.floor(Math.random() * 13) + 8;
        const minute = Math.random() > 0.5 ? 0 : 30;
        
        // Random platform
        const platformIndex = Math.floor(Math.random() * accounts.length);
        const platform = accounts[platformIndex]?.platform || "facebook";
        
        dayPosts.push({
          id: `post-${i}-${j}`,
          time: setMinutes(setHours(day, hour), minute),
          platform,
          content: getRandomPostContent(),
          status: i === 0 && hour < now.getHours() ? "published" : "scheduled"
        });
      }
      
      calendar.push({
        date: day,
        posts: dayPosts
      });
    }
    
    setPublishingCalendar(calendar);
    
    // Generate some scheduled posts for the calendar view
    const sampleScheduledPosts = [];
    for (let i = 0; i < 8; i++) {
      const postDate = addDays(now, Math.floor(Math.random() * 14));
      const hour = Math.floor(Math.random() * 13) + 8;
      const minute = Math.random() > 0.5 ? 0 : 30;
      const platformIndex = Math.floor(Math.random() * accounts.length);
      
      sampleScheduledPosts.push({
        id: `sched-${i}`,
        scheduledFor: setMinutes(setHours(postDate, hour), minute),
        platform: accounts[platformIndex]?.platform || "facebook",
        content: getRandomPostContent(),
        status: "scheduled"
      });
    }
    
    setScheduledPosts(sampleScheduledPosts);
  };

  const generateBestTimes = () => {
    const times = {};
    
    accounts.forEach(account => {
      switch(account.platform) {
        case "facebook":
          times[account.platform] = {
            weekday: ["9:00 AM", "1:00 PM", "3:00 PM"],
            weekend: ["12:00 PM", "1:00 PM", "7:00 PM"]
          };
          break;
        case "instagram":
          times[account.platform] = {
            weekday: ["11:00 AM", "1:00 PM", "7:00 PM"],
            weekend: ["9:00 AM", "11:00 AM", "8:00 PM"]
          };
          break;
        case "twitter":
          times[account.platform] = {
            weekday: ["8:00 AM", "12:00 PM", "5:00 PM"],
            weekend: ["9:00 AM", "2:00 PM", "6:00 PM"]
          };
          break;
        case "linkedin":
          times[account.platform] = {
            weekday: ["8:00 AM", "10:30 AM", "5:30 PM"],
            weekend: ["10:00 AM", "12:00 PM", "3:00 PM"]
          };
          break;
        default:
          times[account.platform] = {
            weekday: ["9:00 AM", "12:00 PM", "3:00 PM"],
            weekend: ["11:00 AM", "2:00 PM", "5:00 PM"]
          };
      }
    });
    
    setBestTimes(times);
  };

  const getRandomPostContent = () => {
    const contents = [
      "Check out our latest product update!",
      "We're excited to announce our new partnership with...",
      "Behind the scenes look at our design process",
      "Tips and tricks for getting the most out of our service",
      "Customer spotlight: See how they achieved success",
      "Join us for our upcoming webinar on...",
      "Limited time offer: Get 20% off this week",
      "Thank you to our amazing community for your support!"
    ];
    
    return contents[Math.floor(Math.random() * contents.length)];
  };

  const getEngagementLevel = (score) => {
    if (score >= 80) return "High";
    if (score >= 60) return "Medium";
    return "Low";
  };

  const getEngagementColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getPlatformColor = (platform) => {
    switch(platform) {
      case "facebook": return "bg-blue-600";
      case "instagram": return "bg-pink-600";
      case "twitter": return "bg-sky-500";
      case "linkedin": return "bg-blue-800";
      default: return "bg-gray-600";
    }
  };

  const getPlatformName = (platform) => {
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  const handleScheduleClick = (recommendedTime) => {
    // In a real app, this would open a post creation dialog with pre-filled time
    setDate(recommendedTime.date);
    const hours = recommendedTime.date.getHours();
    const minutes = recommendedTime.date.getMinutes();
    
    setScheduledTime({
      hour: hours > 12 ? (hours - 12).toString() : hours.toString(),
      minutes: minutes.toString().padStart(2, '0'),
      ampm: hours >= 12 ? "pm" : "am"
    });
    
    setPlatform(recommendedTime.platform);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Smart Scheduler</CardTitle>
            <CardDescription>
              Optimize your posting schedule based on engagement data
            </CardDescription>
          </div>
          <Button size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recommendations">
          <TabsList className="mb-4">
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="insights">Best Times</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommendations">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Filter by Platform</label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  {accounts.map(account => (
                    <SelectItem key={account.id} value={account.platform}>
                      {getPlatformName(account.platform)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <h3 className="font-medium mb-3 flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Optimal Posting Times
            </h3>
            
            <div className="space-y-3">
              {recommendedTimes.slice(0, 6).map((time, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/10"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${getPlatformColor(time.platform)}`}>
                      {time.platform.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{time.formattedDate}</div>
                      <div className="text-sm text-muted-foreground">
                        {time.formattedTime} • {getPlatformName(time.platform)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Engagement</div>
                      <div className={`font-medium ${getEngagementColor(time.engagement)}`}>
                        {getEngagementLevel(time.engagement)}
                        <span className="text-xs ml-1">({time.engagement}%)</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleScheduleClick(time)}
                    >
                      Schedule
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-3 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Traffic Analysis
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Audience Activity</h4>
                  <div className="space-y-2">
                    {accounts.slice(0, 2).map((account, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${getPlatformColor(account.platform)}`}>
                            {account.platform.charAt(0).toUpperCase()}
                          </div>
                          <span>{getPlatformName(account.platform)}</span>
                        </div>
                        <div>
                          <span className="text-sm">
                            Peak: <span className="font-medium">
                              {["10AM - 2PM", "7PM - 10PM"][i]}
                            </span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Daily Recommendations</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Weekdays</span>
                      <ul className="text-sm">
                        <li>Morning: 8AM - 10AM</li>
                        <li>Afternoon: 12PM - 2PM</li>
                        <li>Evening: 5PM - 7PM</li>
                      </ul>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Weekends</span>
                      <ul className="text-sm">
                        <li>Morning: 9AM - 11AM</li>
                        <li>Afternoon: 1PM - 3PM</li>
                        <li>Evening: 7PM - 9PM</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="calendar">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                <div key={i} className="text-center text-sm font-medium p-2">
                  {day}
                </div>
              ))}
              
              {publishingCalendar.slice(0, 14).map((day, dayIndex) => {
                const dayOfWeek = getDay(day.date);
                // Calculate offset for first week
                const offset = dayIndex < 7 && dayOfWeek > 0 ? dayOfWeek : 0;
                
                return (
                  <div
                    key={dayIndex}
                    className={`p-3 border rounded-lg ${
                      format(day.date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
                        ? "bg-primary/10 border-primary"
                        : ""
                    }`}
                    style={{
                      gridColumnStart: dayIndex < 7 ? offset + 1 : undefined,
                      minHeight: "100px"
                    }}
                  >
                    <div className="text-sm font-medium mb-1">
                      {format(day.date, "d MMM")}
                    </div>
                    
                    {day.posts.length > 0 ? (
                      <div className="space-y-1">
                        {day.posts.map((post, postIndex) => (
                          <div 
                            key={post.id} 
                            className={`text-xs p-1 rounded flex items-center gap-1 ${
                              post.status === "published"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${getPlatformColor(post.platform)}`}></div>
                            <span>{format(post.time, "h:mm a")}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 rounded-full p-0"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <h3 className="font-medium mt-6 mb-3">Upcoming Scheduled Posts</h3>
            <div className="space-y-3">
              {scheduledPosts
                .filter(post => new Date(post.scheduledFor) > new Date())
                .sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor))
                .slice(0, 3)
                .map(post => (
                  <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${getPlatformColor(post.platform)}`}>
                        {post.platform.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{format(new Date(post.scheduledFor), "EEE, MMM d")}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(post.scheduledFor), "h:mm a")} • {getPlatformName(post.platform)}
                        </div>
                      </div>
                    </div>
                    <div>
                      <Button size="sm" variant="ghost">Edit</Button>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="insights">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Highest Engagement Hours</CardTitle>
                    <CardDescription>
                      When your audience is most active
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {accounts.map((account, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${getPlatformColor(account.platform)}`}>
                              {account.platform.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{getPlatformName(account.platform)}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 bg-muted rounded-lg">
                              <div className="text-xs text-muted-foreground mb-1">Weekdays</div>
                              <div className="space-y-1">
                                {bestTimes[account.platform]?.weekday.map((time, timeIndex) => (
                                  <div key={timeIndex} className="flex items-center text-sm">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>{time}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="p-2 bg-muted rounded-lg">
                              <div className="text-xs text-muted-foreground mb-1">Weekends</div>
                              <div className="space-y-1">
                                {bestTimes[account.platform]?.weekend.map((time, timeIndex) => (
                                  <div key={timeIndex} className="flex items-center text-sm">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>{time}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Audience Activity Insights</CardTitle>
                    <CardDescription>
                      Content timing recommendations by demographic
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { group: "Gen Z (18-24)", times: ["9:00 PM - 11:00 PM", "12:00 PM - 2:00 PM"] },
                        { group: "Millennials (25-34)", times: ["7:00 AM - 9:00 AM", "8:00 PM - 10:00 PM"] },
                        { group: "Gen X (35-44)", times: ["6:00 PM - 8:00 PM", "8:00 AM - 10:00 AM"] },
                        { group: "Boomers (45+)", times: ["9:00 AM - 11:00 AM", "3:00 PM - 5:00 PM"] }
                      ].map((demographic, i) => (
                        <div key={i} className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="h-4 w-4" />
                            <span className="font-medium">{demographic.group}</span>
                          </div>
                          <div className="text-sm space-y-1">
                            {demographic.times.map((time, timeIndex) => (
                              <div key={timeIndex} className="flex items-center">
                                <Check className="h-3 w-3 mr-1 text-green-600" />
                                <span>{time}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Platform Best Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      {
                        platform: "facebook",
                        timing: "1-2 posts per day",
                        bestTimes: "Weekdays: 1-4pm, Weekends: 12-1pm",
                        tips: "Videos perform best, aim for 1-2 minute length"
                      },
                      {
                        platform: "instagram",
                        timing: "1-3 posts per day",
                        bestTimes: "Weekdays: 11am-1pm, 7-9pm",
                        tips: "Stories throughout the day, feed posts during peak hours"
                      },
                      {
                        platform: "twitter",
                        timing: "3-5 tweets per day",
                        bestTimes: "Weekdays: 8am-10am, 12pm-1pm",
                        tips: "Space tweets throughout the day, engage with trending topics"
                      },
                      {
                        platform: "linkedin",
                        timing: "1 post per day",
                        bestTimes: "Weekdays: 8am-10am, 5pm-6pm",
                        tips: "Business hours perform best, avoid weekends"
                      }
                    ].map((plat, i) => (
                      <div key={i} className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getPlatformColor(plat.platform)}`}>
                            {plat.platform.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{getPlatformName(plat.platform)}</span>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div>
                            <div className="text-xs text-muted-foreground">Posting Frequency</div>
                            <div>{plat.timing}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Best Times</div>
                            <div>{plat.bestTimes}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Tips</div>
                            <div>{plat.tips}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 