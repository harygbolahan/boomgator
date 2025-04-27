import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { dashboardService, accountService } from '@/lib/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

// Create the Dashboard Context
const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  // Account data
  const [accountData, setAccountData] = useState(null);
  const [loadingAccount, setLoadingAccount] = useState(false);
  const [accountError, setAccountError] = useState(null);
  
  // Home dashboard data
  const [homeData, setHomeData] = useState(null);
  const [loadingHome, setLoadingHome] = useState(false);
  const [homeError, setHomeError] = useState(null);
  
  // Loading state for the entire dashboard
  const isLoading = loadingAccount || loadingHome;
  
  // Fetch account data
  const fetchAccountData = useCallback(async () => {
    if (!isAuthenticated) return;
    
    console.log('Starting account data fetch...');
    setLoadingAccount(true);
    setAccountError(null);
    
    try {
      console.log('Calling accountService.getAccount()');
      const response = await accountService.getAccount();
      console.log('Account data response:', response);
      setAccountData(response);
    } catch (error) {
      console.error('Error fetching account data:', error);
      setAccountError(error.message);
      toast.error(`Error loading account data: ${error.message}`);
    } finally {
      console.log('Account data fetch completed');
      setLoadingAccount(false);
    }
  }, [isAuthenticated]);
  
  // Fetch home dashboard data
  const fetchHomeData = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoadingHome(true);
    setHomeError(null);
    
    try {
      const response = await dashboardService.getHomeData();
      setHomeData(response);
    } catch (error) {
      setHomeError(error.message);
      toast.error(`Error loading dashboard data: ${error.message}`);
    } finally {
      setLoadingHome(false);
    }
  }, [isAuthenticated]);
  
  // Refresh all dashboard data
  const refreshDashboard = useCallback(() => {
    fetchAccountData();
    fetchHomeData();
  }, [fetchAccountData, fetchHomeData]);
  
  // Initialize dashboard data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshDashboard();
    }
  }, [isAuthenticated, refreshDashboard]);
  
  const value = {
    // Account data
    accountData,
    loadingAccount,
    accountError,
    fetchAccountData,
    
    // Home data
    homeData,
    loadingHome,
    homeError,
    fetchHomeData,
    
    // Utilities
    isLoading,
    refreshDashboard,
  };
  
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

// Custom hook to use the dashboard context
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export default DashboardContext; 