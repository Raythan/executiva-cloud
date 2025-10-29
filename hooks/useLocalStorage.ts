// FIX: Import Dispatch and SetStateAction to correctly type the hook's return value without needing the 'React' namespace.
import { useState, useEffect, Dispatch, SetStateAction } from 'react';

// FIX: Corrected generic type parameter syntax from <T,> to <T>.
function getValue<T>(key: string, initialValue: T | (() => T)): T {
  const savedValue = localStorage.getItem(key);
  if (savedValue) {
    try {
        return JSON.parse(savedValue);
    } catch (error) {
        console.error("Error parsing JSON from localStorage", error);
        localStorage.removeItem(key); // Remove corrupted data
    }
  }
  
  if (initialValue instanceof Function) {
    return initialValue();
  }
  return initialValue;
}

// FIX: Corrected generic type parameter syntax and updated return type to use imported Dispatch and SetStateAction, resolving the "Cannot find namespace 'React'" error.
export function useLocalStorage<T>(key: string, initialValue: T | (() => T)): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    return getValue(key, initialValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
