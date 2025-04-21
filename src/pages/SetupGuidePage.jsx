import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Bot
} from "lucide-react";

export function SetupGuidePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [automationCreated, setAutomationCreated] = useState(false);
  
  const steps = [
    {
      id: "welcome",
      title: "Welcome to Boomgator!",
      description: "Let's set up your account in just a few steps.",
    },
    {
      id: "connect-social",
      title: "Connect Your Social Media",
      description: "Link your social accounts to start managing them in one place.",
    },
    {
      id: "setup-automation",
      title: "Create Your First Automation",
      description: "Set up automated responses based on keywords.",
    },
    {
      id: "completed",
      title: "Setup Complete!",
      description: "You're all set to start managing your social media with Boomgator.",
    }
  ];

  const socialPlatforms = [
    { 
      id: "facebook", 
      name: "Facebook", 
      icon: <Facebook className="h-5 w-5" />,
      color: "bg-blue-600 hover:bg-blue-700"
    },
    { 
      id: "instagram", 
      name: "Instagram", 
      icon: <Instagram className="h-5 w-5" />,
      color: "bg-purple-600 hover:bg-purple-700"
    },
    { 
      id: "twitter", 
      name: "Twitter", 
      icon: <Twitter className="h-5 w-5" />,
      color: "bg-black hover:bg-gray-800"
    },
    { 
      id: "linkedin", 
      name: "LinkedIn", 
      icon: <Linkedin className="h-5 w-5" />,
      color: "bg-blue-800 hover:bg-blue-900"
    },
    { 
      id: "whatsapp", 
      name: "WhatsApp", 
      icon: <MessageSquare className="h-5 w-5" />,
      color: "bg-green-600 hover:bg-green-700"
    }
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      if (!completedSteps.includes(steps[currentStep].id)) {
        setCompletedSteps([...completedSteps, steps[currentStep].id]);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkipToEnd = () => {
    localStorage.setItem("hasCompletedSetup", "true");
    navigate("/dashboard");
  };

  const handleConnectSocial = async (platformId) => {
    setIsConnecting(true);
    
    try {
      // Mock API call with delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add connected account to state
      const platform = socialPlatforms.find(p => p.id === platformId);
      const newAccount = {
        id: `${platformId}-${Date.now()}`,
        name: platform.name,
        username: `yourbrand_${platformId}`,
        connected: true
      };
      
      setConnectedAccounts([...connectedAccounts, newAccount]);
    } catch (error) {
      console.error("Error connecting account:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCreateAutomation = async () => {
    setIsConnecting(true);
    
    try {
      // Mock API call with delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAutomationCreated(true);
    } catch (error) {
      console.error("Error creating automation:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("hasCompletedSetup", "true");
    navigate("/dashboard");
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case "welcome":
        return (
          <div className="text-center space-y-8">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Welcome to Boomgator</h2>
              <p className="text-muted-foreground">
                We'll help you set up your account in just a few steps.
              </p>
            </div>
            <Button 
              onClick={handleNextStep} 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              Get Started <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        );
        
      case "connect-social":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Connect Your Social Media</h2>
              <p className="text-muted-foreground">
                Choose at least one social platform to get started. You can add more later.
              </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {socialPlatforms.map(platform => {
                const isConnected = connectedAccounts.some(acc => acc.id.startsWith(platform.id));
                return (
                  <button
                    key={platform.id}
                    className={`flex items-center p-4 border rounded-xl transition-all ${
                      isConnected 
                        ? 'border-green-300 bg-green-50' 
                        : 'hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => !isConnected && !isConnecting && handleConnectSocial(platform.id)}
                    disabled={isConnected || isConnecting}
                    tabIndex={0}
                    aria-label={`Connect to ${platform.name}`}
                  >
                    <div className={`w-10 h-10 rounded-full ${platform.color} flex items-center justify-center text-white mr-3`}>
                      {platform.icon}
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium">{platform.name}</div>
                      {isConnected ? (
                        <div className="text-sm text-green-600 flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Connected
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Click to connect
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handlePrevStep}>
                Back
              </Button>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    handleNextStep();
                  }}
                >
                  Skip for now
                </Button>
                <Button 
                  onClick={handleNextStep} 
                  disabled={connectedAccounts.length === 0}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  Continue <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        );
        
      case "setup-automation":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Create Your First Automation</h2>
              <p className="text-muted-foreground">
                Set up an automation to respond to messages containing specific keywords.
              </p>
            </div>
            
            {automationCreated ? (
              <div className="p-6 border rounded-xl bg-green-50 border-green-200 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium">Automation Created!</h3>
                <p className="text-sm text-muted-foreground">
                  Your keyword response automation has been set up successfully.
                </p>
              </div>
            ) : (
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-gray-50 p-4 border-b">
                  <h3 className="font-medium">Quick Automation Setup</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">When a message contains:</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded-lg bg-background"
                      placeholder="e.g., pricing, support, help"
                      defaultValue="pricing"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Automatically respond with:</label>
                    <textarea 
                      className="w-full p-2 border rounded-lg bg-background min-h-[100px]"
                      placeholder="Your automated response"
                      defaultValue="Thank you for your interest in our pricing! Our plans start at $29/month for basic features. For a detailed breakdown, please visit our pricing page at example.com/pricing or let me know if you'd like to schedule a demo."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Apply to platforms:</label>
                    <div className="flex flex-wrap gap-2">
                      {connectedAccounts.map(account => (
                        <div 
                          key={account.id}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {account.name}
                        </div>
                      ))}
                      {connectedAccounts.length === 0 && (
                        <div className="text-sm text-muted-foreground">
                          No accounts connected. This will apply to accounts you connect later.
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleCreateAutomation}
                    disabled={isConnecting}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {isConnecting ? (
                      <>Creating Automation...</>
                    ) : (
                      <>
                        <Bot className="h-4 w-4 mr-2" /> Create Automation
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handlePrevStep}>
                Back
              </Button>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    handleNextStep();
                  }}
                >
                  Skip for now
                </Button>
                <Button 
                  onClick={handleNextStep} 
                  disabled={!automationCreated && isConnecting}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  Continue <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        );
        
      case "completed":
        return (
          <div className="text-center space-y-8">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">You're All Set!</h2>
              <p className="text-muted-foreground">
                You've successfully set up your Boomgator account. You can now start managing your social media presence effectively.
              </p>
            </div>
            <div className="space-y-4">
              <ul className="space-y-2 text-left max-w-md mx-auto">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <span>
                    <strong>Social Accounts:</strong> {connectedAccounts.length} account(s) connected
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <span>
                    <strong>Automations:</strong> {automationCreated ? '1 automation' : 'No automations'} created
                  </span>
                </li>
              </ul>
              <Button 
                onClick={handleComplete} 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                Go to Dashboard <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="mb-8">
          <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Start</span>
            <span>Complete</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border shadow-sm p-6 md:p-8">
          {renderStepContent()}
        </div>
        
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleSkipToEnd}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={0}
            aria-label="Skip setup guide"
          >
            Skip setup guide
          </button>
        </div>
      </div>
    </div>
  );
} 