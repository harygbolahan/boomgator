import { useState, useEffect, useReducer } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Check, CreditCard, Loader, RefreshCw, AlertCircle } from "lucide-react";
import { useBoom } from "@/contexts/BoomContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Account state reducer
const accountReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_FORM_DATA':
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case 'SET_EMAIL_NOTIFICATIONS':
      return { ...state, emailNotificationStates: { ...state.emailNotificationStates, ...action.payload } };
    case 'SET_PUSH_NOTIFICATIONS':
      return { ...state, pushNotificationStates: { ...state.pushNotificationStates, ...action.payload } };
    case 'TOGGLE_EMAIL_NOTIFICATION':
      return {
        ...state,
        emailNotificationStates: {
          ...state.emailNotificationStates,
          [action.payload]: !state.emailNotificationStates[action.payload]
        }
      };
    case 'TOGGLE_PUSH_NOTIFICATION':
      return {
        ...state,
        pushNotificationStates: {
          ...state.pushNotificationStates,
          [action.payload]: !state.pushNotificationStates[action.payload]
        }
      };
    case 'SET_SAVING_PROFILE':
      return { ...state, savingProfile: action.payload };
    case 'SET_UPDATING_PASSWORD':
      return { ...state, updatingPassword: action.payload };
    case 'SET_PASSWORD_DATA':
      return { ...state, passwordData: { ...state.passwordData, ...action.payload } };
    case 'RESET_PASSWORD_DATA':
      return { 
        ...state, 
        passwordData: {
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        } 
      };
    case 'SET_PASSWORD_ERROR':
      return { ...state, passwordError: action.payload };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  activeTab: "profile",
  formData: {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  },
  emailNotificationStates: {
    account_activity: false,
    billing_alerts: false,
    post_engagement: false,
    product_updates: false,
    analytics_reports: false,
    campaign_status: false
  },
  pushNotificationStates: {
    push_notifications: false,
    social_activity: false
  },
  savingProfile: false,
  updatingPassword: false,
  passwordData: {
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  },
  passwordError: ""
};

