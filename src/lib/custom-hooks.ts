"use client"
import { toast } from "sonner";
import { useCallback, useEffect, useRef } from "react"
import { formattedDate, formattedTime } from "./utils";

export const useToast = (message: string) => {
    const now = new Date(Date.now());
    return toast(message, {
      description: `${formattedDate(now)} at ${formattedTime(now)}`,
      action: {
        label: "Close",
        onClick: () => toast.dismiss()
      },
    })
  }
  
  export function useTimeout(callback: () => void, delay: number) {
    const callbackRef = useRef(callback);
    const timeoutRef = useRef<number | undefined>(0);
  
    useEffect(() => {
      callbackRef.current = callback;
    }, [callback]);
  
    const set = useCallback(() => {
      timeoutRef.current = window.setTimeout(() => callbackRef.current(), delay);
    }, [delay]);
  
    const clear = useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }, []);
  
    useEffect(() => {
      set();
      return clear;
    }, [delay, set, clear]);
  
    const reset = useCallback(() => {
      clear();
      set();
    }, [clear, set]);
  
    return { reset, clear };
  }
  
  export function useDebounce(callback: () => void, delay: number, dependencies: any[]) {
    const { reset, clear } = useTimeout(callback, delay);
    useEffect(reset, [...dependencies, reset]);
    useEffect(clear, []);
  }