import { useState } from 'react';
import { AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import PostCard from './PostCard';

const PostsList = ({ 
  posts, 
  loading, 
  onRefresh, 
  refreshing, 
  onViewDetails 
}) => {
  const [selectedTab, setSelectedTab] = useState("All");

  // Filter posts based on selected tab
  const filteredPosts = selectedTab === "All" 
    ? posts 
    : posts.filter(post => post.status.toLowerCase() === selectedTab.toLowerCase());

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              Scheduled Posts
            </CardTitle>
            <CardDescription>
              Manage your scheduled social media content
            </CardDescription>
          </div>
          
          <Select 
            value={selectedTab} 
            onValueChange={setSelectedTab}
            className="w-full sm:w-[180px]"
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Posts</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="Posted">Posted</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-lg text-gray-500">No {selectedTab === "All" ? "" : selectedTab.toLowerCase()} posts found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onViewDetails={onViewDetails} 
              />
            ))}
          </div>
        )}
      </CardContent>
      
      {filteredPosts.length > 0 && (
        <CardFooter className="bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredPosts.length} {selectedTab === "All" ? "total" : selectedTab.toLowerCase()} posts
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRefresh}
            className="flex items-center gap-2"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PostsList; 