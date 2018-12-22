import { minutesInDay } from "./minutes-in-day";

export function timeInDay(date: Date): string {
  const minutes = minutesInDay(date);
  let h = Math.floor(minutes / 60);
  let m = Math.floor(minutes % 60);
 
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

