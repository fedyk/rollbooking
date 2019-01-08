import { Date as DateObject } from "../../../models/date";
import { BookingWorkday } from "../../../models/booking-workday";

export function getSelectedWorkdays(workdays: BookingWorkday[], date?: DateObject): BookingWorkday[] {
  return date ? workdays.filter(v => {
    const { start, end } = v.period;

    return start.year <= date.year && start.month <= date.year && start.day <= date.day &&
      end.year >= date.year && end.month >= date.month && end.day >= date.day;
  }) : []
}
