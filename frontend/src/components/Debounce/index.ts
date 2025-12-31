import { useEffect, useState } from "react";

import type { UseDebounceOptions, UseDebounceReturn } from "./types";

export const useDebounce = <T>(
  value: T,
  options: UseDebounceOptions = {}
): UseDebounceReturn<T> => {
  const { delay = 500 } = options;
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    setIsDebouncing(true);
    const timer = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    return () => {
      clearTimeout(timer);
      setIsDebouncing(false);
    };
  }, [value, delay]);

  return { debouncedValue, isDebouncing };
};
