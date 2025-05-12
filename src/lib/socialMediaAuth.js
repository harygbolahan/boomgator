// Function to initialize the Facebook SDK
export const initFacebookSdk = () => {
  return new Promise((resolve, reject) => {
    // Load the Facebook SDK script
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: import.meta.env.VITE_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0'  // Use the latest stable version
      });
      
      resolve();
    };

    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); 
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  });
};

// Helper function to check login status
export const getFacebookLoginStatus = () => {
  return new Promise((resolve, reject) => {
    window.FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        resolve(response);
      } else {
        reject(new Error('User not connected to Facebook'));
      }
    });
  });
};

// Helper function to handle Facebook login
export const loginWithFacebook = () => {
  return new Promise((resolve, reject) => {
    window.FB.login(function(response) {
      if (response.status === 'connected') {
        resolve(response);
      } else {
        reject(new Error('Facebook login failed'));
      }
    }, { scope: 'public_profile,email,pages_show_list,pages_messaging,pages_manage_posts' });
  });
};