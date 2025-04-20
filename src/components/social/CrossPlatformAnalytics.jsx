import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export function CrossPlatformAnalytics({ accounts }) {
  const [timeRange, setTimeRange] = useState("7days");
  const [metrics, setMetrics] = useState({
    platforms: [],
    engagementByPlatform: [],
    contentPerformance: [],
    audienceGrowth: [],
    postTypesPerformance: []
  });

  useEffect(() => {
    if (accounts && accounts.length > 0) {
      // Generate metrics based on accounts
      const platformData = accounts.map(account => ({
        name: account.platform,
        followers: Math.floor(Math.random() * 10000) + 1000,
        engagement: Math.floor(Math.random() * 1000) + 200,
        reach: Math.floor(Math.random() * 50000) + 5000,
        interactions: Math.floor(Math.random() * 2000) + 500,
      }));

      // Generate engagement by platform data
      const engagementData = accounts.map(account => ({
        name: capitalize(account.platform),
        likes: Math.floor(Math.random() * 1000) + 100,
        comments: Math.floor(Math.random() * 300) + 50,
        shares: Math.floor(Math.random() * 200) + 30,
      }));

      // Generate content performance data
      const contentData = [
        { name: "Text", value: Math.floor(Math.random() * 30) + 10 },
        { name: "Image", value: Math.floor(Math.random() * 40) + 20 },
        { name: "Video", value: Math.floor(Math.random() * 50) + 30 },
        { name: "Link", value: Math.floor(Math.random() * 20) + 5 },
      ];

      // Generate audience growth data
      const audienceData = generateTimeSeriesData(timeRange, accounts);

      // Generate post types performance data
      const postTypesData = [
        { name: "Product", engagement: Math.floor(Math.random() * 80) + 40, reach: Math.floor(Math.random() * 6000) + 2000 },
        { name: "Promotional", engagement: Math.floor(Math.random() * 70) + 30, reach: Math.floor(Math.random() * 5000) + 1500 },
        { name: "Educational", engagement: Math.floor(Math.random() * 90) + 50, reach: Math.floor(Math.random() * 7000) + 3000 },
        { name: "User-generated", engagement: Math.floor(Math.random() * 85) + 45, reach: Math.floor(Math.random() * 6500) + 2500 },
        { name: "Behind the scenes", engagement: Math.floor(Math.random() * 75) + 35, reach: Math.floor(Math.random() * 5500) + 2000 },
      ];

      setMetrics({
        platforms: platformData,
        engagementByPlatform: engagementData,
        contentPerformance: contentData,
        audienceGrowth: audienceData,
        postTypesPerformance: postTypesData
      });
    }
  }, [accounts, timeRange]);

  // Helper function to generate time series data based on time range
  const generateTimeSeriesData = (range, accounts) => {
    let days;
    let format;
    
    switch(range) {
      case "7days":
        days = 7;
        format = "day";
        break;
      case "30days":
        days = 30;
        format = "week";
        break;
      case "90days":
        days = 90;
        format = "month";
        break;
      default:
        days = 7;
        format = "day";
    }
    
    return Array.from({ length: format === "day" ? days : (format === "week" ? Math.ceil(days/7) : Math.ceil(days/30)) }, (_, i) => {
      const entry = {
        name: format === "day" ? `Day ${i+1}` : (format === "week" ? `Week ${i+1}` : `Month ${i+1}`)
      };
      
      accounts.forEach(account => {
        // Base value increases over time for a growth effect
        const baseValue = Math.floor(Math.random() * 50) + 950 + (i * 10);
        entry[account.platform] = baseValue;
      });
      
      return entry;
    });
  };

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Colors for platforms
  const PLATFORM_COLORS = {
    facebook: "#4267B2",
    instagram: "#E1306C",
    twitter: "#1DA1F2",
    linkedin: "#0077B5",
    pinterest: "#E60023",
    tiktok: "#000000",
    youtube: "#FF0000",
    threads: "#000000"
  };

  // Colors for pie chart
  const CONTENT_COLORS = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d"];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Cross-Platform Analytics</CardTitle>
            <CardDescription>Compare performance across all your social media platforms</CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.platforms.map((platform, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white`} 
                        style={{ backgroundColor: PLATFORM_COLORS[platform.name] || "#666" }}>
                        {platform.name.charAt(0).toUpperCase()}
                      </div>
                      <CardTitle className="text-base">{capitalize(platform.name)}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-xs text-muted-foreground">Followers</div>
                        <div className="text-lg font-semibold">{platform.followers.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Engagement</div>
                        <div className="text-lg font-semibold">{platform.engagement.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Reach</div>
                        <div className="text-lg font-semibold">{platform.reach.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Interactions</div>
                        <div className="text-lg font-semibold">{platform.interactions.toLocaleString()}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="h-[300px] mt-6">
              <h3 className="font-medium mb-2">Platform Performance Comparison</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metrics.platforms}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="engagement" fill="#8884d8" name="Engagement" />
                  <Bar dataKey="interactions" fill="#82ca9d" name="Interactions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="engagement" className="space-y-4">
            <div className="h-[300px]">
              <h3 className="font-medium mb-2">Engagement by Platform</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metrics.engagementByPlatform}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="likes" fill="#8884d8" name="Likes" />
                  <Bar dataKey="comments" fill="#82ca9d" name="Comments" />
                  <Bar dataKey="shares" fill="#ffc658" name="Shares" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="font-medium mb-2">Engagement by Content Type</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={metrics.contentPerformance}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {metrics.contentPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CONTENT_COLORS[index % CONTENT_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Post Type Performance</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={metrics.postTypesPerformance}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="engagement" fill="#8884d8" name="Engagement" />
                      <Bar dataKey="reach" fill="#82ca9d" name="Reach" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="content">
            <div className="space-y-4">
              <div className="h-[300px]">
                <h3 className="font-medium mb-2">Content Performance by Type</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={metrics.postTypesPerformance}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="engagement" fill="#8884d8" name="Engagement" />
                    <Bar dataKey="reach" fill="#82ca9d" name="Reach" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Top Performing Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0">
                          <div className="w-12 h-12 bg-muted rounded flex-shrink-0"></div>
                          <div>
                            <div className="font-medium">
                              {["Product announcement", "Customer testimonial", "How-to guide"][i-1]}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {capitalize(metrics.platforms[i-1]?.name || "instagram")}
                            </div>
                            <div className="mt-1 text-sm flex items-center gap-3">
                              <span>👍 {Math.floor(Math.random() * 1000) + 200}</span>
                              <span>💬 {Math.floor(Math.random() * 200) + 50}</span>
                              <span>🔄 {Math.floor(Math.random() * 100) + 20}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Recommended Content Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { type: "Video", platform: "Instagram", performance: 87 },
                        { type: "Carousel", platform: "LinkedIn", performance: 72 },
                        { type: "Stories", platform: "Facebook", performance: 65 },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <div className="font-medium">{item.type}</div>
                            <div className="text-sm text-muted-foreground">Best on {item.platform}</div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary font-medium">
                              {item.performance}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="audience">
            <div className="space-y-6">
              <div className="h-[300px]">
                <h3 className="font-medium mb-2">Audience Growth Trends</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={metrics.audienceGrowth}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {accounts.map((account, index) => (
                      <Line 
                        key={index}
                        type="monotone" 
                        dataKey={account.platform} 
                        stroke={PLATFORM_COLORS[account.platform] || "#8884d8"} 
                        name={capitalize(account.platform)}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accounts.map((account, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: PLATFORM_COLORS[account.platform] }}></div>
                        <CardTitle className="text-base">{capitalize(account.platform)}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-y-3">
                        <div>
                          <div className="text-xs text-muted-foreground">Audience Size</div>
                          <div className="text-lg font-semibold">{(Math.floor(Math.random() * 10000) + 1000).toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Growth Rate</div>
                          <div className="text-lg font-semibold text-green-600">+{(Math.random() * 5 + 1).toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Engagement Rate</div>
                          <div className="text-lg font-semibold">{(Math.random() * 4 + 1).toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Avg. Reach</div>
                          <div className="text-lg font-semibold">{(Math.floor(Math.random() * 5000) + 500).toLocaleString()}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 