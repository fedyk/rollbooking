import { BookingWorkday } from "../../../models/booking-workday";

export function getSelectedWorkday(workdays: BookingWorkday[], date?: Date): BookingWorkday {
  if (date instanceof Date && !isNaN(date.getTime())) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    for (let i = 0; i < workdays.length; i++) {
      const workday = workdays[i];

      if (workday.period.startDate.year === year 
        && workday.period.startDate.month === month
        && workday.period.startDate.day === day) {
          return workday;
      }
    }

    return null;
  }

  return workdays.length > 0 ? workdays[0] : null;
}
