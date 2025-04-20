import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialMediaConnect } from "@/components/SocialMediaConnect";
import { initFacebookSdk } from "@/lib/socialMediaAuth";
import { AutomationFlowBuilder } from "@/components/automation/AutomationFlowBuilder";

export function AutomationPage() {
  const [activeTab, setActiveTab] = useState("automations");
  const [showModal, setShowModal] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    name: "",
    type: "comment",
    platform: "facebook",
    trigger: "",
    response: ""
  });
  const [automationsList, setAutomationsList] = useState(automations);
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [facebookSdkLoaded, setFacebookSdkLoaded] = useState(false);
  
  // Initialize Facebook SDK on component mount
  useEffect(() => {
    initFacebookSdk()
      .then(() => setFacebookSdkLoaded(true))
      .catch(error => console.error("Failed to initialize Facebook SDK:", error));
  }, []);
  
  const handleCreateAutomation = () => {
    // Validate form
    if (!newAutomation.name || !newAutomation.trigger || !newAutomation.response) {
      return; // Show validation error in a real app
    }
    
    // Create new automation
    const newItem = {
      ...newAutomation,
      status: "Active",
      icon: getIconForType(newAutomation.type),
      iconBg: getBgForType(newAutomation.type),
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      triggered: 0
    };
    
    // Add to list
    setAutomationsList([newItem, ...automationsList]);
    
    // Close modal and reset form
    setShowModal(false);
    setNewAutomation({
      name: "",
      type: "comment",
      platform: "facebook",
      trigger: "",
      response: ""
    });
  };
  
  const handleStatusChange = (index, newStatus) => {
    const updatedAutomations = [...automationsList];
    updatedAutomations[index].status = newStatus;
    setAutomationsList(updatedAutomations);
  };

  const handleEditAutomation = (automation, index) => {
    setNewAutomation({
      ...automation,
      index
    });
    setShowModal(true);
  };
  
  const handleAccountConnected = (accounts) => {
    setConnectedAccounts(accounts);
  };
  
  const filteredAutomations = automationsList.filter(automation => {
    const matchesTab = activeTab === "all" || automation.type.toLowerCase() === activeTab;
    const matchesPlatform = filterPlatform === "all" || automation.platform.toLowerCase().includes(filterPlatform);
    const matchesType = filterType === "all" || automation.type.toLowerCase() === filterType;
    const matchesStatus = filterStatus === "all" || automation.status === filterStatus;
    
    return matchesTab && matchesPlatform && matchesType && matchesStatus;
  });
  
  const getIconForType = (type) => {
    switch(type.toLowerCase()) {
      case "comment": return "💬";
      case "message": return "📨";
      case "keyword": return "🔑";
      case "story": return "📱";
      default: return "🤖";
    }
  };
  
  const getBgForType = (type) => {
    switch(type.toLowerCase()) {
      case "comment": return "bg-blue-100";
      case "message": return "bg-green-100";
      case "keyword": return "bg-yellow-100";
      case "story": return "bg-purple-100";
      default: return "bg-gray-100";
    }
  };

  const getPlatformColor = (platform) => {
    switch(platform.toLowerCase()) {
      case "facebook": return "bg-blue-500";
      case "instagram": return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "twitter": return "bg-sky-500";
      case "linkedin": return "bg-blue-700";
      case "all platforms": return "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500";
      default: return "bg-gray-500";
    }
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case "automations":
        return (
          <div className="space-y-6">
            {/* Tab navigation for automation types */}
            <div className="mt-6 border-b">
              <nav className="flex space-x-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                      activeTab === tab.id
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Automation filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/50 p-4 rounded-lg">
              <div>
                <label htmlFor="platform" className="block text-sm font-medium mb-1">
                  Platform
                </label>
                <select
                  id="platform"
                  className="w-full p-2 border rounded-lg bg-background"
                  value={filterPlatform}
                  onChange={(e) => setFilterPlatform(e.target.value)}
                >
                  <option value="all">All Platforms</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium mb-1">
                  Type
                </label>
                <select
                  id="type"
                  className="w-full p-2 border rounded-lg bg-background"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="comment">Comment</option>
                  <option value="message">Message</option>
                  <option value="keyword">Keyword</option>
                  <option value="story">Story</option>
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium mb-1">
                  Status
                </label>
                <select
                  id="status"
                  className="w-full p-2 border rounded-lg bg-background"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>
            
            {/* Automation cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAutomations.map((automation, index) => (
                <div key={index} className="bg-card rounded-xl shadow-md border overflow-hidden hover:shadow-lg transition-all duration-200">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          automation.status === "Active" 
                            ? "bg-green-100 text-green-800" 
                            : automation.status === "Paused"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}>
                          {automation.status}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-accent">
                          ⋮
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${automation.iconBg}`}>
                        {automation.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{automation.name}</h3>
                        <div className="flex items-center mt-1">
                          <div className={`w-3 h-3 rounded-full mr-1.5 ${getPlatformColor(automation.platform)}`}></div>
                          <p className="text-xs text-muted-foreground">{automation.platform}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Type:</span> {automation.type}
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Trigger:</span> {automation.trigger}
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Response:</span> {automation.response}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Created on {automation.created}</span>
                      <div className="flex items-center gap-1">
                        <span className={automation.triggered > 0 ? "text-green-600" : "text-muted-foreground"}>
                          {automation.triggered} today
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t p-4 bg-accent/10 flex justify-between">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleStatusChange(index, automation.status === "Active" ? "Paused" : "Active")}
                      className={automation.status === "Active" ? "text-yellow-600" : "text-green-600"}
                    >
                      {automation.status === "Active" ? "Pause" : "Activate"}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditAutomation(automation, index)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Automation Types Section */}
            <div className="pt-8">
              <h3 className="text-xl font-semibold mb-6">Automation Types</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {automationTypes.map((type, index) => (
                  <div 
                    key={index} 
                    className="bg-card p-6 rounded-xl shadow-md border hover:shadow-lg transition-all duration-200"
                  >
                    <div className={`w-12 h-12 rounded-full ${getBgForType(type.id)} flex items-center justify-center mb-4 text-xl`}>
                      {type.icon}
                    </div>
                    <h3 className="text-lg font-medium mb-2">{type.title}</h3>
                    <p className="text-muted-foreground mb-4 text-sm">{type.description}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100"
                      onClick={() => {
                        setNewAutomation({
                          ...newAutomation,
                          type: type.id
                        });
                        setShowModal(true);
                      }}
                    >
                      Create
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "flow-builder":
        return (
          <AutomationFlowBuilder 
            onSave={(automationFlow) => {
              // Add the new automation to the list
              const newItem = {
                name: automationFlow.name,
                type: automationFlow.type || "Custom",
                platform: automationFlow.platform || "All Platforms",
                status: "Active",
                icon: getIconForType(automationFlow.type || "Custom"),
                iconBg: getBgForType(automationFlow.type || "Custom"),
                trigger: automationFlow.trigger || "Custom trigger",
                response: automationFlow.response || "Custom action",
                created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                triggered: 0
              };
              
              setAutomationsList([newItem, ...automationsList]);
            }}
          />
        );
      case "accounts":
        return (
          <SocialMediaConnect onAccountConnected={handleAccountConnected} />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Automation Center</h2>
          <p className="text-muted-foreground">
            Configure and manage your social media automations across all platforms.
          </p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
        >
          Create Automation
        </Button>
      </div>
      
      <div className="mt-6">
        <div className="border-b mb-4">
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'automations' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground'}`}
              onClick={() => setActiveTab('automations')}
            >
              Automations
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'flow-builder' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground'}`}
              onClick={() => setActiveTab('flow-builder')}
            >
              Flow Builder
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'accounts' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground'}`}
              onClick={() => setActiveTab('accounts')}
            >
              Connected Accounts
            </button>
          </div>
        </div>
        
        {renderTabContent()}
      </div>
      
      {/* Create Automation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
              {newAutomation.index !== undefined ? "Edit Automation" : "Create New Automation"}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Automation Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full p-2 border rounded-lg bg-background"
                  placeholder="E.g., Comment Responder"
                  value={newAutomation.name}
                  onChange={(e) => setNewAutomation({ ...newAutomation, name: e.target.value })}
                />
              </div>
              
              <div>
                <label htmlFor="automation-type" className="block text-sm font-medium mb-1">
                  Automation Type
                </label>
                <select
                  id="automation-type"
                  className="w-full p-2 border rounded-lg bg-background"
                  value={newAutomation.type}
                  onChange={(e) => setNewAutomation({ ...newAutomation, type: e.target.value })}
                >
                  <option value="comment">Comment Automation</option>
                  <option value="message">Message Automation</option>
                  <option value="keyword">Keyword Triggers</option>
                  <option value="story">Story Automation</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="platform" className="block text-sm font-medium mb-1">
                  Platform
                </label>
                <select
                  id="platform"
                  className="w-full p-2 border rounded-lg bg-background"
                  value={newAutomation.platform}
                  onChange={(e) => setNewAutomation({ ...newAutomation, platform: e.target.value })}
                >
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="All Platforms">All Platforms</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="trigger" className="block text-sm font-medium mb-1">
                  Trigger
                </label>
                <input
                  id="trigger"
                  type="text"
                  className="w-full p-2 border rounded-lg bg-background"
                  placeholder="E.g., Comments containing 'price' or 'cost'"
                  value={newAutomation.trigger}
                  onChange={(e) => setNewAutomation({ ...newAutomation, trigger: e.target.value })}
                />
              </div>
              
              <div>
                <label htmlFor="response" className="block text-sm font-medium mb-1">
                  Response
                </label>
                <textarea
                  id="response"
                  className="w-full p-2 border rounded-lg bg-background"
                  rows={3}
                  placeholder="E.g., Thank you for your interest! Our prices start at $99..."
                  value={newAutomation.response}
                  onChange={(e) => setNewAutomation({ ...newAutomation, response: e.target.value })}
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button 
                onClick={handleCreateAutomation}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              >
                {newAutomation.index !== undefined ? "Save Changes" : "Create Automation"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sample data
const tabs = [
  { id: "all", name: "All Automations" },
  { id: "comment", name: "Comment Automations" },
  { id: "message", name: "Message Automations" },
  { id: "keyword", name: "Keyword Triggers" },
  { id: "story", name: "Story Automations" }
];

const automations = [
  {
    name: "Comment Responder",
    platform: "Facebook, Instagram",
    type: "Comment",
    status: "Active",
    icon: "💬",
    iconBg: "bg-blue-100",
    trigger: "Comments on posts and ads",
    response: "Thank you message with product link",
    created: "Jul 10, 2023",
    triggered: 24
  },
  {
    name: "DM Welcome",
    platform: "Instagram",
    type: "Message",
    status: "Active",
    icon: "📨",
    iconBg: "bg-green-100",
    trigger: "First-time direct message",
    response: "Welcome message with FAQ links",
    created: "Aug 5, 2023",
    triggered: 12
  },
  {
    name: "Product Inquiry",
    platform: "All Platforms",
    type: "Keyword",
    status: "Paused",
    icon: "🔑",
    iconBg: "bg-yellow-100",
    trigger: "Keywords: price, cost, how much",
    response: "Pricing info and catalog link",
    created: "Jun 22, 2023",
    triggered: 0
  },
  {
    name: "Story Mentions",
    platform: "Instagram",
    type: "Story",
    status: "Active",
    icon: "📱",
    iconBg: "bg-purple-100",
    trigger: "When brand is mentioned in stories",
    response: "Thank you message with discount code",
    created: "Jul 30, 2023",
    triggered: 8
  },
  {
    name: "Customer Support",
    platform: "Facebook",
    type: "Keyword",
    status: "Active",
    icon: "🛠️",
    iconBg: "bg-red-100",
    trigger: "Keywords: help, support, issue",
    response: "Support ticket creation and contact info",
    created: "Aug 2, 2023",
    triggered: 5
  },
  {
    name: "Appointment Booking",
    platform: "LinkedIn, Facebook",
    type: "Message",
    status: "Draft",
    icon: "📅",
    iconBg: "bg-indigo-100",
    trigger: "Keywords: appointment, book, schedule",
    response: "Booking link with calendar access",
    created: "Aug 8, 2023",
    triggered: 0
  }
];

const automationTypes = [
  {
    id: "comment",
    icon: "💬",
    title: "Comment Automation",
    description: "Auto-reply to comments on your posts and ads."
  },
  {
    id: "message",
    icon: "📨",
    title: "Message Automation",
    description: "Set up responses for direct messages and inquiries."
  },
  {
    id: "keyword",
    icon: "🔑",
    title: "Keyword Triggers",
    description: "Create automated flows based on specific keywords."
  },
  {
    id: "story",
    icon: "📱",
    title: "Story Automation",
    description: "Respond to story mentions and interactions."
  }
];