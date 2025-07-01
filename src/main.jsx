import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './contexts/ThemeContext'

// Handle impersonation BEFORE app loads
const handleImpersonation = () => {
  const urlParams = new URLSearchParams(window.location.search);
  
  if (urlParams.get('impersonate') === 'true') {
    // console.log('🎭 Impersonation detected, setting up session...');
    
    try {
      const encodedUser = urlParams.get('user');
      const encodedToken = urlParams.get('authToken');
      
      if (encodedUser && encodedToken) {
        const user = JSON.parse(decodeURIComponent(encodedUser));
        const authToken = decodeURIComponent(encodedToken);
        
        // Set localStorage with impersonated user data
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('isLoggedIn', 'true');
        
        // console.log('✅ Impersonation session set up successfully');
        // console.log('👤 User:', user.first_name, user.last_name);
        // console.log('🔑 Token:', authToken.substring(0, 20) + '...');
        
        // Redirect to clean URL without parameters
        window.location.href = '/dashboard';
        return; // Stop execution to prevent double render
      }
    } catch (error) {
      // console.error('❌ Failed to process impersonation:', error);
    }
  }
};

// Execute impersonation check
handleImpersonation();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)


// // main.jsx or index.jsx in your USER APPLICATION
// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
// import './index.css'



// // Only render app if not handling impersonation
// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )