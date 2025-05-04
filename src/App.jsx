import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider, useAuth } from "@/contexts/AuthContext"
import { DashboardProvider } from "@/contexts/DashboardContext"
import ErrorBoundary from "@/components/ErrorBoundary"

// Import components directly instead of using lazy loading
import Layout from "@/components/layout/Layout"
import { HomePage } from "@/pages/HomePage"
import { Login } from "@/pages/auth/Login"
import { Register } from "@/pages/auth/Register"
import { ForgotPassword } from "@/pages/auth/ForgotPassword"
import { DashboardPage } from "@/pages/DashboardPage"
import { AutomationPage } from "@/pages/AutomationPage"
import { CalendarPage } from "@/pages/CalendarPage"
import { AnalyticsPage } from "@/pages/AnalyticsPage"
import { IntegrationsPage } from "@/pages/IntegrationsPage"
import { AccountPage } from "@/pages/AccountPage"
import { SupportPage } from "@/pages/SupportPage"
import { SocialHubPage } from "@/pages/SocialHubPage"
import { SetupGuidePage } from "@/pages/SetupGuidePage"
import { InstagramViralFinderPage } from "@/pages/InstagramViralFinder"
import { MessengerBroadcastPage } from "@/pages/MessengerBroadcastPage"
import { WhatsAppBotPage } from "@/pages/WhatsAppBotPage"
import { PaymentPlansPage } from "@/pages/PaymentPlansPage"
import { NotificationsPage } from "@/pages/NotificationsPage"
import { ContentSchedulerPage } from "@/pages/ContentSchedulerPage"
import { AIContentCreatorPage } from "@/pages/AIContentCreatorPage"
import { NotFoundPage } from "@/pages/NotFoundPage"
import Enhancements from "@/pages/Enhancements"
import CommentAutomationPage from "@/pages/CommentAutomationPage"
import LiveChatPage from "@/pages/LiveChatPage"
import AdCommentsPage from "@/pages/AdCommentsPage"
import CaptionGeneratorPage from "@/pages/CaptionGeneratorPage"

// Protected route component with memoization
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()
  
  // Show loading state while auth is initializing
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin text-primary border-2 border-current border-t-transparent rounded-full"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }
  
  return children
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DashboardProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              
              {/* Auth Routes */}
              <Route path="/auth">
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
              </Route>
              
              {/* Redirect old routes to new auth routes */}
              <Route path="/login" element={<Navigate to="/auth/login" replace />} />
              <Route path="/signup" element={<Navigate to="/auth/register" replace />} />
              
              {/* Setup Guide Route */}
              <Route path="/setup-guide" element={
                <ProtectedRoute>
                  <SetupGuidePage />
                </ProtectedRoute>
              } />
              
              {/* Protected routes */}
              <Route element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/automation" element={<AutomationPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/integrations" element={<IntegrationsPage />} />
                <Route path="/social-hub" element={<SocialHubPage />} />
                <Route path="/content-scheduler" element={<ContentSchedulerPage />} />
                <Route path="/ai-content-creator" element={<AIContentCreatorPage />} />
                <Route path="/instagram-viral-finder" element={<InstagramViralFinderPage />} />
                <Route path="/messenger-broadcast" element={<MessengerBroadcastPage />} />
                <Route path="/whatsapp-bot" element={<WhatsAppBotPage />} />
                <Route path="/payment-plans" element={<PaymentPlansPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/enhancements" element={<Enhancements />} />
                
                {/* New Enhancement Pages */}
                <Route path="/comment-automation" element={<CommentAutomationPage />} />
                <Route path="/live-chat" element={<LiveChatPage />} />
                <Route path="/ad-comments" element={<AdCommentsPage />} />
                <Route path="/caption-generator" element={<CaptionGeneratorPage />} />
              </Route>
              
              {/* 404 Not Found */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            
            <ToastContainer 
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </BrowserRouter>
        </DashboardProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
