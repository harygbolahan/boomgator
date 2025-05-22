import * as React from "react";

const TooltipContext = React.createContext(null);

const Tooltip = React.forwardRef(({ children, ...props }, ref) => {
  const [open, setOpen] = React.useState(false);
  const tooltipRef = React.useRef(null);

  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div ref={tooltipRef} className="relative inline-block" {...props}>
        {children}
      </div>
    </TooltipContext.Provider>
  );
});
Tooltip.displayName = "Tooltip";

const TooltipTrigger = React.forwardRef(({ className, asChild = false, children, ...props }, ref) => {
  const context = React.useContext(TooltipContext);
  if (!context) {
    throw new Error("TooltipTrigger must be used within a Tooltip");
  }

  const { setOpen } = context;

  return (
    <div
      ref={ref}
      className={className}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      {...props}
    >
      {children}
    </div>
  );
});
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef(({ className, side = "top", children, ...props }, ref) => {
  const context = React.useContext(TooltipContext);
  if (!context) {
    throw new Error("TooltipContent must be used within a Tooltip");
  }

  const { open } = context;

  if (!open) return null;

  // Position styles based on side
  const positionStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-1",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-1",
    left: "right-full top-1/2 -translate-y-1/2 mr-1",
    right: "left-full top-1/2 -translate-y-1/2 ml-1"
  };

  const arrowStyles = {
    top: "bottom-[-4px] left-1/2 -translate-x-1/2 border-t-gray-200 border-l-transparent border-r-transparent",
    bottom: "top-[-4px] left-1/2 -translate-x-1/2 border-b-gray-200 border-l-transparent border-r-transparent rotate-180",
    left: "right-[-4px] top-1/2 -translate-y-1/2 border-l-gray-200 border-t-transparent border-b-transparent -rotate-90",
    right: "left-[-4px] top-1/2 -translate-y-1/2 border-r-gray-200 border-t-transparent border-b-transparent rotate-90"
  };

  return (
    <div
      ref={ref}
      className={`absolute z-50 w-max rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-3 py-1.5 text-sm shadow-md animate-in fade-in-0 zoom-in-95 ${positionStyles[side]} ${className || ""}`}
      {...props}
    >
      <div className={`absolute w-2 h-2 border-4 border-solid ${arrowStyles[side]}`} />
      {children}
    </div>
  );
});
TooltipContent.displayName = "TooltipContent";

const TooltipProvider = ({ children }) => {
  return <>{children}</>;
};

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }; 