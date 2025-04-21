import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Heart, MessageCircle, Eye, Bookmark, Loader2, ExternalLink, Hash } from "lucide-react";

export function InstagramViralFinderPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("username"); // username or hashtag
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [sortBy, setSortBy] = useState("likes");
  const [error, setError] = useState(null);

  // Mock data for demonstration
  const mockPosts = [
    {
      id: "post1",
      imageUrl: "https://via.placeholder.com/300x300",
      likes: 4582,
      comments: 312,
      views: 28453,
      caption: "This is our new product launch! #newproduct #launch",
      type: "video",
      account: "@brandsample",
      postUrl: "https://instagram.com/p/123456"
    },
    {
      id: "post2",
      imageUrl: "https://via.placeholder.com/300x300",
      likes: 2891,
      comments: 187,
      views: 15632,
      caption: "Behind the scenes at our photoshoot #bts #photoshoot",
      type: "carousel",
      account: "@brandsample",
      postUrl: "https://instagram.com/p/789012"
    },
    {
      id: "post3",
      imageUrl: "https://via.placeholder.com/300x300",
      likes: 7123,
      comments: 521,
      views: 42181,
      caption: "Check out our new office space! #newoffice #workspace",
      type: "image",
      account: "@brandsample",
      postUrl: "https://instagram.com/p/345678"
    },
    {
      id: "post4",
      imageUrl: "https://via.placeholder.com/300x300",
      likes: 5732,
      comments: 413,
      views: 31254,
      caption: "Introducing our summer collection #summer #fashion",
      type: "video",
      account: "@brandsample",
      postUrl: "https://instagram.com/p/901234"
    },
    {
      id: "post5",
      imageUrl: "https://via.placeholder.com/300x300",
      likes: 3645,
      comments: 267,
      views: 19873,
      caption: "Customer testimonial - hear what they have to say! #testimonial",
      type: "carousel",
      account: "@brandsample",
      postUrl: "https://instagram.com/p/567890"
    }
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setError("Please enter a search term");
      return;
    }

    setIsLoading(true);
    setError(null);

    // In a real app, you would make an API call to fetch Instagram posts
    // For now, we'll simulate a search with mock data
    setTimeout(() => {
      try {
        setSearchResults({
          query: searchQuery,
          type: searchType,
          posts: mockPosts
        });
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch posts. Please try again.");
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
  };

  // Sort the posts based on the selected criteria
  const getSortedPosts = () => {
    if (!searchResults?.posts) return [];

    return [...searchResults.posts].sort((a, b) => {
      switch (sortBy) {
        case "likes":
          return b.likes - a.likes;
        case "comments":
          return b.comments - a.comments;
        case "views":
          return b.views - a.views;
        default:
          return b.likes - a.likes;
      }
    });
  };

  const getPostTypeIcon = (type) => {
    switch (type) {
      case "video":
        return <Badge className="bg-red-100 text-red-800">Video</Badge>;
      case "carousel":
        return <Badge className="bg-blue-100 text-blue-800">Carousel</Badge>;
      case "image":
        return <Badge className="bg-green-100 text-green-800">Image</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Post</Badge>;
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Instagram Viral Post Finder</h1>
        <p className="text-muted-foreground">
          Find the best performing content on Instagram by searching for a username or hashtag.
        </p>
      </div>

      <div className="bg-card border rounded-xl p-6 mb-8">
        <div className="mb-4">
          <Tabs 
            defaultValue="username" 
            value={searchType}
            onValueChange={setSearchType}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="username" className="flex items-center gap-1">
                <Search className="w-4 h-4" />
                <span>Username</span>
              </TabsTrigger>
              <TabsTrigger value="hashtag" className="flex items-center gap-1">
                <Hash className="w-4 h-4" />
                <span>Hashtag</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="username">
              <div>
                <div className="text-sm mb-2">
                  Enter an Instagram username to find their most viral posts
                </div>
                <div className="flex w-full max-w-lg items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Enter username (e.g., nike)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Searching
                      </>
                    ) : (
                      "Search"
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="hashtag">
              <div>
                <div className="text-sm mb-2">
                  Enter a hashtag to find viral posts
                </div>
                <div className="flex w-full max-w-lg items-center space-x-2">
                  <div className="flex-none text-lg text-muted-foreground">#</div>
                  <Input
                    type="text"
                    placeholder="Enter hashtag (without #)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Searching
                      </>
                    ) : (
                      "Search"
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-800 p-3 rounded-md my-4">
            {error}
          </div>
        )}
      </div>

      {searchResults && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {searchType === "username" ? (
                <>Results for <span className="text-primary">@{searchResults.query}</span></>
              ) : (
                <>Results for <span className="text-primary">#{searchResults.query}</span></>
              )}
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <div className="flex border rounded-md overflow-hidden">
                <button
                  className={`px-3 py-1 text-sm ${
                    sortBy === "likes" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent"
                  }`}
                  onClick={() => handleSortChange("likes")}
                >
                  Likes
                </button>
                <button
                  className={`px-3 py-1 text-sm border-x ${
                    sortBy === "comments" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent"
                  }`}
                  onClick={() => handleSortChange("comments")}
                >
                  Comments
                </button>
                <button
                  className={`px-3 py-1 text-sm ${
                    sortBy === "views" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent"
                  }`}
                  onClick={() => handleSortChange("views")}
                >
                  Views
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getSortedPosts().map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square relative bg-muted">
                  <img
                    src={post.imageUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    {getPostTypeIcon(post.type)}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium">{post.account}</div>
                    <a 
                      href={post.postUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {truncateText(post.caption)}
                  </p>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span>{formatNumber(post.likes)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <MessageCircle className="w-4 h-4 text-blue-500" />
                        <span>{formatNumber(post.comments)}</span>
                      </div>
                      {post.views > 0 && (
                        <div className="flex items-center gap-1 text-sm">
                          <Eye className="w-4 h-4 text-green-500" />
                          <span>{formatNumber(post.views)}</span>
                        </div>
                      )}
                    </div>
                    <button className="text-muted-foreground hover:text-foreground">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default InstagramViralFinderPage; 