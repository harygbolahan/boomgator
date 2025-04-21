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
import { Linkedin, Edit, Copy, Bookmark, Sparkles, Clock, Check, AlertTriangle, Send } from "lucide-react";

export function AIContentCreatorPage() {
  const [activeTab, setActiveTab] = useState("post");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");
  const [error, setError] = useState("");
  
  // Form states
  const [topic, setTopic] = useState("");
  const [industry, setIndustry] = useState("");
  const [tone, setTone] = useState("professional");
  const [contentLength, setContentLength] = useState(2); // 1-4 scale
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeCTA, setIncludeCTA] = useState(true);
  const [targetAudience, setTargetAudience] = useState("");
  
  // Saved content collection
  const [savedContent, setSavedContent] = useState([
    {
      id: 1,
      topic: "Remote Work Benefits",
      platform: "LinkedIn",
      content: "Remote work isn't just a trend—it's a transformation in how we approach productivity and work-life balance. After two years of building a remote-first culture at our company, we've seen a 34% increase in employee satisfaction and a 22% boost in overall productivity. The key? Trust and clear communication. What's your experience with remote work? Has it changed your perspective on workplace flexibility? #RemoteWork #FutureOfWork #WorkLifeBalance",
      createdAt: new Date("2023-06-15").toISOString(),
      status: "draft"
    },
    {
      id: 2,
      topic: "AI in Marketing",
      platform: "LinkedIn",
      content: "Marketing teams using AI tools are seeing 40% faster campaign development and 37% better ROI according to our latest industry report. But the most successful implementations are those that augment human creativity, not replace it. At the intersection of AI efficiency and human insight is where true marketing innovation happens. Curious how your team can implement this approach? Let's connect. #AIMarketing #MarketingInnovation #DigitalTransformation",
      createdAt: new Date("2023-06-10").toISOString(),
      status: "published"
    }
  ]);
  
  const contentLengthLabels = ["Short", "Medium", "Long", "Comprehensive"];
  const industryOptions = [
    "Technology", "Finance", "Healthcare", "Marketing", "Education", 
    "E-commerce", "Real Estate", "Manufacturing", "Consulting", "Other"
  ];
  const toneOptions = [
    "Professional", "Conversational", "Enthusiastic", "Informative", 
    "Persuasive", "Inspirational", "Educational", "Authoritative"
  ];
  
  const handleGenerateContent = () => {
    if (!topic) {
      setError("Please provide a content topic");
      return;
    }
    
    setError("");
    setIsGenerating(true);
    
    // Mock AI generation with a timeout
    setTimeout(() => {
      // Create a mock AI response based on input parameters
      const contentSizeMultiplier = contentLength;
      const hashtagSection = includeHashtags ? generateMockHashtags(topic, industry) : "";
      const ctaSection = includeCTA ? generateMockCTA(industry) : "";
      
      const contentBody = generateMockContent(topic, industry, tone, contentSizeMultiplier);
      
      setGeneratedContent({
        topic,
        platform: "LinkedIn",
        content: `${contentBody}\n\n${ctaSection}\n\n${hashtagSection}`,
        createdAt: new Date().toISOString(),
        status: "draft"
      });
      
      setIsGenerating(false);
    }, 2500);
  };
  
  const generateMockContent = (topic, industry, tone, size) => {
    // This would be replaced with actual AI generation in a real app
    const sentences = [
      `I've been exploring ${topic} extensively in the ${industry || "industry"} lately.`,
      `The impact of ${topic} on business outcomes cannot be overstated.`,
      `When implemented correctly, ${topic} can transform how we approach challenges.`,
      `Research shows that organizations adopting ${topic} see significant improvements in efficiency.`,
      `The evolution of ${topic} over the past few years has been remarkable.`,
      `Industry leaders are leveraging ${topic} to stay ahead of the competition.`,
      `What's your experience with ${topic}? I'd love to hear your thoughts.`,
      `The intersection of ${topic} and technology presents unique opportunities.`,
      `One of the key insights I've gained from working with ${topic} is the importance of a strategic approach.`,
      `Successful implementation of ${topic} requires both technical expertise and business acumen.`,
      `I've found that teams who embrace ${topic} tend to innovate more rapidly.`,
      `The ROI of investing in ${topic} goes beyond immediate financial returns.`
    ];
    
    // Select a number of sentences based on content length
    const sentenceCount = 3 + size * 2;
    let selectedSentences = [];
    
    // Ensure we don't try to select more sentences than available
    const maxSentences = Math.min(sentenceCount, sentences.length);
    
    // Randomly select sentences without repetition
    while (selectedSentences.length < maxSentences) {
      const randomIndex = Math.floor(Math.random() * sentences.length);
      if (!selectedSentences.includes(sentences[randomIndex])) {
        selectedSentences.push(sentences[randomIndex]);
      }
    }
    
    return selectedSentences.join(" ");
  };
  
  const generateMockHashtags = (topic, industry) => {
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
  
  const generateMockCTA = (industry) => {
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
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Content Creator</h1>
          <p className="text-muted-foreground">
            Generate professional content for LinkedIn with AI assistance
          </p>
        </div>
        
        <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
          <Linkedin className="w-3 h-3" />
          <span>LinkedIn Optimized</span>
        </Badge>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="post">Create Post</TabsTrigger>
          <TabsTrigger value="library">Content Library</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="post">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Parameters</CardTitle>
                  <CardDescription>
                    Customize your AI-generated content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic or Idea</Label>
                    <Textarea 
                      id="topic" 
                      placeholder="What would you like to post about?"
                      rows={3}
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger id="industry">
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="audience">Target Audience</Label>
                    <Input
                      id="audience"
                      placeholder="Who is this content for?"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tone">Content Tone</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger id="tone">
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="length">Content Length: {contentLengthLabels[contentLength - 1]}</Label>
                    <Slider
                      id="length"
                      min={1}
                      max={4}
                      step={1}
                      value={[contentLength]}
                      onValueChange={(values) => setContentLength(values[0])}
                    />
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hashtags">Include Hashtags</Label>
                      <Switch
                        id="hashtags"
                        checked={includeHashtags}
                        onCheckedChange={setIncludeHashtags}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cta">Include Call-to-Action</Label>
                      <Switch
                        id="cta"
                        checked={includeCTA}
                        onCheckedChange={setIncludeCTA}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
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
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <div className="md:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Generated Content</CardTitle>
                  <CardDescription>
                    {generatedContent 
                      ? `Created on ${formatDate(generatedContent.createdAt)}` 
                      : "Your content will appear here"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="animate-pulse flex space-x-2 mb-4">
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      </div>
                      <p className="text-muted-foreground">
                        Creating your LinkedIn post with AI...
                      </p>
                    </div>
                  ) : generatedContent ? (
                    <div className="space-y-4">
                      <div className="bg-muted p-4 rounded-lg min-h-40 whitespace-pre-wrap">
                        {generatedContent.content}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Linkedin className="w-12 h-12 text-blue-500 mb-4 opacity-50" />
                      <p className="text-muted-foreground max-w-md">
                        Fill out the content parameters and click "Generate Content" to create
                        an AI-optimized LinkedIn post
                      </p>
                    </div>
                  )}
                </CardContent>
                {generatedContent && (
                  <CardFooter className="flex justify-between flex-wrap gap-2">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleSaveContent}>
                        <Bookmark className="mr-2 h-4 w-4" />
                        {saveStatus === "saving" ? "Saving..." : "Save"}
                      </Button>
                    </div>
                    <Button>
                      <Send className="mr-2 h-4 w-4" />
                      Post to LinkedIn
                    </Button>
                  </CardFooter>
                )}
              </Card>
              
              {saveStatus === "saved" && (
                <Alert className="mt-4 bg-green-50 border-green-200">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Content saved to your library
                  </AlertDescription>
                </Alert>
              )}
              
              {saveStatus === "copied" && (
                <Alert className="mt-4 bg-green-50 border-green-200">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
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
                          <Linkedin className="h-4 w-4 text-blue-600" />
                          <h3 className="font-medium">{content.topic}</h3>
                        </div>
                        <div className="flex items-center gap-1">
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
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
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
  );
}

export default AIContentCreatorPage; 