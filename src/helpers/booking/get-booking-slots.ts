import { addDay } from "../../utils/date";
import { DateRange } from "../../lib/date-range";
import { DateTime } from "../../base/types/date-time";
import { DayOfWeek } from "../../base/types/dat-of-week";
import { TimePeriod } from "../../base/types/time-period";
import { Date as DateObject } from "../../base/types/date";
import { BusinessHours, SpecialHours } from "../../base/types/salon";
import { nativeDateToDateTime } from "../date/native-date-to-date-time";
import { dateObjectToNativeDate } from "../date/date-object-to-native-date";

export interface Params {
  startPeriod: DateObject;
  endPeriod: DateObject;
  regularHours: BusinessHours;
  specialHours: SpecialHours;
  users: Array<{
    id: string;
  }>;
  services: Array<{
    id: number;
    duration: number;
  }>;
  reservations: {
    range: DateRange;
    userId: string;
  }[];
}

export interface Slot {
  start: DateTime;
  end: DateTime;
  userId: string;
  serviceId: number;
}

export function getBookingSlots({ regularHours, specialHours, startPeriod, endPeriod, users, reservations, services }: Params): Slot[] {
  const ranges = getPeriods(startPeriod, endPeriod, regularHours, specialHours);
  const slots: Slot[] = [];
  const usersReservedRanges = new Map<string, DateRange[]>();

  reservations.forEach(reservation => {
    if (!usersReservedRanges.has(reservation.userId)) {
      usersReservedRanges.set(reservation.userId, [reservation.range]);
    }
    else {
      usersReservedRanges.get(reservation.userId).push(reservation.range);
    }
  });

  ranges.forEach(range => {
    users.forEach(user => {
      const reservedRanges = usersReservedRanges.has(user.id) ? usersReservedRanges.get(user.id) : [];

      services.forEach(service => {
        const availableRanges = range.exclude(reservedRanges);
        const serviceDurationInMs = service.duration * 60 * 1000;

        availableRanges.forEach(function (availableRange) {
          const times = availableRange.split(serviceDurationInMs, {
            round: true
          });

          // remove last result
          times.pop();

          times.forEach(time => {
            const start = nativeDateToDateTime(time);
            time.setTime(time.getTime() + serviceDurationInMs);
            const end = nativeDateToDateTime(time);

            slots.push({
              start,
              end,
              userId: user.id,
              serviceId: service.id
            })
          })
        });
      })
    })
  })

  return slots;
}

export function getPeriods(
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

  const periodsByStartDay = getGroupedPeriodsByDayOfWeek(regularHours.periods);
  const ranges = [];

  let curr = new Date(startDate.getTime());

  while (curr.getTime() <= endDate.getTime()) {
    const currDayOfWeek = curr.getDay() as DayOfWeek;

    if (periodsByStartDay.has(currDayOfWeek)) {
      ranges.push(...periodsByStartDay.get(currDayOfWeek).map(period => {
        return getDateRangeFromPeriod(curr, period)
      }))
    }

    if (periodsByStartDay.has(DayOfWeek.DAY_OF_WEEK_UNSPECIFIED)) {
      ranges.push(...periodsByStartDay.get(DayOfWeek.DAY_OF_WEEK_UNSPECIFIED).map(period => {
        return getDateRangeFromPeriod(curr, period);
      }))
    }

    curr = addDay(curr, 1);
  }

  const mergedRanges = DateRange.merge(ranges);

  return mergedRanges
    .filter(range => range.isOverlap(allPeriod))
    .map(range => DateRange.intersection(range, allPeriod));
}

export function getGroupedPeriodsByDayOfWeek(periods: TimePeriod[]): Map<DayOfWeek, TimePeriod[]> {
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
