import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle, CreditCard, Clock, Zap, HelpCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PaymentPlansPage() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [paymentStatus, setPaymentStatus] = useState(null);
  
  const plans = [
    {
      id: "basic",
      name: "Basic",
      description: "Essential tools for social media management",
      price: {
        monthly: 29,
        annually: 24
      },
      features: [
        "Connect up to 5 social profiles",
        "Basic content scheduling",
        "Performance analytics",
        "Mobile app access",
      ],
      cta: "Get Started"
    },
    {
      id: "professional",
      name: "Professional",
      description: "Advanced features for growing businesses",
      price: {
        monthly: 49,
        annually: 39
      },
      features: [
        "Connect up to 10 social profiles",
        "Advanced content scheduling",
        "Detailed performance analytics",
        "WhatsApp bot (basic)",
        "Priority support",
        "Team collaboration (2 users)"
      ],
      popular: true,
      cta: "Upgrade Now"
    },
    {
      id: "business",
      name: "Business",
      description: "Complete solution for businesses and agencies",
      price: {
        monthly: 99,
        annually: 79
      },
      features: [
        "Connect unlimited social profiles",
        "Advanced content scheduling & automation",
        "Comprehensive analytics dashboard",
        "WhatsApp bot (advanced)",
        "Messenger broadcast",
        "AI content generation",
        "Instagram viral finder",
        "Team collaboration (5 users)",
        "Dedicated account manager"
      ],
      cta: "Contact Sales"
    }
  ];

  const currentPlan = {
    id: "basic",
    status: "active",
    startDate: "2023-06-01",
    nextBillingDate: "2023-07-01",
    paymentMethod: "Visa ending in 4242"
  };

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
  };

  const handleChangeBillingCycle = (cycle) => {
    setBillingCycle(cycle);
  };

  const handleUpgrade = () => {
    if (!selectedPlan) return;
    
    // Simulate payment processing
    setPaymentStatus("processing");
    
    setTimeout(() => {
      setPaymentStatus("success");
      
      // Reset after showing success message
      setTimeout(() => {
        setPaymentStatus(null);
      }, 3000);
    }, 2000);
  };

  const calculateSavings = (plan) => {
    const monthlyCost = plan.price.monthly * 12;
    const annualCost = plan.price.annually * 12;
    const savings = monthlyCost - annualCost;
    const percentage = Math.round((savings / monthlyCost) * 100);
    
    return `Save ${percentage}%`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
  };

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
              <AlertTitle className="text-green-800">Payment Successful</AlertTitle>
              <AlertDescription className="text-green-700">
                Your plan has been upgraded. You now have access to all new features.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-center mb-8">
            <div className="bg-muted inline-flex items-center p-1 rounded-lg">
              <Button
                variant={billingCycle === "monthly" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleChangeBillingCycle("monthly")}
              >
                Monthly
              </Button>
              <Button
                variant={billingCycle === "annually" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleChangeBillingCycle("annually")}
              >
                Annually
                <Badge className="ml-2 bg-green-100 text-green-800">Save 20%</Badge>
              </Button>
            </div>
          </div>
          
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
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-3xl font-bold">
                      ${plan.price[billingCycle]}
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        /mo
                      </span>
                    </p>
                    {billingCycle === "annually" && (
                      <p className="text-sm text-green-600 mt-1">{calculateSavings(plan)}</p>
                    )}
                  </div>
                  
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 mt-1 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={currentPlan.id === plan.id ? "outline" : "default"}
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={paymentStatus === "processing" || (currentPlan.id === plan.id && plan.id === "basic")}
                  >
                    {currentPlan.id === plan.id ? "Current Plan" : plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {selectedPlan && selectedPlan !== currentPlan.id && (
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
                      <span className="text-sm">{plans.find(p => p.id === currentPlan.id)?.name}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">New Plan</span>
                      <span className="text-sm font-medium">{plans.find(p => p.id === selectedPlan)?.name}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Billing Cycle</span>
                      <span className="text-sm capitalize">{billingCycle}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-sm font-medium">Amount</span>
                      <span className="text-sm font-medium">
                        ${plans.find(p => p.id === selectedPlan)?.price[billingCycle]}/mo
                      </span>
                    </div>
                  </div>
                  
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-700">
                      Your plan will be upgraded immediately and you'll be charged the prorated amount for the remainder of your billing cycle.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setSelectedPlan(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpgrade} disabled={paymentStatus === "processing"}>
                    {paymentStatus === "processing" ? (
                      <>
                        <span className="animate-spin mr-2">⟳</span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Confirm Upgrade
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="billing">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
                <CardDescription>
                  Manage your subscription and billing information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Current Plan</p>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">{plans.find(p => p.id === currentPlan.id)?.name}</h3>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium mb-1">Started On</p>
                    <p>{formatDate(currentPlan.startDate)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Next Billing Date</p>
                    <div className="flex items-center gap-2">
                      <p>{formatDate(currentPlan.nextBillingDate)}</p>
                      <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Upcoming</span>
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Payment Method</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <p>{currentPlan.paymentMethod}</p>
                    <Button variant="ghost" size="sm" className="h-8 ml-2">
                      Update
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline">Cancel Subscription</Button>
                <Button variant="default">Change Plan</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>
                  Get assistance with billing and subscription issues
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-orange-500" />
                    Billing Questions
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Have questions about your bill or need to update payment info?
                  </p>
                  <Button variant="outline" size="sm">Contact Billing Support</Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-blue-500" />
                    Plan Assistance
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Need help choosing the right plan for your business?
                  </p>
                  <Button variant="outline" size="sm">Schedule Consultation</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                View and download your past invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-left py-3 px-4 font-medium">Invoice</th>
                      <th className="text-left py-3 px-4 font-medium">Amount</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-right py-3 px-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr className="hover:bg-muted/50">
                      <td className="py-3 px-4">Jun 1, 2023</td>
                      <td className="py-3 px-4">INV-001234</td>
                      <td className="py-3 px-4">$29.00</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-green-100 text-green-800">Paid</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm">Download</Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/50">
                      <td className="py-3 px-4">May 1, 2023</td>
                      <td className="py-3 px-4">INV-001198</td>
                      <td className="py-3 px-4">$29.00</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-green-100 text-green-800">Paid</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm">Download</Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/50">
                      <td className="py-3 px-4">Apr 1, 2023</td>
                      <td className="py-3 px-4">INV-001154</td>
                      <td className="py-3 px-4">$29.00</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-green-100 text-green-800">Paid</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm">Download</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PaymentPlansPage; 