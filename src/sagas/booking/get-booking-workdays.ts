import { BusinessHours, SpecialHours } from "../../types/salon";
import { BookingWorkday, Masters, Services } from "../../types/booking-workday";
import { TimePeriod } from "../../types/time-period";
import { DateRange } from "../../lib/date-range";
import { DayOfWeek } from "../../types/dat-of-week";
import { addDay } from "../../utils/date";
import { Date as DateObject } from "../../types/date";
import { dateObjectToNativeDate } from "../../helpers/date/date-object-to-native-date";
import { nativeDateToDateTime } from "../../helpers/date/native-date-to-date-time";
import { nativeDateToTimeOfDay } from "../../helpers/date/native-date-to-time-of-day";

interface Params {
  startPeriod: DateObject;
  endPeriod: DateObject;
  regularHours: BusinessHours;
  specialHours: SpecialHours;
  masters: Array<{
    id: string;
  }>;
  services: Array<{
    id: number;
    duration: number;
  }>;
  reservations: Array<{
    range: DateRange;
    masterId: string;
  }>;
  timezone?: string;
}

export function getBookingWorkdays(params: Params): BookingWorkday[] {
  const { regularHours, specialHours, startPeriod, endPeriod } = params;

  const ranges = getPeriods(startPeriod, endPeriod, regularHours, specialHours);

  const bookingWorkdays: BookingWorkday[] = [];

  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    const masters: Masters = {};

    for (let j = 0; j < params.masters.length; j++) {
      const master = params.masters[j];
      const masterReservations = params.reservations.filter(v => v.masterId === master.id);
      const masterReservationsRanges = masterReservations.map(v => v.range);

      const masterServices: Services = {}

      for (let z = 0; z < params.services.length; z++) {
        const salonService = params.services[z];

        const availableRanges = range.exclude(masterReservationsRanges);
        const serviceRanges = availableRanges.reduce(function(result, current) {
          const serviceDurationInMs = salonService.duration * 60 * 1000;
          const ranges = current.split(serviceDurationInMs, {
            round: true
          });

          // remove last result
          ranges.pop();

          return result.concat(ranges);
        }, ([] as Date[]));

        const availableTimes = serviceRanges.map(v => nativeDateToTimeOfDay(v))

        masterServices[salonService.id] = {
          availableTimes: availableTimes
        };
      }

      masters[master.id] = {
        services: masterServices
      }
    }

    bookingWorkdays.push({
      masters: masters,
      period: {
        start: nativeDateToDateTime(range.start),
        end: nativeDateToDateTime(range.end)
      }
    })
  }

  return bookingWorkdays;
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
