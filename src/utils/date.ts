/**
 * Add month to date
 * @param {Date} date
 * @param {number} days
 */
export function addDay(date, days = 1) {
  const clone = new Date(date.getTime());

  return clone.setDate(clone.getDate() + days), clone;
}

/**
 * Add month to date
 * @param {Date} date
 * @param {number} months
 */
export function addMonth(date, months) {
  const clone = new Date(date.getTime());

  return clone.setMonth(clone.getMonth() + months), clone;
}

export function parseDate(str): Date {
  const date = str ? new Date(str) : new Date();

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid data");
  }
  
  return date;
}

export function toDate(date: Date) {
  return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`;
}

export function toTime(date: Date) {
  return `${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
}

function padZero(num: number, size = 2): string {
  var s = '00' + num;

  return s.substr(s.length - size);
}