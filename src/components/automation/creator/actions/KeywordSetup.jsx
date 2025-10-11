import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, Hash, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAutomation } from "@/contexts/AutomationContext";

const KeywordSetup = () => {
  const { 
    automationState, 
    addKeyword, 
    removeKeyword 
  } = useAutomation();

  const [newKeyword, setNewKeyword] = useState("");
  const [error, setError] = useState("");

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) {
      setError("Please enter a keyword");
      return;
    }

    if (automationState.keywords.includes(newKeyword.trim().toLowerCase())) {
      setError("This keyword already exists");
      return;
    }

    if (newKeyword.trim().length > 50) {
      setError("Keyword must be less than 50 characters");
      return;
    }

    addKeyword(newKeyword.trim());
    setNewKeyword("");
    setError("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleRemoveKeyword = (index) => {
    removeKeyword(index);
    setError("");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="font-medium text-gray-900 flex items-center gap-2">
          <Hash className="w-4 h-4 text-purple-500" />
          Keyword Triggers
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Add keywords that will trigger your automation when users comment them
        </p>
      </div>

      {/* Add Keyword Input */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              value={newKeyword}
              onChange={(e) => {
                setNewKeyword(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              placeholder="Type & Hit + Enter to add Keyword"
              className={`${error ? 'border-red-300 focus:border-red-500' : ''}`}
            />
          </div>
          <Button
            onClick={handleAddKeyword}
            disabled={!newKeyword.trim()}
            className="bg-purple-600 hover:bg-purple-700 px-4"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-red-600 text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </div>

      {/* Keywords List */}
      {automationState.keywords.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Active Keywords ({automationState.keywords.length})
            </span>
            <span className="text-xs text-gray-500">
              Click × to remove
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {automationState.keywords.map((keyword, index) => (
              <motion.div
                key={`${keyword}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800 border border-purple-200 px-3 py-1 text-sm font-medium flex items-center gap-2 hover:bg-purple-200 transition-colors"
                >
                  <Hash className="w-3 h-3" />
                  {keyword}
                  <button
                    onClick={() => handleRemoveKeyword(index)}
                    className="ml-1 hover:bg-purple-300 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Section */}
      {automationState.keywords.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Hash className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                How it works
              </h4>
              <p className="text-sm text-blue-700 mb-2">
                When someone comments with any of these keywords on your selected post, 
                the automation will instantly trigger and send them a DM.
              </p>
              <div className="text-xs text-blue-600">
                <strong>Example:</strong> User comments "{automationState.keywords[0]}" → 
                Automation sends DM automatically
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {automationState.keywords.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Hash className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm mb-2">No keywords added yet</p>
          <p className="text-xs text-gray-400">
            Add keywords that users might comment to trigger your automation
          </p>
        </div>
      )}

      {/* Suggestions */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="text-sm font-medium text-yellow-900 mb-2">
          💡 Keyword Suggestions
        </h4>
        <div className="flex flex-wrap gap-2">
          {['Hello', 'Info', 'Link', 'More', 'Details', 'Price', 'Buy', 'Shop'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                if (!automationState.keywords.includes(suggestion.toLowerCase())) {
                  addKeyword(suggestion);
                }
              }}
              disabled={automationState.keywords.includes(suggestion.toLowerCase())}
              className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded border border-yellow-300 hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeywordSetup;