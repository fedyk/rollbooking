export function parseTime(
  time: string
): {
  hours: number;
  minutes: number;
  seconds: number;
} {
  if (!time) {
    return null;
  }

  const [hoursString, minutesString, secondsString] = time.split(":");
  let hours = hoursString ? parseInt(hoursString, 10) : null;
  let minutes = minutesString ? parseInt(minutesString, 10) : null;
  let seconds = secondsString ? parseInt(secondsString, 10) : null;

  if (Number.isNaN(hours)) {
    return null;
  }

  if (Number.isNaN(minutes)) {
    return null;
  }

  if (Number.isNaN(seconds)) {
    seconds = 0;
  }

  return {
    hours,
    minutes,
    seconds
  };
}
