import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  ConnectionLineType,
  MarkerType,
  Position,
  Handle,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Import components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, 
  Save, 
  Play, 
  Settings, 
  MessageCircle, 
  Share2, 
  Hash, 
  User, 
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

// Import custom nodes
import TriggerNode from '@/components/automation/flow-nodes/TriggerNode';
import PlatformNode from '@/components/automation/flow-nodes/PlatformNode';
import PageNode from '@/components/automation/flow-nodes/PageNode';
import PostNode from '@/components/automation/flow-nodes/PostNode';
import KeywordsNode from '@/components/automation/flow-nodes/KeywordsNode';
import ResponseNode from '@/components/automation/flow-nodes/ResponseNode';
import ConfigNode from '@/components/automation/flow-nodes/ConfigNode';

// Import modals
import BlockConfigModal from '@/components/automation/flow-modals/BlockConfigModal';

// Import BoomContext
import { useBoom } from '@/contexts/BoomContext';

// Custom Node Component
const FlowNode = ({ data, selected }) => {
  const { icon: Icon, label, type, isConfigured, isActive } = data;
  
  return (
    <div 
      className={`
        relative px-4 py-3 sm:px-4 sm:py-3 rounded-lg border-2 min-w-[220px] sm:min-w-[200px] max-w-[280px] sm:max-w-none transition-all duration-200
        ${selected ? 'ring-2 ring-purple-500 ring-offset-2' : ''}
        ${isConfigured ? 'border-green-500 bg-green-50' : 
          isActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-white'}
        hover:shadow-md cursor-pointer
      `}
      onClick={data.onClick}
    >
      <div className="flex items-center gap-3">
        <div className={`
          p-2 rounded-full shrink-0
          ${isConfigured ? 'bg-green-100 text-green-600' : 
            isActive ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}
        `}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-gray-900">{label}</div>
          <div className="text-xs text-gray-500 mt-1">
            {isConfigured ? 'Configured' : isActive ? 'Tap to configure' : 'Pending'}
          </div>
        </div>
        <div className="flex items-center shrink-0">
          {isConfigured ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : isActive ? (
            <Clock className="w-4 h-4 text-purple-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>
      
      {/* React Flow Handles */}
      {type !== 'servicePlatform' && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-purple-500 border-2 border-white"
          style={{ top: -6 }}
        />
      )}
      {type !== 'responseConfig' && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-purple-500 border-2 border-white"
          style={{ bottom: -6 }}
        />
      )}
    </div>
  );
};

// Node types
const nodeTypes = {
  flowNode: FlowNode,
};

