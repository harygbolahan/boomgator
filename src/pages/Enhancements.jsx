import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AutomationFlowBuilder } from '@/components/automation/AutomationFlowBuilder';
import ChatContainer from '@/components/chat/ChatContainer';
import UserCaptionGenerator from '@/components/captions/UserCaptionGenerator';
import { 
  MessageCircle, 
  MessageSquare, 
  Bot, 
  Type,
  Settings
} from 'lucide-react';

const Enhancements = () => {
  return (
    <div className="container mx-auto py-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Social Dashboard Enhancements</h1>
        <p className="text-muted-foreground mt-2">
          New features to improve your social media management experience
        </p>
      </header>
      
      <Tabs defaultValue="comment-automation" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-3xl">
          <TabsTrigger value="comment-automation" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            <span>Comment Automation</span>
          </TabsTrigger>
          <TabsTrigger value="live-chat" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>Live Chat</span>
          </TabsTrigger>
          <TabsTrigger value="ad-comments" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Ad Comments</span>
          </TabsTrigger>
          <TabsTrigger value="caption-generator" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            <span>Caption Generator</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Comment Automation Tab */}
        <TabsContent value="comment-automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Comment Automation</CardTitle>
              <CardDescription>
                Automatically respond to comments on your Facebook and Instagram posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Design your comment automation flow with our visual builder. Create triggers, conditions, and actions to respond to comments automatically.
                </p>
                <AutomationFlowBuilder 
                  onSave={(data) => console.log('Saved automation:', data)}
                  initialData={{
                    name: 'Comment Automation Flow',
                    nodes: [],
                    edges: []
                  }} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Live Chat Tab */}
        <TabsContent value="live-chat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Live Chat</CardTitle>
              <CardDescription>
                Engage with your audience in real-time through a live chat interface
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[600px] relative">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="p-4 border rounded-lg h-[500px] flex items-center justify-center bg-muted/30">
                    <div className="text-center">
                      <MessageCircle className="h-12 w-12 mx-auto text-muted mb-4" />
                      <h3 className="text-lg font-medium mb-2">Live Chat Dashboard</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        This area displays analytics and chat management tools. Click the chat icon in the bottom right to open the chat interface.
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm mb-4">
                    Chat with visitors directly from your dashboard. Configure automated responses, manage multiple conversations, and never miss an opportunity to connect.
                  </p>
                  <div className="space-y-4">
                    <Card className="p-3">
                      <div className="flex items-center mb-2">
                        <Settings className="h-4 w-4 mr-2 text-muted-foreground" />
                        <h4 className="font-medium text-sm">Chat Settings</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Configure chat appearance, automated responses, and notification settings.
                      </p>
                    </Card>
                    <Card className="p-3">
                      <div className="flex items-center mb-2">
                        <Bot className="h-4 w-4 mr-2 text-muted-foreground" />
                        <h4 className="font-medium text-sm">Auto-Responders</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Set up automated responses for common questions when you're away.
                      </p>
                    </Card>
                  </div>
                </div>
              </div>
              
              {/* Chat Container - this displays the actual chat widgets */}
              <ChatContainer />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Ad Comments Tab */}
        <TabsContent value="ad-comments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Ad Comment Automation</CardTitle>
              <CardDescription>
                Automatically moderate and respond to comments on your Facebook and Instagram ads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Keep your ad comments section positive and responsive with automated comment moderation. Set up rules to hide, delete, or respond to comments based on content.
                </p>
                
                <div className="border rounded-lg p-6 bg-muted/30">
                  <div className="text-center mb-8">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted mb-4" />
                    <h3 className="text-lg font-medium mb-2">Ad Comment Automation</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Connect your Facebook and Instagram ad accounts to get started with comment automation.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-4 bg-white">
                      <h4 className="font-medium mb-3">Comment Rules</h4>
                      <div className="space-y-2">
                        <div className="p-2 border rounded text-sm">
                          <div className="font-medium">Rule 1: Hide spam comments</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Hide comments containing spam keywords automatically
                          </div>
                        </div>
                        <div className="p-2 border rounded text-sm">
                          <div className="font-medium">Rule 2: Reply to questions</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Auto-reply to comments containing question marks
                          </div>
                        </div>
                        <div className="p-2 border rounded text-sm">
                          <div className="font-medium">Rule 3: Thank positive comments</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Reply with thanks to comments with positive sentiment
                          </div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4 bg-white">
                      <h4 className="font-medium mb-3">Response Templates</h4>
                      <div className="space-y-2">
                        <div className="p-2 border rounded text-sm">
                          <div className="font-medium">Product Questions</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            "Thanks for your interest! Please visit our website or DM us for more details."
                          </div>
                        </div>
                        <div className="p-2 border rounded text-sm">
                          <div className="font-medium">Pricing Questions</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            "Our pricing starts at $X. Visit our pricing page for more information."
                          </div>
                        </div>
                        <div className="p-2 border rounded text-sm">
                          <div className="font-medium">Positive Feedback</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            "Thank you for your kind words! We're glad you're enjoying our product."
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Caption Generator Tab */}
        <TabsContent value="caption-generator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">User Caption Generator</CardTitle>
              <CardDescription>
                Generate personalized captions using user information and brand voice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserCaptionGenerator />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Enhancements; 