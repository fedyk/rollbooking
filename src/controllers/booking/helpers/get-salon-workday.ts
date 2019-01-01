import { BookingWorkday } from "../../../models/booking-workday";
import { dateToISODate } from "../../../helpers/booking-workday/date-to-iso-date";
import { Date } from "../../../models/date";

export function getSelectedWorkday(workdays: BookingWorkday[], date?: Date): BookingWorkday {
  if (date instanceof Date && !isNaN(date.getTime())) {
    for (let i = 0; i < workdays.length; i++) {
      const workday = workdays[i];
      const { start, end } = workday.period;

      if (start.year === date.year && start.month === date.month && start.day === date.day) {
        return workday;
      }
    }

    return null;
  }

  return workdays.length > 0 ? workdays[0] : null;
}
