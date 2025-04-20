import * as React from "react";

const PopoverContext = React.createContext(null);

const Popover = React.forwardRef(({ children, ...props }, ref) => {
  const [open, setOpen] = React.useState(false);
  const popoverRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
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