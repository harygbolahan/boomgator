import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile");
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Account Settings</h2>
        <p className="text-muted-foreground">
          Manage your account preferences and settings.
        </p>
      </div>
      
      {/* Tab navigation */}
      <div className="border-b">
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
      
      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          <div className="bg-card rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-medium mb-6">Personal Information</h3>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center md:items-start">
                <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center text-2xl mb-4">
                  JD
                </div>
                <Button variant="outline" size="sm">Change Avatar</Button>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      className="w-full p-2 border rounded-lg bg-background"
                      defaultValue="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      className="w-full p-2 border rounded-lg bg-background"
                      defaultValue="Doe"
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
                    className="w-full p-2 border rounded-lg bg-background"
                    defaultValue="john.doe@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-1">
                    Company
                  </label>
                  <input
                    id="company"
                    type="text"
                    className="w-full p-2 border rounded-lg bg-background"
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
                    className="w-full p-2 border rounded-lg bg-background"
                    defaultValue="Marketing Manager"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <div className="bg-card rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-medium mb-6">Password</h3>
            
            <div className="space-y-4 max-w-md">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  className="w-full p-2 border rounded-lg bg-background"
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  className="w-full p-2 border rounded-lg bg-background"
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="w-full p-2 border rounded-lg bg-background"
                  placeholder="••••••••"
                />
              </div>
              
              <div className="flex justify-end">
                <Button>Update Password</Button>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-medium mb-6">Two-Factor Authentication</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1">Two-factor authentication is disabled.</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account by enabling two-factor authentication.</p>
              </div>
              <Button variant="outline">Enable</Button>
            </div>
          </div>
          
          <div className="bg-card rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-medium mb-6">Sessions</h3>
            
            <div className="space-y-4">
              {sessions.map((session, index) => (
                <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{session.device}</span>
                      {session.current && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span>{session.location}</span> • <span>Last active {session.lastActive}</span>
                    </div>
                  </div>
                  {!session.current && (
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">Sign Out</Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Billing Tab */}
      {activeTab === "billing" && (
        <div className="space-y-6">
          <div className="bg-card rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-medium">Current Plan</h3>
                <p className="text-muted-foreground">You are currently on the Professional plan.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Change Plan</Button>
                <Button variant="ghost" className="text-red-500 hover:text-red-700">Cancel Plan</Button>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg bg-accent/10">
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold">Professional Plan</div>
                <div className="font-bold">$49/month</div>
              </div>
              <div className="text-sm text-muted-foreground">Renews on September 12, 2023</div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Unlimited social accounts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Advanced analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>100 scheduled posts per month</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>10 automation workflows</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-medium mb-6">Payment Method</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-indigo-100 rounded flex items-center justify-center">
                    💳
                  </div>
                  <div>
                    <div className="font-medium">Visa ending in 4242</div>
                    <div className="text-sm text-muted-foreground">Expires 12/2025</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">Remove</Button>
                </div>
              </div>
              
              <Button variant="outline">Add Payment Method</Button>
            </div>
          </div>
          
          <div className="bg-card rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-medium mb-6">Billing History</h3>
            
            <div className="overflow-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Description</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {billingHistory.map((item, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-4">{item.date}</td>
                      <td className="py-4">{item.description}</td>
                      <td className="py-4">{item.amount}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.status === "Paid" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <Button variant="ghost" size="sm">PDF</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <div className="bg-card rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-medium mb-6">Email Notifications</h3>
            
            <div className="space-y-4">
              {emailNotifications.map((notification, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{notification.title}</div>
                    <div className="text-sm text-muted-foreground">{notification.description}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={notification.enabled} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-card rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-medium mb-6">Push Notifications</h3>
            
            <div className="space-y-4">
              {pushNotifications.map((notification, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{notification.title}</div>
                    <div className="text-sm text-muted-foreground">{notification.description}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={notification.enabled} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
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
  { id: "notifications", name: "Notifications" }
];

const sessions = [
  {
    device: "Windows 10 - Chrome",
    location: "New York, USA",
    lastActive: "Now",
    current: true
  },
  {
    device: "MacOS - Safari",
    location: "New York, USA",
    lastActive: "2 days ago",
    current: false
  },
  {
    device: "iPhone 13 - Safari",
    location: "Boston, USA",
    lastActive: "5 days ago",
    current: false
  }
];

const billingHistory = [
  {
    date: "Aug 12, 2023",
    description: "Professional Plan - Monthly",
    amount: "$49.00",
    status: "Paid"
  },
  {
    date: "Jul 12, 2023",
    description: "Professional Plan - Monthly",
    amount: "$49.00",
    status: "Paid"
  },
  {
    date: "Jun 12, 2023",
    description: "Professional Plan - Monthly",
    amount: "$49.00",
    status: "Paid"
  }
];

const emailNotifications = [
  {
    title: "Social Media Alerts",
    description: "Receive notifications when someone mentions or tags your accounts",
    enabled: true
  },
  {
    title: "Comment Notifications",
    description: "Receive notifications when someone comments on your posts",
    enabled: true
  },
  {
    title: "Billing Notifications",
    description: "Receive notifications about your billing, invoices, and plan",
    enabled: true
  },
  {
    title: "Product Updates",
    description: "Receive notifications about new features and updates",
    enabled: false
  },
  {
    title: "Marketing Emails",
    description: "Receive promotional offers and marketing materials",
    enabled: false
  }
];

const pushNotifications = [
  {
    title: "Automation Triggers",
    description: "Receive notifications when automations are triggered",
    enabled: true
  },
  {
    title: "Post Performance",
    description: "Receive notifications about post engagement and analytics",
    enabled: true
  },
  {
    title: "Direct Messages",
    description: "Receive notifications for new direct messages",
    enabled: true
  },
  {
    title: "System Alerts",
    description: "Receive important system notifications and alerts",
    enabled: true
  }
]; 