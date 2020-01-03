import { TimeOfDay } from "../../base/types/time-of-day";

export function timeOfDayToISOTime(time: TimeOfDay): string {
  const hours = time.hours.toString().padStart(2, "0");
  const minutes = time.minutes.toString().padStart(2, "0");
  const seconds = time.seconds.toString().padStart(2, "0");

  let isoTime = `${hours}:${minutes}`;

  if (seconds !== "00") {
    isoTime += `:${seconds}`;
  }

  return isoTime
}
