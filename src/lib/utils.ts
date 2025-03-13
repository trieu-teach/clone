import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const formattedDate = (Date:Date):string => Date.toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export const formattedTime = (Date:Date):string => Date.toLocaleTimeString("en-US", {
  hour: "numeric",
  minute: "numeric",
  hour12: true,
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
