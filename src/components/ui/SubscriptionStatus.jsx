import { useNavigate } from 'react-router-dom';
import { Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Component to display subscription status in the dashboard
 */
const SubscriptionStatus = ({ compact = false }) => {
  const { userPackage, loading, hasServiceAccess, packageName } = useSubscription();
  const navigate = useNavigate();

  // If loading, show skeleton
  if (loading) {
    return compact ? (
      <Skeleton className="h-8 w-24" />
    ) : (
      <div className="space-y-2 w-full">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-32" />
      </div>
    );
  }

  // Get first service as example
  const firstService = userPackage?.service?.[0];
  const isTrialPackage = packageName?.toLowerCase().includes('trial');
  
  // Compact version (for header/sidebar)
  if (compact) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className={`gap-1.5 ${isTrialPackage ? 'text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100' : ''}`}
        onClick={() => navigate('/payment-plans')}
      >
        {isTrialPackage ? (
          <>
            <Clock className="h-3.5 w-3.5" />
            Trial
          </>
        ) : (
          packageName
        )}
      </Button>
    );
  }

  // Full version
  return (
    <div className="rounded-lg border p-4 w-full">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-sm">Subscription Status</h3>
          <p className="text-xl font-semibold flex items-center gap-1.5">
            {packageName}
            {isTrialPackage && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                <Clock className="h-3 w-3 mr-1" />
                Trial
              </span>
            )}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/payment-plans')}
        >
          {isTrialPackage ? 'Upgrade' : 'Manage'}
        </Button>
      </div>

      {isTrialPackage && (
        <div className="bg-amber-50 text-amber-800 rounded-md p-3 mb-3 flex items-center gap-2 text-sm">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <p>You're on a trial plan with limited features</p>
        </div>
      )}

      {firstService && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">{firstService.service}</h4>
          
          {firstService.limit_daily > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Daily Usage</span>
                <span>0/{firstService.limit_daily}</span>
              </div>
              <Progress value={0} className="h-1.5" />
            </div>
          )}
          
          {firstService.limit_monthly > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Monthly Usage</span>
                <span>0/{firstService.limit_monthly}</span>
              </div>
              <Progress value={0} className="h-1.5" />
            </div>
          )}
        </div>
      )}

      <div className="mt-4">
        <Button 
          variant="link" 
          size="sm" 
          className="h-auto p-0 text-xs flex items-center gap-1"
          onClick={() => navigate('/payment-plans')}
        >
          View all features
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionStatus; 