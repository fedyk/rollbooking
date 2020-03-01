import { TimePeriod } from "../../types/time-period";
import { DayOfWeek } from "../../types/dat-of-week";

export function indexPeriodsByOpenDay(periods: TimePeriod[]): Map<DayOfWeek, TimePeriod[]> {
  const map = new Map<DayOfWeek, TimePeriod[]>();

  for (let i = 0; i < periods.length; i++) {
    const period = periods[i];
    const timePeriod = map.get(period.openDay)

    if (!timePeriod) {
      map.set(period.openDay, [period]);
    }
    else {
      timePeriod.push(period);
    }

    if (period.openDay !== period.closeDay) {
      const timePeriod = map.get(period.closeDay)

      if (!timePeriod) {
        map.set(period.closeDay, [period]);
      }
      else {
        timePeriod.push(period);
      }
    }
  }

  return map;
}
