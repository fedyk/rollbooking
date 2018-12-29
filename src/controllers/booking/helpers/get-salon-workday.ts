import { BookingWorkday } from "../../../models/booking-workday";
import { dateToISODate } from "../../../helpers/booking-workday/date-to-iso-date";

export function getSelectedWorkday(workdays: BookingWorkday[], date?: Date): BookingWorkday {
  if (date instanceof Date && !isNaN(date.getTime())) {
    const isoDate = dateToISODate(date);

    for (let i = 0; i < workdays.length; i++) {
      const workday = workdays[i];

      if (dateToISODate(workday.period.start) === isoDate) {
        return workday;
      }
    }

    return null;
  }

  return workdays.length > 0 ? workdays[0] : null;
}
