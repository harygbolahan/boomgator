import { useState, useEffect, memo } from "react";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { debounce } from "@/lib/utils";

/**
 * A debounced input component that delays updating the parent state until
 * the user has stopped typing for a specified delay time.
 */
export const DebouncedInput = memo(({
  value: initialValue,
  onChange,
  debounceTime = 300,
  type = "text",
  ...props
}) => {
  const [localValue, setLocalValue] = useState(initialValue);
  
  // Update local value when the parent value changes
  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);
  
  // Create a debounced function that only triggers the onChange after debounceTime
  const debouncedOnChange = debounce((value) => {
    onChange(value);
  }, debounceTime);
  
  // Handle input change
  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };
  
  return (
    <Input
      {...props}
      type={type}
      value={localValue}
      onChange={handleChange}
    />
  );
});

/**
 * A debounced textarea component that delays updating the parent state until
 * the user has stopped typing for a specified delay time.
 */
export const DebouncedTextarea = memo(({
  value: initialValue,
  onChange,
  debounceTime = 300,
  ...props
}) => {
  const [localValue, setLocalValue] = useState(initialValue);
  
  // Update local value when the parent value changes
  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);
  
  // Create a debounced function that only triggers the onChange after debounceTime
  const debouncedOnChange = debounce((value) => {
    onChange(value);
  }, debounceTime);
  
  // Handle input change
  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };
  
  return (
    <Textarea
      {...props}
      value={localValue}
      onChange={handleChange}
    />
  );
}); 