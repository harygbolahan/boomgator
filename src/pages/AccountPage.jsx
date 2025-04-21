import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, CreditCard } from "lucide-react";

export function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [emailNotificationStates, setEmailNotificationStates] = useState(() => 
    emailNotifications.map(notification => notification.enabled)
  );
  const [pushNotificationStates, setPushNotificationStates] = useState(() => 
    pushNotifications.map(notification => notification.enabled)
  );
  
  const handleToggleEmailNotification = (index) => {
    const newStates = [...emailNotificationStates];
    newStates[index] = !newStates[index];
    setEmailNotificationStates(newStates);
  };
  
  const handleTogglePushNotification = (index) => {
    const newStates = [...pushNotificationStates];
    newStates[index] = !newStates[index];
    setPushNotificationStates(newStates);
  };
  
  const handleTabKeyDown = (e, tabId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveTab(tabId);
    }
  };
  
  const handleSaveChanges = () => {
    // Implementation for saving profile changes
    console.log('Saving profile changes');
  };
  
  const handlePasswordUpdate = () => {
    // Implementation for updating password
    console.log('Updating password');
  };
  
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Account Settings</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your account preferences and settings.
        </p>
      </div>
      
      {/* Tab navigation */}
      <div className="border-b overflow-x-auto" role="tablist" aria-label="Account settings tabs">
        <nav className="flex space-x-2 sm:space-x-4 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              id={`${tab.id}-tab`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              className={`px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium border-b-2 -mb-px transition-colors ${
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
      
      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div 
          role="tabpanel" 
          id="profile-panel" 
          aria-labelledby="profile-tab"
          className="space-y-4 sm:space-y-6"
        >
          <div className="bg-card rounded-xl shadow-sm border p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-6">Personal Information</h3>
            
            <div className="flex flex-col md:flex-row gap-4 sm:gap-8">
              <div className="flex flex-col items-center md:items-start">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-accent flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4">
                  JD
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  aria-label="Change avatar"
                >
                  Change Avatar
                </Button>
              </div>
              
              <div className="flex-1 space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      className="w-full p-2 text-sm border rounded-lg bg-background"
                      defaultValue="John"
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      className="w-full p-2 text-sm border rounded-lg bg-background"
                      defaultValue="Doe"
                      aria-required="true"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full p-2 text-sm border rounded-lg bg-background"
                    defaultValue="john.doe@example.com"
                    aria-required="true"
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-1">
                    Company
                  </label>
                  <input
                    id="company"
                    type="text"
                    className="w-full p-2 text-sm border rounded-lg bg-background"
                    defaultValue="Acme Inc."
                  />
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium mb-1">
                    Role
                  </label>
                  <input
                    id="role"
                    type="text"
                    className="w-full p-2 text-sm border rounded-lg bg-background"
                    defaultValue="Marketing Manager"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    className="text-xs sm:text-sm"
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Security Tab */}
      {activeTab === "security" && (
        <div 
          role="tabpanel" 
          id="security-panel" 
          aria-labelledby="security-tab"
          className="space-y-4 sm:space-y-6"
        >
          <div className="bg-card rounded-xl shadow-sm border p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-6">Change Password</h3>
            
            <div className="grid gap-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium mb-1.5">Current Password</label>
                <input
                  id="currentPassword"
                  type="password"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Enter your current password"
                  aria-required="true"
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium mb-1.5">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Enter your new password"
                  aria-required="true"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Confirm your new password"
                  aria-required="true"
                />
              </div>
              
              <div>
                <Button 
                  className="text-xs sm:text-sm"
                  onClick={handlePasswordUpdate}
                >
                  Update Password
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl shadow-sm border p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-6">Two-Factor Authentication</h3>
            
            <div className="space-y-4">
              <div className="flex items-start sm:items-center justify-between">
                <div>
                  <p className="text-sm sm:text-base font-medium">Authenticator App</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Use an authenticator app to generate one-time codes.</p>
                </div>
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">Setup</Button>
              </div>
              
              <div className="flex items-start sm:items-center justify-between">
                <div>
                  <p className="text-sm sm:text-base font-medium">Text Message</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Use your phone number to receive codes via SMS.</p>
                </div>
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">Setup</Button>
              </div>
              
              <div className="flex items-start sm:items-center justify-between">
                <div>
                  <p className="text-sm sm:text-base font-medium">Backup Codes</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Generate backup codes to use when you don't have access to other methods.</p>
                </div>
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">Generate</Button>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl shadow-sm border p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-6">Active Sessions</h3>
            
            <div className="space-y-3 sm:space-y-4">
              {sessions.map((session, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-2 sm:gap-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm sm:text-base">{session.device}</span>
                      {session.current && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {session.location} • {session.lastActive}
                    </div>
                  </div>
                  {!session.current && (
                    <Button variant="ghost" size="sm" className="text-xs sm:text-sm text-red-500 hover:text-red-700">
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Billing Tab */}
      {activeTab === "billing" && (
        <div 
          role="tabpanel" 
          id="billing-panel" 
          aria-labelledby="billing-tab"
          className="space-y-4 sm:space-y-6"
        >
          <div className="bg-card rounded-xl shadow-sm border p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-6">Current Plan</h3>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b gap-2 sm:gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-medium">Pro Plan</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    Current
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">$29/month • Renews on May 12, 2023</p>
              </div>
              <div className="flex flex-col xs:flex-row gap-2">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">Change Plan</Button>
                <Button variant="ghost" size="sm" className="text-xs sm:text-sm text-red-500 hover:text-red-700">Cancel</Button>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Plan Features</h4>
              <ul className="grid gap-2 text-xs sm:text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Unlimited projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Unlimited team members</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Priority support</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-card rounded-xl shadow-sm border p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-6">Payment Method</h3>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b gap-2 sm:gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-muted rounded-md h-10 w-14 flex items-center justify-center">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-medium">•••• •••• •••• 4242</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Expires 12/2024</p>
                </div>
              </div>
              <div className="flex flex-col xs:flex-row gap-2">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">Update</Button>
                <Button variant="ghost" size="sm" className="text-xs sm:text-sm">Add New</Button>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-3">Billing Address</h4>
              <p className="text-xs sm:text-sm mb-4">
                John Doe<br />
                123 Main St<br />
                San Francisco, CA 94103<br />
                United States
              </p>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">Edit Address</Button>
            </div>
          </div>
          
          <div className="bg-card rounded-xl shadow-sm border p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-6">Billing History</h3>
            
            <div className="space-y-3 sm:space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-2 sm:gap-0">
                  <div>
                    <p className="text-sm sm:text-base font-medium">Pro Plan - Monthly</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {index === 0 ? "May 12, 2023" : index === 1 ? "April 12, 2023" : "March 12, 2023"}
                    </p>
                  </div>
                  <div className="flex flex-col xs:flex-row gap-2 sm:gap-4 items-start sm:items-center">
                    <span className="text-sm font-medium">$29.00</span>
                    <Button variant="ghost" size="sm" className="text-xs sm:text-sm">View Invoice</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div 
          role="tabpanel" 
          id="notifications-panel" 
          aria-labelledby="notifications-tab"
          className="space-y-4 sm:space-y-6"
        >
          <div className="bg-card rounded-xl shadow-sm border p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-6">Email Notifications</h3>
            
            <div className="space-y-3 sm:space-y-5">
              {emailNotifications.map((notification, index) => (
                <div key={index} className="flex items-start sm:items-center justify-between">
                  <div>
                    <p className="font-medium text-sm sm:text-base">{notification.title}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={emailNotificationStates[index]}
                    aria-label={`${notification.title} notifications ${emailNotificationStates[index] ? 'enabled' : 'disabled'}`}
                    onClick={() => handleToggleEmailNotification(index)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleToggleEmailNotification(index);
                      }
                    }}
                    tabIndex={0}
                    className={`relative inline-flex h-5 w-10 flex-shrink-0 rounded-full border-2 border-transparent ${
                      emailNotificationStates[index] ? 'bg-indigo-600' : 'bg-gray-200'
                    } cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  >
                    <span 
                      className={`${
                        emailNotificationStates[index] ? 'translate-x-5 bg-white' : 'translate-x-0 bg-white'
                      } pointer-events-none relative inline-block h-4 w-4 rounded-full shadow transform ring-0 transition ease-in-out duration-200`} 
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-card rounded-xl shadow-sm border p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-6">Push Notifications</h3>
            
            <div className="space-y-3 sm:space-y-5">
              {pushNotifications.map((notification, index) => (
                <div key={index} className="flex items-start sm:items-center justify-between">
                  <div>
                    <p className="font-medium text-sm sm:text-base">{notification.title}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={pushNotificationStates[index]}
                    aria-label={`${notification.title} notifications ${pushNotificationStates[index] ? 'enabled' : 'disabled'}`}
                    onClick={() => handleTogglePushNotification(index)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleTogglePushNotification(index);
                      }
                    }}
                    tabIndex={0}
                    className={`relative inline-flex h-5 w-10 flex-shrink-0 rounded-full border-2 border-transparent ${
                      pushNotificationStates[index] ? 'bg-indigo-600' : 'bg-gray-200'
                    } cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  >
                    <span 
                      className={`${
                        pushNotificationStates[index] ? 'translate-x-5 bg-white' : 'translate-x-0 bg-white'
                      } pointer-events-none relative inline-block h-4 w-4 rounded-full shadow transform ring-0 transition ease-in-out duration-200`} 
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* API Tab */}
      {activeTab === "api" && (
        <div 
          role="tabpanel" 
          id="api-panel" 
          aria-labelledby="api-tab"
          className="space-y-4 sm:space-y-6"
        >
          <div className="bg-card rounded-xl shadow-sm border p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-6">API Keys</h3>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm sm:text-base">Production Key</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <input 
                      type="password" 
                      readOnly
                      value="••••••••••••••••"
                      className="text-xs sm:text-sm bg-transparent border-none p-0 outline-none" 
                    />
                    <button className="text-xs sm:text-sm text-primary">Show</button>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Created on Aug 12, 2023</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">Copy</Button>
                  <Button variant="ghost" size="sm" className="text-xs sm:text-sm text-red-500 hover:text-red-700">Revoke</Button>
                </div>
              </div>
              
              <Button variant="outline" className="text-xs sm:text-sm">Generate New API Key</Button>
            </div>
          </div>
          
          <div className="bg-card rounded-xl shadow-sm border p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-6">Webhooks</h3>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-0">
                <div>
                  <div className="font-medium text-sm sm:text-base">https://example.com/webhook</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">For post engagement events</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">Test</Button>
                  <Button variant="ghost" size="sm" className="text-xs sm:text-sm text-red-500 hover:text-red-700">Delete</Button>
                </div>
              </div>
              
              <Button variant="outline" className="text-xs sm:text-sm">Add Webhook Endpoint</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sample data
const tabs = [
  { id: "profile", name: "Profile" },
  { id: "security", name: "Security" },
  { id: "billing", name: "Billing" },
  { id: "notifications", name: "Notifications" },
  { id: "api", name: "API" }
];

const sessions = [
  {
    device: "MacBook Pro",
    location: "San Francisco, CA",
    lastActive: "Just now",
    current: true
  },
  {
    device: "iPhone 12",
    location: "San Francisco, CA",
    lastActive: "2 hours ago",
    current: false
  },
  {
    device: "Windows PC",
    location: "New York, NY",
    lastActive: "3 days ago",
    current: false
  }
];

const invoices = [
  {
    date: "Aug 12, 2023",
    description: "Professional Plan - Monthly",
    amount: "$49.00"
  },
  {
    date: "Jul 12, 2023",
    description: "Professional Plan - Monthly",
    amount: "$49.00"
  },
  {
    date: "Jun 12, 2023",
    description: "Professional Plan - Monthly",
    amount: "$49.00"
  }
];

const emailNotifications = [
  {
    title: "Account activity",
    description: "Get notified when there is activity on your account like logins and password changes.",
    enabled: true
  },
  {
    title: "Billing alerts",
    description: "Get notified about upcoming payments, billing issues, etc.",
    enabled: true
  },
  {
    title: "Post engagement",
    description: "Get notified when someone likes, comments, or shares your posts.",
    enabled: false
  },
  {
    title: "Product updates",
    description: "Get notified about new features and improvements.",
    enabled: true
  }
];

const pushNotifications = [
  {
    title: "Social activity",
    description: "Notifications about likes, comments, and shares on your posts.",
    enabled: true
  },
  {
    title: "Analytics reports",
    description: "Weekly and monthly analytics reports.",
    enabled: false
  },
  {
    title: "Campaign status",
    description: "Updates about your running campaigns and automations.",
    enabled: true
  }
]; 