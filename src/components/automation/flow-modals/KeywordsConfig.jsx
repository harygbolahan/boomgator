import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';

const KeywordsConfig = ({ configData, setConfigData }) => {
  const [currentKeyword, setCurrentKeyword] = useState('');
  const keywords = configData.keywords || [];

  const handleAddKeyword = () => {
    const keyword = currentKeyword.trim();
    if (keyword && !keywords.includes(keyword)) {
      const newKeywords = [...keywords, keyword];
      setConfigData({
        ...configData,
        keywords: newKeywords,
      });
      setCurrentKeyword('');
      console.log('Keyword added:', keyword);
    }
  };

  const handleRemoveKeyword = (keywordToRemove) => {
    const newKeywords = keywords.filter(k => k !== keywordToRemove);
    setConfigData({
      ...configData,
      keywords: newKeywords,
    });
    console.log('Keyword removed:', keywordToRemove);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Add keywords that will trigger this automation when found in comments.
      </div>

      <div className="space-y-2">
        <Label htmlFor="keywords">Trigger Keywords</Label>
        <div className="flex gap-2">
          <Input
            id="keywords"
            value={currentKeyword}
            onChange={(e) => setCurrentKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a keyword and press Enter"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleAddKeyword}
            disabled={!currentKeyword.trim()}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Keywords display */}
        {keywords.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Keywords ({keywords.length}):</div>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm"
                >
                  <span>{keyword}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="hover:bg-purple-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preset keywords */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Quick Add:</div>
          <div className="flex flex-wrap gap-2">
            {['Hello', 'I am interested', 'Okay', 'Yes', 'Info', 'Details'].map((preset) => (
              <Button
                key={preset}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!keywords.includes(preset)) {
                    setConfigData({
                      ...configData,
                      keywords: [...keywords, preset],
                    });
                  }
                }}
                disabled={keywords.includes(preset)}
                className="text-xs"
              >
                {preset}
              </Button>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-500">
          Keywords are not case-sensitive. When someone comments with these words, your automation will trigger.
        </p>
      </div>
    </div>
  );
};

export default KeywordsConfig; 