import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Linkedin, 
  Facebook, 
  Instagram, 
  Twitter, 
  Globe, 
  Edit, 
  Copy, 
  Bookmark, 
  Sparkles, 
  Clock, 
  Check, 
  AlertTriangle, 
  Send,
  RefreshCw
} from "lucide-react";
import { useBoom } from "@/contexts/BoomContext";

export function AIContentCreatorPage() {
  const { generateContent } = useBoom();
  const [activeTab, setActiveTab] = useState("post");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");
  const [error, setError] = useState("");
  
  // Form states
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("linkedin");
  const [industry, setIndustry] = useState("");
  const [tone, setTone] = useState("professional");
  const [voiceStyle, setVoiceStyle] = useState("straightforward");
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeCTA, setIncludeCTA] = useState(true);
  const [customCTA, setCustomCTA] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  
  // Saved content collection
  const [savedContent, setSavedContent] = useState([
    {
      id: 1,
      topic: "Remote Work Benefits",
      platform: "linkedin",
      content: "Remote work isn't just a trend—it's a transformation in how we approach productivity and work-life balance. After two years of building a remote-first culture at our company, we've seen a 34% increase in employee satisfaction and a 22% boost in overall productivity. The key? Trust and clear communication. What's your experience with remote work? Has it changed your perspective on workplace flexibility? #RemoteWork #FutureOfWork #WorkLifeBalance",
      createdAt: new Date("2023-06-15").toISOString(),
      status: "draft"
    },
    {
      id: 2,
      topic: "AI in Marketing",
      platform: "facebook",
      content: "Marketing teams using AI tools are seeing 40% faster campaign development and 37% better ROI according to our latest industry report. But the most successful implementations are those that augment human creativity, not replace it. At the intersection of AI efficiency and human insight is where true marketing innovation happens. Curious how your team can implement this approach? Let's connect. #AIMarketing #MarketingInnovation #DigitalTransformation",
      createdAt: new Date("2023-06-10").toISOString(),
      status: "published"
    }
  ]);
  
  const platformOptions = [
    { id: "linkedin", name: "LinkedIn", icon: <Linkedin className="h-4 w-4" /> },
    { id: "facebook", name: "Facebook", icon: <Facebook className="h-4 w-4" /> },
    { id: "instagram", name: "Instagram", icon: <Instagram className="h-4 w-4" /> },
    { id: "twitter", name: "Twitter", icon: <Twitter className="h-4 w-4" /> },
    { id: "blog", name: "Blog", icon: <Globe className="h-4 w-4" /> }
  ];
  
  const industryOptions = [
    "Technology", "Finance", "Healthcare", "Marketing", "Education", 
    "E-commerce", "Real Estate", "Manufacturing", "Consulting", "Other"
  ];
  
  const toneOptions = [
    "Professional", "Conversational", "Enthusiastic", "Informative", 
    "Persuasive", "Inspirational", "Educational", "Authoritative"
  ];
  
  const voiceStyleOptions = [
    "Straightforward", "Friendly", "Humorous", "Technical", 
    "Storytelling", "Formal", "Casual", "Analytical"
  ];
  
  const getPlatformIcon = (platformId) => {
    const platform = platformOptions.find(p => p.id === platformId);
    return platform ? platform.icon : <Globe className="h-4 w-4" />;
  };
  
  const handleGenerateContent = async () => {
    if (!topic) {
      setError("Please provide a content topic");
      return;
    }
    
    setError("");
    setIsGenerating(true);
    
    try {
      // Prepare the content parameters
      const contentParams = {
        keyword: topic,
        audience: targetAudience || (industry ? `professionals in the ${industry} industry` : "professionals"),
        tone: tone || "Professional",
        voice_style: voiceStyle || "Straightforward",
        cta: includeCTA ? (customCTA || generateDefaultCTA(industry)) : ""
      };
      
      // Call the API
      const response = await generateContent(contentParams);
      
      if (!response) {
        throw new Error("Failed to generate content");
      }
      
      // Process the response to include hashtags if needed
      let finalContent = response.content || "";
      
      if (includeHashtags) {
        const hashtags = generateHashtags(topic, industry);
        finalContent = `${finalContent}\n\n${hashtags}`;
      }
      
      // Set the generated content
      setGeneratedContent({
        topic,
        platform,
        content: finalContent,
        createdAt: new Date().toISOString(),
        status: "draft",
        rawResponse: response
      });
      
    } catch (err) {
      console.error("Error generating content:", err);
      setError(err.message || "Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const generateHashtags = (topic, industry) => {
    const topicWords = topic.split(" ");
    const hashtags = topicWords.map(word => `#${word.replace(/[^a-zA-Z0-9]/g, "")}`);
    
    if (industry) {
      hashtags.push(`#${industry.replace(/\s+/g, "")}`);
    }
    
    // Add some generic professional hashtags
    const commonHashtags = ["#ProfessionalDevelopment", "#Innovation", "#Leadership", "#GrowthMindset"];
    const selectedCommon = commonHashtags.slice(0, 2 + Math.floor(Math.random() * 3));
    
    return [...hashtags, ...selectedCommon].join(" ");
  };
  
  const generateDefaultCTA = (industry) => {
    const ctas = [
      "What are your thoughts on this? I'd love to hear your perspective in the comments.",
      "If you're interested in learning more about this topic, let's connect.",
      "Have you implemented this in your organization? Share your experience below.",
      `Looking for more insights on ${industry || "industry"} trends? Follow me for regular updates.`,
      "Tag someone who would find this information valuable!"
    ];
    
    return ctas[Math.floor(Math.random() * ctas.length)];
  };
  
  const handleSaveContent = () => {
    if (!generatedContent) return;
    
    setSaveStatus("saving");
    
    // Mock saving process
    setTimeout(() => {
      const newContent = {
        ...generatedContent,
        id: savedContent.length + 1
      };
      
      setSavedContent([...savedContent, newContent]);
      setSaveStatus("saved");
      
      // Reset save status after a few seconds
      setTimeout(() => setSaveStatus(""), 3000);
    }, 1000);
  };
  
  const handleDeleteSaved = (id) => {
    setSavedContent(savedContent.filter(content => content.id !== id));
  };
  
  const handleCopyToClipboard = () => {
    if (!generatedContent) return;
    
    navigator.clipboard.writeText(generatedContent.content).then(
      () => {
        setSaveStatus("copied");
        setTimeout(() => setSaveStatus(""), 3000);
      },
      () => {
        setError("Failed to copy to clipboard");
      }
    );
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  const clearForm = () => {
    setTopic("");
    setIndustry("");
    setTargetAudience("");
    setCustomCTA("");
    setTone("professional");
    setVoiceStyle("straightforward");
    setIncludeHashtags(true);
    setIncludeCTA(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI Content Creator
            </h1>
            <p className="text-slate-600 text-lg">
              Generate professional content for social media and blogs with AI assistance
            </p>
          </div>
          
          <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg flex items-center gap-2 px-4 py-2 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>AI Powered</span>
          </Badge>
        </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8 grid grid-cols-1 w-full max-w-xs mx-auto bg-white/80 backdrop-blur-sm shadow-lg border-0 p-1">
          <TabsTrigger 
            value="post" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
          >
            Create Content
          </TabsTrigger>
          {/* <TabsTrigger value="library">Content Library</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger> */}
        </TabsList>
        
        <TabsContent value="post">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold text-slate-800">Content Parameters</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearForm} 
                      title="Reset form"
                      className="hover:bg-white/60 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription className="text-slate-600 mt-1">
                    Customize your AI-generated content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="space-y-3">
                    <Label htmlFor="topic" className="text-sm font-medium text-slate-700">Topic or Idea</Label>
                    <Textarea 
                      id="topic" 
                      placeholder="What would you like to post about? Be specific for better results..."
                      rows={3}
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="platform" className="text-sm font-medium text-slate-700">Platform</Label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger id="platform" className="w-full focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {platformOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            <div className="flex items-center">
                              {option.icon}
                              <span className="ml-2">{option.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="industry" className="text-sm font-medium text-slate-700">Industry</Label>
                      <Select value={industry} onValueChange={setIndustry}>
                        <SelectTrigger id="industry" className="focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industryOptions.map((option) => (
                            <SelectItem key={option} value={option.toLowerCase()}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="audience" className="text-sm font-medium text-slate-700">Target Audience</Label>
                      <Input
                        id="audience"
                        placeholder="Who is this content for?"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        className="focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="tone" className="text-sm font-medium text-slate-700">Content Tone</Label>
                      <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger id="tone" className="focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          {toneOptions.map((option) => (
                            <SelectItem key={option} value={option.toLowerCase()}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="voiceStyle" className="text-sm font-medium text-slate-700">Voice Style</Label>
                      <Select value={voiceStyle} onValueChange={setVoiceStyle}>
                        <SelectTrigger id="voiceStyle" className="focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                          <SelectValue placeholder="Select voice style" />
                        </SelectTrigger>
                        <SelectContent>
                          {voiceStyleOptions.map((option) => (
                            <SelectItem key={option} value={option.toLowerCase()}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-6 pt-6 border-t border-slate-200">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <Label htmlFor="hashtags" className="text-sm font-medium text-slate-700">Include Hashtags</Label>
                      <Switch
                        id="hashtags"
                        checked={includeHashtags}
                        onCheckedChange={setIncludeHashtags}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <Label htmlFor="cta" className="text-sm font-medium text-slate-700">Include Call-to-Action</Label>
                        <Switch
                          id="cta"
                          checked={includeCTA}
                          onCheckedChange={setIncludeCTA}
                        />
                      </div>
                      
                      {includeCTA && (
                        <Input
                          id="customCTA"
                          placeholder="Custom call-to-action (optional)"
                          value={customCTA}
                          onChange={(e) => setCustomCTA(e.target.value)}
                          className="focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-6">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12 text-base font-medium"
                    onClick={handleGenerateContent}
                    disabled={isGenerating || !topic}
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
              
              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200 shadow-lg animate-in fade-in-50 slide-in-from-top-1">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700 font-medium">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <div className="lg:col-span-2">
              <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl font-semibold text-slate-800">Generated Content</CardTitle>
                      <CardDescription className="text-slate-600 mt-1">
                        {generatedContent 
                          ? `Created on ${formatDate(generatedContent.createdAt)}` 
                          : "Your content will appear here"}
                      </CardDescription>
                    </div>
                    {generatedContent && (
                      <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md flex items-center gap-2 px-3 py-1">
                        {getPlatformIcon(generatedContent.platform)}
                        <span className="capitalize ml-1">{generatedContent.platform}</span>
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="relative mb-6">
                        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin">
                          <div className="w-4 h-4 bg-blue-600 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
                        </div>
                      </div>
                      <p className="text-slate-600 text-lg font-medium mb-2">
                        Creating your {platformOptions.find(p => p.id === platform)?.name || 'social media'} content with AI...
                      </p>
                      <p className="text-slate-500 text-sm">
                        This may take a few seconds
                      </p>
                    </div>
                  ) : generatedContent ? (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-xl border border-slate-200 min-h-48 whitespace-pre-wrap text-slate-700 leading-relaxed shadow-inner">
                        {generatedContent.content}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
                        <Sparkles className="w-10 h-10 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-800 mb-2">Ready to Create</h3>
                      <p className="text-slate-600 max-w-md">
                        Fill out the content parameters and click "Generate Content" to create
                        AI-optimized social media content
                      </p>
                    </div>
                  )}
                </CardContent>
                {generatedContent && (
                  <CardFooter className="flex justify-between flex-wrap gap-4 pt-6 bg-slate-50/50 rounded-b-lg">
                    <div className="flex gap-3 flex-wrap">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleCopyToClipboard}
                        className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleSaveContent}
                        className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        <Bookmark className="mr-2 h-4 w-4" />
                        {saveStatus === "saving" ? "Saving..." : "Save"}
                      </Button>
                    </div>
                    <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all">
                      <Send className="mr-2 h-4 w-4" />
                      Post to {platformOptions.find(p => p.id === generatedContent.platform)?.name || 'Platform'}
                    </Button>
                  </CardFooter>
                )}
              </Card>
              
              {saveStatus === "saved" && (
                <Alert className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg animate-in fade-in-50 slide-in-from-top-1">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700 font-medium">
                    Content saved to your library
                  </AlertDescription>
                </Alert>
              )}
              
              {saveStatus === "copied" && (
                <Alert className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg animate-in fade-in-50 slide-in-from-top-1">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700 font-medium">
                    Content copied to clipboard
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="library">
          <Card>
            <CardHeader>
              <CardTitle>Your Content Library</CardTitle>
              <CardDescription>
                Access and manage your saved content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedContent.length === 0 ? (
                <div className="text-center py-8">
                  <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Your saved content will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {savedContent.map((content) => (
                    <div key={content.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(content.platform)}
                          <h3 className="font-medium">{content.topic}</h3>
                        </div>
                        <div className="flex items-center gap-1 flex-wrap">
                          <Badge 
                            className={content.status === "published" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {content.status === "published" ? "Published" : "Draft"}
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-800 ml-2">
                            <Clock className="mr-1 h-3 w-3" />
                            {formatDate(content.createdAt)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="bg-muted p-3 rounded-md text-sm mt-2 mb-4 whitespace-pre-wrap">
                        {content.content.length > 200 
                          ? content.content.substring(0, 200) + "..." 
                          : content.content
                        }
                      </div>
                      
                      <div className="flex justify-end gap-2 flex-wrap">
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteSaved(content.id)}>
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                        {content.status !== "published" && (
                          <Button size="sm">
                            <Send className="mr-2 h-4 w-4" />
                            Post
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Content Performance</CardTitle>
              <CardDescription>
                Analyze the engagement and reach of your AI-generated content
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-80">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold">📊</span>
                </div>
                <h3 className="text-xl font-medium mb-2">Analytics Coming Soon</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  We're working on a comprehensive analytics dashboard to help you track the performance of your content across platforms.
                </p>
                <Badge className="bg-blue-100 text-blue-800">
                  In Development
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}

export default AIContentCreatorPage; 