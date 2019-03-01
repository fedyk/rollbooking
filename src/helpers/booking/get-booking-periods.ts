import { addDay } from "../../utils/date";
import { DateRange } from "../../lib/date-range";
import { DayOfWeek } from "../../models/dat-of-week";
import { Date as DateObject } from "../../models/date";
import { BusinessHours, SpecialHours } from "../../models/salon";
import { dateObjectToNativeDate } from "../date/date-object-to-native-date";
import { indexPeriodsByOpenDay } from "./index-periods-by-open-day";
import { getDateRangeFromPeriod } from "./get-date-range-from-period";

export function getBookingPeriods(
  start: DateObject,
  end: DateObject,
  regularHours: BusinessHours,
  specialHours: SpecialHours
): DateRange[] {
  const startDate = dateObjectToNativeDate(start);
  const endDate = dateObjectToNativeDate(end);

  endDate.setHours(23);
  endDate.setMinutes(59);
  endDate.setSeconds(59);
  endDate.setMilliseconds(999);

  const allPeriod = new DateRange(startDate, endDate);

  const periodsByStartDay = indexPeriodsByOpenDay(regularHours.periods);
  const ranges = [];

  let curr = new Date(startDate.getTime());

  while (curr.getTime() <= endDate.getTime()) {
    const currDayOfWeek = curr.getDay() as DayOfWeek;

    if (periodsByStartDay.has(currDayOfWeek)) {
      ranges.push(...periodsByStartDay.get(currDayOfWeek).map(period => getDateRangeFromPeriod(curr, period)));
    }

    if (periodsByStartDay.has(DayOfWeek.DAY_OF_WEEK_UNSPECIFIED)) {
      ranges.push(...periodsByStartDay.get(DayOfWeek.DAY_OF_WEEK_UNSPECIFIED).map(period => getDateRangeFromPeriod(curr, period)));
    }

    curr = addDay(curr, 1);
  }

  const mergedRanges = DateRange.merge(ranges);

  return mergedRanges
    .filter(range => range.isOverlap(allPeriod))
    .map(range => DateRange.intersection(range, allPeriod));
}
