import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Zap, Clock, Shield, Users, Calendar, MessageSquare, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useDashboard } from "@/contexts/DashboardContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function PricingPage() {
  const { 
    allPackages, 
    userPackage, 
    loading, 
    subscribeToPackage, 
    packageName 
  } = useSubscription();
  
  const { accountData } = useDashboard();
  
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [processingSub, setProcessingSub] = useState(false);
  const [status, setStatus] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const navigate = useNavigate();
  
  // Initialize selected plan based on user's current package
  useEffect(() => {
    if (accountData?.data) {
      const currentPackage = accountData.data.package?.toLowerCase();
      if (currentPackage?.includes('pro')) {
        setSelectedPlan('pro');
      } else if (currentPackage?.includes('plus')) {
        setSelectedPlan('plus');
      } else {
        setSelectedPlan('trial');
      }
    }
  }, [accountData]);

  const handleSubscribe = async (planId) => {
    if (planId === 'trial') return;
    
    setProcessingSub(true);
    setStatus("processing");
    
    try {
      const result = await subscribeToPackage(planId);
      
      if (result.success) {
        setStatus("success");
        setSelectedPlan(planId);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error subscribing to plan:", error);
      setStatus("error");
    } finally {
      setProcessingSub(false);
      
      // Reset status after showing message
      setTimeout(() => {
        setStatus(null);
      }, 3000);
    }
  };

  // Define plans with features
  const plans = [
    {
      id: "trial",
      name: "Trial",
      description: "Test out our features before committing",
      price: { monthly: 0, yearly: 0 },
      billing: "Free forever",
      color: "bg-gray-100",
      features: [
        { name: "Limited feature access", included: true },
        { name: "Basic account setup", included: true },
        { name: "Up to 2 social accounts", included: true },
        { name: "Content scheduler (2 posts/day)", included: true },
        { name: "Basic automation workflows", included: true },
        { name: "AI content generation", included: false },
        { name: "Analytics dashboard", included: false },
        { name: "Priority support", included: false }
      ],
      cta: "Current Plan",
      icon: <Clock className="h-5 w-5 text-gray-700" />
    },
    {
      id: "plus",
      name: "Plus",
      description: "Perfect for growing creators and small businesses",
      price: { monthly: 200, yearly: 2000 },
      savings: "Save ₦400",
      color: "bg-blue-100",
      popular: true,
      features: [
        { name: "Everything in Trial, plus:", included: true },
        { name: "Up to 10 social accounts", included: true },
        { name: "Premium content scheduler (10 posts/day)", included: true },
        { name: "Auto-reply to comments", included: true },
        { name: "Auto DM responses", included: true },
        { name: "Basic analytics dashboard", included: true },
        { name: "AI content generation (limited)", included: true },
        { name: "Priority support", included: false }
      ],
      cta: "Upgrade to Plus",
      icon: <Zap className="h-5 w-5 text-blue-700" />
    },
    {
      id: "pro",
      name: "Pro",
      description: "Advanced features for businesses that need more",
      price: { monthly: 500, yearly: 5000 },
      savings: "Save ₦1,000",
      color: "bg-purple-100",
      features: [
        { name: "Everything in Plus, plus:", included: true },
        { name: "Unlimited social accounts", included: true },
        { name: "Advanced automation workflows", included: true },
        { name: "Unlimited content scheduling", included: true },
        { name: "AI content generation (unlimited)", included: true },
        { name: "Advanced analytics with reports", included: true },
        { name: "Priority support", included: true },
        { name: "Dedicated account manager", included: true }
      ],
      cta: "Upgrade to Pro",
      icon: <Shield className="h-5 w-5 text-purple-700" />
    }
  ];

  const currentPlan = plans.find(plan => plan.id === selectedPlan) || plans[0];
  const userBalance = accountData?.data?.wallet || 0;

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-5 w-full max-w-xl mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[1, 2, 3].map(i => (
              <Card key={i} className="w-full">
                <CardHeader>
                  <Skeleton className="h-7 w-32" />
                  <Skeleton className="h-5 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-24 mb-6" />
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(j => (
                      <Skeleton key={j} className="h-5 w-full" />
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
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">Choose Your Plan</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Select the plan that best fits your needs. All plans come with a free trial period.
          </p>
          
          {status === "success" && (
            <div className="max-w-md mx-auto mt-4 bg-green-50 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <Check className="h-5 w-5" />
              <p>Your subscription has been updated successfully!</p>
            </div>
          )}
          
          {status === "error" && (
            <div className="max-w-md mx-auto mt-4 bg-red-50 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <p>There was an error processing your subscription. Please try again.</p>
            </div>
          )}
          
          {status === "processing" && (
            <div className="max-w-md mx-auto mt-4 bg-blue-50 text-blue-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <p>Processing your subscription...</p>
            </div>
          )}
          
          <div className="flex justify-center mt-8">
            <div className="bg-muted p-1 rounded-full flex items-center">
              <div className="flex items-center space-x-2 mr-4">
                <Switch 
                  id="billing-cycle" 
                  checked={billingCycle === "yearly"}
                  onCheckedChange={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                />
                <Label htmlFor="billing-cycle">Annual billing</Label>
              </div>
              {billingCycle === "yearly" && (
                <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                  Save up to 16%
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {plans.map((plan) => {
            const isCurrentPlan = selectedPlan === plan.id;
            const priceToShow = billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly;
            const planDisabled = plan.id === "trial" && selectedPlan !== "trial";
            
            return (
              <Card 
                key={plan.id} 
                className={`w-full relative border ${isCurrentPlan ? 'border-green-300 ring-1 ring-green-200' : ''} transition-all ${planDisabled ? 'opacity-70' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                  </div>
                )}
                {isCurrentPlan && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <Badge className="bg-green-500 text-white">Current Plan</Badge>
                  </div>
                )}
                
                <CardHeader className={`${plan.color} rounded-t-lg`}>
                  <div className="flex items-center mb-2">
                    <div className="mr-2 p-1.5 rounded-full bg-white/80">
                      {plan.icon}
                    </div>
                    <CardTitle>{plan.name}</CardTitle>
                  </div>
                  <CardDescription className="text-sm opacity-90">{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <div className="flex items-end">
                      <span className="text-3xl font-bold">₦{priceToShow.toLocaleString()}</span>
                      <span className="text-muted-foreground ml-2">
                        {plan.id === "trial" ? "Free" : `/${billingCycle === "monthly" ? "month" : "year"}`}
                      </span>
                    </div>
                    {billingCycle === "yearly" && plan.savings && (
                      <p className="text-sm text-green-600 mt-1">{plan.savings}</p>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground mr-2 shrink-0 mt-0.5" />
                        )}
                        <span className={feature.included ? "" : "text-muted-foreground"}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    variant={isCurrentPlan ? "outline" : "default"} 
                    className="w-full font-medium"
                    disabled={isCurrentPlan || processingSub || planDisabled}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {isCurrentPlan ? "Current Plan" : plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-12 bg-muted rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Current Subscription</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium">{currentPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Billing Cycle</span>
                  <span className="font-medium capitalize">{accountData?.data?.subscription || "Trial"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wallet Balance</span>
                  <span className="font-medium">₦{userBalance.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
              <p className="text-muted-foreground mb-4">
                Have questions about which plan is right for you? Our team is ready to help.
              </p>
              <Button variant="outline" onClick={() => navigate("/support")}>
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage; 