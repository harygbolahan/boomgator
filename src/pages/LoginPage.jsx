import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  
  // Mock credentials
  const mockCredentials = {
    email: "demo@boomgator.com",
    password: "password123"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if credentials match
      if (email === mockCredentials.email && password === mockCredentials.password) {
        // In a real app, would store auth token, user info, etc.
        localStorage.setItem("isLoggedIn", "true");
        
        // Check if this is the first login (in a real app, this would be from the API)
        const isFirstLogin = !localStorage.getItem("hasCompletedSetup");
        
        // Redirect to setup guide on first login, otherwise to dashboard
        if (isFirstLogin) {
          navigate("/setup-guide");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem("isLoggedIn", "true");
      
      // Check if this is the first login (in a real app, this would be from the API)
      const isFirstLogin = !localStorage.getItem("hasCompletedSetup");
      
      // Redirect to setup guide on first login, otherwise to dashboard
      if (isFirstLogin) {
        navigate("/setup-guide");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Google authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setIsLoading(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem("isLoggedIn", "true");
      
      // Check if this is the first login (in a real app, this would be from the API)
      const isFirstLogin = !localStorage.getItem("hasCompletedSetup");
      
      // Redirect to setup guide on first login, otherwise to dashboard
      if (isFirstLogin) {
        navigate("/setup-guide");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Facebook authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

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

  if (isForgotPassword) {
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
              <Button onClick={() => {
                setIsForgotPassword(false);
                setResetSuccess(false);
              }} className="w-full text-sm">
                Back to Login
              </Button>
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
                className="w-full text-sm"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Instructions"}
              </Button>
              
              <p className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="text-primary hover:underline"
                  tabIndex={0}
                  aria-label="Back to login"
                >
                  Back to login
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      {/* Form */}
      <div className="flex flex-col justify-center items-center p-4 sm:p-8 w-full max-w-md">
        <div className="w-full">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold">Welcome back to Boomgator</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">Log in to your account to continue</p>
          </div>
          
          {/* Mock credentials info */}
          <div className="mb-6 p-3 sm:p-4 text-sm bg-blue-50 text-blue-700 rounded-lg">
            <p className="font-medium">Demo Credentials</p>
            <p className="text-xs sm:text-sm">Email: {mockCredentials.email}</p>
            <p className="text-xs sm:text-sm">Password: {mockCredentials.password}</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 text-sm bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full p-2 text-sm border rounded-lg bg-background"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <button 
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-xs sm:text-sm text-primary hover:underline"
                  tabIndex={0}
                  aria-label="Forgot password"
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                required
                className="w-full p-2 text-sm border rounded-lg bg-background"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="remember" className="ml-2 block text-xs sm:text-sm">
                Remember me for 30 days
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full text-sm"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm text-gray-500">
                <span className="px-2 bg-background">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center gap-2 py-2 px-3 sm:px-4 text-xs sm:text-sm border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                disabled={isLoading}
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={handleFacebookSignIn}
                className="flex items-center justify-center gap-2 py-2 px-3 sm:px-4 text-xs sm:text-sm border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                disabled={isLoading}
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>
          </div>
          
          <p className="mt-6 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 