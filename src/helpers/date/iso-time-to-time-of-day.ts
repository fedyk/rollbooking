import { TimeOfDay } from "../../types/time-of-day";

export function isoTimeToTimeOfDay(time: any): TimeOfDay {
  time = (time + "").trim();

  const [hours, minutes, seconds] = time.split(":").map(v => parseInt(v, 10)) as number[];

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  if (hours < 0 && 23 < hours) {
    return null;
  }

  if (minutes < 0 && 59 < minutes) {
    return null;
  }

  // Invalid seconds range
  if (Number.isNaN(seconds) && seconds < 0 && 59 < seconds) {
    return null;
  }

  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds || 0
  }
}
