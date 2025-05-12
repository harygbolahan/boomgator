import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { subscriptionService } from '@/lib/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

// Create the Subscription Context
const SubscriptionContext = createContext(null);

export const SubscriptionProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [allPackages, setAllPackages] = useState(null);
  const [userPackage, setUserPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all available subscription packages
  const fetchAllPackages = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await subscriptionService.getAllPackages();
      setAllPackages(data.package || {});
    } catch (error) {
      console.error('Error fetching packages:', error);
      setError('Failed to load subscription packages');
      toast.error('Failed to load subscription packages');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch current user's subscription
  const fetchUserPackage = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await subscriptionService.getUserPackage();
      setUserPackage(data);
    } catch (error) {
      console.error('Error fetching user package:', error);
      setError('Failed to load your subscription details');
      toast.error('Failed to load your subscription details');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Subscribe to a new package
  const subscribeToPackage = async (packageName) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await subscriptionService.subscribeToPackage(packageName);
      if (response.status === 'success') {
        setUserPackage(response);
        toast.success(`Subscribed to ${packageName.toUpperCase()} package successfully`);
        return { success: true, data: response };
      } else {
        throw new Error(response.message || 'Subscription failed');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setError('Failed to subscribe to package');
      toast.error(error.message || 'Failed to subscribe to package');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Check if user has access to a specific service
  const hasServiceAccess = (serviceName) => {
    if (!userPackage || !userPackage.service) return false;
    
    const service = userPackage.service.find(s => s.service === serviceName);
    return !!service;
  };

  // Get service limits for a specific service
  const getServiceLimits = (serviceName) => {
    if (!userPackage || !userPackage.service) return null;
    
    const service = userPackage.service.find(s => s.service === serviceName);
    if (!service) return null;
    
    return {
      daily: service.limit_daily,
      weekly: service.limit_weekly,
      monthly: service.limit_monthly
    };
  };

  // Refresh subscription data
  const refreshSubscription = useCallback(() => {
    fetchAllPackages();
    fetchUserPackage();
  }, [fetchAllPackages, fetchUserPackage]);

  // Initialize subscription data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshSubscription();
    } else {
      setAllPackages(null);
      setUserPackage(null);
    }
  }, [isAuthenticated, refreshSubscription]);

  // Context value
  const value = {
    allPackages,
    userPackage,
    loading,
    error,
    fetchAllPackages,
    fetchUserPackage,
    subscribeToPackage,
    hasServiceAccess,
    getServiceLimits,
    refreshSubscription,
    packageName: userPackage?.package || 'Free'
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};

// Custom hook to use the subscription context
export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export default SubscriptionContext; 