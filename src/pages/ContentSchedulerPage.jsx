import { useState, useEffect } from 'react';
import { schedulerService } from '@/lib/api';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';
import { RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import withSubscriptionCheck from '@/lib/withSubscriptionCheck';
import FeatureGate from '@/components/ui/FeatureGate';
import axios from 'axios';

// Component imports
import SchedulePostForm from '@/components/social/content-scheduler/SchedulePostForm';
import PostsList from '@/components/social/content-scheduler/PostsList';
import PostDetailsDialog from '@/components/social/content-scheduler/PostDetailsDialog';
import PreviewDialog from '@/components/social/content-scheduler/PreviewDialog';

export const ContentSchedulerPage = () => {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [platformsLoading, setPlatformsLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewFormData, setPreviewFormData] = useState({
    content: "",
    scheduled_time: "",
    scheduled_date: "",
    platform_id: "",
    media: []
  });

  // Fetch scheduled posts on component mount
  useEffect(() => {
    if (token) {
      fetchScheduledPosts();
      fetchPlatforms();
    }
  }, [token]);

  // Function to fetch all scheduled posts
  const fetchScheduledPosts = async () => {
    setLoading(true);
    try {
      const data = await schedulerService.getScheduledPosts();
      console.log("Data", data);
      
      setPosts(data || []);
    } catch (error) {
      toast.error("Failed to load scheduled posts");
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch platforms
  const fetchPlatforms = async () => {
    if (!token) return;
    
    setPlatformsLoading(true);
    try {
      const response = await axios.get('https://ai.loomsuite.com/api/ai/platforms', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPlatforms(response.data || []);
    } catch (error) {
      toast.error("Failed to load platforms");
      console.error("Error fetching platforms:", error);
    } finally {
      setPlatformsLoading(false);
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
      setIsViewDialogOpen(true);
    } catch (error) {
      toast.error("Failed to load post details");
      console.error("Error fetching post:", error);
    }
  };

  // Handle post creation
  const handlePostCreated = () => {
    fetchScheduledPosts();
  };

  // Open preview modal with form data
  const openPreviewModal = (formData) => {
    if (!formData.platform_id) {
      toast.error("Please select a platform to preview");
      return;
    }
    setPreviewFormData(formData);
    setIsPreviewModalOpen(true);
  };

  return (
    <div className="mx-auto px-1 space-y-6 w-full max-w-[350px] sm:max-w-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Content Scheduler</h1>
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={handleRefreshPosts}
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {/* Schedule New Post Form */}
      <FeatureGate serviceName="Schedule Post">
        <SchedulePostForm 
          onPostCreated={handlePostCreated}
          openPreviewModal={openPreviewModal}
          platforms={platforms}
          platformsLoading={platformsLoading}
        />
      </FeatureGate>
      
      {/* Scheduled Posts List */}
      <PostsList 
        posts={posts}
        loading={loading}
        onRefresh={handleRefreshPosts}
        refreshing={refreshing}
        onViewDetails={fetchPostById}
      />
      
      {/* Post Details Dialog */}
      <PostDetailsDialog
        post={selectedPost}
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
      />
      
      {/* Preview Post Dialog */}
      <PreviewDialog 
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        formData={previewFormData}
        platforms={platforms}
      />
    </div>
  );
};

// Wrap the component with subscription check for "Schedule Post" service
export default withSubscriptionCheck(ContentSchedulerPage, "Schedule Post"); 