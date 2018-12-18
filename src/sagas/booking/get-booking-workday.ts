import { Salon } from "../../models/salon";
import { SalonUser } from "../../models/salon-user";
import { SalonService } from "../../models/salon-service";
import { SalonReservation } from "../../models/salon-reservation";
import { BookingWorkday, Masters, Period } from "../../models/booking-workday";
import { TimePeriod } from "../../models/time-period";
import { SpecialHourPeriod } from "../../models/special-hour-period";
import { DateRange } from "../../lib/date-range";
import { DayOfWeek } from "../../models/dat-of-week";
import { dateToISODate, minutesToTime } from "../../helpers/date";
import { addDay } from "../../utils/date";

interface Params {
  startPeriod: Date;
  endPeriod: Date;
  salon: Salon;
  salonMasters: SalonUser[];
  salonService: SalonService[];
  salonReservations: SalonReservation[];
}

export async function getBookingWorkday(params: Params): Promise<BookingWorkday> {
  const { salon } = params;

  const masters: Masters = {
    1: {
      services: {
        10: {
          available_times: [600, 660, 840]
        },
        11: {
          available_times: [600, 660, 840]
        }
      }
    },
    2: {
      services: {
        10: {
          available_times: [600, 660, 840]
        },
        11: {
          available_times: [600, 660, 840]
        }
      }
    }
  }

  return {
    period: {
      startDate: {
        year: 2018,
        month: 2,
        day: 1
      },
      startTime: 120,
      endDate: {
        year: 2018,
        month: 2,
        day: 1
      },
      endTime: 120 * 8
    },
    salon_id: salon.id,
    masters: masters
  }
}

export function getPeriods(start: Date, end: Date, periods: TimePeriod[], specialPeriods: SpecialHourPeriod[]): DateRange[] {
  const allPeriod = new DateRange(start, end);
  const periodsByStartDay = getGroupedPeriodsByDayOfWeek(periods);
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
  if (date.getDay() !== period.openDay) {
    throw new Error("date should have the same date as period");
  }

  const start = new Date(`${dateToISODate(date)}T${minutesToTime(period.openTime)}:00`);
  
  const endDate = new Date(date.getTime());

  if (period.openDay !== period.closeDay) {
    if (period.closeDay === DayOfWeek.SUNDAY) {
      endDate.setDate(endDate.getDate() + (7 - period.openDay));
    }
    else {
      endDate.setDate(endDate.getDate() + (period.closeDay - period.openDay));
    }
  }

  const end = new Date(`${dateToISODate(endDate)}T${minutesToTime(period.closeTime)}:00`);

  return new DateRange(start, end);
}
