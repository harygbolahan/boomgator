import { Component } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Higher-order component to connect ErrorBoundary with auth context
const withAuth = (WrappedComponent) => {
  return (props) => {
    const { logout } = useAuth();
    return <WrappedComponent logout={logout} {...props} />;
  };
};

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) { 
    // You can log the error to an error reporting service
    console.error("React Error Boundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
    
    // Check if this is an authentication error
    const isAuthError = this.isAuthenticationError(error);
    if (isAuthError) {
      console.log('Authentication error detected, logging user out');
      // Call the logout function passed via props
      this.props.logout();
    }
  }

  isAuthenticationError(error) {
    // Check various error patterns that could indicate authentication issues
    
    // Check for Axios-style errors with status code
    if (error?.status === 401 || error?.response?.status === 401) {
      return true;
    }
    
    // Check error message for auth-related terms
    const errorMessage = (error?.message || '').toLowerCase();
    if (
      errorMessage.includes('unauthenticated') || 
      errorMessage.includes('unauthorized') || 
      errorMessage.includes('status code 401')
    ) {
      return true;
    }
    
    // Check error response data message
    const responseMessage = (error?.response?.data?.message || '').toLowerCase();
    if (
      responseMessage.includes('unauthenticated') || 
      responseMessage.includes('unauthorized') || 
      responseMessage.includes('token')
    ) {
      return true;
    }
    
    // Check for token expiration or invalidation terms
    if (
      errorMessage.includes('token') && 
      (errorMessage.includes('expired') || errorMessage.includes('invalid'))
    ) {
      return true;
    }
    
    return false;
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50 dark:bg-gray-900">
          <div className="max-w-2xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Something went wrong
            </h1>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded mb-4 text-left overflow-auto">
              <p className="font-mono text-sm text-red-800 dark:text-red-300 whitespace-pre-wrap">
                {this.state.error && this.state.error.toString()}
              </p>
              {this.state.errorInfo && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-gray-700 dark:text-gray-300 mb-2">
                    Component Stack Trace
                  </summary>
                  <div className="ml-2 mt-1">
                    <p className="font-mono text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </p>
                  </div>
                </details>
              )}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Export the enhanced component
export default withAuth(ErrorBoundary); 