// Custom hook for account management
const useAccountManagement = () => {
  const { accountData, loadingAccount, accountError, getAccount, updateAccount } = useBoom();
  const [state, dispatch] = useReducer(accountReducer, initialState);

  useEffect(() => {
    if (accountData?.data) {
      dispatch({ 
        type: 'SET_FORM_DATA', 
        payload: {
          first_name: accountData.data.first_name || "",
          last_name: accountData.data.last_name || "",
          email: accountData.data.email || "",
          phone: accountData.data.phone || "",
        }
      });
      
      // Update notification states from the notification object
      if (accountData.notification) {
        dispatch({
          type: 'SET_EMAIL_NOTIFICATIONS',
          payload: {
            account_activity: accountData.notification.account_activity === "yes",
            billing_alerts: accountData.notification.billing_alerts === "yes",
            post_engagement: accountData.notification.post_engagement === "yes",
            product_updates: accountData.notification.product_updates === "yes",
            analytics_reports: accountData.notification.analytics_reports === "yes",
            campaign_status: accountData.notification.campaign_status === "yes"
          }
        });
        
        dispatch({
          type: 'SET_PUSH_NOTIFICATIONS',
          payload: {
            push_notifications: accountData.notification.push_notifications === "yes",
            social_activity: accountData.notification.social_activity === "yes"
          }
        });
      }
    }
  }, [accountData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({ 
      type: 'SET_FORM_DATA', 
      payload: { [name]: value }
    });
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({ 
      type: 'SET_PASSWORD_DATA', 
      payload: { [name]: value }
    });
    dispatch({ type: 'SET_PASSWORD_ERROR', payload: "" });
  };
  
  const handleToggleEmailNotification = (key) => {
    dispatch({ type: 'TOGGLE_EMAIL_NOTIFICATION', payload: key });
  };
  
  const handleTogglePushNotification = (key) => {
    dispatch({ type: 'TOGGLE_PUSH_NOTIFICATION', payload: key });
  };
  
  const handleTabKeyDown = (e, tabId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      dispatch({ type: 'SET_ACTIVE_TAB', payload: tabId });
    }
  };
  
  const handleSaveChanges = async () => {
    // Validate required fields
    if (!state.formData.first_name || !state.formData.last_name || !state.formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(state.formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    dispatch({ type: 'SET_SAVING_PROFILE', payload: true });
    try {
      // Convert notification states to API format (yes/no)
      const notificationPayload = {
        ...Object.entries(state.emailNotificationStates).reduce((acc, [key, value]) => {
          acc[key] = value ? "yes" : "no";
          return acc;
        }, {}),
        ...Object.entries(state.pushNotificationStates).reduce((acc, [key, value]) => {
          acc[key] = value ? "yes" : "no";
          return acc;
        }, {})
      };

      // Prepare payload
      const payload = {
        data: state.formData,
        notification: notificationPayload
      };

      // Call API to update profile
      await updateAccount(payload);
      toast.success("Profile updated successfully");
      
      // Refresh account data
      getAccount();
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      dispatch({ type: 'SET_SAVING_PROFILE', payload: false });
    }
  };
  
  const handlePasswordUpdate = async () => {
    // Reset previous errors
    dispatch({ type: 'SET_PASSWORD_ERROR', payload: "" });
    
    // Validate all fields are filled
    if (!state.passwordData.currentPassword || !state.passwordData.newPassword || !state.passwordData.confirmPassword) {
      dispatch({ type: 'SET_PASSWORD_ERROR', payload: "Please fill in all password fields" });
      return;
    }
    
    // Validate password length
    if (state.passwordData.newPassword.length < 8) {
      dispatch({ type: 'SET_PASSWORD_ERROR', payload: "New password must be at least 8 characters long" });
      return;
    }
    
    // Validate passwords match
    if (state.passwordData.newPassword !== state.passwordData.confirmPassword) {
      dispatch({ type: 'SET_PASSWORD_ERROR', payload: "Passwords do not match" });
      return;
    }
    
    dispatch({ type: 'SET_UPDATING_PASSWORD', payload: true });
    try {
      // Call API to update password
      const payload = {
        password: {
          current: state.passwordData.currentPassword,
          new: state.passwordData.newPassword
        }
      };
      
      const response = await updateAccount(payload);
      toast.success("Password updated successfully");
      
      // Reset form
      dispatch({ type: 'RESET_PASSWORD_DATA' });
    } catch (error) {
      dispatch({ type: 'SET_PASSWORD_ERROR', payload: error.message || "Failed to update password" });
      toast.error(error.message || "Failed to update password");
    } finally {
      dispatch({ type: 'SET_UPDATING_PASSWORD', payload: false });
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (state.formData.first_name && state.formData.last_name) {
      return `${state.formData.first_name.charAt(0)}${state.formData.last_name.charAt(0)}`.toUpperCase();
    }
    return 'U';
  };

  return {
    state,
    accountData,
    loadingAccount,
    accountError,
    getAccount,
    dispatch,
    handleInputChange,
    handlePasswordInputChange,
    handleToggleEmailNotification,
    handleTogglePushNotification,
    handleTabKeyDown,
    handleSaveChanges,
    handlePasswordUpdate,
    getUserInitials
  };
};

export function AccountPage() {
  const {
    state,
    accountData,
    loadingAccount,
    accountError,
    getAccount,
    dispatch,
    handleInputChange,
    handlePasswordInputChange,
    handleToggleEmailNotification,
    handleTogglePushNotification,
    handleTabKeyDown,
    handleSaveChanges,
    handlePasswordUpdate,
    getUserInitials
  } = useAccountManagement();
  
  // Array of tab objects for navigation
  const tabs = [
    { id: "profile", name: "Profile" },
    { id: "notifications", name: "Notifications" },
    { id: "security", name: "Security" },
    { id: "billing", name: "Billing" }
  ];

  const navigate = useNavigate();
  
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
          onClick={() => getAccount()}
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
                  onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.id })}
                  onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
                  role="tab"
                  aria-selected={state.activeTab === tab.id}
                  aria-controls={`${tab.id}-panel`}
                  id={`${tab.id}-tab`}
                  tabIndex={state.activeTab === tab.id ? 0 : -1}
                  className={`px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium border-b-2 -mb-px transition-colors ${
                    state.activeTab === tab.id
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
          {state.activeTab === "profile" && (
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
                          value={state.formData.first_name}
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
                          value={state.formData.last_name}
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
                        value={state.formData.email}
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
                        value={state.formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="flex items-center p-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
                      <div className="mr-2 bg-blue-100 rounded-full p-1">
                        <Check size={16} className="text-blue-700" />
                      </div>
                      <div>
                        <span className="font-medium">Email Status: </span>
                        <span>{accountData?.data?.email_verified_at ? "Verified" : "Not Verified"}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        className="text-xs sm:text-sm flex items-center gap-2"
                        onClick={handleSaveChanges}
                        disabled={state.savingProfile}
                      >
                        {state.savingProfile && <Loader size={14} className="animate-spin" />}
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
                      <p className="text-2xl font-bold">₦{accountData?.wallet?.toFixed(2) || accountData?.data?.wallet?.toFixed(2) || "0.00"}</p>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <CreditCard size={14} /> Manage Billing
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="text-sm font-medium">Subscription</p>
                      <p className="text-sm">{accountData?.data?.package || "Free"}</p>
                    </div>
                    <Button size="sm" onClick={() => navigate('/subscription')} className="bg-gradient-to-r from-indigo-600 to-purple-600">
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
          {state.activeTab === "notifications" && (
            <div 
              role="tabpanel" 
              id="notifications-panel" 
              aria-labelledby="notifications-tab"
              className="space-y-4 sm:space-y-6"
            >
              <div className="bg-card rounded-xl shadow-sm border p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-6">Email Notifications</h3>
                
                <div className="divide-y">
                  {Object.entries(state.emailNotificationStates).map(([key, enabled], index) => (
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
                  {Object.entries(state.pushNotificationStates).map(([key, enabled], index) => (
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
                  disabled={state.savingProfile}
                >
                  {state.savingProfile && <Loader size={14} className="animate-spin" />}
                  Save Notification Settings
                </Button>
              </div>
            </div>
          )}
          
          {/* Security Tab */}
          {state.activeTab === "security" && (
            <div 
              role="tabpanel" 
              id="security-panel" 
              aria-labelledby="security-tab"
              className="space-y-4 sm:space-y-6"
            >
              <div className="bg-card rounded-xl shadow-sm border p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-6">Change Password</h3>
                
                <div className="max-w-md space-y-3 sm:space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                      Current Password
                    </label>
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      className="w-full p-2 text-sm border rounded-lg bg-background"
                      value={state.passwordData.currentPassword}
                      onChange={handlePasswordInputChange}
                      aria-required="true"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      className="w-full p-2 text-sm border rounded-lg bg-background"
                      value={state.passwordData.newPassword}
                      onChange={handlePasswordInputChange}
                      aria-required="true"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className="w-full p-2 text-sm border rounded-lg bg-background"
                      value={state.passwordData.confirmPassword}
                      onChange={handlePasswordInputChange}
                      aria-required="true"
                    />
                  </div>
                  
                  {state.passwordError && (
                    <div className="text-red-500 text-sm">
                      {state.passwordError}
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button 
                      className="text-xs sm:text-sm flex items-center gap-2"
                      onClick={handlePasswordUpdate}
                      disabled={state.updatingPassword}
                    >
                      {state.updatingPassword && <Loader size={14} className="animate-spin" />}
                      Update Password
                    </Button>
                  </div>
                </div>
              </div>
              
              
            </div>
          )}
          
          {/* Billing Tab */}
          {state.activeTab === "billing" && (
            <div 
              role="tabpanel" 
              id="billing-panel" 
              aria-labelledby="billing-tab"
              className="space-y-4 sm:space-y-6"
            >
              <div className="bg-card rounded-xl shadow-sm border p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-6">Subscription Details</h3>
                
                <div className="divide-y">
                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Current Plan</p>
                      <p className="text-sm">{accountData?.data?.package || "Free"}</p>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600">
                      Upgrade
                    </Button>
                  </div>
                  
                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Wallet Balance</p>
                      <p className="text-sm">₦{accountData?.wallet?.toFixed(2) || accountData?.data?.wallet?.toFixed(2) || "0.00"}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Fund Wallet
                    </Button>
                  </div>
                </div>
              </div>
              
              
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Helper function for notification descriptions
const getNotificationDescription = (key) => {
  const descriptions = {
    account_activity: "Get notified about important changes to your account",
    billing_alerts: "Receive alerts about your billing status and subscription",
    post_engagement: "Notifications about likes, comments, and shares on your posts",
    product_updates: "Learn about new features and improvements",
    analytics_reports: "Receive weekly and monthly analytics reports",
    campaign_status: "Get updates on your campaign performance",
    push_notifications: "Enable or disable all push notifications",
    social_activity: "Get notified about mentions and tags on social media"
  };
  
  return descriptions[key] || "Notification preferences";
}; 