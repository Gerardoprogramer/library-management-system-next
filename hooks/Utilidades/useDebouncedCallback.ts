import { useCallback, useRef } from "react";

export function useDebouncedCallback<TArgs extends unknown[]>(callback: (...args: TArgs) => void, delay: number) {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: TArgs) => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }

      timeout.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}
