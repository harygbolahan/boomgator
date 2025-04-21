import * as React from "react";

const Progress = React.forwardRef(({ className, value, ...props }, ref) => {
  const [progress, setProgress] = React.useState(value || 0);

  React.useEffect(() => {
    setProgress(value || 0);
  }, [value]);

  return (
    <div
      ref={ref}
      className={`relative h-4 w-full overflow-hidden rounded-full bg-secondary ${className}`}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (progress || 0)}%)` }}
      />
    </div>
  );
});
Progress.displayName = "Progress";

export { Progress }; 