import { useState, useEffect } from 'react';
import { schedulerService } from '@/lib/api';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

import { SchedulePostModal } from '@/components/social/SchedulePostModal';
import { ScheduledPostsList } from '@/components/social/ScheduledPostsList';
import { PostDetailsModal } from '@/components/social/PostDetailsModal';

export const ContentSchedulerPage = () => {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("All");
  const [selectedPost, setSelectedPost] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isPostDetailsModalOpen, setIsPostDetailsModalOpen] = useState(false);

  // Fetch scheduled posts on component mount
  useEffect(() => {
    if (token) {
      fetchScheduledPosts();
    }
  }, [token]);

  // Function to fetch all scheduled posts
  const fetchScheduledPosts = async () => {
    setLoading(true);
    try {
      const data = await schedulerService.getScheduledPosts();
      setPosts(data || []);
    } catch (error) {
      toast.error("Failed to load scheduled posts");
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh posts with animation
  const handleRefreshPosts = async () => {
    setRefreshing(true);
    try {
      await fetchScheduledPosts();
      toast.success("Posts refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh posts");
    } finally {
      setTimeout(() => setRefreshing(false), 600);
    }
  };

  // Function to fetch a specific post by ID
  const fetchPostById = async (postId) => {
    try {
      const post = await schedulerService.getScheduledPostById(postId);
      setSelectedPost(post);
      setIsPostDetailsModalOpen(true);
    } catch (error) {
      toast.error("Failed to load post details");
      console.error("Error fetching post:", error);
    }
  };

  // Function to submit a new scheduled post
  const handleSubmitPost = async (formData) => {
    try {
      // Combine date and time fields
      const scheduledDateTime = `${formData.scheduled_date} ${formData.scheduled_time}:00`;
      
      // Organize media files
      let image_path = null;
      let video_path = null;
      
      // In a real implementation, we would upload these files to a server
      if (formData.media.length > 0) {
        formData.media.forEach(media => {
          if (media.type === 'image') {
            // In a real implementation, this would be the URL returned from server
            image_path = media.name; 
          } else if (media.type === 'video') {
            // In a real implementation, this would be the URL returned from server
            video_path = media.name;
          }
        });
      }
      
      // Prepare submission data
      const submissionData = {
        content: formData.content,
        scheduled_time: scheduledDateTime,
        status: formData.status,
        platform_id: parseInt(formData.platform_id),
        image_path: image_path,
        video_path: video_path,
      };
      
      // Submit the form data
      await schedulerService.createScheduledPost(submissionData);
      
      // Show success message
      toast.success("Post scheduled successfully");
      
      // Refresh posts list
      fetchScheduledPosts();
      
    } catch (error) {
      toast.error(error.message || "Failed to schedule post");
    }
  };

  // Copy post content to clipboard
  const copyPostContent = (content) => {
    navigator.clipboard.writeText(content);
    toast.success("Content copied to clipboard");
  };

  return (
    <div className="mx-auto px-1 space-y-6 w-full max-w-[380px] sm:max-w-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Content Scheduler</h1>
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={() => setIsScheduleModalOpen(true)}
        >
          Schedule New Post
        </Button>
      </div>

      <ScheduledPostsList 
        posts={posts}
        loading={loading}
        refreshing={refreshing}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        onRefresh={handleRefreshPosts}
        onViewPost={fetchPostById}
        onCopyContent={copyPostContent}
      />

      <SchedulePostModal 
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSubmit={handleSubmitPost}
      />

      {selectedPost && (
        <PostDetailsModal 
          isOpen={isPostDetailsModalOpen}
          onClose={() => setIsPostDetailsModalOpen(false)}
          post={selectedPost}
          onCopyContent={copyPostContent}
        />
      )}
    </div>
  );
};

export default ContentSchedulerPage; 