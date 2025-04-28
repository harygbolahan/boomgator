import { createContext, useContext, useEffect, useReducer, useCallback, useMemo } from 'react';
import { dashboardService, accountService } from '@/lib/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

// Create the Dashboard Context
const DashboardContext = createContext(null);

// Define reducer actions
const ACTIONS = {
  FETCH_ACCOUNT_START: 'FETCH_ACCOUNT_START',
  FETCH_ACCOUNT_SUCCESS: 'FETCH_ACCOUNT_SUCCESS',
  FETCH_ACCOUNT_ERROR: 'FETCH_ACCOUNT_ERROR',
  FETCH_HOME_START: 'FETCH_HOME_START',
  FETCH_HOME_SUCCESS: 'FETCH_HOME_SUCCESS',
  FETCH_HOME_ERROR: 'FETCH_HOME_ERROR',
};

// Initial state
const initialState = {
  accountData: null,
  loadingAccount: false,
  accountError: null,
  homeData: null,
  loadingHome: false,
  homeError: null,
};

// Reducer function
const dashboardReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_ACCOUNT_START:
      return { ...state, loadingAccount: true, accountError: null };
    case ACTIONS.FETCH_ACCOUNT_SUCCESS:
      return { ...state, accountData: action.payload, loadingAccount: false };
    case ACTIONS.FETCH_ACCOUNT_ERROR:
      return { ...state, accountError: action.payload, loadingAccount: false };
    case ACTIONS.FETCH_HOME_START:
      return { ...state, loadingHome: true, homeError: null };
    case ACTIONS.FETCH_HOME_SUCCESS:
      return { ...state, homeData: action.payload, loadingHome: false };
    case ACTIONS.FETCH_HOME_ERROR:
      return { ...state, homeError: action.payload, loadingHome: false };
    default:
      return state;
  }
};

export const DashboardProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  
  // Fetch account data with memoized callback
  const fetchAccountData = useCallback(async () => {
    if (!isAuthenticated) return;
    
    dispatch({ type: ACTIONS.FETCH_ACCOUNT_START });
    
    try {
      const response = await accountService.getAccount();
      dispatch({ 
        type: ACTIONS.FETCH_ACCOUNT_SUCCESS, 
        payload: response 
      });
    } catch (error) {
      dispatch({ 
        type: ACTIONS.FETCH_ACCOUNT_ERROR, 
        payload: error.message 
      });
      toast.error(`Error loading account data: ${error.message}`);
    }
  }, [isAuthenticated]);
  
  // Fetch home dashboard data with memoized callback
  const fetchHomeData = useCallback(async () => {
    if (!isAuthenticated) return;
    
    dispatch({ type: ACTIONS.FETCH_HOME_START });
    
    try {
      const response = await dashboardService.getHomeData();
      dispatch({ 
        type: ACTIONS.FETCH_HOME_SUCCESS, 
        payload: response 
      });
    } catch (error) {
      dispatch({ 
        type: ACTIONS.FETCH_HOME_ERROR, 
        payload: error.message 
      });
      toast.error(`Error loading dashboard data: ${error.message}`);
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

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    ...state,
    fetchAccountData,
    fetchHomeData,
    refreshDashboard,
    isLoading: state.loadingAccount || state.loadingHome,
  }), [
    state,
    fetchAccountData,
    fetchHomeData,
    refreshDashboard
  ]);
  
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