import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Type, 
  Users, 
  Target, 
  MessageSquare, 
  Sparkles, 
  History, 
  Copy, 
  Check, 
  Save,
  RefreshCcw,
  Download
} from 'lucide-react';

const UserCaptionGenerator = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [caption, setCaption] = useState('');
  const [generatedCaptions, setGeneratedCaptions] = useState([]);
  const [copied, setCopied] = useState(false);
  const [savedCaptions, setSavedCaptions] = useState([]);
  const [formData, setFormData] = useState({
    demographics: {
      age: '25-34',
      gender: '',
      location: '',
      interests: []
    },
    brand: {
      voice: 'Friendly',
      tone: 'Casual',
      industry: '',
      name: ''
    },
    targetAudience: {
      primary: '',
      interests: [],
      painPoints: '',
      goals: ''
    },
    content: {
      type: 'Post',
      platform: 'Instagram',
      length: 'Medium',
      hashtags: true,
      emojis: true
    }
  });

  // Sample caption templates
  const captionTemplates = [
    "Looking for {{solution}} to solve {{painPoint}}? Our {{product}} is designed for {{audience}} who want to {{goal}}. #{{industry}} #{{brandName}}",
    "Attention {{audience}}! Discover how {{brandName}} can help you {{goal}} without the stress of {{painPoint}}. Try our {{product}} today!",
    "{{audience}}, are you tired of {{painPoint}}? {{brandName}} offers {{solution}} that helps you {{goal}}. Learn more in our bio!",
    "The perfect {{product}} for {{audience}} who value {{value}}. Say goodbye to {{painPoint}} and hello to {{benefit}}!",
    "{{brandName}} - where {{audience}} find {{solution}} to their {{painPoint}}. Designed with your {{goal}} in mind."
  ];

  const handleFormChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    });
  };

  const handleGenerate = () => {
    // In a real implementation, this would call an API or use a more sophisticated algorithm
    const newCaption = generateCaption();
    setCaption(newCaption);
    setGeneratedCaptions([
      { id: Date.now(), text: newCaption, timestamp: new Date().toISOString() },
      ...generatedCaptions
    ]);
  };

  const generateCaption = () => {
    // Simple template-based generation
    const randomTemplate = captionTemplates[Math.floor(Math.random() * captionTemplates.length)];
    
    // Replace placeholders with form data
    return randomTemplate
      .replace(/{{audience}}/g, formData.targetAudience.primary || 'users')
      .replace(/{{product}}/g, 'solution')
      .replace(/{{brandName}}/g, formData.brand.name || 'brand')
      .replace(/{{painPoint}}/g, formData.targetAudience.painPoints || 'common problems')
      .replace(/{{goal}}/g, formData.targetAudience.goals || 'achieve your goals')
      .replace(/{{solution}}/g, 'product/service')
      .replace(/{{industry}}/g, formData.brand.industry || 'industry')
      .replace(/{{value}}/g, 'quality')
      .replace(/{{benefit}}/g, 'amazing results');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveCaption = (textToSave = caption) => {
    setSavedCaptions([
      { id: Date.now(), text: textToSave, timestamp: new Date().toISOString() },
      ...savedCaptions
    ]);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Type className="mr-2 h-5 w-5" />
          Caption Generator
        </CardTitle>
        <CardDescription>
          Generate personalized captions using user information
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="create" className="space-y-4 px-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Demographics */}
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-medium flex items-center mb-3">
                  <Users className="mr-2 h-4 w-4" />
                  User Demographics
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="age-range">Age Range</Label>
                    <Select 
                      value={formData.demographics.age} 
                      onValueChange={(value) => handleFormChange('demographics', 'age', value)}
                    >
                      <SelectTrigger id="age-range">
                        <SelectValue placeholder="Select age range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="18-24">18-24</SelectItem>
                        <SelectItem value="25-34">25-34</SelectItem>
                        <SelectItem value="35-44">35-44</SelectItem>
                        <SelectItem value="45-54">45-54</SelectItem>
                        <SelectItem value="55+">55+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select 
                      value={formData.demographics.gender} 
                      onValueChange={(value) => handleFormChange('demographics', 'gender', value)}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                        <SelectItem value="all">All genders</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.demographics.location}
                      onChange={(e) => handleFormChange('demographics', 'location', e.target.value)}
                      placeholder="e.g., New York, Global"
                    />
                  </div>
                </div>
              </div>
              
              {/* Brand Voice */}
              <div className="mb-4">
                <h3 className="text-sm font-medium flex items-center mb-3">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Brand Voice
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="brand-name">Brand Name</Label>
                    <Input
                      id="brand-name"
                      value={formData.brand.name}
                      onChange={(e) => handleFormChange('brand', 'name', e.target.value)}
                      placeholder="Your brand name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={formData.brand.industry}
                      onChange={(e) => handleFormChange('brand', 'industry', e.target.value)}
                      placeholder="e.g., Fashion, Tech, Health"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="voice">Brand Voice</Label>
                    <Select 
                      value={formData.brand.voice} 
                      onValueChange={(value) => handleFormChange('brand', 'voice', value)}
                    >
                      <SelectTrigger id="voice">
                        <SelectValue placeholder="Select voice" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Friendly">Friendly</SelectItem>
                        <SelectItem value="Professional">Professional</SelectItem>
                        <SelectItem value="Quirky">Quirky</SelectItem>
                        <SelectItem value="Authoritative">Authoritative</SelectItem>
                        <SelectItem value="Inspirational">Inspirational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="tone">Tone</Label>
                    <Select 
                      value={formData.brand.tone} 
                      onValueChange={(value) => handleFormChange('brand', 'tone', value)}
                    >
                      <SelectTrigger id="tone">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Casual">Casual</SelectItem>
                        <SelectItem value="Formal">Formal</SelectItem>
                        <SelectItem value="Humorous">Humorous</SelectItem>
                        <SelectItem value="Serious">Serious</SelectItem>
                        <SelectItem value="Enthusiastic">Enthusiastic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div>
              {/* Target Audience */}
              <div className="mb-4">
                <h3 className="text-sm font-medium flex items-center mb-3">
                  <Target className="mr-2 h-4 w-4" />
                  Target Audience
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="primary-audience">Primary Audience</Label>
                    <Input
                      id="primary-audience"
                      value={formData.targetAudience.primary}
                      onChange={(e) => handleFormChange('targetAudience', 'primary', e.target.value)}
                      placeholder="e.g., Working professionals, Parents"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="pain-points">Pain Points</Label>
                    <Textarea
                      id="pain-points"
                      value={formData.targetAudience.painPoints}
                      onChange={(e) => handleFormChange('targetAudience', 'painPoints', e.target.value)}
                      placeholder="What problems does your audience face?"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="goals">Goals</Label>
                    <Textarea
                      id="goals"
                      value={formData.targetAudience.goals}
                      onChange={(e) => handleFormChange('targetAudience', 'goals', e.target.value)}
                      placeholder="What does your audience want to achieve?"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
              
              {/* Content Settings */}
              <div className="mb-4">
                <h3 className="text-sm font-medium flex items-center mb-3">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Content Settings
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="platform">Platform</Label>
                    <Select 
                      value={formData.content.platform} 
                      onValueChange={(value) => handleFormChange('content', 'platform', value)}
                    >
                      <SelectTrigger id="platform">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                        <SelectItem value="Twitter">Twitter</SelectItem>
                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                        <SelectItem value="TikTok">TikTok</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="content-type">Content Type</Label>
                    <Select 
                      value={formData.content.type} 
                      onValueChange={(value) => handleFormChange('content', 'type', value)}
                    >
                      <SelectTrigger id="content-type">
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Post">Regular Post</SelectItem>
                        <SelectItem value="Story">Story</SelectItem>
                        <SelectItem value="Reel">Reel/Video</SelectItem>
                        <SelectItem value="Ad">Advertisement</SelectItem>
                        <SelectItem value="Carousel">Carousel Post</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="length">Caption Length</Label>
                    <Select 
                      value={formData.content.length} 
                      onValueChange={(value) => handleFormChange('content', 'length', value)}
                    >
                      <SelectTrigger id="length">
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Short">Short (1-2 sentences)</SelectItem>
                        <SelectItem value="Medium">Medium (3-5 sentences)</SelectItem>
                        <SelectItem value="Long">Long (6+ sentences)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hashtags" className="cursor-pointer">Include Hashtags</Label>
                    <Switch
                      id="hashtags"
                      checked={formData.content.hashtags}
                      onCheckedChange={(checked) => handleFormChange('content', 'hashtags', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emojis" className="cursor-pointer">Include Emojis</Label>
                    <Switch
                      id="emojis"
                      checked={formData.content.emojis}
                      onCheckedChange={(checked) => handleFormChange('content', 'emojis', checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Generate Button */}
          <div className="mt-6">
            <Button 
              className="w-full font-medium"
              onClick={handleGenerate}
              size="lg"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Caption
            </Button>
          </div>
          
          {/* Generated Caption */}
          {caption && (
            <div className="mt-6 p-4 border rounded-lg bg-muted/30">
              <div className="flex justify-between mb-2">
                <h3 className="text-sm font-medium">Generated Caption</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleGenerate()}
                  >
                    <RefreshCcw className="h-3.5 w-3.5 mr-1" />
                    Regenerate
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(caption)}
                  >
                    {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => saveCaption()}
                  >
                    <Save className="h-3.5 w-3.5 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
              <div className="p-3 bg-background rounded border">
                <p className="whitespace-pre-wrap">{caption}</p>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="p-6">
          <div className="space-y-1 mb-4">
            <h3 className="text-sm font-medium flex items-center">
              <History className="mr-2 h-4 w-4" />
              Recently Generated
            </h3>
            <p className="text-sm text-muted-foreground">Your last {generatedCaptions.length} generated captions</p>
          </div>
          
          <ScrollArea className="h-[400px] pr-4">
            {generatedCaptions.length > 0 ? (
              <div className="space-y-4">
                {generatedCaptions.map((item) => (
                  <div key={item.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-muted-foreground">{formatDate(item.timestamp)}</span>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => copyToClipboard(item.text)}
                          className="h-6 w-6"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => saveCaption(item.text)}
                          className="h-6 w-6"
                        >
                          <Save className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm">{item.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <History className="h-10 w-10 text-muted-foreground mb-2 opacity-20" />
                <p className="text-muted-foreground">No caption history yet</p>
                <p className="text-xs text-muted-foreground">Generate your first caption to see it here</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="saved" className="p-6">
          <div className="space-y-1 mb-4">
            <h3 className="text-sm font-medium flex items-center">
              <Save className="mr-2 h-4 w-4" />
              Saved Captions
            </h3>
            <p className="text-sm text-muted-foreground">Captions you've saved for future use</p>
          </div>
          
          <ScrollArea className="h-[400px] pr-4">
            {savedCaptions.length > 0 ? (
              <div className="space-y-4">
                {savedCaptions.map((item) => (
                  <div key={item.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-muted-foreground">{formatDate(item.timestamp)}</span>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => copyToClipboard(item.text)}
                          className="h-6 w-6"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            const newSavedCaptions = savedCaptions.filter(
                              (caption) => caption.id !== item.id
                            );
                            setSavedCaptions(newSavedCaptions);
                          }}
                          className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" x2="10" y1="11" y2="17" />
                            <line x1="14" x2="14" y1="11" y2="17" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm">{item.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <Save className="h-10 w-10 text-muted-foreground mb-2 opacity-20" />
                <p className="text-muted-foreground">No saved captions yet</p>
                <p className="text-xs text-muted-foreground">Save captions to access them later</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex justify-between border-t p-4 mt-4">
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Captions
        </Button>
        <div className="text-xs text-muted-foreground">
          Personalized captions based on user data
        </div>
      </CardFooter>
    </Card>
  );
};

export default UserCaptionGenerator; 