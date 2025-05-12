import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";

export function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register: registerUser, error: authError, loading, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    first_name: "Ibrahim",
    last_name: "Musa",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    general: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Update local error state when auth context error changes
  useEffect(() => {
    if (authError) {
      // Parse error message to determine which field it belongs to
      const errorLower = authError.toLowerCase();
      
      if (errorLower.includes("email") || errorLower.includes("already") || errorLower.includes("exists")) {
        setErrors(prev => ({ ...prev, email: authError, general: "" }));
      } else if (errorLower.includes("password")) {
        if (errorLower.includes("match") || errorLower.includes("confirmation")) {
          setErrors(prev => ({ ...prev, password_confirmation: authError, general: "" }));
        } else {
          setErrors(prev => ({ ...prev, password: authError, general: "" }));
        }
      } else if (errorLower.includes("phone")) {
        setErrors(prev => ({ ...prev, phone: authError, general: "" }));
      } else if (errorLower.includes("name")) {
        if (errorLower.includes("first")) {
          setErrors(prev => ({ ...prev, first_name: authError, general: "" }));
        } else if (errorLower.includes("last")) {
          setErrors(prev => ({ ...prev, last_name: authError, general: "" }));
        } else {
          setErrors(prev => ({ ...prev, general: authError }));
        }
      } else {
        setErrors(prev => ({ ...prev, general: authError }));
      }
      
      setIsLoading(false);
    }
  }, [authError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    
    // Special case for password confirmation
    if (name === "password" && errors.password_confirmation) {
      setErrors(prev => ({
        ...prev,
        password_confirmation: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
      general: ""
    };
    let isValid = true;
    
    // First name validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
      isValid = false;
    }
    
    // Last name validation
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
      isValid = false;
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }
    
    // Phone validation
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else {
      const phoneDigits = formData.phone.replace(/[^0-9]/g, '');
      if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        newErrors.phone = "Please enter a valid phone number";
        isValid = false;
      }
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }
    
    // Password confirmation validation
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear all errors
    setErrors({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
      general: ""
    });
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use real API registration
      const result = await registerUser(formData);
      
      if (result.success) {
        // Navigate to setup guide for new users
        navigate("/setup-guide");
      } else {
        // Specific error handling is now done in the useEffect for authError
        // But we can still handle any error that comes directly in the result
        if (result.error) {
          // Use same logic to determine which field the error belongs to
          const errorLower = result.error.toLowerCase();
          
          if (errorLower.includes("email") || errorLower.includes("already") || errorLower.includes("exists")) {
            setErrors(prev => ({ ...prev, email: result.error }));
          } else if (errorLower.includes("password")) {
            if (errorLower.includes("match") || errorLower.includes("confirmation")) {
              setErrors(prev => ({ ...prev, password_confirmation: result.error }));
            } else {
              setErrors(prev => ({ ...prev, password: result.error }));
            }
          } else if (errorLower.includes("phone")) {
            setErrors(prev => ({ ...prev, phone: result.error }));
          } else if (errorLower.includes("name")) {
            if (errorLower.includes("first")) {
              setErrors(prev => ({ ...prev, first_name: result.error }));
            } else if (errorLower.includes("last")) {
              setErrors(prev => ({ ...prev, last_name: result.error }));
            } else {
              setErrors(prev => ({ ...prev, general: result.error }));
            }
          } else {
            setErrors(prev => ({ ...prev, general: result.error }));
          }
        } else {
          setErrors(prev => ({ ...prev, general: "Registration failed. Please try again." }));
        }
      }
    } catch (err) {
      setErrors(prev => ({ ...prev, general: err.message || "An error occurred. Please try again." }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setErrors(prev => ({ ...prev, general: "Google registration is not implemented yet." }));
  };

  const handleFacebookSignUp = async () => {
    setErrors(prev => ({ ...prev, general: "Facebook registration is not implemented yet." }));
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function to toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      {/* Form */}
      <div className="flex flex-col justify-center items-center p-4 sm:p-8 w-full max-w-md">
        <div className="w-full">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold">Create an account</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">Join Boomgator to manage your social media accounts</p>
          </div>
          
          {errors.general && (
            <div className="mb-4 p-3 text-sm bg-red-50 text-red-700 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  className={`w-full p-2 text-sm border rounded-lg bg-background ${errors.first_name ? "border-red-500" : ""}`}
                  value={formData.first_name}
                  onChange={handleChange}
                  aria-invalid={errors.first_name ? "true" : "false"}
                  aria-describedby={errors.first_name ? "first_name-error" : undefined}
                />
                {errors.first_name && (
                  <p id="first_name-error" className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.first_name}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  className={`w-full p-2 text-sm border rounded-lg bg-background ${errors.last_name ? "border-red-500" : ""}`}
                  value={formData.last_name}
                  onChange={handleChange}
                  aria-invalid={errors.last_name ? "true" : "false"}
                  aria-describedby={errors.last_name ? "last_name-error" : undefined}
                />
                {errors.last_name && (
                  <p id="last_name-error" className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.last_name}
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`w-full p-2 text-sm border rounded-lg bg-background ${errors.email ? "border-red-500" : ""}`}
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className={`w-full p-2 text-sm border rounded-lg bg-background ${errors.phone ? "border-red-500" : ""}`}
                placeholder="Your phone number"
                value={formData.phone}
                onChange={handleChange}
                aria-invalid={errors.phone ? "true" : "false"}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              {errors.phone && (
                <p id="phone-error" className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.phone}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className={`w-full p-2 pr-10 text-sm border rounded-lg bg-background ${errors.password ? "border-red-500" : ""}`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
              {errors.password ? (
                <p id="password-error" className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password}
                </p>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">
                  Must be at least 8 characters
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className={`w-full p-2 pr-10 text-sm border rounded-lg bg-background ${errors.password_confirmation ? "border-red-500" : ""}`}
                  placeholder="••••••••"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  aria-invalid={errors.password_confirmation ? "true" : "false"}
                  aria-describedby={errors.password_confirmation ? "password_confirmation-error" : undefined}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
              {errors.password_confirmation && (
                <p id="password_confirmation-error" className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password_confirmation}
                </p>
              )}
            </div>
            
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-muted-foreground">
                I agree to the{" "}
                <a href="#" className="text-primary hover:underline" tabIndex={0}>
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline" tabIndex={0}>
                  Privacy Policy
                </a>
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full text-sm flex items-center justify-center gap-2"
              disabled={isLoading || loading}
            >
              {(isLoading || loading) && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{isLoading || loading ? "Creating Account..." : "Create Account"}</span>
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
                className="flex items-center justify-center gap-2 py-2 px-3 sm:px-4 text-xs sm:text-sm border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={handleGoogleSignUp}
                disabled={isLoading || loading}
                tabIndex={0}
                aria-label="Sign up with Google"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                  <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25529 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335"/>
                  <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4"/>
                  <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05"/>
                  <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.2154 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853"/>
                </svg>
                <span>Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2 px-3 sm:px-4 text-xs sm:text-sm border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={handleFacebookSignUp}
                disabled={isLoading || loading}
                tabIndex={0}
                aria-label="Sign up with Facebook"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                  <path d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z" fill="#1877F2"/>
                  <path d="M16.6711 15.4688L17.2031 12H13.875V9.75C13.875 8.80102 14.34 7.875 15.8306 7.875H17.3438V4.92188C17.3438 4.92188 15.9705 4.6875 14.6576 4.6875C11.9166 4.6875 10.125 6.34875 10.125 9.35625V12H7.07812V15.4688H10.125V23.8542C11.3674 24.0486 12.6326 24.0486 13.875 23.8542V15.4688H16.6711Z" fill="white"/>
                </svg>
                <span>Facebook</span>
              </button>
            </div>
          </div>
          
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-primary hover:underline" tabIndex={0}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 