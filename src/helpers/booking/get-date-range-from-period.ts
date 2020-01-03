import { DateRange } from "../../lib/date-range";
import { DayOfWeek } from "../../base/types/dat-of-week";
import { TimePeriod } from "../../base/types/time-period";

export function getDateRangeFromPeriod(date: Date, period: TimePeriod): DateRange {
  const day = date.getDay();

  if (period.openDay !== DayOfWeek.DAY_OF_WEEK_UNSPECIFIED) {
    if (day !== period.openDay && day !== period.closeDay) {
      throw new Error("date should have the same date as period");  
    }
  }

  const start = new Date(date.getTime());

  if (period.openDay !== DayOfWeek.DAY_OF_WEEK_UNSPECIFIED) {
    let diff = day - period.openDay;

    if (day === DayOfWeek.SUNDAY && period.openDay === DayOfWeek.SATURDAY) {
      diff = 1;
    }

    if (day === DayOfWeek.SUNDAY && period.openDay === DayOfWeek.MONDAY) {
      throw new Error("The period is out of range of the date");
    }
    
    start.setDate(start.getDate() - diff);
  }

  start.setHours(period.openTime.hours);
  start.setMinutes(period.openTime.minutes);
  start.setSeconds(0)
  start.setMilliseconds(0)

  const end = new Date(date.getTime());

  if (period.closeDay !== DayOfWeek.DAY_OF_WEEK_UNSPECIFIED) {
    let diff = period.closeDay - day;

    if (day === DayOfWeek.SATURDAY && period.closeDay === DayOfWeek.SUNDAY) {
      diff = 1;
    }

    end.setDate(end.getDate() + diff);
  }

  end.setHours(period.closeTime.hours);
  end.setMinutes(period.closeTime.minutes);
  end.setSeconds(0)
  end.setMilliseconds(0)

  return new DateRange(start, end);
}
