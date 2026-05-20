"use client";
import { useState, useEffect, Dispatch } from "react";
import { z } from "zod";

export function useLocalStorage<S extends z.ZodTypeAny>(key: string, schema: S, initialValue: z.infer<S> | null): [z.infer<S>, Dispatch<React.SetStateAction<z.infer<S>>>] {

  const [storedValue, setStoredValue] = useState<z.infer<S> | null>(() => {

    if (typeof window === "undefined" || !schema) {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);

      if (!item) {
        return initialValue
      }

      const parsed = JSON.parse(item)
      console.log(schema)
      const result = schema.safeParse(parsed);

      if (!result.success) {
        throw result.error;

      }

      return result.data;

    } catch (error) {
      console.error(`Error reading from localStoragee key [${key}]:`, error);
      return initialValue;

    }
  });


  useEffect(() => {
    try {

      const result = schema.safeParse(storedValue);

      if (!result.success) {
        throw result.error;

      }

      window.localStorage.setItem(key, JSON.stringify(storedValue));

    } catch (error) {
      console.error(`Error writing to localStorage key [${key}]:`, error);

    }
  }, [key, storedValue, schema]);

  return [storedValue, setStoredValue];
}