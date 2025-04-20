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
        
        // Redirect to dashboard
        navigate("/dashboard");
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
      navigate("/dashboard");
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
      navigate("/dashboard");
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
      <div className="min-h-screen bg-background flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Reset your password</h1>
            <p className="text-muted-foreground mt-2">We'll send you instructions to reset your password</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          {resetSuccess ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-50 text-green-700 rounded-lg mb-4">
                Password reset instructions have been sent to your email.
              </div>
              <Button onClick={() => {
                setIsForgotPassword(false);
                setResetSuccess(false);
              }} className="w-full">
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
                  className="w-full p-2 border rounded-lg bg-background"
                  placeholder="your@email.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
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
    <div className="min-h-screen bg-background flex justify-center">
      {/* Form */}
      <div className="flex flex-col justify-center items-center p-8 w-full max-w-md">
        <div className="w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Welcome back to Boomgator</h1>
            <p className="text-muted-foreground mt-2">Log in to your account to continue</p>
          </div>
          
          {/* Mock credentials info */}
          <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg">
            <p className="font-medium">Demo Credentials</p>
            <p className="text-sm">Email: {mockCredentials.email}</p>
            <p className="text-sm">Password: {mockCredentials.password}</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
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
                className="w-full p-2 border rounded-lg bg-background"
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
                  className="text-sm text-primary hover:underline"
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
                className="w-full p-2 border rounded-lg bg-background"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-muted-foreground">
                Remember me
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
          </form>
          
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t"></div>
            <span className="px-3 text-muted-foreground text-sm">or continue with</span>
            <div className="flex-grow border-t"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button"
              className="p-2 border rounded-lg hover:bg-accent flex items-center justify-center gap-2"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              tabIndex={0}
              aria-label="Sign in with Google"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              Google
            </button>
            <button 
              type="button"
              className="p-2 border rounded-lg hover:bg-accent flex items-center justify-center gap-2"
              onClick={handleFacebookSignIn}
              disabled={isLoading}
              tabIndex={0}
              aria-label="Sign in with Facebook"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M20.007,3H3.993C3.445,3,3,3.445,3,3.993v16.013C3,20.555,3.445,21,3.993,21h8.621v-6.971h-2.346v-2.717h2.346V9.31c0-2.325,1.42-3.591,3.494-3.591c0.993,0,1.847,0.074,2.096,0.107v2.43l-1.438,0.001c-1.128,0-1.346,0.536-1.346,1.323v1.734h2.69l-0.35,2.717h-2.34V21h4.587C20.555,21,21,20.555,21,20.007V3.993C21,3.445,20.555,3,20.007,3z"
                />
              </svg>
              Facebook
            </button>
          </div>
          
          <p className="mt-8 text-center text-sm text-muted-foreground">
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