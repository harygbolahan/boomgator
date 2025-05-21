import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, Loader2 } from "lucide-react";
import { useBoom } from "@/contexts/BoomContext";

export function PagePostsPage() {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const { 
    pages, 
    loadingPages, 
    getPages, 
    getPagePosts, 
    syncPagePosts 
  } = useBoom();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    // Fetch page data if not already loaded
    if (!pages.length) {
      getPages();
    } else {
      const currentPage = pages.find(p => p.page_id === pageId);
      if (currentPage) {
        setPage(currentPage);
      }
    }
    
    // Fetch posts for this page
    fetchPagePosts();
  }, [pageId, pages]);

  const fetchPagePosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getPagePosts(pageId);
      
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        setError("Failed to fetch posts");
      }
    } catch (error) {
      setError("Error loading posts: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncPosts = async () => {
    setSyncing(true);
    setError(null);
    
    try {
      const data = await syncPagePosts(pageId);
      
      if (data && data.data) {
        // Update posts with the new data
        setPosts(data.data);
      } else {
        // Fallback to fetching posts again
        fetchPagePosts();
      }
    } catch (error) {
      setError("Error syncing posts: " + error.message);
    } finally {
      setSyncing(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getPlatformColor = (platformName) => {
    const name = platformName.toLowerCase();
    if (name.includes('facebook')) return 'bg-blue-100 text-blue-800';
    if (name.includes('instagram')) return 'bg-pink-100 text-pink-800';
    if (name.includes('twitter')) return 'bg-gray-100 text-gray-800';
    if (name.includes('linkedin')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getPlatformIcon = (platformName) => {
    const name = platformName.toLowerCase();
    if (name.includes('facebook')) return 'f';
    if (name.includes('instagram')) return '📸';
    if (name.includes('twitter')) return '𝕏';
    if (name.includes('linkedin')) return 'in';
    return '@';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/integrations')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {page ? page.page_name : "Page Posts"}
            </h2>
            <p className="text-muted-foreground">
              View and manage posts from this page
            </p>
          </div>
        </div>
        <Button 
          onClick={handleSyncPosts} 
          disabled={syncing}
        >
          {syncing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Posts
            </>
          )}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : posts.length === 0 ? (
        <Alert>
          <AlertTitle>No posts found</AlertTitle>
          <AlertDescription>
            There are no posts available for this page yet, or the page might not be properly connected.
            Try syncing the posts or reconnecting the platform.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded flex items-center justify-center ${getPlatformColor(post.platform_name)}`}>
                      {getPlatformIcon(post.platform_name)}
                    </div>
                    <CardTitle className="text-md">{post.page_name}</CardTitle>
                  </div>
                  <Badge variant="outline">
                    {formatDate(post.created_time)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm whitespace-pre-wrap break-words">
                  {post.messages}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 py-2 px-4 flex justify-between text-xs text-muted-foreground">
                <div>Post ID: {post.post_id.split('_')[1]}</div>
                <a 
                  href={`https://facebook.com/${post.post_id}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View on {post.platform_name}
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 