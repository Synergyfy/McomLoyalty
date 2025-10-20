// src/hooks/useFormPersistence.ts
import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";

/**
 * Persist form to localStorage under key.
 * Debounced to avoid perf issues.
 */
export default function useFormPersistence(key: string, methods: UseFormReturn<any>) {
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        methods.reset(JSON.parse(saved));
      }
    } catch (e) {
      // ignore parse issues
      console.warn("Failed to restore form from localStorage", e);
    }

    let timer: number | null = null;
    const subscription = methods.watch((value) => {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
          console.warn("Failed to persist form", e);
        }
      }, 400); // debounce 400ms
    });

    return () => {
      subscription.unsubscribe();
      if (timer) window.clearTimeout(timer);
    };
  }, [key, methods]);
}
