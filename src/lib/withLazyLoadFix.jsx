import { memo } from 'react';

/**
 * Higher-order component to help with lazy loading compatibility in React 19
 * Ensures proper memoization and handles issues with circular references
 * 
 * @param {React.ComponentType} Component - The component to wrap
 * @param {string} displayName - The display name for the component
 * @returns {React.ComponentType} - The wrapped component
 */
function withLazyLoadFix(Component, displayName) {
  // The wrapper component ensures we have a clean props reference
  const WrappedComponent = (props) => {
    return <Component {...props} />;
  };

  // Set a useful display name for debugging
  WrappedComponent.displayName = displayName || `LazyLoad(${Component.displayName || Component.name || 'Component'})`;
  
  // Memoize the wrapped component to prevent unnecessary re-renders
  return memo(WrappedComponent);
}

export default withLazyLoadFix; 