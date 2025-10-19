import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';

const ConfigSettings = ({ configData, setConfigData }) => {
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [newQuickLink, setNewQuickLink] = useState({ text: '', url: '' });
  
  const titles = configData.titles || [];
  const urls = configData.urls || [];
  const quickLinks = configData.quickLinks || [];

  const handleLabelChange = (value) => {
    setConfigData({
      ...configData,
      label: value,
    });
  };

  const handleAddTitle = () => {
    const title = currentTitle.trim();
    if (title && !titles.includes(title)) {
      setConfigData({
        ...configData,
        titles: [...titles, title],
      });
      setCurrentTitle('');
    }
  };

  const handleRemoveTitle = (titleToRemove) => {
    setConfigData({
      ...configData,
      titles: titles.filter(t => t !== titleToRemove),
    });
  };

  const handleAddUrl = () => {
    const url = currentUrl.trim();
    if (url && !urls.includes(url)) {
      setConfigData({
        ...configData,
        urls: [...urls, url],
      });
      setCurrentUrl('');
    }
  };

  const handleRemoveUrl = (urlToRemove) => {
    setConfigData({
      ...configData,
      urls: urls.filter(u => u !== urlToRemove),
    });
  };

  const handleAddQuickLink = () => {
    const { text, url } = newQuickLink;
    if (text.trim() && url.trim()) {
      setConfigData({
        ...configData,
        quickLinks: [...quickLinks, { text: text.trim(), url: url.trim() }],
      });
      setNewQuickLink({ text: '', url: '' });
    }
  };

  const handleRemoveQuickLink = (index) => {
    setConfigData({
      ...configData,
      quickLinks: quickLinks.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6 max-w-full">
      <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="font-medium text-blue-900 mb-1">🎯 Final Configuration</div>
        Complete your automation setup with a label and optional titles and URLs. This is the last step before your automation goes live!
      </div>

      {/* Label */}
      <div className="space-y-3">
        <Label htmlFor="label" className="text-sm font-medium flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          Automation Label (Required)
        </Label>
        <Input
          id="label"
          value={configData.label || ''}
          onChange={(e) => handleLabelChange(e.target.value)}
          placeholder="e.g., Instagram Comments Auto-Reply, Lead Generation Bot..."
          className="h-10"
        />
        <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded border">
          💡 <strong>Tip:</strong> Use descriptive labels like "Instagram Lead Gen" or "Facebook Support Bot" to easily identify this automation later.
        </p>
      </div>

      {/* Titles */}
      <div className="space-y-3">
        <Label htmlFor="titles" className="text-sm font-medium flex items-center gap-2">
          📝 Response Titles (Optional)
        </Label>
        <div className="flex gap-2">
          <Input
            id="titles"
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTitle())}
            placeholder="e.g., Free Guide, Exclusive Offer, Download Link..."
            className="flex-1 h-10"
          />
          <Button
            type="button"
            onClick={handleAddTitle}
            disabled={!currentTitle.trim()}
            size="default"
            variant="outline"
            className="px-4 h-10"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>

        {titles.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                {titles.length} Title{titles.length !== 1 ? 's' : ''}
              </span>
              Added Titles:
            </div>
            <div className="space-y-2 max-h-[150px] overflow-y-auto">
              {titles.map((title, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-lg px-3 py-2 group hover:from-blue-100 hover:to-blue-50 transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-sm font-medium">{title}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveTitle(title)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded border">
          💡 <strong>Pro tip:</strong> Add catchy titles that will be used in your automation responses to grab attention and increase engagement.
        </p>
      </div>

      {/* URLs */}
      <div className="space-y-3">
        <Label htmlFor="urls" className="text-sm font-medium flex items-center gap-2">
          🔗 Response URLs (Optional)
        </Label>
        <div className="flex gap-2">
          <Input
            id="urls"
            value={currentUrl}
            onChange={(e) => setCurrentUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
            placeholder="e.g., https://example.com/download, https://calendly.com/meeting..."
            className="flex-1 h-10"
          />
          <Button
            type="button"
            onClick={handleAddUrl}
            disabled={!currentUrl.trim()}
            size="default"
            variant="outline"
            className="px-4 h-10"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>

        {urls.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                {urls.length} URL{urls.length !== 1 ? 's' : ''}
              </span>
              Added URLs:
            </div>
            <div className="space-y-2 max-h-[150px] overflow-y-auto">
              {urls.map((url, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gradient-to-r from-green-50 to-white border border-green-200 rounded-lg px-3 py-2 group hover:from-green-100 hover:to-green-50 transition-all duration-200"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                    <span className="text-sm font-medium truncate" title={url}>{url}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveUrl(url)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0 ml-2 flex-shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded border">
          💡 <strong>Pro tip:</strong> Add direct links to your lead magnets, booking pages, or downloads that will be sent in automation responses.
        </p>
      </div>

      {/* Quick Links */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          ⚡ Quick Action Links (Optional)
        </Label>
        <p className="text-xs text-gray-600">
          Create clickable action buttons with custom text and URLs for your automation responses
        </p>
        
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="link-text" className="text-xs font-medium text-gray-700">
                Button Text
              </Label>
              <Input
                id="link-text"
                value={newQuickLink.text}
                onChange={(e) => setNewQuickLink({ ...newQuickLink, text: e.target.value })}
                placeholder="e.g., Download Now, Book Meeting, Get Started..."
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-url" className="text-xs font-medium text-gray-700">
                URL
              </Label>
              <Input
                id="link-url"
                value={newQuickLink.url}
                onChange={(e) => setNewQuickLink({ ...newQuickLink, url: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddQuickLink())}
                placeholder="https://example.com/action"
                className="h-9 text-sm"
              />
            </div>
          </div>
          <Button
            type="button"
            onClick={handleAddQuickLink}
            disabled={!newQuickLink.text.trim() || !newQuickLink.url.trim()}
            size="sm"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Quick Link
          </Button>
        </div>

        {quickLinks.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                {quickLinks.length} Quick Link{quickLinks.length !== 1 ? 's' : ''}
              </span>
              Action Buttons:
            </div>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {quickLinks.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-white border border-purple-200 rounded-lg px-3 py-3 group hover:from-purple-100 hover:to-purple-50 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate" title={link.text}>
                        {link.text}
                      </div>
                      <div className="text-xs text-gray-500 truncate" title={link.url}>
                        {link.url}
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveQuickLink(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 ml-2 flex-shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 bg-purple-50 p-2 rounded border border-purple-200">
          ⚡ <strong>Action Links:</strong> These will appear as clickable buttons in your automation responses, making it easy for users to take specific actions.
        </p>
      </div>

      {/* Configuration Summary */}
      {configData.label && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
            <div className="text-sm font-bold text-purple-900">🎉 Configuration Summary</div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-purple-100">
              <span className="text-green-600">✅</span>
              <span className="font-medium text-gray-700">Label:</span>
              <span className="text-purple-800 font-medium">{configData.label}</span>
            </div>
            {titles.length > 0 && (
              <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-blue-100">
                <span className="text-blue-600">📝</span>
                <span className="font-medium text-gray-700">Titles:</span>
                <span className="text-blue-800 font-medium">{titles.length} configured</span>
              </div>
            )}
            {urls.length > 0 && (
              <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-green-100">
                <span className="text-green-600">🔗</span>
                <span className="font-medium text-gray-700">URLs:</span>
                <span className="text-green-800 font-medium">{urls.length} configured</span>
              </div>
            )}
            {quickLinks.length > 0 && (
              <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-purple-100">
                <span className="text-purple-600">⚡</span>
                <span className="font-medium text-gray-700">Quick Links:</span>
                <span className="text-purple-800 font-medium">{quickLinks.length} action button{quickLinks.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
          <div className="mt-3 p-2 bg-white rounded-lg border border-yellow-200">
            <div className="text-xs text-yellow-800 font-medium flex items-center gap-1">
              <span>🚀</span>
              <span>Your automation is ready to be created! Click "Confirm" to proceed.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigSettings;