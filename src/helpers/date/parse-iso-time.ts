import { TimeOfDay } from "../../types/time-of-day";
import { throws } from "assert";

export function parseISOTime(time: string): TimeOfDay {
  if (typeof time !== "string") {
    throw new RangeError("Invalid time passed")
  }

  const parts = time.split(":")
  const hours = Number(parts[0] ?? 0)
  const minutes = Number(parts[1] ?? 0)
  const seconds = Number(parts[2] ?? 0)

  return {
    hours,
    minutes,
    seconds
  }
}
