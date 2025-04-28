import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names and resolves Tailwind CSS conflicts
 * @param {...string} inputs - Class names to combine
 * @returns {string} - Combined class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Utility functions for performance optimization

/**
 * Debounces a function call, delaying execution until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked.
 * @param {Function} func The function to debounce
 * @param {number} wait The number of milliseconds to delay
 * @return {Function} The debounced function
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttles a function to execute at most once per every wait milliseconds.
 * @param {Function} func The function to throttle
 * @param {number} wait The number of milliseconds to throttle invocations to
 * @return {Function} The throttled function
 */
export function throttle(func, wait = 300) {
  let waiting = false;
  return function (...args) {
    if (!waiting) {
      func.apply(this, args);
      waiting = true;
      setTimeout(() => {
        waiting = false;
      }, wait);
    }
  };
}

/**
 * Creates a memoized version of a function that caches its results.
 * @param {Function} fn The function to memoize
 * @return {Function} The memoized function
 */
export function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
} 