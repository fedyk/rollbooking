import Debug from "debug"
import * as DateFNS from "date-fns"
import * as tz from "timezone-support"
import { Business } from "../accounts";
import { Reservation, DayOfWeek, DateTime } from "../types";
import { Slot } from "./types";
import { BusinessHours } from "../types/salon";
import { TimePeriod } from "../types/time-period";

export class Booking {
  store: Map<string, BusinessBooking>

  constructor() {
    this.store = new Map()
  }
}

export class BusinessBooking {
  business: Business
  timezone: ReturnType<typeof tz.findTimeZone>
  usersReservations: Map<string, Reservation[]>

  constructor(business: Business) {
    this.business = business
    this.timezone = tz.findTimeZone(business.timezone)
    this.usersReservations = new Map()
  }

  dispose() {
    this.usersReservations.clear()
  }

  addUserReservations(userId: string, reservations: Reservation[]) {
    const userReservations = this.usersReservations.get(userId)

    if (userReservations) {
      userReservations.push(...reservations)
    }
    else {
      this.usersReservations.set(userId, reservations)
    }
  }

  getNearestSlots(): Slot[] {
    const start = tz.getZonedTime(new Date(), this.timezone);
    const end = tz.getZonedTime(DateFNS.addDays(new Date, 31), this.timezone);
    const services = this.business.services.map(s => ({
      id: s.id,
      duration: s.duration
    }))

    const periodRanges = getPeriodRanges(start, end, this.business.regularHours);
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

    periodRanges.forEach(range => {
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
}


function getPeriodRanges(start: DateTime, end: DateTime, regularHours: TimePeriod[]): DateTimeRange[] {
  const allPeriod = new DateTimeRange(start, end)
  const groupedRegularHours = getGroupedPeriodsByDayOfWeek(regularHours);
  const ranges = [];

  let curr = tz.convertTimeToDate(start)

  while (curr.getTime() <= end.getTime()) {
    const currDayOfWeek = curr.getDay() as DayOfWeek;

    if (groupedRegularHours.has(currDayOfWeek)) {
      ranges.push(...groupedRegularHours.get(currDayOfWeek).map(period => {
        return getDateRangeFromPeriod(curr, period)
      }))
    }

    if (groupedRegularHours.has(DayOfWeek.DAY_OF_WEEK_UNSPECIFIED)) {
      ranges.push(...groupedRegularHours.get(DayOfWeek.DAY_OF_WEEK_UNSPECIFIED).map(period => {
        return getDateRangeFromPeriod(curr, period);
      }))
    }

    curr = DateFNS.addDays(curr, 1);
  }

  const mergedRanges = DateRange.merge(ranges);

  return mergedRanges
    .filter(range => range.isOverlap(allPeriod))
    .map(range => DateRange.intersection(range, allPeriod));
}

function getGroupedPeriodsByDayOfWeek(periods: TimePeriod[]): Map<DayOfWeek, TimePeriod[]> {
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

function getDateRangeFromPeriod(date: Date, period: TimePeriod): DateRange {
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

  return new DateTimeRange(start, end);
}


export class DateTimeRange {
  readonly start: DateTime
  readonly startTime: number
  readonly end: DateTime
  readonly endTime: number

  constructor(start: DateTime, end: DateTime) {
    this.start = start
    this.startTime = tz.getUnixTime(start)
    this.end = end
    this.endTime = tz.getUnixTime(end)
  }

  /**
   * 
   * dateRangeA: ---|-----------|---------
   * dateRangeB: ------|-----------|------
   * dateRangeC: --------|--------|-------
   * result    : --------|======|---------
   */
  static intersection(a: DateTimeRange, b: DateTimeRange): DateTimeRange {
    if (!a.isOverlap(b)) {
      return null;
    }

    const start = a.start.getTime() >= b.start.getTime() ? a.start : b.start;
    const end = a.end.getTime() <= b.end.getTime() ? a.end : b.end;

    return new DateTimeRange(start, end);
  }

  static merge(ranges: DateTimeRange[]): DateTimeRange[] {
    if (ranges.length === 0) {
      return []
    }

    // Create an empty stack
    const result = [];

    // Sort ranges by start
    const sortedRanges = ranges.slice().sort((a, b) => a.start.getTime() - b.start.getTime())

    sortedRanges.forEach(range => {
      if (result.length === 0 || result[result.length - 1].end < range.start) {
        result.push(range)
      }
      else {
        result[result.length - 1] = new DateTimeRange(
          result[result.length - 1].start,
          result[result.length - 1].end > range.end ? result[result.length - 1].end : range.end
        )
      }
    })

    return result;
  }

  isOverlap(dateRange: DateTimeRange): boolean {
    if (this.startTime <= dateRange.startTime && dateRange.startTime < this.endTime) {
      return true
    }

    if (this.startTime < dateRange.endTime && dateRange.endTime <= this.endTime) {
      return true
    }

    if (dateRange.startTime <= this.startTime && this.endTime <= dateRange.endTime) {
      return true
    }

    return false;
  }


  clone(): DateTimeRange {
    return new DateTimeRange(this.start, this.end)
  }

  exclude(dateRange: DateTimeRange | DateTimeRange[]): DateTimeRange[] {
    if (Array.isArray(dateRange)) {
      let result = [this.clone()]

      dateRange.forEach(v => {
        let tmp = [];

        result.forEach(r => {
          tmp = tmp.concat(r.exclude(v))
        })

        result = tmp;
      })

      return result;
    }

    if (!this.isOverlap(dateRange)) {
      return [this.clone()]
    }

    if (this.startTime < dateRange.startTime && dateRange.endTime < this.endTime) {
      return [
        new DateTimeRange(this.start, dateRange.start),
        new DateTimeRange(dateRange.end, this.end)
      ]
    }

    if (dateRange.startTime <= this.startTime && this.endTime <= dateRange.endTime) {
      return []
    }

    if (dateRange.startTime <= this.startTime && dateRange.endTime < this.endTime) {
      return [
        new DateTimeRange(dateRange.end, this.end)
      ]
    }

    if (this.startTime < dateRange.startTime && this.endTime <= dateRange.endTime) {
      return [
        new DateTimeRange(this.start, dateRange.start)
      ]
    }

    return []
  }


  /**
   * ---|---------|-------
   * ---|---|-------------
   * -------|---|---------
   * -----------|-|-------
   * 
   * @param period in ms
   * @param options 
   */
  split(periodInMs: number, round = false): DateTimeRange[] {
    const periods: DateTimeRange[] = []
    const current = tz.convertTimeToDate(this.start)
    const end = tz.convertTimeToDate(this.end)

    // while(round ? current <= end : current < end) {

    //   current.
    //   current = new Date(current.getTime())
    //   current.setMilliseconds(period)
    // }

    // if (!round && current !== this.end) {
    //   periods.push(new Date(this.end.getTime()))
    // }

    return periods;
  }
}
