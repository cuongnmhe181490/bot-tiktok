"use client";

import * as React from "react";

export function useLocalDraft<T>(key: string, initialValue: T) {
  const [value, setValue] = React.useState<T>(initialValue);
  const hydratedRef = React.useRef(false);

  React.useEffect(() => {
    const raw = window.localStorage.getItem(key);
    if (raw) {
      try {
        setValue(JSON.parse(raw) as T);
      } catch {
        setValue(initialValue);
      }
    }
    hydratedRef.current = true;
  }, [initialValue, key]);

  React.useEffect(() => {
    if (!hydratedRef.current) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  const reset = React.useCallback(() => {
    window.localStorage.removeItem(key);
    setValue(initialValue);
  }, [initialValue, key]);

  return { value, setValue, reset };
}
