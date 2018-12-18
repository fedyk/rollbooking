export function minutesToTime(time: number): string {
  const hours = Math.round(time / 60).toString().padStart(2, "0");
  const minutes = (time % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}

// Date -> YYYY-MM-DD
export function dateToISODate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  
  return `${year}-${month}-${day}`;
}
