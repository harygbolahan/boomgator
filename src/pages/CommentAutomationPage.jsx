import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AutomationFlowBuilder } from '@/components/automation/AutomationFlowBuilder';
import { Bot } from 'lucide-react';

const CommentAutomationPage = () => {
  return (
    <div className="container mx-auto py-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Comment Automation</h1>
        <p className="text-muted-foreground mt-2">
          Automatically respond to comments on your Facebook and Instagram posts
        </p>
      </header>
      
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
    </div>
  );
};

export default CommentAutomationPage; 