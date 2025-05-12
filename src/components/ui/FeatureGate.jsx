import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockIcon, AlertCircle } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

/**
 * FeatureGate component that wraps content that requires specific subscription levels
 */
const FeatureGate = ({ 
  children, 
  serviceName, 
  fallback, 
  showUpgradeButton = true,
  hideContentOnRestricted = true
}) => {
  const { hasServiceAccess, getServiceLimits, userPackage, loading } = useSubscription();
  const [showRestrictionModal, setShowRestrictionModal] = useState(false);
  const navigate = useNavigate();

  // If loading, show nothing yet
  if (loading) return null;

  // Check if user has access to this service
  const hasAccess = hasServiceAccess(serviceName);
  const limits = getServiceLimits(serviceName);

  // If user has access, render the children
  if (hasAccess) {
    return children;
  }

  // Custom fallback content was provided
  if (fallback) {
    return fallback;
  }

  // Show default restriction message or upgrade modal
  return (
    <>
      {showRestrictionModal ? (
        <UpgradeModal 
          serviceName={serviceName} 
          onClose={() => setShowRestrictionModal(false)} 
          currentPackage={userPackage?.package || 'Trial'} 
        />
      ) : (
        hideContentOnRestricted ? (
          <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-dashed text-center">
            <LockIcon className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Feature Restricted</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {serviceName} requires a subscription upgrade
            </p>
            {showUpgradeButton && (
              <Button 
                onClick={() => setShowRestrictionModal(true)}
                variant="default"
                size="sm"
              >
                View Plans
              </Button>
            )}
          </div>
        ) : (
          <>
            {children}
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LockIcon className="h-5 w-5" />
                    Feature Restricted
                  </CardTitle>
                  <CardDescription>
                    This feature requires a subscription upgrade
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">
                    {serviceName} is available in our Plus and Pro plans
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowRestrictionModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => navigate('/payment-plans')}>
                    View Plans
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </>
        )
      )}
    </>
  );
};

// Upgrade modal component
const UpgradeModal = ({ serviceName, onClose, currentPackage }) => {
  const navigate = useNavigate();
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Upgrade Your Plan</CardTitle>
          <CardDescription>
            Get access to {serviceName} and other premium features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Current Plan: {currentPackage}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Your current plan doesn't include access to {serviceName}. 
                Upgrade to unlock this feature and more.
              </p>
            </div>
          </div>
          
          <div className="grid gap-4 mt-4">
            <div className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium">Plus Plan</h3>
                <p className="text-sm text-muted-foreground">Basic access to all features</p>
              </div>
              <Button size="sm" onClick={() => navigate('/payment-plans')}>
                View Details
              </Button>
            </div>
            
            <div className="border rounded-lg p-4 flex justify-between items-center bg-primary/5 border-primary/20">
              <div>
                <h3 className="font-medium">Pro Plan</h3>
                <p className="text-sm text-muted-foreground">Unlimited access to all features</p>
              </div>
              <Button size="sm" onClick={() => navigate('/payment-plans')}>
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => navigate('/payment-plans')}>
            Compare All Plans
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FeatureGate; 