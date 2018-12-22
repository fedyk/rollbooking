export function minutesToTime(time: number): string {
  const hours = Math.round(time / 60).toString().padStart(2, "0");
  const minutes = (time % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}
