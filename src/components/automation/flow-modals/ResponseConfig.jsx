import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, X, Copy } from 'lucide-react';
import { toast } from 'react-toastify';

const ResponseConfig = ({ configData, setConfigData, flowData }) => {
  const serviceId = flowData.trigger?.service_id;
  const isCommentService = serviceId === "1" || serviceId === "5"; // Comment or Both
  const isDMService = serviceId === "2" || serviceId === "5"; // DM or Both

  // Initialize arrays for multiple responses
  const [commentResponses, setCommentResponses] = useState(
    configData.comment_content ? 
      (typeof configData.comment_content === 'string' ? 
        configData.comment_content.split(',').map(s => s.trim()) : 
        configData.comment_content) : 
      ['']
  );
  
  const [dmResponses, setDmResponses] = useState(
    configData.dm_content ? 
      (typeof configData.dm_content === 'string' ? 
        configData.dm_content.split(',').map(s => s.trim()) : 
        configData.dm_content) : 
      ['']
  );

  const updateConfigData = () => {
    const newConfigData = { ...configData };
    
    if (isCommentService) {
      const validComments = commentResponses.filter(c => c.trim());
      newConfigData.comment_content = validComments.join(', ');
    }
    
    if (isDMService) {
      const validDMs = dmResponses.filter(d => d.trim());
      newConfigData.dm_content = validDMs.join(', ');
    }
    
    setConfigData(newConfigData);
  };

  const handleCommentChange = (index, value) => {
    const updated = [...commentResponses];
    updated[index] = value;
    setCommentResponses(updated);
    
    const validComments = updated.filter(c => c.trim());
    setConfigData({
      ...configData,
      comment_content: validComments.join(', '),
    });
  };

  const handleDMChange = (index, value) => {
    const updated = [...dmResponses];
    updated[index] = value;
    setDmResponses(updated);
    
    const validDMs = updated.filter(d => d.trim());
    setConfigData({
      ...configData,
      dm_content: validDMs.join(', '),
    });
  };

  const addCommentResponse = () => {
    setCommentResponses([...commentResponses, '']);
  };

  const removeCommentResponse = (index) => {
    if (commentResponses.length > 1) {
      const updated = commentResponses.filter((_, i) => i !== index);
      setCommentResponses(updated);
      const validComments = updated.filter(c => c.trim());
      setConfigData({
        ...configData,
        comment_content: validComments.join(', '),
      });
    }
  };

  const addDMResponse = () => {
    setDmResponses([...dmResponses, '']);
  };

  const removeDMResponse = (index) => {
    if (dmResponses.length > 1) {
      const updated = dmResponses.filter((_, i) => i !== index);
      setDmResponses(updated);
      const validDMs = updated.filter(d => d.trim());
      setConfigData({
        ...configData,
        dm_content: validDMs.join(', '),
      });
    }
  };

  const copyTemplate = (template, type, index = 0) => {
    if (type === 'comment') {
      handleCommentChange(index, template);
    } else {
      handleDMChange(index, template);
    }
    toast.success('Template applied!');
  };

  return (
    <div className="space-y-6 max-w-full">
      <div className="text-sm text-gray-600">
        Configure the response messages that will be sent when the automation triggers. You can add multiple responses separated by commas.
      </div>

      {/* Comment Response */}
      {isCommentService && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Comment Responses</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCommentResponse}
              className="h-8 px-3"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Response
            </Button>
          </div>
          
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {commentResponses.map((response, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-gray-500 min-w-fit">Response {index + 1}:</Label>
                  {commentResponses.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCommentResponse(index)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <Textarea
                  value={response}
                  onChange={(e) => handleCommentChange(index, e.target.value)}
                  placeholder={`Enter comment response ${index + 1}`}
                  rows={2}
                  className="resize-none text-sm"
                />
              </div>
            ))}
          </div>
          
          <p className="text-xs text-gray-500">
            Multiple responses will be randomly selected. Separate multiple responses by adding new ones above.
          </p>
        </div>
      )}

      {/* DM Response */}
      {isDMService && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Direct Message Responses</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addDMResponse}
              className="h-8 px-3"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Response
            </Button>
          </div>
          
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {dmResponses.map((response, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-gray-500 min-w-fit">Response {index + 1}:</Label>
                  {dmResponses.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDMResponse(index)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <Textarea
                  value={response}
                  onChange={(e) => handleDMChange(index, e.target.value)}
                  placeholder={`Enter DM response ${index + 1}`}
                  rows={2}
                  className="resize-none text-sm"
                />
              </div>
            ))}
          </div>
          
          <p className="text-xs text-gray-500">
            Multiple responses will be randomly selected. Separate multiple responses by adding new ones above.
          </p>
        </div>
      )}

      {/* Response Preview */}
      {(configData.comment_content || configData.dm_content) && (
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700">Response Preview:</div>
          <div className="border border-gray-200 rounded-md p-3 bg-gray-50 space-y-3 max-h-[200px] overflow-y-auto">
            {configData.comment_content && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <div className="text-xs font-medium text-blue-800 mb-2">Comment Replies:</div>
                <div className="text-sm text-blue-700 space-y-1">
                  {configData.comment_content.split(', ').filter(c => c.trim()).map((comment, index) => (
                    <div key={index} className="p-2 bg-white rounded border border-blue-100">
                      <span className="text-xs text-blue-600 font-medium">Option {index + 1}: </span>
                      {comment}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {configData.dm_content && (
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <div className="text-xs font-medium text-green-800 mb-2">Direct Messages:</div>
                <div className="text-sm text-green-700 space-y-1">
                  {configData.dm_content.split(', ').filter(d => d.trim()).map((dm, index) => (
                    <div key={index} className="p-2 bg-white rounded border border-green-100">
                      <span className="text-xs text-green-600 font-medium">Option {index + 1}: </span>
                      {dm}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Response Templates */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-700">Quick Templates:</div>
        <div className="space-y-3">
          {isCommentService && (
            <div className="space-y-2">
              <div className="text-xs text-gray-600 font-medium">Comment Templates:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Thanks for your interest! Check your DM 📩",
                  "Message sent! 📩",
                  "Got it, check your inbox! 📧",
                  "Perfect! I'll send you the details right now 🚀"
                ].map((template, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => copyTemplate(template, 'comment', 0)}
                    className="justify-start text-left h-auto p-2 text-xs bg-blue-50 hover:bg-blue-100 border-blue-200"
                  >
                    <Copy className="h-3 w-3 mr-2 flex-shrink-0" />
                    <span className="truncate">{template}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {isDMService && (
            <div className="space-y-2">
              <div className="text-xs text-gray-600 font-medium">DM Templates:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Hey there! Thanks for your interest 😊",
                  "Hi! I've sent you the details you requested.",
                  "Hello! Click below and I'll send you the link in just a sec 👇",
                  "Welcome! Here's what you're looking for 🎉"
                ].map((template, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => copyTemplate(template, 'dm', 0)}
                    className="justify-start text-left h-auto p-2 text-xs bg-green-50 hover:bg-green-100 border-green-200"
                  >
                    <Copy className="h-3 w-3 mr-2 flex-shrink-0" />
                    <span className="truncate">{template}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponseConfig; 