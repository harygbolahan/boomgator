import { SubscriptionWrapper } from './SubscriptionWrapper';

/**
 * Higher-order component to wrap a component with subscription check
 * @param {React.ComponentType} Component - The component to wrap
 * @param {number|string} requiredService - Service ID or name to check for subscription
 * @param {boolean} displayUpgradePrompt - Whether to show the upgrade prompt UI
 * @returns {React.ComponentType} - Wrapped component with subscription check
 */
export function withSubscription(
  Component,
  requiredService,
  displayUpgradePrompt = true
) {
  // Return a new component that wraps the original with SubscriptionWrapper
  const WithSubscriptionComponent = (props) => {
    return (
      <SubscriptionWrapper
        requiredService={requiredService}
        displayUpgradePrompt={displayUpgradePrompt}
      >
        <Component {...props} />
      </SubscriptionWrapper>
    );
  };

  // Set display name for better debugging
  const wrappedComponentName = Component.displayName || Component.name || 'Component';
  WithSubscriptionComponent.displayName = `withSubscription(${wrappedComponentName})`;

  return WithSubscriptionComponent;
}

export default withSubscription; 