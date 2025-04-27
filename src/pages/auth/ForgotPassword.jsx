import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function ForgotPassword() {
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResetSuccess(true);
    } catch (err) {
      setError("Password reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 sm:p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Reset your password</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">We'll send you instructions to reset your password</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 text-sm bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {resetSuccess ? (
          <div className="text-center space-y-4">
            <div className="p-3 sm:p-4 text-sm bg-green-50 text-green-700 rounded-lg mb-4">
              Password reset instructions have been sent to your email.
            </div>
            <Button 
              onClick={() => setResetSuccess(false)} 
              className="w-full text-sm"
            >
              Try Again
            </Button>
            <p className="text-center text-sm">
              <Link
                to="/auth/login"
                className="text-primary hover:underline"
                tabIndex={0}
                aria-label="Back to login"
              >
                Back to login
              </Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label htmlFor="resetEmail" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="resetEmail"
                type="email"
                required
                className="w-full p-2 text-sm border rounded-lg bg-background"
                placeholder="your@email.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full text-sm flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{isLoading ? "Sending..." : "Send Reset Instructions"}</span>
            </Button>
            
            <p className="text-center text-sm">
              <Link
                to="/auth/login"
                className="text-primary hover:underline"
                tabIndex={0}
                aria-label="Back to login"
              >
                Back to login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
} 