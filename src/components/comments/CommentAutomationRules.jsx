import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Save, Plus, Trash2 } from 'lucide-react';

const TRIGGER_TYPES = [
  { value: "keyword", label: "Contains Keyword" },
  { value: "sentiment", label: "Sentiment Analysis" },
  { value: "question", label: "Contains Question" },
  { value: "user_type", label: "User Type" }
];

const PLATFORM_TYPES = [
  { value: "all", label: "All Platforms" },
  { value: "1", label: "Facebook" },
  { value: "2", label: "Instagram" },
  { value: "3", label: "Twitter" }
];

const REPLY_TYPES = [
  { value: "admin", label: "Admin Reply" },
  { value: "auto", label: "Auto Reply" }
];

// Single rule component
const AutomationRule = ({ rule, onChange, onDelete, index }) => {
  const handleChange = (field, value) => {
    onChange(index, { ...rule, [field]: value });
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Bot className="h-5 w-5 mr-2 text-primary" />
            Rule {index + 1}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(index)}
            className="h-8 w-8 text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Rule Name</label>
            <Input 
              value={rule.name} 
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter rule name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Platform</label>
            <Select 
              value={rule.platform} 
              onValueChange={(value) => handleChange('platform', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {PLATFORM_TYPES.map(platform => (
                  <SelectItem key={platform.value} value={platform.value}>
                    {platform.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Trigger Type</label>
          <Select 
            value={rule.triggerType} 
            onValueChange={(value) => handleChange('triggerType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select trigger type" />
            </SelectTrigger>
            <SelectContent>
              {TRIGGER_TYPES.map(trigger => (
                <SelectItem key={trigger.value} value={trigger.value}>
                  {trigger.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {rule.triggerType === 'keyword' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Keywords (comma separated)</label>
            <Input 
              value={rule.keywords} 
              onChange={(e) => handleChange('keywords', e.target.value)}
              placeholder="help, support, issue, problem"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Response Type</label>
          <Select 
            value={rule.responseType} 
            onValueChange={(value) => handleChange('responseType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select response type" />
            </SelectTrigger>
            <SelectContent>
              {REPLY_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Automated Response</label>
          <Textarea 
            value={rule.response} 
            onChange={(e) => handleChange('response', e.target.value)}
            placeholder="Enter your automated response template here..."
            rows={3}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch 
            id={`active-${index}`}
            checked={rule.active}
            onCheckedChange={(checked) => handleChange('active', checked)}
          />
          <label htmlFor={`active-${index}`} className="text-sm font-medium">
            Rule Active
          </label>
        </div>
      </CardContent>
    </Card>
  );
};

// Main component
const CommentAutomationRules = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // In a real implementation, you would fetch existing rules from API
    setRules([
      {
        id: 1,
        name: "Support Request",
        platform: "all",
        triggerType: "keyword",
        keywords: "help, support, issue, problem",
        responseType: "auto",
        response: "Thank you for reaching out. Our support team will get back to you shortly.",
        active: true
      }
    ]);
  }, []);

  const handleAddRule = () => {
    setRules([
      ...rules,
      {
        id: Date.now(),
        name: "New Rule",
        platform: "all",
        triggerType: "keyword",
        keywords: "",
        responseType: "auto",
        response: "",
        active: true
      }
    ]);
  };

  const handleRuleChange = (index, updatedRule) => {
    const updatedRules = [...rules];
    updatedRules[index] = updatedRule;
    setRules(updatedRules);
  };

  const handleDeleteRule = (index) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleSaveRules = () => {
    setLoading(true);
    // In a real implementation, you would save the rules to your backend
    console.log("Saving rules:", rules);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Comment Automation Rules</h2>
        <div className="flex gap-2">
          <Button 
            onClick={handleAddRule}
            variant="outline"
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Rule
          </Button>
          <Button 
            onClick={handleSaveRules}
            disabled={loading}
            className="flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            {loading ? "Saving..." : "Save All"}
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {rules.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Automation Rules</h3>
            <p className="text-muted-foreground mb-4">
              Create rules to automatically respond to comments based on triggers and conditions.
            </p>
            <Button onClick={handleAddRule}>Create Your First Rule</Button>
          </Card>
        ) : (
          rules.map((rule, index) => (
            <AutomationRule
              key={rule.id}
              rule={rule}
              index={index}
              onChange={handleRuleChange}
              onDelete={handleDeleteRule}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentAutomationRules; 