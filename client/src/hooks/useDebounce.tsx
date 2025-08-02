import { useEffect, useState } from "react";

/**
 * Debounce a changing value by `delay` ms
 *
 * @param value - Any state value (string, object, etc.)
 * @param delay - Milliseconds to wait
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    // Clear previous timeout if value changes
    const timeout = setTimeout(() => setDebounced(value), delay);
    // Cleanup function to clear the timeout if the component unmounts or value changes
    return () => clearTimeout(timeout);
  }, [value, delay]);


  
  // Return the debounced value
  return debounced;
}
