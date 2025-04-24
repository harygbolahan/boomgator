import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { Layout } from "@/components/layout/Layout"
import { HomePage } from "@/pages/HomePage"
import { LoginPage } from "@/pages/LoginPage"
import { SignupPage } from "@/pages/SignupPage"
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
import { NotFoundPage } from "@/pages/NotFoundPage"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Protected route component
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const location = useLocation();
  
  if (!isLoggedIn) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
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
          <Route path="/instagram-viral-finder" element={<InstagramViralFinderPage />} />
          <Route path="/messenger-broadcast" element={<MessengerBroadcastPage />} />
          <Route path="/whatsapp-bot" element={<WhatsAppBotPage />} />
          <Route path="/payment-plans" element={<PaymentPlansPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
        
        {/* 404 Not Found */}
        <Route path="*" element={
          <ProtectedRoute>
            <NotFoundPage />
          </ProtectedRoute>
        } />
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
  )
}

export default App
