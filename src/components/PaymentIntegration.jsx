import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, CreditCard, DollarSign, ChevronRight, Check } from "lucide-react";

export function PaymentIntegration({ onPaymentComplete, amount = 29.99, productName = "Premium Plan", recurring = true }) {
  const [activeTab, setActiveTab] = useState("stripe");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isRecurring, setIsRecurring] = useState(recurring);
  const [errorMessage, setErrorMessage] = useState(null);
  
  // Payment form state
  const [formData, setFormData] = useState({
    nameOnCard: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    email: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePaymentProcess = () => {
    // Validate form data
    if (!validateForm()) {
      return;
    }
    
    setProcessingPayment(true);
    setErrorMessage(null);
    
    // Simulate payment processing
    setTimeout(() => {
      try {
        // In a real implementation, we would call the respective payment APIs
        setPaymentSuccess(true);
        setProcessingPayment(false);
        
        // Notify parent component of payment completion
        if (onPaymentComplete) {
          onPaymentComplete({
            success: true,
            provider: activeTab,
            isRecurring,
            amount,
            transactionId: `TX-${Date.now()}`
          });
        }
      } catch (error) {
        setErrorMessage("Payment failed. Please try again.");
        setProcessingPayment(false);
      }
    }, 2000);
  };

  const validateForm = () => {
    // Basic validation
    if (activeTab === "stripe" || activeTab === "paystack") {
      if (!formData.nameOnCard.trim()) {
        setErrorMessage("Please enter the name on your card");
        return false;
      }
      if (!formData.cardNumber.trim() || formData.cardNumber.replace(/\s/g, '').length !== 16) {
        setErrorMessage("Please enter a valid card number");
        return false;
      }
      if (!formData.expiryDate.trim() || !formData.expiryDate.match(/^\d{2}\/\d{2}$/)) {
        setErrorMessage("Please enter a valid expiry date (MM/YY)");
        return false;
      }
      if (!formData.cvc.trim() || formData.cvc.length < 3) {
        setErrorMessage("Please enter a valid CVC");
        return false;
      }
    }
    
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }
    
    return true;
  };

  // Reset form when changing payment methods
  const handleTabChange = (value) => {
    setActiveTab(value);
    setErrorMessage(null);
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "stripe":
        return (
          <div className="w-8 h-8 bg-indigo-600 flex items-center justify-center rounded">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
        );
      case "paypal":
        return (
          <div className="w-8 h-8 bg-blue-600 flex items-center justify-center rounded">
            <span className="text-white font-bold">P</span>
          </div>
        );
      case "paystack":
        return (
          <div className="w-8 h-8 bg-green-600 flex items-center justify-center rounded">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
        );
      default:
        return null;
    }
  };

  if (paymentSuccess) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="space-y-1 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Thank you for your payment. Your transaction was completed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-t border-b py-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">${amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Product:</span>
              <span className="font-medium">{productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Type:</span>
              <span className="font-medium">
                {isRecurring ? "Recurring (monthly)" : "One-time"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method:</span>
              <div className="flex items-center">
                {getPaymentMethodIcon(activeTab)}
                <span className="ml-2 font-medium capitalize">{activeTab}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => setPaymentSuccess(false)}>
            Return to Dashboard
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>
          Choose your preferred payment method to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
          <div>
            <p className="font-medium">{productName}</p>
            <p className="text-sm text-muted-foreground">
              {isRecurring ? "Monthly subscription" : "One-time payment"}
            </p>
          </div>
          <div className="text-xl font-bold">${amount}</div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="recurring"
            checked={isRecurring}
            onCheckedChange={setIsRecurring}
          />
          <Label htmlFor="recurring">Recurring Payment</Label>
        </div>

        <Tabs 
          defaultValue="stripe" 
          value={activeTab} 
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="stripe">Stripe</TabsTrigger>
            <TabsTrigger value="paypal">PayPal</TabsTrigger>
            <TabsTrigger value="paystack">Paystack</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stripe" className="space-y-4 pt-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="nameOnCard">Name on Card</Label>
                <Input
                  id="nameOnCard"
                  name="nameOnCard"
                  placeholder="John Doe"
                  value={formData.nameOnCard}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    name="cvc"
                    placeholder="123"
                    value={formData.cvc}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="paypal" className="space-y-4 pt-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center space-y-4">
              <p className="text-sm">
                You'll be redirected to PayPal to complete your payment securely.
              </p>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handlePaymentProcess}
                disabled={processingPayment}
              >
                {processingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing
                  </>
                ) : (
                  <>
                    Pay with PayPal
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
              <div>
                <Label htmlFor="paypal-email">Email Address</Label>
                <Input
                  id="paypal-email"
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="paystack" className="space-y-4 pt-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="nameOnCard-paystack">Name on Card</Label>
                <Input
                  id="nameOnCard-paystack"
                  name="nameOnCard"
                  placeholder="John Doe"
                  value={formData.nameOnCard}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="cardNumber-paystack">Card Number</Label>
                <Input
                  id="cardNumber-paystack"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate-paystack">Expiry Date</Label>
                  <Input
                    id="expiryDate-paystack"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="cvc-paystack">CVC</Label>
                  <Input
                    id="cvc-paystack"
                    name="cvc"
                    placeholder="123"
                    value={formData.cvc}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email-paystack">Email Address</Label>
                <Input
                  id="email-paystack"
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-md text-sm">
            {errorMessage}
          </div>
        )}
      </CardContent>
      <CardFooter>
        {activeTab !== "paypal" && (
          <Button 
            className="w-full" 
            onClick={handlePaymentProcess}
            disabled={processingPayment}
          >
            {processingPayment ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing Payment
              </>
            ) : (
              `Pay $${amount} ${isRecurring ? 'monthly' : ''}`
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default PaymentIntegration; 