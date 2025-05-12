import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { LockIcon, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

/**
 * Higher-order component that checks if the user has access to a specific service
 * @param {React.Component} WrappedComponent - The component to wrap
 * @param {string} serviceName - The service name required to access this component
 */
const withSubscriptionCheck = (WrappedComponent, serviceName) => {
  // Return a functional component
  return (props) => {
    const { hasServiceAccess, loading, userPackage, packageName } = useSubscription();
    const [showRestrictionModal, setShowRestrictionModal] = useState(true);
    const navigate = useNavigate();
    
    // Check service access on mount and when subscription changes
    useEffect(() => {
      // Reset modal visibility if subscription changes
      setShowRestrictionModal(true);
    }, [userPackage]);
    
    // If still loading subscription data, show loading
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full mb-4" />
            <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      );
    }
    
    // Check if user has access to this feature
    const hasAccess = hasServiceAccess(serviceName);
    
    // If has access, render the wrapped component
    if (hasAccess) {
      return <WrappedComponent {...props} />;
    }
    
    // If doesn't have access and modal is open, show restriction modal
    if (showRestrictionModal) {
      return (
        <div className="container mx-auto py-10 px-4 max-w-xl">
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center mb-2">
                <div className="bg-amber-100 p-2 rounded-full mr-4">
                  <LockIcon className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <CardTitle>Subscription Required</CardTitle>
                  <CardDescription>This feature requires a subscription upgrade</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 bg-muted p-4 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Current Plan: {packageName}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your current plan doesn't include access to {serviceName}. 
                    Upgrade to unlock this feature.
                  </p>
                </div>
              </div>
              
              <div className="grid gap-4 mt-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium">Try our Plus plan:</h3>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-green-200 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                      </div>
                      <span>Access to {serviceName}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-green-200 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                      </div>
                      <span>More advanced features</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-green-200 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                      </div>
                      <span>Higher usage limits</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
              <Button 
                variant="outline" 
                onClick={() => setShowRestrictionModal(false)}
                className="w-full sm:w-auto"
              >
                Continue with Limited Access
              </Button>
              <Button 
                onClick={() => navigate('/payment-plans')}
                className="w-full sm:w-auto"
              >
                View Subscription Plans
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }
    
    // If modal dismissed, render the page with limited functionality
    // The FeatureGate component will be used inside the WrappedComponent 
    // to restrict specific features
    return <WrappedComponent {...props} />;
  };
};

export default withSubscriptionCheck; 