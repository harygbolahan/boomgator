import { useState, useEffect } from 'react';
import { useBoom } from '../contexts/BoomContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { formatCurrency } from '../lib/utils';
import { toast } from 'react-toastify';
import { Package, Check, Clock, AlertCircle, Sparkles, Crown } from 'lucide-react';

export const SubscriptionPage = () => {
  const { 
    availablePackages, 
    currentPackage, 
    getAllPackages, 
    getUserPackage, 
    subscribeToPackage, 
    subscribingPackage 
  } = useBoom();
  
  const [isLoading, setIsLoading] = useState(true);
  
  
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          getAllPackages(),
          getUserPackage()
        ]);
      } catch (error) {
        console.error('Failed to load subscription data:', error);
        toast.error('Failed to load subscription data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [getAllPackages, getUserPackage]);
  
  const handleSubscribe = async (packageName) => {
    try {
      await subscribeToPackage(packageName);
      toast.success(`Successfully subscribed to ${packageName.toUpperCase()} package`);
    } catch (error) {
      console.error('Failed to subscribe:', error);
      toast.error('Failed to subscribe');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6">
      {/* Header Section with gradient background */}
      <div className="rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 p-6 sm:p-8 mb-10 shadow-sm border border-blue-100 dark:border-blue-900/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent tracking-tight mb-2">
              Subscription Plans
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-xl">
              Choose a subscription plan that best fits your needs and unlock powerful features for your social media management.
            </p>
          </div>
          <Package className="h-16 w-16 text-indigo-500/50 hidden md:block" />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col justify-center items-center min-h-[300px] bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 animate-pulse">
          <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-4 mb-4">
            <Package className="h-8 w-8 text-blue-500 dark:text-blue-400 animate-pulse" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading subscription information...</p>
          <div className="mt-4 w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="mt-2 w-36 h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
      ) : (
        <>
          {/* Current Package */}
          {currentPackage && (
            <Card className="mb-10 overflow-hidden border-blue-200 dark:border-blue-800/50 shadow-md">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2"></div>
              <CardHeader className="bg-blue-50/50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800/50">
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span>Current Subscription</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400 border border-green-200 dark:border-green-800/50 px-3 py-1 rounded-full">
                    <Check className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Your active subscription and included services
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400">{currentPackage.package}</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Manage your subscription services and limits</p>
                  </div>
                  <Button variant="outline" className="border-blue-200 dark:border-blue-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    Manage Subscription
                  </Button>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-800">
                  <h4 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                    Your Active Services
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentPackage.service?.map((service) => (
                      <div key={service.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="font-medium text-gray-800 dark:text-gray-200 mb-2">{service.service}</div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          {service.limit_daily > 0 && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-center">
                              <span className="block text-blue-700 dark:text-blue-400 font-bold">{service.limit_daily}</span>
                              <span className="text-xs text-gray-600 dark:text-gray-400">Daily</span>
                            </div>
                          )}
                          {service.limit_weekly > 0 && (
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded text-center">
                              <span className="block text-indigo-700 dark:text-indigo-400 font-bold">{service.limit_weekly}</span>
                              <span className="text-xs text-gray-600 dark:text-gray-400">Weekly</span>
                            </div>
                          )}
                          {service.limit_monthly > 0 && (
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded text-center">
                              <span className="block text-purple-700 dark:text-purple-400 font-bold">{service.limit_monthly}</span>
                              <span className="text-xs text-gray-600 dark:text-gray-400">Monthly</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Available Packages Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-1 text-gray-800 dark:text-gray-200">Available Plans</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Compare and choose the right plan for your needs</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availablePackages && Object.entries(availablePackages).map(([packageType, packages]) => (
                <PackageCard 
                  key={packageType}
                  title={packageType.charAt(0).toUpperCase() + packageType.slice(1)}
                  icon={<Package className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />}
                  packages={packages || []}
                  onSubscribe={() => handleSubscribe(packageType)}
                  isSubscribing={subscribingPackage}
                  isCurrentPackage={currentPackage?.package === `${packageType.toUpperCase()} PACKAGE`}
                  recommended={packageType === 'pro'}
                  colorClass="border-indigo-200 dark:border-indigo-900/50 hover:border-indigo-300"
                />
              ))}
            </div>
          </div>
          
          {/* Help Section */}
          <div className="mt-12 bg-gray-50 dark:bg-gray-800/30 rounded-lg p-6 border border-gray-100 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
                <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">Need help choosing?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Contact our support team for assistance in selecting the right plan for your business needs.
                </p>
              </div>
              <Button 
                variant="outline" 
                className="mt-3 sm:mt-0 sm:ml-auto border-orange-200 dark:border-orange-900/50 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-700 dark:text-orange-400"
                onClick={() => window.location.href = '/support'}
              >
                Contact Support
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const PackageCard = ({ 
  title, 
  icon,
  packages, 
  onSubscribe, 
  isSubscribing, 
  isCurrentPackage = false, 
  recommended = false,
  colorClass = ""
}) => {
  // Get the price and validity from the first package (assuming all packages in a plan have the same price)
  const firstPackage = packages[0];
  const price = firstPackage?.price || 0;
  const validity = firstPackage?.validity || 'monthly';
  
  // Collect all unique services from all packages
  const allServices = [];
  packages.forEach(pkg => {
    if (pkg.service && Array.isArray(pkg.service)) {
      pkg.service.forEach(service => {
        // Check if service already exists to avoid duplicates
        const existingService = allServices.find(s => s.id === service.id);
        if (!existingService) {
          allServices.push(service);
        }
      });
    }
  });
  
  return (
    <Card className={`relative hover:shadow-lg transition-all duration-300 ${colorClass} ${recommended ? 'border-2 border-purple-400 dark:border-purple-500 shadow-md transform hover:-translate-y-1' : 'border'} ${isCurrentPackage ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}>
      {recommended && (
        <Badge className="absolute -top-3 right-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 px-3 py-1 shadow-md">
          <Sparkles className="w-3.5 h-3.5 mr-1" />
          Recommended
        </Badge>
      )}
      
      {isCurrentPackage && (
        <Badge className="absolute -top-3 left-4 bg-green-600 text-white border-0 px-3 py-1 shadow-md">
          <Check className="w-3.5 h-3.5 mr-1" />
          Current Plan
        </Badge>
      )}
      
      <CardHeader className={`pb-3 ${recommended ? 'bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20' : ''}`}>
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            {formatCurrency(price)}
          </span>
          <CardDescription className="text-right">
            per {validity === 'daily' ? 'day' : validity === 'weekly' ? 'week' : 'month'}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <h4 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">What's included:</h4>
        {allServices.length > 0 ? (
          <ul className="space-y-4">
            {allServices.map((service, index) => (
              <li key={service.id} className="text-sm">
                <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-medium">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-500 flex-shrink-0" />
                  {service.service}
                </div>
                <div className="ml-6 mt-1 grid grid-cols-3 gap-2 text-xs">
                  {service.limit_daily > 0 && (
                    <div className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">{service.limit_daily}</span> daily
                    </div>
                  )}
                  {service.limit_weekly > 0 && (
                    <div className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">{service.limit_weekly}</span> weekly
                    </div>
                  )}
                  {service.limit_monthly > 0 && (
                    <div className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">{service.limit_monthly}</span> monthly
                    </div>
                  )}
                </div>
                {index < allServices.length - 1 && <Separator className="my-3" />}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No services available</p>
            <p className="text-xs">Coming soon...</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button 
          className={`w-full ${recommended ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700' : ''}`}
          onClick={onSubscribe}
          disabled={isSubscribing || isCurrentPackage || allServices.length === 0}
          variant={isCurrentPackage ? "outline" : allServices.length === 0 ? "outline" : "default"}
        >
          {isSubscribing 
            ? 'Subscribing...' 
            : isCurrentPackage 
              ? 'Current Plan'
              : allServices.length === 0
                ? 'Coming Soon'
                : 'Subscribe Now'
          }
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionPage; 