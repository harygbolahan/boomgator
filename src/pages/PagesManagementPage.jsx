import { useState, useEffect } from 'react';
import { useBoom } from '../contexts/BoomContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { Avatar } from '../components/ui/avatar';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { RefreshCw, Share2, AlertCircle, MessageCircle, ThumbsUp, BarChart2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const ITEMS_PER_PAGE = 5;

const PagesManagementPage = () => {
  const navigate = useNavigate();
  const { 
    pages, 
    loadingPages, 
    getPages,
    getPagePosts,
    syncPagePosts,
    getPlatforms,
    platforms,
    loadingPlatforms,
    getPlatformAuthLink,
    getAllPagePosts
  } = useBoom();

  const [selectedPage, setSelectedPage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingAllPosts, setLoadingAllPosts] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState('pages');
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filtering state
  const [pageNameFilter, setPageNameFilter] = useState('');
  const [selectedPageFilter, setSelectedPageFilter] = useState('all');
  const [uniquePageNames, setUniquePageNames] = useState([]);

  useEffect(() => {
    // Fetch pages when component mounts
    fetchPages();
    // Also fetch platforms to determine if user has connected accounts
    fetchPlatforms();

    // Debug log to check if useBoom hook is providing the correct data
    console.log('BoomContext data in PagesManagementPage:', { pages, loadingPages, platforms });
  }, []);

  // Log when pages data changes
  useEffect(() => {
    console.log('Pages data updated:', pages);
  }, [pages]);
  
  const fetchPlatforms = async () => {
    try {
      await getPlatforms();
    } catch (err) {
      console.error('Error fetching platforms:', err);
      setError('Failed to load connected platforms');
    }
  };

  const fetchPages = async () => {
    setError(null);
    try {
      console.log('Fetching pages...');
      const result = await getPages();
      console.log('Pages fetch result:', result);
    } catch (err) {
      console.error('Error fetching pages:', err);
      setError('Failed to load social media pages');
      toast.error('Failed to load pages. Please try again.');
    }
  };

  const handlePageSelect = async (page) => {
    console.log('Selecting page:', page);
    setSelectedPage(page);
    setActiveTab('posts');
    fetchPostsForPage(page.page_id || page.id);
  };

  const fetchPostsForPage = async (pageId) => {
    setLoadingPosts(true);
    try {
      console.log('Fetching posts for page ID:', pageId);
      const fetchedPosts = await getPagePosts(pageId);
      console.log('Fetched posts:', fetchedPosts);
      setPosts(fetchedPosts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
      toast.error('Failed to fetch posts for this page');
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchAllPosts = async () => {
    setLoadingAllPosts(true);
    try {
      console.log('Fetching all posts from all pages...');
      const fetchedPosts = await getAllPagePosts();
      console.log('Fetched all posts:', fetchedPosts);
      
      // Extract unique page names for filter dropdown
      if (fetchedPosts && fetchedPosts.length > 0) {
        const pageNames = [...new Set(fetchedPosts.map(post => post.page_name))];
        setUniquePageNames(pageNames);
      }
      
      setAllPosts(fetchedPosts || []);
      setTotalPages(Math.ceil((fetchedPosts || []).length / ITEMS_PER_PAGE));
      setCurrentPage(1); // Reset to first page when fetching new data
    } catch (error) {
      console.error('Error fetching all posts:', error);
      setAllPosts([]);
      setUniquePageNames([]);
      toast.error('Failed to fetch posts from all pages');
    } finally {
      setLoadingAllPosts(false);
    }
  };

  const handleSyncPosts = async () => {
    if (!selectedPage) return;
    
    // Always use page_id for syncing
    const pageId = selectedPage.page_id || selectedPage.id;
    
    setSyncing(true);
    try {
      console.log('Syncing posts for page ID:', pageId);
      const syncResult = await syncPagePosts(pageId);
      console.log('Sync result:', syncResult);
      // Refresh posts after sync
      toast.success(`${syncResult.message}: Added ${syncResult.new_posts} new posts `);
      fetchPostsForPage(pageId);
    } catch (error) {
      console.error('Error syncing posts:', error);
      toast.error('Failed to sync posts. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const handleConnectAccount = async (platformType) => {
    try {
      const authLink = await getPlatformAuthLink(platformType);
      if (authLink) {
        window.location.href = authLink;
      } else {
        toast.error(`Failed to get authorization link for ${platformType}`);
      }
    } catch (error) {
      console.error('Error connecting account:', error);
      toast.error('Failed to connect account. Please try again.');
    }
  };

  const refreshData = () => {
    fetchPages();
    if (selectedPage) {
      fetchPostsForPage(selectedPage.page_id || selectedPage.id);
    }
    if (activeTab === 'all-posts') {
      fetchAllPosts();
    }
    toast.info('Refreshing data...');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  // Helper for displaying counts with K/M formatting for large numbers
  const formatCount = (count) => {
    if (!count) return '0';
    const num = parseInt(count, 10);
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const hasNoConnectedPlatforms = !loadingPlatforms && (!platforms || platforms.length === 0);
  const hasNoPages = !loadingPages && (!pages || pages.length === 0);

  // When the "All Posts" tab is selected, fetch all posts
  useEffect(() => {
    if (activeTab === 'all-posts') {
      fetchAllPosts();
    }
  }, [activeTab]);
  
  // Pagination controls
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  // Filter all posts based on search and page filter
  const filteredAllPosts = allPosts.filter(post => {
    const matchesSearch = !pageNameFilter || 
      post.messages?.toLowerCase().includes(pageNameFilter.toLowerCase()) ||
      post.page_name?.toLowerCase().includes(pageNameFilter.toLowerCase());
      
    const matchesPageFilter = selectedPageFilter === 'all' || 
      post.page_name === selectedPageFilter;
      
    return matchesSearch && matchesPageFilter;
  });
  
  // Calculate current page items
  const paginatedPosts = filteredAllPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );
  
  // Update total pages when filters change
  useEffect(() => {
    setTotalPages(Math.ceil(filteredAllPosts.length / ITEMS_PER_PAGE));
    setCurrentPage(1); // Reset to first page when filters change
  }, [filteredAllPosts.length]);

  return (
    <div className="space-y-4 sm:space-y-6 mx-auto max-w-[1200px]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Pages & Posts Management</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={refreshData}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          {selectedPage && activeTab === 'posts' && (
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('pages')}
            >
              Back to Pages
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-lg flex items-center text-red-700">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>{error}</p>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="posts" disabled={!selectedPage}>Page Posts</TabsTrigger>
          <TabsTrigger value="all-posts">All Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="pages">
          {hasNoConnectedPlatforms ? (
            <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
              <Share2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Social Media Accounts Connected</h3>
              <p className="text-muted-foreground mb-6">Connect your social media accounts to manage your pages and posts.</p>
              <div className="flex justify-center gap-4">
                <Button onClick={() => handleConnectAccount('facebook')}>
                  Connect Facebook
                </Button>
                <Button onClick={() => handleConnectAccount('instagram')}>
                  Connect Instagram
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loadingPages ? (
                <div className="col-span-full flex justify-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : hasNoPages ? (
                <div className="col-span-full text-center p-8 border border-dashed border-gray-300 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">No Pages Found</h3>
                  <p className="text-muted-foreground mb-4">
                    You have accounts connected but no pages were found. Try refreshing or connecting additional accounts.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button onClick={refreshData} variant="outline" className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Refresh
                    </Button>
                    <Button onClick={() => navigate('/integrations')}>
                      Manage Connections
                    </Button>
                  </div>
                </div>
              ) : (
                pages.map((page) => (
                  <Card key={page.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <Avatar>
                          <img 
                            src={page.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(page.page_name || page.name)}`} 
                            alt={page.page_name || page.name} 
                            className="h-full w-full object-cover"
                          />
                        </Avatar>
                        <div>
                          <h3 className="font-bold text-lg">{page.page_name || page.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {page.platform_name || (page.platform_type?.charAt(0).toUpperCase() + page.platform_type?.slice(1))}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="font-semibold">{formatCount(page.followers)}</div>
                          <div className="text-xs text-muted-foreground">Followers</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="font-semibold">{formatCount(page.likes)}</div>
                          <div className="text-xs text-muted-foreground">Likes</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="font-semibold">{formatCount(page.comments)}</div>
                          <div className="text-xs text-muted-foreground">Comments</div>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-muted-foreground">
                          Connected: {formatDate(page.created_at || page.connected_at)}
                        </span>
                        <Button onClick={() => handlePageSelect(page)}>
                          View Posts
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="posts">
          {selectedPage && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <img 
                      src={selectedPage.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedPage.page_name || selectedPage.name)}`} 
                      alt={selectedPage.page_name || selectedPage.name} 
                      className="h-full w-full object-cover"
                    />
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedPage.page_name || selectedPage.name}</h2>
                    <p className="text-muted-foreground">
                      {selectedPage.platform_name || (selectedPage.platform_type?.charAt(0).toUpperCase() + selectedPage.platform_type?.slice(1))}
                    </p>
                    
                    <div className="flex space-x-4 mt-1">
                      <span className="text-sm">{formatCount(selectedPage.followers)} followers</span>
                      <span className="text-sm">{formatCount(selectedPage.likes)} likes</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSyncPosts} 
                  disabled={syncing || loadingPosts}
                  variant="default"
                  className="flex items-center gap-2"
                >
                  {syncing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Sync Posts
                    </>
                  )}
                </Button>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                {loadingPosts ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : posts && posts.length > 0 ? (
                  posts.map((post) => (
                    <Card key={post.id || post.post_id} className="overflow-hidden">
                      <div className="p-6">
                        <div className="flex justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">
                              {post.message || post.messages ? 
                                (post.message || post.messages).substring(0, 100) + 
                                ((post.message || post.messages).length > 100 ? '...' : '') 
                              : 'No message content'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Posted: {formatDate(post.created_time)}
                            </p>
                          </div>
                          {post.attachment_url && (
                            <div className="ml-4 flex-shrink-0">
                              <img 
                                src={post.attachment_url} 
                                alt="Post attachment" 
                                className="h-20 w-20 object-cover rounded"
                              />
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 flex space-x-4">
                          <div className="flex items-center text-sm">
                            <span className="mr-1">👍</span>
                            <span>{post.likes_count || 0}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="mr-1">💬</span>
                            <span>{post.comments_count || 0}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="mr-1">🔄</span>
                            <span>{post.shares_count || 0}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => fetchPostsForPage(selectedPage.page_id || selectedPage.id, post.id || post.post_id)}
                          >
                            Get Comments
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(post.permalink_url, '_blank')}
                            disabled={!post.permalink_url}
                          >
                            View on {selectedPage.platform_name || (selectedPage.platform_type?.charAt(0).toUpperCase() + selectedPage.platform_type?.slice(1))}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
                    <p className="text-muted-foreground mb-4">No posts found. Sync posts to get started.</p>
                    <Button onClick={handleSyncPosts} className="mt-4" disabled={syncing}>
                      {syncing ? 'Syncing...' : 'Sync Posts Now'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="all-posts">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h2 className="text-2xl font-bold">All Posts</h2>
              <Button 
                onClick={fetchAllPosts} 
                disabled={loadingAllPosts}
                variant="outline"
                className="flex items-center gap-2"
              >
                {loadingAllPosts ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </>
                )}
              </Button>
            </div>
            
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search posts or page names..." 
                  value={pageNameFilter}
                  onChange={(e) => setPageNameFilter(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={selectedPageFilter} onValueChange={setSelectedPageFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pages</SelectItem>
                  {uniquePageNames.map(pageName => (
                    <SelectItem key={pageName} value={pageName}>
                      {pageName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              {loadingAllPosts ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : filteredAllPosts.length > 0 ? (
                <>
                  {paginatedPosts.map((post) => (
                    <Card key={post.id || post.post_id} className="overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <Avatar className="h-8 w-8 mr-2">
                            <img 
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.page_name)}`} 
                              alt={post.page_name} 
                              className="h-full w-full object-cover"
                            />
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{post.page_name}</p>
                            <p className="text-xs text-muted-foreground">{post.platform_name}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">
                              {post.messages ? 
                                post.messages.substring(0, 100) + (post.messages.length > 100 ? '...' : '') 
                                : 'No message content'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Posted: {formatDate(post.created_time)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedPage({
                                id: post.page_id,
                                page_id: post.page_id,
                                name: post.page_name,
                                page_name: post.page_name,
                                platform_type: post.platform_name.toLowerCase(),
                                platform_name: post.platform_name
                              });
                              setActiveTab('posts');
                              fetchPostsForPage(post.page_id);
                            }}
                          >
                            View Page
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  
                  {/* Pagination Controls */}
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">
                      Showing {Math.min(filteredAllPosts.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)} to {Math.min(filteredAllPosts.length, currentPage * ITEMS_PER_PAGE)} of {filteredAllPosts.length} posts
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                        Page {currentPage} of {totalPages || 1}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={nextPage}
                        disabled={currentPage >= totalPages}
                        className="flex items-center gap-1"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
                  <p className="text-muted-foreground mb-4">
                    {pageNameFilter || selectedPageFilter !== 'all' 
                      ? 'No posts match your filters. Try changing your search criteria.' 
                      : 'No posts found across all pages.'}
                  </p>
                  <Button onClick={fetchAllPosts} className="mt-4" disabled={loadingAllPosts}>
                    {loadingAllPosts ? 'Loading...' : 'Refresh Posts'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PagesManagementPage; 