// Configuration Sidebar Component
const ConfigurationSidebar = ({ 
  activeStep, 
  configData, 
  onConfigChange,
  platforms,
  pages,
  services,
  posts,
  onSyncPosts,
  syncingPosts,
  loadingServices,
  loadingPlatforms,
  loadingPages,
  loadingPosts,
  isMobile = false
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Presets
  const defaultKeywords = ['hello', 'hi', 'help', 'info', 'price', 'buy', 'interested', 'contact', 'dm me', 'more info', 'details', 'available', 'how much', 'cost'];
  
  const defaultLabels = [
    'Instagram Auto Reply',
    'Facebook Auto Response', 
    'Lead Generation Bot',
    'Customer Support Bot',
    'Sales Inquiry Handler',
    'Comment Auto Responder'
  ];

  const defaultTitles = [
    'Welcome Message',
    'Product Information',
    'Contact Details',
    'Thank You Note',
    'Follow Up Message',
    'Special Offer'
  ];

  const defaultUrls = [
    'https://your-website.com',
    'https://calendly.com/your-name',
    'https://wa.me/your-number',
    'mailto:contact@yoursite.com'
  ];

  const defaultCommentResponses = [
    'Thank you for your interest! 🙏',
    'I\'ll send you more details in DM 📩',
    'Thanks for reaching out! 💬',
    'Check your DM for more info ✨',
    'Appreciate your comment! ❤️',
    'Thank you! I\'ll get back to you shortly 🚀'
  ];

  const defaultDmResponses = [
    'Hi! Thanks for your interest in our products/services.',
    'Hello! I saw your comment and I\'d love to help you with more information.',
    'Thanks for reaching out! Here are the details you requested:',
    'Hi there! I\'m excited to share more information with you.',
    'Hello! I noticed your interest and wanted to personally reach out.',
    'Thanks for your comment! Let me provide you with more details.'
  ];

  // Helper functions for adding presets
  const addKeyword = (keyword) => {
    const currentKeywords = configData.keywords?.incoming?.split(',').map(k => k.trim()).filter(k => k) || [];
    if (keyword.trim() && !currentKeywords.includes(keyword.trim())) {
      const updatedKeywords = [...currentKeywords, keyword.trim()].join(', ');
      onConfigChange('keywords', { incoming: updatedKeywords });
    }
  };

  const removeKeyword = (keywordToRemove) => {
    const currentKeywords = configData.keywords?.incoming?.split(',').map(k => k.trim()).filter(k => k) || [];
    const updatedKeywords = currentKeywords.filter(k => k !== keywordToRemove).join(', ');
    onConfigChange('keywords', { incoming: updatedKeywords });
  };

  const addPresetValue = (field, value) => {
    onConfigChange('responseConfig', { 
      ...configData.responseConfig, 
      [field]: value 
    });
  };

  const addPresetToList = (field, value) => {
    const currentValues = configData.responseConfig?.[field]?.split(',').map(v => v.trim()).filter(v => v) || [];
    if (value.trim() && !currentValues.includes(value.trim())) {
      const updatedValues = [...currentValues, value.trim()].join(', ');
      onConfigChange('responseConfig', { 
        ...configData.responseConfig, 
        [field]: updatedValues 
      });
    }
  };

  // Get display names for selected values
  const getSelectedServiceName = () => {
    const serviceId = configData.servicePlatform?.service_id;
    if (!serviceId) return '';
    const service = services.find(s => s.id.toString() === serviceId);
    return service?.service || service?.name || '';
  };

  const getSelectedPlatformName = () => {
    const platformId = configData.servicePlatform?.platform_id;
    if (!platformId) return '';
    const platform = platforms.find(p => p.platform_id === platformId || p.id.toString() === platformId);
    return platform?.platform_name || platform?.name || '';
  };

  const getSelectedPageName = () => {
    const pageId = configData.pagePost?.page_id;
    if (!pageId) return '';
    const page = pages.find(p => p.page_id === pageId);
    return page?.page_name || page?.name || '';
  };

  const getSelectedPostName = () => {
    const postId = configData.pagePost?.post_id;
    if (!postId) return 'All Posts';
    const post = posts.find(p => p.post_id === postId);
    return post?.messages?.substring(0, 50) + '...' || `Post ${post?.id}`;
  };

  // Step 1: Service & Platform Configuration
  const renderServicePlatformConfig = () => (
    <div className="space-y-6">
      <div className="text-sm text-gray-600">
        Select the automation service type and the social media platform.
      </div>

      {/* Service Type */}
      <div className="space-y-2">
        <Label htmlFor="service">Service Type *</Label>
                <Select 
          value={configData.servicePlatform?.service_id || ''} 
          onValueChange={(value) => {
            const selectedService = services.find(s => s.id.toString() === value);
            if (selectedService) {
              onConfigChange('servicePlatform', { 
                ...configData.servicePlatform,
                service_id: value,
                serviceName: selectedService.service || selectedService.name,
                serviceDescription: `Daily limit: ${selectedService.limit_daily || 'Unlimited'}`
              });
            }
          }}
          disabled={isLoading || loadingServices}
        >
          <SelectTrigger>
            <SelectValue placeholder={loadingServices ? "Loading services..." : "Select service type"}>
              {getSelectedServiceName()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="z-[70] max-h-[200px] overflow-y-auto">
            {loadingServices ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500 mr-2"></div>
                <span className="text-sm text-gray-500">Loading services...</span>
              </div>
            ) : (
              services.map(service => (
              <SelectItem key={service.id} value={service.id.toString()}>
                <div className="flex flex-col">
                  <span className="font-medium">{service.service || service.name}</span>
                  <span className="text-xs text-gray-500">
                    Daily limit: {service.limit_daily || 'Unlimited'}
                  </span>
                </div>
              </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        
        {configData.servicePlatform?.service_id && (
          <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-md">
            <div className="text-sm">
              <div className="font-medium text-purple-900">
                {getSelectedServiceName()}
              </div>
              <div className="text-purple-700 text-xs mt-1">
                {configData.servicePlatform.serviceDescription}
              </div>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Platform */}
      <div className="space-y-2">
        <Label htmlFor="platform">Platform *</Label>
                <Select 
          value={configData.servicePlatform?.platform_id || ''} 
          onValueChange={(value) => {
            const selectedPlatform = platforms.find(p => p.id.toString() === value || p.platform_id === value);
            if (selectedPlatform) {
              onConfigChange('servicePlatform', { 
                ...configData.servicePlatform,
                platform_id: value,
                platformName: selectedPlatform.platform_name || selectedPlatform.name,
                platformDescription: `Platform configuration for ${selectedPlatform.platform_name || selectedPlatform.name}`
              });
            }
          }}
          disabled={isLoading || loadingPlatforms}
        >
          <SelectTrigger>
            <SelectValue placeholder={loadingPlatforms ? "Loading platforms..." : "Select platform"}>
              {getSelectedPlatformName()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="z-[70] max-h-[200px] overflow-y-auto">
            {loadingPlatforms ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                <span className="text-sm text-gray-500">Loading platforms...</span>
              </div>
            ) : (
              platforms.map(platform => (
              <SelectItem key={platform.id} value={platform.platform_id || platform.id.toString()}>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{platform.platform_name || platform.name}</span>
                </div>
              </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        
        {configData.servicePlatform?.platform_id && (
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="text-sm">
              <div className="font-medium text-blue-900">
                {getSelectedPlatformName()}
              </div>
              <div className="text-blue-700 text-xs mt-1">
                This automation will work on {getSelectedPlatformName()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Step 2: Page & Post Configuration
  const renderPagePostConfig = () => {
    const platformId = configData.servicePlatform?.platform_id;
    const filteredPages = platformId ? 
      pages.filter(page => page.platform_id === platformId || page.platform_id === platformId.toString()) : 
      pages;

    return (
      <div className="space-y-6">
        <div className="text-sm text-gray-600">
          Select the specific page/account and optionally choose a post to monitor.
        </div>

        {/* Page Selection */}
        <div className="space-y-2">
          <Label htmlFor="page">Page/Account *</Label>
                  <Select 
          value={configData.pagePost?.page_id || ''} 
          onValueChange={(value) => {
            const selectedPage = filteredPages.find(p => p.page_id === value);
            if (selectedPage) {
              onConfigChange('pagePost', { 
                ...configData.pagePost,
                page_id: value,
                pageName: selectedPage.page_name || selectedPage.name,
                pageDescription: `Page: ${selectedPage.page_name || selectedPage.name}`,
                post_id: '' // Reset post selection when page changes
              });
            }
          }}
          disabled={isLoading || !platformId || loadingPages}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              loadingPages ? "Loading pages..." :
              !platformId ? "Select platform first" : "Select page or account"
            }>
              {getSelectedPageName()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="z-[70] max-h-[200px] overflow-y-auto">
            {loadingPages ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500 mr-2"></div>
                <span className="text-sm text-gray-500">Loading pages...</span>
              </div>
            ) : (
              filteredPages.map(page => (
                <SelectItem key={page.id} value={page.page_id}>
                <div className="flex flex-col">
                  <span className="font-medium">{page.page_name || page.name}</span>
                  <span className="text-xs text-gray-500">
                    {page.platform_name || 'Page'}
                  </span>
                </div>
              </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
          
          {configData.pagePost?.page_id && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="text-sm">
                <div className="font-medium text-green-900">
                  {getSelectedPageName()}
                </div>
                <div className="text-green-700 text-xs mt-1">
                  Automation will monitor this page
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Post Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="post">Select Post (Optional)</Label>
            {configData.pagePost?.page_id && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onSyncPosts(configData.pagePost.page_id)}
                disabled={syncingPosts || isLoading || loadingPosts}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${syncingPosts ? 'animate-spin' : ''}`} />
                {syncingPosts ? 'Syncing...' : 'Sync Posts'}
              </Button>
            )}
          </div>
          
                  <Select 
          value={configData.pagePost?.post_id || ''} 
          onValueChange={(value) => {
            if (value === 'all-posts') {
              onConfigChange('pagePost', { 
                ...configData.pagePost,
                post_id: '',
                postName: 'All Posts'
              });
          } else {
              const selectedPost = posts.find(p => p.post_id === value);
            if (selectedPost) {
                onConfigChange('pagePost', { 
                  ...configData.pagePost,
                  post_id: value,
                  postName: selectedPost.messages?.substring(0, 50) || `Post ${selectedPost.id}`
              });
            }
          }
        }}
          disabled={!configData.pagePost?.page_id || loadingPosts}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              !configData.pagePost?.page_id ? "Select page first" :
              loadingPosts ? "Loading posts..." : "Select specific post or all posts"
            }>
              {getSelectedPostName()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="z-[70] max-h-[250px] overflow-y-auto">
            {loadingPosts ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2"></div>
                <span className="text-sm text-gray-500">Loading posts...</span>
              </div>
            ) : (
              <>
                <SelectItem value="all-posts">
            <span className="font-medium">All Posts</span>
          </SelectItem>
            {posts.map(post => (
                    <SelectItem key={post.post_id} value={post.post_id}>
                <div className="flex flex-col max-w-xs">
                  <span className="font-medium truncate">
                          {post.messages?.substring(0, 50) || `Post ${post.id}`}...
                  </span>
                  <span className="text-xs text-gray-500">
                          {new Date(post.created_time).toLocaleDateString()}
                  </span>
                </div>
              </SelectItem>
            ))}
              </>
            )}
          </SelectContent>
        </Select>

          {configData.pagePost?.post_id && (
            <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <div className="text-sm">
                <div className="font-medium text-orange-900">
                  {getSelectedPostName()}
                </div>
                <div className="text-orange-700 text-xs mt-1">
                  Automation will monitor this specific post
                </div>
              </div>
            </div>
          )}
          
          {configData.pagePost?.postName === 'All Posts' && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="text-sm">
                <div className="font-medium text-blue-900">
                  All Posts Selected
                </div>
                <div className="text-blue-700 text-xs mt-1">
                  Automation will monitor all posts on this page
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Step 3: Keywords Configuration
  const renderKeywordsConfig = () => {
    const currentKeywords = configData.keywords?.incoming?.split(',').map(k => k.trim()).filter(k => k) || [];

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 mb-3">
            <Hash className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Trigger Keywords</h3>
          <p className="text-sm text-gray-600">
            Set up keywords that will trigger your automation when they appear in comments or messages.
          </p>
        </div>

        {/* Keyword Input Section */}
        <Card className="border-2 border-dashed border-gray-200 hover:border-yellow-300 transition-colors">
          <CardContent className="p-4">
            <div className="space-y-3">
              <Label htmlFor="keyword-input" className="text-base font-medium">Add Keywords *</Label>
              <Input
                id="keyword-input"
                placeholder="Type keywords separated by commas (e.g., hello, info, price)..."
                value={configData.keywords?.incoming || ''}
                onChange={(e) => onConfigChange('keywords', { incoming: e.target.value })}
                className="text-sm"
              />
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                Separate multiple keywords with commas
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Add Keywords */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">Quick Add Popular Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {defaultKeywords.map((keyword) => (
                <Button
                  key={keyword}
                  variant={currentKeywords.includes(keyword) ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => addKeyword(keyword)}
                  disabled={currentKeywords.includes(keyword)}
                  className={`h-8 text-xs justify-start transition-all ${
                    currentKeywords.includes(keyword) 
                      ? 'bg-green-100 text-green-700 border-green-200' 
                      : 'hover:bg-yellow-50 hover:border-yellow-300'
                  }`}
                >
                  {currentKeywords.includes(keyword) && (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  )}
                  {keyword}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        
                {/* Active Keywords Display */}
        {currentKeywords.length > 0 && (
          <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-yellow-800 flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                Active Trigger Keywords ({currentKeywords.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {currentKeywords.map((keyword, index) => (
                  <div
                      key={index} 
                    className="group bg-white border border-yellow-300 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 cursor-pointer hover:bg-red-50 hover:border-red-300 transition-all duration-200 shadow-sm"
                      onClick={() => removeKeyword(keyword)}
                    >
                    <span className="font-medium text-gray-700">{keyword}</span>
                    <span className="text-gray-400 group-hover:text-red-500 transition-colors">×</span>
                  </div>
                  ))}
                </div>
              <p className="text-yellow-700 text-xs mt-3 flex items-center gap-1">
                <span className="w-1 h-1 bg-yellow-500 rounded-full"></span>
                Click on any keyword to remove it
              </p>
            </CardContent>
          </Card>
        )}

        {/* Progress Indicator */}
        <div className="flex items-center justify-center pt-2 pb-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className={`w-2 h-2 rounded-full ${currentKeywords.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span>{currentKeywords.length > 0 ? `${currentKeywords.length} keywords configured` : 'Add keywords to continue'}</span>
          </div>
        </div>
      </div>
    );
  };

  // Platform-specific preview components
  const FacebookCommentPreview = ({ comment, pageName }) => (
    <div className="bg-white border rounded-lg p-3 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">FB</span>
        </div>
        <div>
          <div className="font-semibold text-sm">{pageName || 'Your Page'}</div>
          <div className="text-xs text-gray-500">2m</div>
        </div>
      </div>
      <div className="text-sm bg-gray-50 rounded-lg p-2">
        {comment || 'Your comment response will appear here...'}
      </div>
    </div>
  );

  const FacebookDMPreview = ({ message, pageName }) => (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg">
      <div className="bg-white rounded-lg p-3 space-y-3">
        <div className="flex items-center gap-2 border-b pb-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">FB</span>
          </div>
          <div className="font-semibold text-sm">{pageName || 'Your Page'}</div>
        </div>
        <div className="bg-blue-500 text-white rounded-lg p-2 ml-8 max-w-[80%]">
          <div className="text-sm">
            {message || 'Your direct message will appear here...'}
          </div>
          <div className="text-xs opacity-75 mt-1">Just now</div>
        </div>
      </div>
    </div>
  );

  const InstagramCommentPreview = ({ comment, pageName }) => (
    <div className="bg-white border rounded-lg p-3 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">IG</span>
        </div>
        <div>
          <div className="font-semibold text-sm">{pageName || 'Your Account'}</div>
          <div className="text-xs text-gray-500">2m</div>
        </div>
      </div>
      <div className="text-sm">
        {comment || 'Your comment response will appear here...'}
      </div>
    </div>
  );

  const InstagramDMPreview = ({ message, pageName }) => (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-lg">
      <div className="bg-white rounded-lg p-3 space-y-3">
        <div className="flex items-center gap-2 border-b pb-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">IG</span>
          </div>
          <div className="font-semibold text-sm">{pageName || 'Your Account'}</div>
        </div>
        <div className="bg-gray-100 rounded-full p-2 mr-8 max-w-[80%]">
          <div className="text-sm text-gray-800">
            {message || 'Your direct message will appear here...'}
          </div>
        </div>
        <div className="text-xs text-gray-500 text-right mr-8">Just now</div>
      </div>
    </div>
  );

  // Step 4: Response Configuration & Settings
  const renderResponseConfig = () => {
    const serviceId = configData.servicePlatform?.service_id;
    const showCommentResponse = serviceId === "1" || serviceId === "5";
    const showDmResponse = serviceId === "2" || serviceId === "5";
    const platformName = getSelectedPlatformName();
    const pageName = getSelectedPageName();
    const isInstagram = platformName?.toLowerCase().includes('instagram');
    const isFacebook = platformName?.toLowerCase().includes('facebook');

    return (
      <div className="space-y-6">
        {/* Header Section */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-3">
            <MessageCircle className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Response & Settings</h3>
          <p className="text-sm text-gray-600">
            Configure your automation responses and settings for {platformName || 'your platform'}.
          </p>
        </div>

        {/* Basic Configuration Card */}
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Basic Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="label" className="text-sm font-medium">Automation Label *</Label>
              <Input
                id="label"
                placeholder="Enter automation label..."
                value={configData.responseConfig?.label || ''}
                onChange={(e) => onConfigChange('responseConfig', { 
                  ...configData.responseConfig, 
                  label: e.target.value 
                })}
                className="mt-1"
              />
              <div className="mt-3">
                <Label className="text-xs text-gray-600">Quick Select Labels</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {defaultLabels.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => addPresetValue('label', preset.replace('Instagram Auto Reply', `${platformName} Auto Reply`).replace('Facebook Auto Response', `${platformName} Auto Response`))}
                      className="text-xs h-7 justify-start hover:bg-purple-50"
                    >
                      {preset.replace('Instagram Auto Reply', `${platformName} Auto Reply`).replace('Facebook Auto Response', `${platformName} Auto Response`)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                            <Select
                value={configData.responseConfig?.status || 'Active'} 
                onValueChange={(value) => onConfigChange('responseConfig', { 
                  ...configData.responseConfig, 
                  status: value 
                })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="z-[70]">
                  <SelectItem value="Active">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Active
            </div>
                  </SelectItem>
                  <SelectItem value="Paused">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      Paused
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Content Configuration Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Content Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Titles */}
            <div>
              <Label htmlFor="tittle" className="text-sm font-medium">Titles *</Label>
              <Input
                id="tittle"
                placeholder="Enter titles separated by commas..."
                value={configData.responseConfig?.tittle || ''}
                onChange={(e) => onConfigChange('responseConfig', { 
                  ...configData.responseConfig, 
                  tittle: e.target.value 
                })}
                className="mt-1"
              />
              <div className="mt-3">
                <Label className="text-xs text-gray-600">Preset Titles</Label>
                <div className="flex flex-wrap gap-1 mt-2">
                  {defaultTitles.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => addPresetToList('tittle', preset)}
                      className="text-xs h-6 hover:bg-blue-50"
                    >
                      {preset}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* URLs */}
            <div>
              <Label htmlFor="url" className="text-sm font-medium">URLs *</Label>
              <Input
                id="url"
                placeholder="Enter URLs separated by commas..."
                value={configData.responseConfig?.url || ''}
                onChange={(e) => onConfigChange('responseConfig', { 
                  ...configData.responseConfig, 
                  url: e.target.value 
                })}
                className="mt-1"
              />
              <div className="mt-3">
                <Label className="text-xs text-gray-600">Preset URLs</Label>
                <div className="grid grid-cols-2 gap-1 mt-2">
                  {defaultUrls.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => addPresetToList('url', preset)}
                      className="text-xs h-6 hover:bg-green-50 justify-start"
                    >
                      {preset}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response Messages Cards */}
        {showCommentResponse && (
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-blue-600" />
                Comment Response {serviceId === "1" && <span className="text-red-500">*</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Textarea
                  id="comment_content"
                  placeholder="Enter your automated comment reply..."
                  value={configData.responseConfig?.comment_content || ''}
                  onChange={(e) => onConfigChange('responseConfig', { 
                    ...configData.responseConfig, 
                    comment_content: e.target.value 
                  })}
                  rows={3}
                  className="resize-none"
                />
                <div className="mt-3">
                  <Label className="text-xs text-gray-600">Quick Responses</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2 max-h-32 overflow-y-auto">
                    {defaultCommentResponses.map((preset, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => addPresetValue('comment_content', preset)}
                        className="text-xs h-8 justify-start hover:bg-blue-50 text-left"
                      >
                        {preset}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comment Preview */}
              <div className="border-t pt-4">
                <Label className="text-sm font-medium flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Live Preview - Comment on {platformName}
                </Label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  {isFacebook ? (
                    <FacebookCommentPreview 
                      comment={configData.responseConfig?.comment_content} 
                      pageName={pageName}
                    />
                  ) : isInstagram ? (
                    <InstagramCommentPreview 
                      comment={configData.responseConfig?.comment_content} 
                      pageName={pageName}
                    />
                  ) : (
                    <div className="bg-gray-100 p-4 rounded-lg text-center">
                      <div className="text-sm text-gray-600">
                        Preview will show once platform is selected
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {showDmResponse && (
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Share2 className="w-4 h-4 text-green-600" />
                Direct Message Response {serviceId === "2" && <span className="text-red-500">*</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Textarea
                  id="dm_content"
                  placeholder="Enter your automated direct message..."
                  value={configData.responseConfig?.dm_content || ''}
                  onChange={(e) => onConfigChange('responseConfig', { 
                    ...configData.responseConfig, 
                    dm_content: e.target.value 
                  })}
                  rows={3}
                  className="resize-none"
                />
                <div className="mt-3">
                  <Label className="text-xs text-gray-600">Message Templates</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2 max-h-32 overflow-y-auto">
                    {defaultDmResponses.map((preset, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => addPresetValue('dm_content', preset)}
                        className="text-xs h-8 justify-start hover:bg-green-50 text-left"
                      >
                        {preset}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* DM Preview */}
              <div className="border-t pt-4">
                <Label className="text-sm font-medium flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Live Preview - Direct Message on {platformName}
                </Label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  {isFacebook ? (
                    <FacebookDMPreview 
                      message={configData.responseConfig?.dm_content} 
                      pageName={pageName}
                    />
                  ) : isInstagram ? (
                    <InstagramDMPreview 
                      message={configData.responseConfig?.dm_content} 
                      pageName={pageName}
                    />
                  ) : (
                    <div className="bg-gray-100 p-4 rounded-lg text-center">
                      <div className="text-sm text-gray-600">
                        Preview will show once platform is selected
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Configuration Summary */}
        {configData.responseConfig?.label && (
          <Card className="border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-600" />
                Configuration Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Automation:</span>
                  <span className="text-sm text-gray-900">{configData.responseConfig.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Platform:</span>
                  <span className="text-sm text-gray-900">{platformName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  <Badge variant={configData.responseConfig.status === 'Active' ? 'default' : 'secondary'}>
                    {configData.responseConfig.status || 'Active'}
                  </Badge>
                </div>
                {configData.responseConfig.tittle && (
                  <div className="pt-2 border-t">
                    <span className="text-xs text-gray-600">Titles: </span>
                    <span className="text-xs text-gray-800">{configData.responseConfig.tittle}</span>
                  </div>
                )}
                {configData.responseConfig.url && (
                  <div>
                    <span className="text-xs text-gray-600">URLs: </span>
                    <span className="text-xs text-gray-800">{configData.responseConfig.url}</span>
                  </div>
                )}
                <div className="pt-2 border-t">
                  <span className="text-xs text-gray-600">Response Type: </span>
                  <span className="text-xs text-gray-800">
                    {configData.responseConfig.comment_content && configData.responseConfig.dm_content
                      ? 'Comment + Direct Message'
                      : configData.responseConfig.comment_content 
                        ? 'Comment Only'
                        : configData.responseConfig.dm_content
                          ? 'Direct Message Only'
                          : 'Not configured'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Extra padding for mobile to ensure all content is accessible */}
        {isMobile && <div className="pb-4"></div>}
      </div>
    );
  };

  const configComponents = {
    servicePlatform: renderServicePlatformConfig,
    pagePost: renderPagePostConfig,
    keywords: renderKeywordsConfig,
    responseConfig: renderResponseConfig,
  };

  const stepTitles = {
    servicePlatform: 'Service Type & Platform',
    pagePost: 'Page & Post Selection', 
    keywords: 'Keywords & Triggers',
    responseConfig: 'Response & Settings',
  };

  const stepDescriptions = {
    servicePlatform: 'Choose automation service and select platform',
    pagePost: 'Select page/account and optionally choose specific post',
    keywords: 'Set up trigger keywords for the automation',
    responseConfig: 'Configure responses, titles, URLs and final settings',
  };

  return (
    <Card className={`h-full flex flex-col ${isMobile ? 'shadow-none border-0' : 'shadow-xl'}`}>
      {!isMobile && (
        <CardHeader className="pb-4 border-b border-gray-200 flex-shrink-0">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {stepTitles[activeStep] || 'Configuration'}
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            {stepDescriptions[activeStep] || 'Configure this step in your automation flow'}
          </p>
        </CardHeader>
      )}
      
      <CardContent className={`flex-1 ${isMobile ? 'p-0' : 'p-0 overflow-hidden'}`}>
        <div className={`${isMobile ? 'p-4' : 'h-full overflow-y-auto p-6'}`}>
          {activeStep && configComponents[activeStep] ? (
            configComponents[activeStep]()
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Settings className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>Click on a step in the flow to configure it</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const Flow = () => {
  const navigate = useNavigate();
  const { createAutomation, getPlatforms, getPages, getAutoReplyServices, getPagePosts, syncPagePosts, platforms, pages } = useBoom();

  // Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [activeStep, setActiveStep] = useState('servicePlatform');
  const [configData, setConfigData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Mobile configuration panel state
  const [showMobileConfig, setShowMobileConfig] = useState(false);
  const [mobileConfigStep, setMobileConfigStep] = useState(null);

  // Data state
  const [services, setServices] = useState([]);
  const [posts, setPosts] = useState([]);
  const [syncingPosts, setSyncingPosts] = useState(false);

  // Loading states
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingPlatforms, setLoadingPlatforms] = useState(true);
  const [loadingPages, setLoadingPages] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Memoized node types
  const memoizedNodeTypes = useMemo(() => nodeTypes, []);

  // Flow steps configuration - Updated to 4 steps
  const FLOW_STEPS = [
    { id: 'servicePlatform', label: 'Service & Platform', icon: Settings },
    { id: 'pagePost', label: 'Page & Post', icon: User },
    { id: 'keywords', label: 'Keywords', icon: Hash },
    { id: 'responseConfig', label: 'Response & Settings', icon: MessageCircle },
  ];

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingServices(true);
        setLoadingPlatforms(true);
        setLoadingPages(true);

        // Fetch services
        const servicesData = await getAutoReplyServices();
        setServices(Array.isArray(servicesData) ? servicesData : []);
        setLoadingServices(false);

        // Fetch platforms
        await getPlatforms();
        setLoadingPlatforms(false);

        // Fetch pages
        await getPages();
        setLoadingPages(false);

      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load configuration data');
        setLoadingServices(false);
        setLoadingPlatforms(false);
        setLoadingPages(false);
      }
    };

    fetchData();
  }, [getPlatforms, getPages, getAutoReplyServices]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Close mobile config panel when switching to desktop
      if (!mobile && showMobileConfig) {
        setShowMobileConfig(false);
        setMobileConfigStep(null);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showMobileConfig]);

  // Handle post sync
  const handleSyncPosts = async (pageId) => {
    if (!pageId) {
      toast.error("Please select a page first");
      return;
    }
    
    setSyncingPosts(true);
    try {
      const response = await syncPagePosts(pageId);
      if (response?.data) {
        setPosts(response.data);
        toast.success(response.message);
      }
    } catch (error) {
      console.error("Error syncing posts:", error);
      toast.error("Failed to sync posts");
    } finally {
      setSyncingPosts(false);
    }
  };

  // Fetch posts when page is selected
  useEffect(() => {
    const fetchPosts = async () => {
      const pageId = configData.pagePost?.page_id;
      if (!pageId) return;
      
      setLoadingPosts(true);
      try {
        const response = await getPagePosts(pageId);
        setPosts(response);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to load posts");
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [configData.pagePost?.page_id, getPagePosts]);

  // Initialize nodes and edges
  useEffect(() => {
    const initialNodes = FLOW_STEPS.map((step, index) => ({
      id: step.id,
      type: 'flowNode',
      position: { 
        x: isMobile ? 30 : 100, 
        y: 80 + (index * (isMobile ? 120 : 120)) 
      },
      data: {
        label: step.label,
        icon: step.icon,
        type: step.id,
        isConfigured: false,
        isActive: step.id === 'servicePlatform', // First step is active by default
        onClick: () => handleStepClick(step.id),
      },
    }));

    const initialEdges = FLOW_STEPS.slice(0, -1).map((step, index) => ({
      id: `${step.id}-${FLOW_STEPS[index + 1].id}`,
      source: step.id,
      target: FLOW_STEPS[index + 1].id,
      type: 'smoothstep',
      markerEnd: {
        type: MarkerType.Arrow,
      },
      style: {
        stroke: '#7c3aed',
        strokeWidth: 2,
      },
    }));

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [isMobile]);

  // Handle step click
  const handleStepClick = useCallback((stepId) => {
    setActiveStep(stepId);
    
    // On mobile, show the configuration panel
    if (isMobile) {
      setMobileConfigStep(stepId);
      setShowMobileConfig(true);
    }
    
    // Update nodes to show which one is active
    setNodes(prevNodes => 
      prevNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          isActive: node.id === stepId,
        },
      }))
    );
  }, [setNodes, isMobile]);

  // Handle configuration change
  const handleConfigChange = useCallback((stepId, newConfig) => {
    setConfigData(prevData => {
      const updatedData = {
        ...prevData,
        [stepId]: {
          ...prevData[stepId],
          ...newConfig,
        },
      };

      // Update node configuration status
      setNodes(prevNodes => 
        prevNodes.map(node => {
          if (node.id === stepId) {
            const isConfigured = validateStepConfig(stepId, updatedData[stepId]);
            return {
              ...node,
              data: {
                ...node.data,
                isConfigured,
              },
            };
          }
          return node;
        })
      );

      return updatedData;
    });
  }, [setNodes]);

  // Validate step configuration
  const validateStepConfig = useCallback((stepId, stepData) => {
    if (!stepData) return false;

    switch (stepId) {
      case 'servicePlatform':
        return !!(stepData.service_id && stepData.platform_id);
      case 'pagePost':
        return !!stepData.page_id;
      case 'keywords':
        return !!(stepData.incoming && stepData.incoming.trim());
      case 'responseConfig':
        const hasLabel = !!(stepData.label && stepData.label.trim());
        const hasTittle = !!(stepData.tittle && stepData.tittle.trim());
        const hasUrl = !!(stepData.url && stepData.url.trim());
        const serviceId = configData.servicePlatform?.service_id;
        
        let hasRequiredResponse = false;
        if (serviceId === "1") {
          hasRequiredResponse = !!(stepData.comment_content && stepData.comment_content.trim());
        } else if (serviceId === "2") {
          hasRequiredResponse = !!(stepData.dm_content && stepData.dm_content.trim());
        } else if (serviceId === "5") {
          hasRequiredResponse = !!((stepData.comment_content && stepData.comment_content.trim()) || (stepData.dm_content && stepData.dm_content.trim()));
        }
        
        return hasLabel && hasTittle && hasUrl && hasRequiredResponse;
      default:
        return false;
    }
  }, [configData.servicePlatform?.service_id]);

  // Handle save automation
  const handleSaveAutomation = useCallback(async () => {
    // Validate required steps
    const requiredSteps = ['servicePlatform', 'pagePost', 'keywords', 'responseConfig'];
    const missingSteps = requiredSteps.filter(stepId => !validateStepConfig(stepId, configData[stepId]));

    if (missingSteps.length > 0) {
      toast.error(`Please configure all required steps: ${missingSteps.join(', ')}`);
      return;
    }

    setIsSaving(true);
    try {
      // Prepare automation data in the exact format expected by CreateAutomationPage
      const automationData = {
        status: configData.responseConfig.status || "Active",
        service_id: configData.servicePlatform.service_id,
        incoming: configData.keywords.incoming,
        platform_id: configData.servicePlatform.platform_id,
        page_id: configData.pagePost.page_id,
        post_id: configData.pagePost.post_id || "",
        label: configData.responseConfig.label,
        comment_content: configData.responseConfig.comment_content || "",
        dm_content: configData.responseConfig.dm_content || "",
        tittle: configData.responseConfig.tittle,
        url: configData.responseConfig.url
      };

      console.log("Submitting automation data:", automationData);
      const response = await createAutomation(automationData);
      console.log("Automation creation response:", response);

      toast.success('Automation created successfully!');
      navigate('/automation');
    } catch (error) {
      console.error('Error creating automation:', error);
      toast.error(`Failed to create automation: ${error.message || "Unknown error"}`);
    } finally {
      setIsSaving(false);
    }
  }, [configData, validateStepConfig, createAutomation, navigate]);

  // Calculate completion percentage
  const getCompletionPercentage = useCallback(() => {
    const totalSteps = FLOW_STEPS.length;
    const completedSteps = FLOW_STEPS.filter(step => 
      validateStepConfig(step.id, configData[step.id])
    ).length;
    return Math.round((completedSteps / totalSteps) * 100);
  }, [configData, validateStepConfig]);

  // Handle mobile configuration save
  const handleMobileConfigSave = useCallback(() => {
    const isCurrentStepValid = validateStepConfig(mobileConfigStep, configData[mobileConfigStep]);
    
    if (isCurrentStepValid) {
      setShowMobileConfig(false);
      setMobileConfigStep(null);
      
      // Update the node to show as configured
      setNodes(prevNodes => 
        prevNodes.map(node => {
          if (node.id === mobileConfigStep) {
            return {
              ...node,
              data: {
                ...node.data,
                isConfigured: true,
                isActive: false,
              },
            };
          }
          return node;
        })
      );
      
      // Check if all steps are now completed
      const updatedConfigData = { ...configData };
      const allStepsCompleted = FLOW_STEPS.every(step => 
        validateStepConfig(step.id, updatedConfigData[step.id])
      );
      
      if (allStepsCompleted) {
        toast.success('🎉 All steps completed! You can now save your automation.');
      } else {
        const remainingSteps = FLOW_STEPS.filter(step => 
          !validateStepConfig(step.id, updatedConfigData[step.id])
        ).length;
        toast.success(`Step saved! ${remainingSteps} step${remainingSteps > 1 ? 's' : ''} remaining.`);
      }
    } else {
      toast.error('Please complete all required fields before saving');
    }
  }, [mobileConfigStep, configData, validateStepConfig, setNodes]);

  // Handle mobile configuration close
  const handleMobileConfigClose = useCallback(() => {
    setShowMobileConfig(false);
    setMobileConfigStep(null);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50 max-w-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-3 sm:p-4 flex-shrink-0">
        <div className="flex items-center justify-between max-w-full overflow-hidden">
          <div className="flex items-center gap-2 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/automation')}
              className="h-8 w-8 shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-2xl font-bold text-gray-900 truncate">
                {isMobile ? 'Flow Builder' : 'Streamlined Flow Builder'}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                {getCompletionPercentage()}% Complete{!isMobile && ' • Configure each step'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className="hidden sm:inline-flex text-xs">
              {FLOW_STEPS.filter(step => validateStepConfig(step.id, configData[step.id])).length} / {FLOW_STEPS.length} Steps
            </Badge>
            {!isMobile && (
              <Button
                onClick={handleSaveAutomation}
                disabled={isSaving || getCompletionPercentage() < 100}
                className="bg-purple-600 hover:bg-purple-700"
                size={isMobile ? "sm" : "default"}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Flow Canvas - Always visible, full width on mobile */}
        <div className={`${isMobile ? 'w-full' : 'flex-1'} relative max-w-full`}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={memoizedNodeTypes}
            connectionLineType={ConnectionLineType.SmoothStep}
            defaultViewport={{ x: isMobile ? 30 : 50, y: 50, zoom: isMobile ? 0.7 : 0.8 }}
            minZoom={0.3}
            maxZoom={2}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={true}
            panOnDrag={true}
            zoomOnScroll={!isMobile}
            fitView={false}
            attributionPosition="bottom-left"
          >
            <Background variant="dots" gap={20} size={1} />
            <Controls 
              className="!bottom-4 !left-4"
              showZoom={!isMobile}
              showFitView={true}
              showInteractive={false}
            />
            {!isMobile && (
              <MiniMap 
                style={{ 
                  height: 120,
                  width: 200 
                }}
                zoomable
                pannable
                nodeColor={(node) => {
                  if (node.data?.isConfigured) return '#7c3aed';
                  if (node.data?.isActive) return '#3b82f6';
                  return '#e5e7eb';
                }}
                className="!bottom-4 !right-4"
              />
            )}
          </ReactFlow>

          {/* Mobile Save Button - Fixed position */}
          {isMobile && getCompletionPercentage() === 100 && !showMobileConfig && (
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
              <div className="flex flex-col items-center gap-2">
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                  All steps completed! Ready to save
                </div>
                <Button
                  onClick={handleSaveAutomation}
                  disabled={isSaving}
                  className="bg-purple-600 hover:bg-purple-700 shadow-2xl border-2 border-white"
                  size="lg"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Automation
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Mobile Progress Indicator - Show when not all steps completed */}
          {isMobile && getCompletionPercentage() < 100 && !showMobileConfig && (
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium shadow-lg border-2 border-white">
                {getCompletionPercentage()}% Complete • {FLOW_STEPS.filter(step => !validateStepConfig(step.id, configData[step.id])).length} steps remaining
              </div>
            </div>
          )}
        </div>

        {/* Desktop Sidebar - Configuration */}
        {!isMobile && (
          <div className="w-96 flex-shrink-0 p-4">
            <ConfigurationSidebar
              activeStep={activeStep}
              configData={configData}
              onConfigChange={handleConfigChange}
              platforms={platforms}
              pages={pages}
              services={services}
              posts={posts}
              onSyncPosts={handleSyncPosts}
              syncingPosts={syncingPosts}
              loadingServices={loadingServices}
              loadingPlatforms={loadingPlatforms}
              loadingPages={loadingPages}
              loadingPosts={loadingPosts}
            />
          </div>
        )}

        {/* Mobile Configuration Panel - Slides in from bottom */}
        {isMobile && (
          <>
            {/* Backdrop */}
            <div 
              className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
                showMobileConfig ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              onClick={handleMobileConfigClose}
            />
            
            {/* Mobile Configuration Panel */}
            <div 
              className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-2xl z-50 max-w-[350px] mx-auto transform transition-transform duration-300 ease-in-out flex flex-col ${
                showMobileConfig ? 'translate-y-0' : 'translate-y-full'
              }`}
              style={{ height: 'calc(100vh - 80px)', maxHeight: '90vh' }}
            >
              {/* Mobile Panel Header */}
              <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white rounded-t-xl flex-shrink-0">
                <h3 className="text-base font-semibold text-gray-900">
                  Step {FLOW_STEPS.findIndex(step => step.id === mobileConfigStep) + 1} of {FLOW_STEPS.length}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {FLOW_STEPS.filter(step => validateStepConfig(step.id, configData[step.id])).length}/{FLOW_STEPS.length}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleMobileConfigClose}
                    className="h-8 w-8"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
              </div>

              {/* Mobile Panel Content */}
              <div className="flex-1 overflow-y-auto overscroll-contain min-h-0">
                <div className="pb-20"> {/* Extra padding to ensure content doesn't get hidden behind footer */}
                  <ConfigurationSidebar
                    activeStep={mobileConfigStep}
                    configData={configData}
                    onConfigChange={handleConfigChange}
                    platforms={platforms}
                    pages={pages}
                    services={services}
                    posts={posts}
                    onSyncPosts={handleSyncPosts}
                    syncingPosts={syncingPosts}
                    loadingServices={loadingServices}
                    loadingPlatforms={loadingPlatforms}
                    loadingPages={loadingPages}
                    loadingPosts={loadingPosts}
                    isMobile={true}
                  />
                </div>
              </div>

              {/* Mobile Panel Footer */}
              <div className="flex-shrink-0 border-t border-gray-200 p-3 bg-white">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleMobileConfigClose}
                    className="flex-1"
                    size="sm"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={handleMobileConfigSave}
                    disabled={!validateStepConfig(mobileConfigStep, configData[mobileConfigStep])}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                    size="sm"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Flow;
