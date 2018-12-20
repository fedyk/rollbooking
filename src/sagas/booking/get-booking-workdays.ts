import { Salon, BusinessHours, SpecialHours } from "../../models/salon";
import { SalonUser } from "../../models/salon-user";
import { SalonReservation } from "../../models/salon-reservation";
import { BookingWorkday, Masters, Period, Services } from "../../models/booking-workday";
import { TimePeriod } from "../../models/time-period";
import { SpecialHourPeriod } from "../../models/special-hour-period";
import { DateRange } from "../../lib/date-range";
import { DayOfWeek } from "../../models/dat-of-week";
import { dateToISODate, minutesToTime } from "../../helpers/date";
import { addDay } from "../../utils/date";
import { workdayISODate } from "../../helpers/booking-workday/date-to-iso-date";
import { minutesInDay } from "../../helpers/date/minutes-in-day";
import { nativeDateToDateObject } from "../../helpers/date/native-date-to-date-object";

interface Params {
  salonId: number;
  salonRegularHours: BusinessHours;
  salonSpecialHours: SpecialHours;
  startPeriod: Date;
  endPeriod: Date;
  salonMasters: Array<{
    id: number;
  }>;
  salonServices: Array<{
    id: number;
    duration: number;
  }>;
  reservations: SalonReservation[];
}

export function getBookingWorkdays(params: Params): BookingWorkday[] {
  const { salonId, salonRegularHours, salonSpecialHours, startPeriod, endPeriod, salonMasters, salonServices, reservations } = params;
  const ranges = getPeriods(startPeriod, endPeriod, salonRegularHours, salonSpecialHours);
  const bookingWorkdays: BookingWorkday[] = [];  

  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    const masters: Masters = {};

    for (let j = 0; j < salonMasters.length; j++) {
      const salonMaster = salonMasters[j];
      const masterReservations = reservations.filter(v => v.master_id === salonMaster.id);

      const masterReservationsRanges = masterReservations.map(v => {
        const start = new Date(`${workdayISODate(v.start_date)}T${minutesToTime(v.start_time)}:00.00Z`);
        const end = new Date(`${workdayISODate(v.end_date)}T${minutesToTime(v.end_time)}:00.00Z`);
        return new DateRange(start, end);
      })

      const masterServices: Services = {}
  
      for (let z = 0; z < salonServices.length; z++) {
        const salonService = salonServices[z];

        const availableRanges = range.exclude(masterReservationsRanges);
        const serviceRanges = availableRanges.reduce(function(result, current) {
          const serviceDurationInMs = salonService.duration * 60 * 1000;

          return result.concat(current.split(serviceDurationInMs, {
            round: false
          }))
        }, ([] as Date[]));

        console.log(serviceRanges)

        const availableTimes = serviceRanges.map(function(date) {
          return minutesInDay(date);
        });

        masterServices[salonService.id] = {
          available_times: availableTimes
        };
      }

      masters[salonMaster.id] = {
        services: masterServices
      }
    }

    bookingWorkdays.push({
      salon_id: salonId,
      masters: masters,
      period: {
        startDate: nativeDateToDateObject(range.start),
        startTime: minutesInDay(range.start),
        endDate: nativeDateToDateObject(range.end),
        endTime: minutesInDay(range.end)
      }
    })
  }

  return bookingWorkdays;
}

export function getPeriods(start: Date, end: Date, salonRegularHours: BusinessHours, salonSpecialHours: SpecialHours): DateRange[] {
  const allPeriod = new DateRange(start, end);
  const periodsByStartDay = getGroupedPeriodsByDayOfWeek(salonRegularHours.periods);
  const ranges = [];
  
  let curr = new Date(start.getTime());

  while(curr.getTime() <= end.getTime()) {
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
    
  }

  return map;
}


export function getDateRangeFromPeriod(date: Date, period: TimePeriod): DateRange {
  if (period.openDay !== DayOfWeek.DAY_OF_WEEK_UNSPECIFIED && date.getDay() !== period.openDay) {
    throw new Error("date should have the same date as period");
  }

  const startTime = `${dateToISODate(date)}T${minutesToTime(period.openTime)}:00.00Z`;
  const start = new Date(startTime);
  
  const endDate = new Date(date.getTime());

  if (period.openDay !== period.closeDay) {
    if (period.closeDay === DayOfWeek.SUNDAY) {
      endDate.setDate(endDate.getDate() + (7 - period.openDay));
    }
    else {
      endDate.setDate(endDate.getDate() + (period.closeDay - period.openDay));
    }
  }

  const end = new Date(`${dateToISODate(endDate)}T${minutesToTime(period.closeTime)}:00.00Z`);

  return new DateRange(start, end);
}
