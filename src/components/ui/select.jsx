import * as React from "react";

const SelectContext = React.createContext(null);

const Select = React.forwardRef(({ children, value, defaultValue, onValueChange, disabled, ...props }, ref) => {
  const [selectedValue, setSelectedValue] = React.useState(value || defaultValue || "");
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleValueChange = React.useCallback((newValue) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
    setOpen(false);
  }, [onValueChange]);

  const handleToggle = React.useCallback((isOpen) => {
    setOpen(isOpen);
  }, []);

  return (
    <SelectContext.Provider 
      value={{ 
        value: selectedValue, 
        onValueChange: handleValueChange,
        disabled,
        open,
        onToggle: handleToggle
      }}
    >
      <div ref={ref} {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  );
});
Select.displayName = "Select";

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("SelectTrigger must be used within a Select");
  }

  return (
    <button
      ref={ref}
      type="button"
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
      disabled={context.disabled}
      onClick={() => context.onToggle?.(!context.open)}
      aria-expanded={context.open}
      aria-label="Select option"
      {...props}
    >
      {children || <SelectValue />}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={`ml-2 h-4 w-4 opacity-50 transition-transform ${context.open ? 'rotate-180' : ''}`}
      >
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = React.forwardRef(({ children, className, placeholder, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("SelectValue must be used within a Select");
  }

  const displayValue = children || context.value || placeholder || "Select an option";
  return (
    <span 
      ref={ref}
      className={`flex-1 text-left ${!context.value && "text-muted-foreground"} ${className || ""}`}
      {...props}
    >
      {displayValue}
    </span>
  );
});
SelectValue.displayName = "SelectValue";

const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("SelectContent must be used within a Select");
  }

  if (!context.open) return null;

  return (
    <div
      ref={ref}
      className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 ${className || ""}`}
      {...props}
    >
      <div className="w-full p-1">
        {children}
      </div>
    </div>
  );
});
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef(({ className, children, value, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("SelectItem must be used within a Select");
  }

  const isSelected = context.value === value;

  return (
    <div
      ref={ref}
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground ${isSelected ? "bg-accent" : ""} ${className || ""}`}
      onClick={() => {
        if (!props.disabled) {
          context.onValueChange(value);
        }
      }}
      tabIndex="0"
      role="option"
      aria-selected={isSelected}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!props.disabled) {
            context.onValueChange(value);
          }
        }
      }}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="h-4 w-4"
          >
            <path d="M20 6 9 17l-5-5"/>
          </svg>
        )}
      </span>
      {children || value}
    </div>
  );
});
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }; 