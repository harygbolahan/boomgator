import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Check, CreditCard, Loader, RefreshCw, AlertCircle } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";
import { accountService } from "@/lib/api";
import { toast } from "react-toastify";

export function AccountPage() {
  const { accountData, loadingAccount, accountError, fetchAccountData } = useDashboard();
  
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  
  const [emailNotificationStates, setEmailNotificationStates] = useState({
    account_activity: false,
    billing_alerts: false,
    post_engagement: false,
    product_updates: false,
    analytics_reports: false,
    campaign_status: false
  });
  
  const [pushNotificationStates, setPushNotificationStates] = useState({
    push_notifications: false,
    social_activity: false
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  
  // Update form data when account data is loaded
  useEffect(() => {
    if (accountData?.data) {
      console.log('Account data loaded:', accountData);
      setFormData({
        first_name: accountData.data.first_name || "",
        last_name: accountData.data.last_name || "",
        email: accountData.data.email || "",
        phone: accountData.data.phone || "",
      });
      
      // Update notification states
      if (accountData.notification) {
        console.log('Notification settings loaded:', accountData.notification);
        setEmailNotificationStates({
          account_activity: accountData.notification.account_activity === "yes",
          billing_alerts: accountData.notification.billing_alerts === "yes",
          post_engagement: accountData.notification.post_engagement === "yes",
          product_updates: accountData.notification.product_updates === "yes",
          analytics_reports: accountData.notification.analytics_reports === "yes",
          campaign_status: accountData.notification.campaign_status === "yes"
        });
        
        setPushNotificationStates({
          push_notifications: accountData.notification.push_notifications === "yes",
          social_activity: accountData.notification.social_activity === "yes"
        });
      }
    }
  }, [accountData]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    setPasswordError("");
  };
  
  const handleToggleEmailNotification = (key) => {
    setEmailNotificationStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handleTogglePushNotification = (key) => {
    setPushNotificationStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handleTabKeyDown = (e, tabId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveTab(tabId);
    }
  };
  
  const handleSaveChanges = async () => {
    // Validate required fields
    if (!formData.first_name || !formData.last_name || !formData.email) {
      console.log('Validation failed: Missing required fields');
      toast.error("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      console.log('Validation failed: Invalid email format');
      toast.error("Please enter a valid email address");
      return;
    }

    setSavingProfile(true);
    console.log('Saving profile with data:', formData);
    try {
      // Convert notification states to API format (yes/no)
      const notificationPayload = {
        ...Object.entries(emailNotificationStates).reduce((acc, [key, value]) => {
          acc[key] = value ? "yes" : "no";
          return acc;
        }, {}),
        ...Object.entries(pushNotificationStates).reduce((acc, [key, value]) => {
          acc[key] = value ? "yes" : "no";
          return acc;
        }, {})
      };

      console.log('Notification payload:', notificationPayload);

      // Prepare payload
      const payload = {
        data: formData,
        notification: notificationPayload
      };

      // Call API to update profile
      const response = await accountService.updateAccount(payload);
      console.log('Profile update response:', response);
      toast.success("Profile updated successfully");
      
      // Refresh account data
      fetchAccountData();
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };
  
  const handlePasswordUpdate = async () => {
    // Reset previous errors
    setPasswordError("");
    
    // Validate all fields are filled
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      console.log('Password validation failed: Empty fields');
      setPasswordError("Please fill in all password fields");
      return;
    }
    
    // Validate password length
    if (passwordData.newPassword.length < 8) {
      console.log('Password validation failed: Password too short');
      setPasswordError("New password must be at least 8 characters long");
      return;
    }
    
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      console.log('Password validation failed: Passwords do not match');
      setPasswordError("Passwords do not match");
      return;
    }
    
    setUpdatingPassword(true);
    console.log('Updating password...');
    try {
      // Call API to update password
      const payload = {
        password: {
          current: passwordData.currentPassword,
          new: passwordData.newPassword
        }
      };
      console.log('Password update payload:', payload);
      
      const response = await accountService.updateAccount(payload);
      console.log('Password update response:', response);
      
      toast.success("Password updated successfully");
      
      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      console.error('Password update error:', error);
      setPasswordError(error.message || "Failed to update password");
      toast.error(error.message || "Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (formData.first_name && formData.last_name) {
      return `${formData.first_name.charAt(0)}${formData.last_name.charAt(0)}`.toUpperCase();
    }
    return 'U';
  };
  
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Account Settings</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your account preferences and settings.
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2 md:mt-0 flex items-center gap-2"
          onClick={() => {
            console.log('Manual refresh requested');
            fetchAccountData();
          }}
          disabled={loadingAccount}
        >
          {loadingAccount ? (
            <Loader size={14} className="animate-spin" />
          ) : (
            <RefreshCw size={14} />
          )}
          Refresh
        </Button>
      </div>
      
      {/* Error Message */}
      {accountError && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error loading account data</p>
            <p className="text-sm">{accountError}</p>
          </div>
        </div>
      )}
      
      {/* Loading State */}
      {loadingAccount && !accountData && (
        <div className="h-40 w-full flex items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}
      
      {/* Tab navigation */}
      {!loadingAccount && accountData && (
        <>
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
                      {getUserInitials()}
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
                        <label htmlFor="first_name" className="block text-sm font-medium mb-1">
                          First Name
                        </label>
                        <input
                          id="first_name"
                          name="first_name"
                          type="text"
                          className="w-full p-2 text-sm border rounded-lg bg-background"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          aria-required="true"
                        />
                      </div>
                      <div>
                        <label htmlFor="last_name" className="block text-sm font-medium mb-1">
                          Last Name
                        </label>
                        <input
                          id="last_name"
                          name="last_name"
                          type="text"
                          className="w-full p-2 text-sm border rounded-lg bg-background"
                          value={formData.last_name}
                          onChange={handleInputChange}
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
                        name="email"
                        type="email"
                        className="w-full p-2 text-sm border rounded-lg bg-background"
                        value={formData.email}
                        onChange={handleInputChange}
                        aria-required="true"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-1">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="w-full p-2 text-sm border rounded-lg bg-background"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="flex items-center p-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
                      <div className="mr-2 bg-blue-100 rounded-full p-1">
                        <Check size={16} className="text-blue-700" />
                      </div>
                      <div>
                        <span className="font-medium">KYC Status: </span>
                        <span>{accountData?.data?.kyc || "Not Verified"}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        className="text-xs sm:text-sm flex items-center gap-2"
                        onClick={handleSaveChanges}
                        disabled={savingProfile}
                      >
                        {savingProfile && <Loader size={14} className="animate-spin" />}
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-xl shadow-sm border p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-medium mb-4">Account Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="text-sm font-medium">Wallet Balance</p>
                      <p className="text-2xl font-bold">${accountData?.wallet?.toFixed(2) || "0.00"}</p>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <CreditCard size={14} /> Manage Billing
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="text-sm font-medium">Subscription</p>
                      <p className="text-sm">{accountData?.data?.subscription || "Free"}</p>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600">
                      Upgrade Plan
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Account Created</p>
                      <p className="text-sm">{accountData?.data?.created_at ? new Date(accountData.data.created_at).toLocaleDateString() : "N/A"}</p>
                    </div>
                  </div>
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
                
                <div className="divide-y">
                  {Object.entries(emailNotificationStates).map(([key, enabled], index) => (
                    <div key={key} className="py-3 sm:py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium capitalize">{key.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-muted-foreground">{getNotificationDescription(key)}</p>
                      </div>
                      <Switch
                        checked={enabled}
                        onCheckedChange={() => handleToggleEmailNotification(key)}
                        aria-label={`Toggle ${key.replace(/_/g, ' ')}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-card rounded-xl shadow-sm border p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-6">Push Notifications</h3>
                
                <div className="divide-y">
                  {Object.entries(pushNotificationStates).map(([key, enabled], index) => (
                    <div key={key} className="py-3 sm:py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium capitalize">{key.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-muted-foreground">{getNotificationDescription(key)}</p>
                      </div>
                      <Switch
                        checked={enabled}
                        onCheckedChange={() => handleTogglePushNotification(key)}
                        aria-label={`Toggle ${key.replace(/_/g, ' ')}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  className="text-xs sm:text-sm flex items-center gap-2"
                  onClick={handleSaveChanges}
                  disabled={savingProfile}
                >
                  {savingProfile && <Loader size={14} className="animate-spin" />}
                  Save Notification Settings
                </Button>
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
                      name="currentPassword"
                      type="password"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Enter your current password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordInputChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium mb-1.5">New Password</label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Enter new password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordInputChange}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Password must be at least 8 characters long</p>
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">Confirm New Password</label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Confirm new password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordInputChange}
                    />
                  </div>
                  
                  {passwordError && (
                    <div className="text-red-500 text-sm">{passwordError}</div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handlePasswordUpdate}
                      disabled={updatingPassword}
                      className="flex items-center gap-2"
                    >
                      {updatingPassword && <Loader size={14} className="animate-spin" />}
                      Update Password
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-xl shadow-sm border p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-6">Two-Factor Authentication</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Secure your account with two-factor authentication</p>
                    <p className="text-xs text-muted-foreground mt-1">We'll send a verification code to your phone each time you log in</p>
                  </div>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Tab definitions
const tabs = [
  { id: "profile", name: "Profile" },
  { id: "notifications", name: "Notifications" },
  { id: "security", name: "Security" }
];

// Helper function to get notification descriptions
const getNotificationDescription = (key) => {
  const descriptions = {
    account_activity: "Get notified about account-related activities and security updates",
    billing_alerts: "Receive alerts for billing and payment information",
    post_engagement: "Get notified when users engage with your content",
    product_updates: "Stay informed about new features and product updates",
    push_notifications: "Enable push notifications on your device",
    social_activity: "Get notified about your social media account activities",
    analytics_reports: "Receive regular reports on your analytics and statistics",
    campaign_status: "Get updates about your campaign status changes"
  };
  
  return descriptions[key] || "Notification preference";
}; 