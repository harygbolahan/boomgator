import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';

export function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("last30days");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [activeMetric, setActiveMetric] = useState("impressions");
  const [activeDashboard, setActiveDashboard] = useState("overview");

  const handleDateRangeChange = (value) => {
    setDateRange(value);
  };

  const handlePlatformChange = (value) => {
    setSelectedPlatform(value);
  };

  const getFilteredData = () => {
    if (selectedPlatform === "all") {
      return analyticsData;
    }
    return analyticsData.filter(item => item.platform === selectedPlatform);
  };

  const getTotalMetrics = () => {
    const filteredData = getFilteredData();
    return {
      impressions: filteredData.reduce((sum, item) => sum + item.impressions, 0),
      engagement: filteredData.reduce((sum, item) => sum + item.engagement, 0),
      clicks: filteredData.reduce((sum, item) => sum + item.clicks, 0),
      followers: filteredData.reduce((sum, item) => sum + item.followers, 0)
    };
  };

  const getPlatformMetrics = () => {
    const result = [];
    const platforms = [...new Set(analyticsData.map(item => item.platform))];
    
    platforms.forEach(platform => {
      const platformData = analyticsData.filter(item => item.platform === platform);
      result.push({
        name: platform,
        impressions: platformData.reduce((sum, item) => sum + item.impressions, 0),
        engagement: platformData.reduce((sum, item) => sum + item.engagement, 0),
        clicks: platformData.reduce((sum, item) => sum + item.clicks, 0),
        followers: platformData.reduce((sum, item) => sum + item.followers, 0)
      });
    });
    
    return result;
  };

  const getDailyData = () => {
    const result = [];
    const platforms = [...new Set(analyticsData.map(item => item.platform))];
    const days = [...new Set(analyticsData.map(item => item.date))].sort();
    
    days.forEach(day => {
      const dayObj = { date: day };
      
      platforms.forEach(platform => {
        const item = analyticsData.find(d => d.date === day && d.platform === platform);
        if (item) {
          dayObj[`${platform}_impressions`] = item.impressions;
          dayObj[`${platform}_engagement`] = item.engagement;
          dayObj[`${platform}_clicks`] = item.clicks;
        }
      });
      
      result.push(dayObj);
    });
    
    return result;
  };

  const getContentPerformance = () => {
    return contentData.map(item => ({
      ...item,
      engagementRate: ((item.likes + item.comments + item.shares) / item.impressions * 100).toFixed(2)
    }));
  };

  const totalMetrics = getTotalMetrics();
  const platformMetrics = getPlatformMetrics();
  const dailyData = getDailyData();
  const contentPerformance = getContentPerformance();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A478E8', '#FF6B6B'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">
            Track your social media performance across platforms.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-auto flex items-center space-x-2">
          <Select defaultValue={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="last30days">Last 30 days</SelectItem>
              <SelectItem value="last90days">Last 90 days</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-auto flex items-center space-x-2">
          <Select defaultValue={selectedPlatform} onValueChange={handlePlatformChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All platforms</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1"></div>
        
        <Button variant="outline">
          Export Report
        </Button>
      </div>
      
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveDashboard}>
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Key metrics cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              title="Impressions"
              value={totalMetrics.impressions.toLocaleString()}
              change={8.1}
              icon="👁️"
              onClick={() => setActiveMetric("impressions")}
              isActive={activeMetric === "impressions"}
            />
            <MetricCard
              title="Engagement"
              value={totalMetrics.engagement.toLocaleString()}
              change={12.5}
              icon="👍"
              onClick={() => setActiveMetric("engagement")}
              isActive={activeMetric === "engagement"}
            />
            <MetricCard
              title="Clicks"
              value={totalMetrics.clicks.toLocaleString()}
              change={-3.2}
              icon="🔗"
              onClick={() => setActiveMetric("clicks")}
              isActive={activeMetric === "clicks"}
            />
            <MetricCard
              title="Followers"
              value={totalMetrics.followers.toLocaleString()}
              change={5.7}
              icon="👥"
              onClick={() => setActiveMetric("followers")}
              isActive={activeMetric === "followers"}
            />
          </div>
          
          {/* Historical trends chart */}
          <Card>
            <CardHeader>
              <CardTitle>Trend - {activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)}</CardTitle>
              <CardDescription>
                Daily {activeMetric} across platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {selectedPlatform === "all" ? (
                      <>
                        <Line type="monotone" dataKey="facebook_impressions" name="Facebook" stroke="#4267B2" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="instagram_impressions" name="Instagram" stroke="#E1306C" />
                        <Line type="monotone" dataKey="twitter_impressions" name="Twitter" stroke="#1DA1F2" />
                        <Line type="monotone" dataKey="linkedin_impressions" name="LinkedIn" stroke="#0077B5" />
                      </>
                    ) : (
                      <Line 
                        type="monotone" 
                        dataKey={`${selectedPlatform}_impressions`} 
                        name={selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} 
                        stroke="#0077B5" 
                        activeDot={{ r: 8 }} 
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Platform distribution chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
                <CardDescription>
                  Breakdown of {activeMetric} by platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={platformMetrics}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey={activeMetric}
                      >
                        {platformMetrics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => value.toLocaleString()} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
                <CardDescription>
                  Comparison across different metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={platformMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => value.toLocaleString()} />
                      <Legend />
                      <Bar dataKey="impressions" fill="#8884d8" />
                      <Bar dataKey="engagement" fill="#82ca9d" />
                      <Bar dataKey="clicks" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Content</CardTitle>
              <CardDescription>
                Content with the highest engagement rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentPerformance
                  .sort((a, b) => b.engagementRate - a.engagementRate)
                  .slice(0, 5)
                  .map((post, index) => (
                    <div key={post.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                        <img
                          src={post.image || "/placeholder-post.jpg"}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className={`w-4 h-4 rounded-full ${
                            post.platform === "facebook" ? "bg-blue-500" :
                            post.platform === "instagram" ? "bg-pink-500" :
                            post.platform === "twitter" ? "bg-sky-500" :
                            "bg-blue-700"
                          }`}></div>
                          <span className="text-sm font-medium">
                            {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {post.date}
                          </span>
                        </div>
                        <p className="text-sm line-clamp-2 mb-2">{post.content}</p>
                        <div className="flex flex-wrap gap-3">
                          <div className="flex items-center space-x-1 text-xs">
                            <span>👁️</span>
                            <span>{post.impressions.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs">
                            <span>👍</span>
                            <span>{post.likes.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs">
                            <span>💬</span>
                            <span>{post.comments.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs">
                            <span>🔄</span>
                            <span>{post.shares.toLocaleString()}</span>
                          </div>
                          <Badge variant="outline" className="ml-auto">
                            {post.engagementRate}% Engagement
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Type Performance</CardTitle>
                <CardDescription>
                  Engagement by content type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={contentTypeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                      <Bar dataKey="engagementRate" fill="#8884d8" name="Avg. Engagement Rate" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Best Posting Times</CardTitle>
                <CardDescription>
                  Engagement by time of day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                      <Bar dataKey="engagementRate" fill="#82ca9d" name="Avg. Engagement Rate" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>
                  Audience by age groups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={audienceAge}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {audienceAge.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
                <CardDescription>
                  Audience by gender
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={audienceGender}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {audienceGender.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
              <CardDescription>
                Top audience locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {audienceLocation.map((location, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-40 font-medium">{location.country}</div>
                    <div className="flex-1">
                      <div className="w-full bg-muted rounded-full h-3">
                        <div 
                          className="bg-primary rounded-full h-3" 
                          style={{ width: `${location.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-12 text-right">{location.percentage}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Interests</CardTitle>
              <CardDescription>
                Top audience interests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {audienceInterests.map((interest, index) => (
                  <div 
                    key={index} 
                    className="px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm"
                    style={{ fontSize: `${14 + interest.weight * 6}px` }}
                  >
                    {interest.topic}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparison" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Growth</CardTitle>
                <CardDescription>
                  Follower growth over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="facebook" stroke="#4267B2" />
                      <Line type="monotone" dataKey="instagram" stroke="#E1306C" />
                      <Line type="monotone" dataKey="twitter" stroke="#1DA1F2" />
                      <Line type="monotone" dataKey="linkedin" stroke="#0077B5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Engagement Rate</CardTitle>
                <CardDescription>
                  Average engagement by platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={engagementRateData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="platform" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                      <Bar dataKey="rate" fill="#8884d8" name="Engagement Rate %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Industry Benchmarks</CardTitle>
              <CardDescription>
                Your performance compared to industry averages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {benchmarkData.map((benchmark, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <div className="font-medium">{benchmark.metric}</div>
                      <div className="flex items-center space-x-2">
                        <span className={benchmark.performance >= 0 ? "text-green-600" : "text-red-600"}>
                          {benchmark.performance >= 0 ? "+" : ""}{benchmark.performance}%
                        </span>
                        <span className="text-xs text-muted-foreground">vs industry</span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className={`rounded-full h-3 ${
                          benchmark.performance >= 10 ? "bg-green-500" : 
                          benchmark.performance >= 0 ? "bg-blue-500" : 
                          "bg-red-500"
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, 50 + benchmark.performance / 2))}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>Industry: {benchmark.industryAvg}</span>
                      <span>Your: {benchmark.yourValue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({ title, value, change, icon, onClick, isActive }) {
  return (
    <Card 
      className={`cursor-pointer transition-all ${isActive ? 'border-primary ring-1 ring-primary' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className={`flex items-center mt-1 text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          <span>{change >= 0 ? '↑' : '↓'} {Math.abs(change)}%</span>
          <span className="text-muted-foreground ml-1">vs previous</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Sample data for analytics
const analyticsData = [
  // Facebook data
  { platform: "facebook", date: "Jun 1", impressions: 12500, engagement: 780, clicks: 340, followers: 5200 },
  { platform: "facebook", date: "Jun 2", impressions: 13200, engagement: 820, clicks: 360, followers: 5220 },
  { platform: "facebook", date: "Jun 3", impressions: 11800, engagement: 750, clicks: 320, followers: 5250 },
  { platform: "facebook", date: "Jun 4", impressions: 12300, engagement: 770, clicks: 330, followers: 5280 },
  { platform: "facebook", date: "Jun 5", impressions: 14500, engagement: 890, clicks: 380, followers: 5310 },
  { platform: "facebook", date: "Jun 6", impressions: 15200, engagement: 920, clicks: 410, followers: 5350 },
  { platform: "facebook", date: "Jun 7", impressions: 14800, engagement: 900, clicks: 400, followers: 5400 },
  
  // Instagram data
  { platform: "instagram", date: "Jun 1", impressions: 18700, engagement: 1450, clicks: 520, followers: 7800 },
  { platform: "instagram", date: "Jun 2", impressions: 19200, engagement: 1520, clicks: 540, followers: 7850 },
  { platform: "instagram", date: "Jun 3", impressions: 17900, engagement: 1400, clicks: 510, followers: 7900 },
  { platform: "instagram", date: "Jun 4", impressions: 18300, engagement: 1430, clicks: 515, followers: 7950 },
  { platform: "instagram", date: "Jun 5", impressions: 21200, engagement: 1640, clicks: 580, followers: 8000 },
  { platform: "instagram", date: "Jun 6", impressions: 22500, engagement: 1730, clicks: 610, followers: 8080 },
  { platform: "instagram", date: "Jun 7", impressions: 21900, engagement: 1680, clicks: 590, followers: 8150 },
  
  // Twitter data
  { platform: "twitter", date: "Jun 1", impressions: 8300, engagement: 540, clicks: 210, followers: 3200 },
  { platform: "twitter", date: "Jun 2", impressions: 8700, engagement: 560, clicks: 220, followers: 3230 },
  { platform: "twitter", date: "Jun 3", impressions: 8100, engagement: 530, clicks: 205, followers: 3250 },
  { platform: "twitter", date: "Jun 4", impressions: 8400, engagement: 550, clicks: 215, followers: 3280 },
  { platform: "twitter", date: "Jun 5", impressions: 9800, engagement: 630, clicks: 250, followers: 3310 },
  { platform: "twitter", date: "Jun 6", impressions: 10200, engagement: 660, clicks: 260, followers: 3350 },
  { platform: "twitter", date: "Jun 7", impressions: 9900, engagement: 650, clicks: 255, followers: 3400 },
  
  // LinkedIn data
  { platform: "linkedin", date: "Jun 1", impressions: 5200, engagement: 280, clicks: 120, followers: 1800 },
  { platform: "linkedin", date: "Jun 2", impressions: 5400, engagement: 290, clicks: 125, followers: 1820 },
  { platform: "linkedin", date: "Jun 3", impressions: 5100, engagement: 275, clicks: 118, followers: 1840 },
  { platform: "linkedin", date: "Jun 4", impressions: 5300, engagement: 285, clicks: 122, followers: 1860 },
  { platform: "linkedin", date: "Jun 5", impressions: 6100, engagement: 325, clicks: 140, followers: 1880 },
  { platform: "linkedin", date: "Jun 6", impressions: 6400, engagement: 340, clicks: 145, followers: 1910 },
  { platform: "linkedin", date: "Jun 7", impressions: 6200, engagement: 330, clicks: 142, followers: 1950 }
];

// Content performance data
const contentData = [
  { 
    id: 1, 
    platform: "instagram", 
    date: "Jun 5", 
    content: "Excited to announce our new product line! Check out the link in bio for more details.",
    image: "/placeholder-instagram.jpg",
    impressions: 21200, 
    likes: 1250, 
    comments: 320, 
    shares: 70 
  },
  { 
    id: 2, 
    platform: "facebook", 
    date: "Jun 6", 
    content: "We're hiring! Join our team and help us build amazing products.",
    image: "/placeholder-facebook.jpg",
    impressions: 15200, 
    likes: 580, 
    comments: 210, 
    shares: 130 
  },
  { 
    id: 3, 
    platform: "twitter", 
    date: "Jun 4", 
    content: "What features would you like to see in our next update? Let us know in the comments!",
    image: null,
    impressions: 8400, 
    likes: 320, 
    comments: 180, 
    shares: 50 
  },
  { 
    id: 4, 
    platform: "linkedin", 
    date: "Jun 7", 
    content: "Our CEO's thoughts on the future of remote work and distributed teams.",
    image: "/placeholder-linkedin.jpg",
    impressions: 6200, 
    likes: 210, 
    comments: 85, 
    shares: 35 
  },
  { 
    id: 5, 
    platform: "instagram", 
    date: "Jun 3", 
    content: "Behind the scenes look at our design team working on the new UI.",
    image: "/placeholder-instagram2.jpg",
    impressions: 17900, 
    likes: 890, 
    comments: 240, 
    shares: 45 
  }
];

// Content type performance data
const contentTypeData = [
  { type: "Image", engagementRate: 4.8 },
  { type: "Video", engagementRate: 6.2 },
  { type: "Carousel", engagementRate: 5.7 },
  { type: "Text", engagementRate: 3.1 },
  { type: "Link", engagementRate: 2.9 }
];

// Time performance data
const timeData = [
  { time: "6-9 AM", engagementRate: 3.2 },
  { time: "9-12 PM", engagementRate: 4.5 },
  { time: "12-3 PM", engagementRate: 5.1 },
  { time: "3-6 PM", engagementRate: 5.8 },
  { time: "6-9 PM", engagementRate: 6.2 },
  { time: "9-12 AM", engagementRate: 4.7 }
];

// Audience demographics
const audienceAge = [
  { name: "18-24", value: 22 },
  { name: "25-34", value: 38 },
  { name: "35-44", value: 25 },
  { name: "45-54", value: 10 },
  { name: "55+", value: 5 }
];

const audienceGender = [
  { name: "Male", value: 48 },
  { name: "Female", value: 51 },
  { name: "Other", value: 1 }
];

const audienceLocation = [
  { country: "United States", percentage: 45 },
  { country: "United Kingdom", percentage: 15 },
  { country: "Canada", percentage: 12 },
  { country: "Australia", percentage: 8 },
  { country: "Germany", percentage: 5 },
  { country: "Others", percentage: 15 }
];

const audienceInterests = [
  { topic: "Technology", weight: 5 },
  { topic: "Business", weight: 4 },
  { topic: "Marketing", weight: 4.5 },
  { topic: "Design", weight: 3.5 },
  { topic: "Entrepreneurship", weight: 4 },
  { topic: "Social Media", weight: 4.2 },
  { topic: "Education", weight: 3 },
  { topic: "Finance", weight: 2.5 },
  { topic: "Travel", weight: 2 },
  { topic: "Health", weight: 2.2 },
  { topic: "Fitness", weight: 1.8 },
  { topic: "Food", weight: 1.5 }
];

// Comparison data
const growthData = [
  { date: "Jan", facebook: 4800, instagram: 7200, twitter: 2800, linkedin: 1600 },
  { date: "Feb", facebook: 4900, instagram: 7400, twitter: 2900, linkedin: 1650 },
  { date: "Mar", facebook: 5000, instagram: 7600, twitter: 3000, linkedin: 1700 },
  { date: "Apr", facebook: 5100, instagram: 7700, twitter: 3100, linkedin: 1750 },
  { date: "May", facebook: 5200, instagram: 7900, twitter: 3200, linkedin: 1800 },
  { date: "Jun", facebook: 5400, instagram: 8150, twitter: 3400, linkedin: 1950 }
];

const engagementRateData = [
  { platform: "Facebook", rate: 5.3 },
  { platform: "Instagram", rate: 7.8 },
  { platform: "Twitter", rate: 6.5 },
  { platform: "LinkedIn", rate: 5.1 }
];

const benchmarkData = [
  { 
    metric: "Engagement Rate", 
    performance: 12, 
    industryAvg: "4.2%", 
    yourValue: "6.7%" 
  },
  { 
    metric: "Follower Growth", 
    performance: 8, 
    industryAvg: "2.8%", 
    yourValue: "4.5%" 
  },
  { 
    metric: "Click-through Rate", 
    performance: -5, 
    industryAvg: "1.6%", 
    yourValue: "1.2%" 
  },
  { 
    metric: "Conversion Rate", 
    performance: 15, 
    industryAvg: "2.4%", 
    yourValue: "3.8%" 
  }
]; 