import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle, CreditCard, Clock, Zap, HelpCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Skeleton } from "@/components/ui/skeleton";

export function PaymentPlansPage() {
  const { 
    allPackages, 
    userPackage, 
    loading, 
    subscribeToPackage, 
    packageName 
  } = useSubscription();
  
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [processingSub, setProcessingSub] = useState(false);
  
  // Initialize selected plan based on user's current package
  useEffect(() => {
    if (userPackage && !selectedPlan) {
      if (userPackage.package?.toLowerCase().includes('plus')) {
        setSelectedPlan('plus');
      } else if (userPackage.package?.toLowerCase().includes('pro')) {
        setSelectedPlan('pro');
      } else {
        setSelectedPlan('trial');
      }
    }
  }, [userPackage, selectedPlan]);

  // Create a dynamic plans array based on API response
  const formatPackages = () => {
    if (!allPackages) return [];
    
    const formattedPlans = [
      {
        id: "trial",
        name: "Trial",
        description: "Free trial for testing out features",
        price: 0,
        services: allPackages.trial?.map(item => ({
          name: item.service[0].service,
          limits: {
            daily: item.service[0].limit_daily,
            weekly: item.service[0].limit_weekly,
            monthly: item.service[0].limit_monthly
          }
        })) || [],
        cta: "Current Plan"
      }
    ];
    
    // Add Plus package if available
    if (allPackages.plus?.length > 0) {
      formattedPlans.push({
        id: "plus",
        name: "Plus",
        description: "Essential tools for social media management",
        price: allPackages.plus[0].price / 100, // Convert from cents to dollars
        services: allPackages.plus.map(item => ({
          name: item.service[0].service,
          limits: {
            daily: item.service[0].limit_daily,
            weekly: item.service[0].limit_weekly,
            monthly: item.service[0].limit_monthly
          }
        })),
        popular: true,
        cta: "Upgrade Now"
      });
    }
    
    // Add Pro package if available
    if (allPackages.pro?.length > 0) {
      formattedPlans.push({
        id: "pro",
        name: "Pro",
        description: "Complete solution for businesses and agencies",
        price: allPackages.pro[0].price / 100, // Convert from cents to dollars
        services: allPackages.pro.map(item => ({
          name: item.service[0].service,
          limits: {
            daily: item.service[0].limit_daily,
            weekly: item.service[0].limit_weekly,
            monthly: item.service[0].limit_monthly
          }
        })),
        cta: "Upgrade Now"
      });
    }
    
    return formattedPlans;
  };
  
  const plans = formatPackages();

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = async () => {
    if (!selectedPlan || selectedPlan === 'trial') return;
    
    setProcessingSub(true);
    setPaymentStatus("processing");
    
    try {
      const result = await subscribeToPackage(selectedPlan);
      
      if (result.success) {
        setPaymentStatus("success");
      } else {
        setPaymentStatus("error");
      }
    } catch (error) {
      console.error("Error subscribing to plan:", error);
      setPaymentStatus("error");
    } finally {
      setProcessingSub(false);
      
      // Reset status after showing message
      setTimeout(() => {
        setPaymentStatus(null);
      }, 3000);
    }
  };

  // Format service limits to display
  const formatServiceLimits = (limits) => {
    if (!limits) return "N/A";
    
    const { daily, weekly, monthly } = limits;
    
    if (monthly > 0) {
      return `${monthly} per month`;
    } else if (weekly > 0) {
      return `${weekly} per week`;
    } else if (daily > 0) {
      return `${daily} per day`;
    } else {
      return "Unlimited";
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="w-full">
              <CardHeader>
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="space-y-6">
                <Skeleton className="h-10 w-20" />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((feature) => (
                    <Skeleton key={feature} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Plans & Billing</h1>
          <p className="text-muted-foreground">
            Choose the right plan for your social media management needs
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Billing History</Button>
          <Button variant="outline" size="sm">
            <HelpCircle className="h-4 w-4 mr-2" />
            Support
          </Button>
        </div>
      </div>

      <Tabs defaultValue="plans" className="space-y-8">
        <TabsList>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="billing">Billing & Subscription</TabsTrigger>
        </TabsList>
        
        <TabsContent value="plans">
          {paymentStatus === "success" && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Subscription Successful</AlertTitle>
              <AlertDescription className="text-green-700">
                Your plan has been updated. You now have access to all new features.
              </AlertDescription>
            </Alert>
          )}
          
          {paymentStatus === "error" && (
            <Alert className="mb-6 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Subscription Failed</AlertTitle>
              <AlertDescription className="text-red-700">
                There was an error processing your subscription. Please try again or contact support.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative ${selectedPlan === plan.id ? "border-primary ring-2 ring-primary/20" : ""} ${plan.popular ? "border-blue-300" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <Badge className="bg-blue-100 text-blue-800">Most Popular</Badge>
                  </div>
                )}
                {packageName?.toLowerCase().includes(plan.id) && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <Badge className="bg-green-100 text-green-800">Current Plan</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-3xl font-bold">
                      ${plan.price}
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        /mo
                      </span>
                    </p>
                  </div>
                  
                  <ul className="space-y-2">
                    {plan.services.map((service, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-1 text-green-500" />
                        <div>
                          <span className="text-sm font-medium">{service.name}</span>
                          <p className="text-xs text-muted-foreground">
                            {formatServiceLimits(service.limits)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={packageName?.toLowerCase().includes(plan.id) ? "outline" : "default"}
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={paymentStatus === "processing" || (packageName?.toLowerCase().includes(plan.id))}
                  >
                    {packageName?.toLowerCase().includes(plan.id) ? "Current Plan" : plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {selectedPlan && !packageName?.toLowerCase().includes(selectedPlan) && (
            <div className="mt-8 flex justify-center">
              <Card className="w-full max-w-2xl">
                <CardHeader>
                  <CardTitle>Upgrade to {plans.find(p => p.id === selectedPlan)?.name}</CardTitle>
                  <CardDescription>
                    Review your plan change and confirm
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Current Plan</span>
                      <span className="text-sm">{packageName}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">New Plan</span>
                      <span className="text-sm font-medium">{plans.find(p => p.id === selectedPlan)?.name}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-sm font-medium">New Monthly Price</span>
                      <span className="text-sm font-medium">${plans.find(p => p.id === selectedPlan)?.price}/mo</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    onClick={handleSubscribe} 
                    disabled={processingSub}
                    className="w-full md:w-auto"
                  >
                    {processingSub ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Confirm Subscription"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>Manage your current subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Plan</h3>
                  <p className="text-xl font-semibold">{packageName}</p>
                </div>

                <div className="flex-1 border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Billing Cycle</h3>
                  <p className="text-xl font-semibold">Monthly</p>
                </div>

                <div className="flex-1 border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Next Billing Date</h3>
                  <p className="text-xl font-semibold">-</p>
                </div>
              </div>
              
              <div className="border rounded-lg divide-y">
                <div className="p-4">
                  <h2 className="font-medium mb-4">Your Features</h2>
                  
                  <ul className="space-y-4">
                    {userPackage?.service?.map((service, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-1 text-green-500" />
                        <div>
                          <span className="text-sm font-medium">{service.service}</span>
                          <div className="flex gap-4 mt-1">
                            {service.limit_daily > 0 && (
                              <span className="text-xs px-2 py-1 bg-muted rounded">
                                {service.limit_daily}/day
                              </span>
                            )}
                            {service.limit_weekly > 0 && (
                              <span className="text-xs px-2 py-1 bg-muted rounded">
                                {service.limit_weekly}/week
                              </span>
                            )}
                            {service.limit_monthly > 0 && (
                              <span className="text-xs px-2 py-1 bg-muted rounded">
                                {service.limit_monthly}/month
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PaymentPlansPage; 