import * as React from "react";

const PopoverContext = React.createContext(null);

const Popover = React.forwardRef(({ children, open: controlledOpen, onOpenChange, ...props }, ref) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const popoverRef = React.useRef(null);
  
  // Support both controlled and uncontrolled modes
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  
  const handleOpenChange = React.useCallback((newOpen) => {
    if (!isControlled) {
      setUncontrolledOpen(newOpen);
    }
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  }, [isControlled, onOpenChange]);

  React.useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        handleOpenChange(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, handleOpenChange]);

  return (
    <PopoverContext.Provider value={{ open, setOpen: handleOpenChange }}>
      <div ref={(node) => {
        // Handle both refs
        if (ref) {
          if (typeof ref === 'function') ref(node);
          else ref.current = node;
        }
        popoverRef.current = node;
      }} className="relative" {...props}>
        {children}
      </div>
    </PopoverContext.Provider>
  );
});
Popover.displayName = "Popover";

const PopoverTrigger = React.forwardRef(({ className, asChild = false, children, ...props }, ref) => {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error("PopoverTrigger must be used within a Popover");
  }

  const { open, setOpen } = context;
  
  // If asChild is true, clone the child and pass the necessary props
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref,
      onClick: (e) => {
        children.props.onClick?.(e);
        setOpen(!open);
      },
      ...props
    });
  }

  return (
    <button
      ref={ref}
      type="button"
      className={className}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
    </button>
  );
});
PopoverTrigger.displayName = "PopoverTrigger";

const PopoverContent = React.forwardRef(({ className, align = "right", children, ...props }, ref) => {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error("PopoverContent must be used within a Popover");
  }

  const { open } = context;

  if (!open) return null;

  const alignClass = align === "right" ? "right-0" : "left-0";

  return (
    <div
      ref={ref}
      className={`absolute ${alignClass} top-full mt-1 z-50 rounded-md border bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-md outline-none ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  );
});
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent }; 