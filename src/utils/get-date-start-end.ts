/**
 * 
 * @param {Date} date
 */
interface IResult {
  start: Date;
  end: Date;
}

export function getDateStartEnd(date: Date): IResult {
  const start = new Date(date.getTime());
  const end = new Date(date.getTime());

  start.setHours(0, 0, 0, 0)
  end.setHours(24, 59, 59, 999)

  return {
    start, end
  }
}
