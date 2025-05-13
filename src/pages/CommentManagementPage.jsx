import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Bot } from 'lucide-react';
import { CommentReplies } from '@/components/comments/CommentReplies';
import { useNavigate } from 'react-router-dom';
import { commentRepliesService } from '@/lib/api';
import { toast } from 'react-toastify';
const CommentManagementPage = () => {
  const navigate = useNavigate();
  const [commentText, setCommentText] = React.useState('');

  const handleNavigateToAutomations = () => {
    navigate('/comment-automations');
  };

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleSubmitComment = async () => {
    if (commentText.trim()) {
      try {
        const commentData = {
          comment_id: 123, // Placeholder; replace with actual comment ID from context or props
          platform_id: 1,  // Placeholder; replace with actual platform ID from context or props
          content: commentText,
          reply: 'admin'   // As per API documentation
        };
        await commentRepliesService.addCommentReply(commentData);
        console.log('Comment submitted successfully:', commentText);
        toast.success('Comment submitted successfully.');
        setCommentText(''); // Clear input after submission
      } catch (error) {
        console.error('Failed to submit comment:', error.message);
        toast.error('Failed to submit comment. Please try again.');
      }
    }
  };

  return (
    <div className="container mx-auto py-6">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Comment Management</h1>
          <p className="text-muted-foreground mt-2">
            View and respond to comments from your social media platforms
          </p>
        </div>
        <Button 
          onClick={handleNavigateToAutomations}
          className="flex items-center gap-2"
        >
          <Bot className="h-4 w-4" />
          <span>Comment Automations</span>
        </Button>
      </header>
      
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-primary" />
            <CardTitle className="text-xl">Social Media Comments</CardTitle>
          </div>
          <CardDescription>
            View and respond to comments from all your connected social media platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={handleCommentChange}
              placeholder="Write a comment..."
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="New comment input"
            />
            <Button
              onClick={handleSubmitComment}
              disabled={!commentText.trim()}
              className="shrink-0"
              aria-label="Submit new comment"
            >
              Post
            </Button>
          </div>
          <CommentReplies />
        </CardContent>
      </Card>
    </div>
  );
};

export default CommentManagementPage; 