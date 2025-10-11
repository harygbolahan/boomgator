import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, X, Plus, Link as LinkIcon, MessageSquare, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAutomation } from "@/contexts/AutomationContext";

const DMConfiguration = () => {
  const { 
    automationState, 
    updateDMConfig 
  } = useAutomation();

  const [newButton, setNewButton] = useState({ text: "", action: "" });
  const [newLink, setNewLink] = useState({ text: "", url: "" });

  const handleMessageChange = (message) => {
    updateDMConfig({ message });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // In a real app, you'd upload to a server and get a URL
      const imageUrl = URL.createObjectURL(file);
      updateDMConfig({ image: imageUrl });
    }
  };

  const removeImage = () => {
    updateDMConfig({ image: null });
  };

  const addButton = () => {
    if (newButton.text.trim() && newButton.action.trim()) {
      const buttons = [...automationState.dmConfig.buttons, newButton];
      updateDMConfig({ buttons });
      setNewButton({ text: "", action: "" });
    }
  };

  const removeButton = (index) => {
    const buttons = automationState.dmConfig.buttons.filter((_, i) => i !== index);
    updateDMConfig({ buttons });
  };

  const addLink = () => {
    if (newLink.text.trim() && newLink.url.trim()) {
      const links = [...automationState.dmConfig.links, newLink];
      updateDMConfig({ links });
      setNewLink({ text: "", url: "" });
    }
  };

  const removeLink = (index) => {
    const links = automationState.dmConfig.links.filter((_, i) => i !== index);
    updateDMConfig({ links });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="font-medium text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-purple-500" />
          DM Response Configuration
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Configure the message that will be sent automatically when the automation triggers
        </p>
      </div>

      {/* Message Text */}
      <div className="space-y-2">
        <Label htmlFor="dm-message">Message Text</Label>
        <Textarea
          id="dm-message"
          placeholder="Enter your message here..."
          value={automationState.dmConfig.message}
          onChange={(e) => handleMessageChange(e.target.value)}
          rows={4}
          className="resize-none"
        />
        <p className="text-xs text-gray-500">
          This message will be sent to users when they trigger the automation
        </p>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label>Attach Image (Optional)</Label>
        {!automationState.dmConfig.image ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Click to upload image</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              </div>
            </label>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={automationState.dmConfig.image} 
                  alt="DM attachment"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Image attached</p>
                <p className="text-xs text-gray-500">This image will be sent with your message</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeImage}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Label>Action Buttons (Optional)</Label>
        
        {/* Existing Buttons */}
        {automationState.dmConfig.buttons.length > 0 && (
          <div className="space-y-2">
            {automationState.dmConfig.buttons.map((button, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">{button.text}</p>
                  <p className="text-xs text-blue-600">{button.action}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeButton(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add New Button */}
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Button text"
            value={newButton.text}
            onChange={(e) => setNewButton({ ...newButton, text: e.target.value })}
          />
          <div className="flex gap-2">
            <Input
              placeholder="Action/URL"
              value={newButton.action}
              onChange={(e) => setNewButton({ ...newButton, action: e.target.value })}
            />
            <Button
              onClick={addButton}
              disabled={!newButton.text.trim() || !newButton.action.trim()}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="space-y-3">
        <Label>Quick Links (Optional)</Label>
        
        {/* Existing Links */}
        {automationState.dmConfig.links.length > 0 && (
          <div className="space-y-2">
            {automationState.dmConfig.links.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <LinkIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">{link.text}</p>
                  <p className="text-xs text-green-600 truncate">{link.url}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLink(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add New Link */}
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Link text"
            value={newLink.text}
            onChange={(e) => setNewLink({ ...newLink, text: e.target.value })}
          />
          <div className="flex gap-2">
            <Input
              placeholder="https://..."
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            />
            <Button
              onClick={addLink}
              disabled={!newLink.text.trim() || !newLink.url.trim()}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {(automationState.dmConfig.message || automationState.dmConfig.image) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">
                DM Preview
              </h4>
              <p className="text-sm text-gray-700 mb-2">
                This is how your automated message will appear to users:
              </p>
              <div className="bg-white border border-gray-200 rounded-lg p-3 max-w-xs">
                {automationState.dmConfig.image && (
                  <div className="mb-2">
                    <img 
                      src={automationState.dmConfig.image} 
                      alt="Message attachment"
                      className="w-full rounded"
                    />
                  </div>
                )}
                {automationState.dmConfig.message && (
                  <p className="text-sm text-gray-900 mb-2">
                    {automationState.dmConfig.message}
                  </p>
                )}
                {automationState.dmConfig.buttons.length > 0 && (
                  <div className="space-y-1">
                    {automationState.dmConfig.buttons.map((button, index) => (
                      <div key={index} className="bg-blue-500 text-white text-xs py-1 px-2 rounded text-center">
                        {button.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DMConfiguration;