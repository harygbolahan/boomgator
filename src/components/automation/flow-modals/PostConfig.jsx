import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useBoom } from '@/contexts/BoomContext';
import { toast } from 'react-toastify';

const PostConfig = ({ configData, setConfigData, flowData }) => {
  const { getPagePosts, syncPagePosts } = useBoom();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const pageId = flowData.page?.page_id;

  // Load posts on component mount
  useEffect(() => {
    if (pageId) {
      loadPosts();
    }
  }, [pageId]);

  const loadPosts = async () => {
    if (!pageId) return;
    
    try {
      setIsLoading(true);
      const response = await getPagePosts(pageId);
      setPosts(response);
      console.log('Posts loaded:', response);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncPosts = async () => {
    if (!pageId) return;
    
    try {
      setIsSyncing(true);
      const response = await syncPagePosts(pageId);
      if (response?.data) {
        setPosts(response.data);
        toast.success('Posts synced successfully');
      }
    } catch (error) {
      console.error('Error syncing posts:', error);
      toast.error('Failed to sync posts');
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePostSelect = (postId) => {
    if (postId === "") {
      setConfigData({
        ...configData,
        post_id: "",
        postTitle: "All Posts",
        postDescription: "Automation will apply to all posts",
      });
    } else {
      const selectedPost = posts.find(p => p.post_id === postId);
      if (selectedPost) {
        setConfigData({
          ...configData,
          post_id: postId,
          postTitle: selectedPost.messages?.substring(0, 50) + "..." || "Selected Post",
          postDescription: `Post from ${new Date(selectedPost.created_time).toLocaleDateString()}`,
        });
      }
    }
    console.log('Post selected:', postId);
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Optionally select a specific post to limit this automation to, or leave as "All Posts" to apply to all posts.
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="post_id">Post Selection</Label>
          {pageId && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSyncPosts}
              disabled={isSyncing}
              className="text-xs"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Posts'}
            </Button>
          )}
        </div>

        <Select
          value={configData.post_id || ""}
          onValueChange={handlePostSelect}
          disabled={isLoading}
        >
          <SelectTrigger id="post_id" className="w-full">
            <SelectValue placeholder={isLoading ? "Loading posts..." : "Select post (optional)"} />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] overflow-y-auto">
            <SelectItem value="" className="focus:bg-gray-100">
              <div className="flex flex-col items-start py-1">
                <span className="font-medium text-sm">All Posts</span>
                <span className="text-xs text-gray-500">Apply to all posts on this page</span>
              </div>
            </SelectItem>
            {posts.length > 0 ? (
              posts.map((post) => (
                <SelectItem key={post.post_id} value={post.post_id} className="focus:bg-blue-50">
                  <div className="flex flex-col items-start py-1 w-full">
                    <span className="font-medium text-sm leading-tight">
                      {post.messages?.substring(0, 60)}
                      {post.messages?.length > 60 ? '...' : ''}
                    </span>
                    <div className="flex items-center justify-between w-full mt-1">
                      <span className="text-xs text-gray-500">
                        {new Date(post.created_time).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-blue-600 font-medium">
                        {post.post_type || 'Post'}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))
            ) : (
              !isLoading && (
                <SelectItem value="no-posts" disabled>
                  <div className="flex flex-col items-start py-1">
                    <span className="text-sm text-gray-500">No posts found</span>
                    <span className="text-xs text-gray-400">Try syncing posts</span>
                  </div>
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
        
        {configData.hasOwnProperty('post_id') && (
          <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-md">
            <div className="text-sm">
              <div className="font-medium text-orange-900">
                {configData.postTitle}
              </div>
              <div className="text-orange-700 text-xs mt-1">
                {configData.postDescription}
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500">
          Select a specific post to limit this automation to, or leave empty to apply to all posts
        </p>
      </div>
    </div>
  );
};

export default PostConfig; 