import { useEffect, useState } from 'react';

/**
 * Debounces a value by the specified delay.
 *
 * Returns a debounced version of the input value that only updates
 * after the user has stopped changing it for `delay` milliseconds.
 *
 * @param value - The value to debounce
 * @param delay - Debounce delay in milliseconds (default: 200ms)
 * @returns The debounced value
 *
 * @example
 * ```tsx
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 200);
 * // debouncedSearch updates 200ms after user stops typing
 * ```
 */
export function useDebounce<T>(value: T, delay = 200): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}