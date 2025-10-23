import { useEffect, useState } from "react";

// 🔹 Debounce hook
export const useDebounce = (value: string, delay: number = 500) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
};