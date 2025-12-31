export interface UseDebounceOptions {
  delay?: number;
}

export interface UseDebounceReturn<T> {
  debouncedValue: T;
  isDebouncing: boolean;
}
