import { BookingWorkday } from "../../../models/booking-workday";

export function getSelectedWorkday(workdays: BookingWorkday[], date?: Date) {
  if (date instanceof Date && !isNaN(date.getTime())) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDay();

    return workdays.find(workday => workday.year === year && workday.month === month && workday.day === day);
  }

  return workdays.length > 0 ? workdays[0] : null;
}
