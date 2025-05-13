import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CommentAutomationRules from '@/components/comments/CommentAutomationRules';

const CommentAutomationsPage = () => {
  const navigate = useNavigate();

  const handleNavigateToManagement = () => {
    navigate('/comment-management');
  };

  return (
    <div className="container mx-auto py-6">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Comment Automations</h1>
          <p className="text-muted-foreground mt-2">
            Create rules to automatically respond to comments on your social media platforms
          </p>
        </div>
        <Button 
          onClick={handleNavigateToManagement}
          variant="outline"
          className="flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Comment Management</span>
        </Button>
      </header>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Bot className="h-5 w-5 mr-2 text-primary" />
              <CardTitle className="text-xl">Comment Automation Rules</CardTitle>
            </div>
            <CardDescription>
              Set up automatic responses to comments based on keywords, sentiment, and other triggers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CommentAutomationRules />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommentAutomationsPage; 