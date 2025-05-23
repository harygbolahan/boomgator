import { useState, useEffect } from 'react';
import { useBoom } from '../../contexts/BoomContext';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Separator } from './separator';
import { formatCurrency } from '../../lib/utils';

const SERVICE_TYPES = {
  AUTO_REPLY_COMMENT: 1,
  AUTO_REPLY_DM: 2,
  SCHEDULE_POST: 3,
  IMPORT_ACCOUNT: 4
};

export const SubscriptionWrapper = ({ 
  children, 
  requiredService,
  onSubscribeSuccess,
  displayUpgradePrompt = true
}) => {
  const { 
    currentPackage, 
    availablePackages, 
    getAllPackages, 
    getUserPackage, 
    subscribeToPackage,
    checkServiceSubscription,
    loadingPackages,
    loadingCurrentPackage,
    subscribingPackage
  } = useBoom();
  
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  
  // Load package information on component mount
  useEffect(() => {
    const loadPackages = async () => {
      if (!currentPackage) {
        await getUserPackage();
      }
      
      if (!availablePackages) {
        await getAllPackages();
      }
      
      setLoadingInitial(false);
    };
    
    loadPackages();
  }, [currentPackage, availablePackages, getUserPackage, getAllPackages]);
  
  // Check subscription status whenever currentPackage changes
  useEffect(() => {
    if (currentPackage && requiredService) {
      const serviceId = typeof requiredService === 'string' 
        ? SERVICE_TYPES[requiredService.toUpperCase()] 
        : requiredService;
        
      const subscriptionStatus = checkServiceSubscription(serviceId);
      setHasSubscription(subscriptionStatus.subscribed);
    }
  }, [currentPackage, requiredService, checkServiceSubscription]);
  
  // Handle subscription
  const handleSubscribe = async (packageName) => {
    try {
      await subscribeToPackage(packageName);
      setShowSubscribeModal(false);
      
      if (onSubscribeSuccess) {
        onSubscribeSuccess();
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
    }
  };
  
  // Show subscribing message when loading
  if (loadingInitial || loadingPackages || loadingCurrentPackage) {
    return (
      <div className="w-full flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-muted-foreground">Checking subscription status...</p>
        </div>
      </div>
    );
  }
  
  // If user has subscription, render the children
  if (hasSubscription) {
    return children;
  }
  
  // Otherwise, show subscription required message
  return (
    <div className="w-full">
      {displayUpgradePrompt ? (
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Subscription Required</CardTitle>
            <CardDescription>
              You need a subscription to access this feature. Please choose a package below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {availablePackages ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availablePackages.trial && (
                  <PackageCard 
                    title="Trial"
                    packages={availablePackages.trial}
                    onSubscribe={() => handleSubscribe('trial')}
                    isSubscribing={subscribingPackage}
                  />
                )}
                
                {availablePackages.plus && (
                  <PackageCard 
                    title="Plus"
                    packages={availablePackages.plus} 
                    onSubscribe={() => handleSubscribe('plus')}
                    isSubscribing={subscribingPackage}
                  />
                )}
                
                {availablePackages.pro && (
                  <PackageCard 
                    title="Pro"
                    packages={availablePackages.pro}
                    onSubscribe={() => handleSubscribe('pro')}
                    isSubscribing={subscribingPackage}
                    recommended
                  />
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">No subscription packages available.</p>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

const PackageCard = ({ title, packages, onSubscribe, isSubscribing, recommended = false }) => {
  // Find the first package to get the price and validity
  const firstPackage = packages[0];
  const price = firstPackage?.price || 0;
  const validity = firstPackage?.validity || 'monthly';
  
  return (
    <Card className={`relative ${recommended ? 'border-primary' : ''}`}>
      {recommended && (
        <Badge className="absolute -top-2 right-2 bg-primary text-white">
          Recommended
        </Badge>
      )}
      
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{title}</span>
          <span className="text-xl">{formatCurrency(price)}</span>
        </CardTitle>
        <CardDescription>
          {validity === 'daily' ? 'Daily' : validity === 'weekly' ? 'Weekly' : 'Monthly'} plan
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <h4 className="text-sm font-medium mb-2">Services:</h4>
        <ul className="space-y-2">
          {packages.map((pkg, index) => (
            <li key={index} className="text-sm">
              {pkg.service[0]?.service || 'Unknown Service'}
              <div className="text-xs text-muted-foreground">
                {pkg.service[0]?.limit_daily > 0 && <span>Daily: {pkg.service[0].limit_daily} </span>}
                {pkg.service[0]?.limit_weekly > 0 && <span>Weekly: {pkg.service[0].limit_weekly} </span>}
                {pkg.service[0]?.limit_monthly > 0 && <span>Monthly: {pkg.service[0].limit_monthly}</span>}
              </div>
              {index < packages.length - 1 && <Separator className="my-2" />}
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={onSubscribe}
          disabled={isSubscribing}
        >
          {isSubscribing ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionWrapper; 