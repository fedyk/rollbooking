import { Date as DateObject } from "../../../models/date";
import { BookingWorkday } from "../../../models/booking-workday";

export function getSelectedWorkday(workdays: BookingWorkday[], date?: DateObject): BookingWorkday {
  if (date) {
    for (let i = 0; i < workdays.length; i++) {
      const workday = workdays[i];
      const { start } = workday.period;

      if (start.year === date.year && start.month === date.month && start.day === date.day) {
        return workday;
      }
    }

    return null;
  }

  return workdays.length > 0 ? workdays[0] : null;
}
