import { TimePeriod } from "../../models/time-period";
import { DayOfWeek } from "../../models/dat-of-week";

export function indexPeriodsByOpenDay(periods: TimePeriod[]): Map<DayOfWeek, TimePeriod[]> {
  const map = new Map<DayOfWeek, TimePeriod[]>();

  for (let i = 0; i < periods.length; i++) {
    const period = periods[i];

    if (!map.has(period.openDay)) {
      map.set(period.openDay, [period]);
    }
    else {
      map.get(period.openDay).push(period);
    }

    if (period.openDay !== period.closeDay) {
      if (!map.has(period.closeDay)) {
        map.set(period.closeDay, [period]);
      }
      else {
        map.get(period.closeDay).push(period);
      }
    }
  }

  return map;
}
