export function nativeDateToTime(date: Date): string {
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");

  return `${hour}:${minute}`;
}
