import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  MessageSquare, 
  Bot, 
  Type,
  ArrowRight
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Comment Automation Card */}
        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-full bg-primary/10">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-xl">Comment Automation</CardTitle>
            </div>
            <CardDescription>
              Automatically respond to comments on your Facebook and Instagram posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Design your comment automation flow with our visual builder. Create triggers, conditions, and actions to respond to comments automatically.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/comment-automation" className="flex items-center justify-between">
                <span>Manage Comment Automation</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Live Chat Card */}
        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-full bg-primary/10">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-xl">Live Chat</CardTitle>
            </div>
            <CardDescription>
              Engage with your audience in real-time through a live chat interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Chat with visitors directly from your dashboard. Configure automated responses, manage multiple conversations, and never miss an opportunity to connect.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/live-chat" className="flex items-center justify-between">
                <span>Open Live Chat</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Ad Comments Card */}
        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-full bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-xl">Ad Comments</CardTitle>
            </div>
            <CardDescription>
              Automatically moderate and respond to comments on your Facebook and Instagram ads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Keep your ad comments section positive and responsive with automated comment moderation. Set up rules to hide, delete, or respond to comments based on content.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/ad-comments" className="flex items-center justify-between">
                <span>Manage Ad Comments</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Caption Generator Card */}
        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-full bg-primary/10">
                <Type className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-xl">Caption Generator</CardTitle>
            </div>
            <CardDescription>
              Generate personalized captions using user information and brand voice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create engaging, on-brand captions for your social media posts. Personalize captions based on user data and match your brand's voice and style.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/caption-generator" className="flex items-center justify-between">
                <span>Generate Captions</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Enhancements; 