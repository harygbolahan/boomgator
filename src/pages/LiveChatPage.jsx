import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ChatContainer from '@/components/chat/ChatContainer';
import { MessageCircle, Settings, Bot } from 'lucide-react';

const LiveChatPage = () => {
  return (
    <div className="container mx-auto py-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Live Chat</h1>
        <p className="text-muted-foreground mt-2">
          Engage with your audience in real-time through a live chat interface
        </p>
      </header>
      
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
    </div>
  );
};

export default LiveChatPage; 