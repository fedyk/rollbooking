import { TimeOfDay } from "../../core/types/time-of-day";

export function nativeDateToTimeOfDay(date: Date): TimeOfDay {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return {
    hours,
    minutes,
    seconds
  };
}

