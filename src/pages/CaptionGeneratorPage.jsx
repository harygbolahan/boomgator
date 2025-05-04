import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UserCaptionGenerator from '@/components/captions/UserCaptionGenerator';
import { Type } from 'lucide-react';

const CaptionGeneratorPage = () => {
  return (
    <div className="container mx-auto py-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Caption Generator</h1>
        <p className="text-muted-foreground mt-2">
          Generate personalized captions using user information and brand voice
        </p>
      </header>
      
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
    </div>
  );
};

export default CaptionGeneratorPage; 