import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from 'lucide-react';

const AdCommentsPage = () => {
  return (
    <div className="container mx-auto py-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Ad Comment Automation</h1>
        <p className="text-muted-foreground mt-2">
          Automatically moderate and respond to comments on your Facebook and Instagram ads
        </p>
      </header>
      
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
    </div>
  );
};

export default AdCommentsPage; 