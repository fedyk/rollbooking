import * as dateFns from "date-fns"
import * as tz from "timezone-support"
import { Business } from "../accounts";
import { Event } from "../events";
import { DayOfWeek } from "../types";
import * as types from "./types";
import { TimePeriod } from "../types/time-period";

export class Booking {
  business: Business
  timezone: ReturnType<typeof tz.findTimeZone>
  reservations: Event[]
  users: Array<{ id: string }>
  services: Array<{ id: string, duration: number }>

  constructor(business: Business, reservations: Event[]) {
    this.business = business
    this.timezone = tz.findTimeZone(business.timezone)
    this.reservations = reservations
    this.users = business.employees
    this.services = business.services.map(s => ({ id: s.id, duration: s.duration }))
  }

  destroy() {
    // TBD
  }

  getServicesSlots() {
    const start = tz.getZonedTime(new Date(), this.timezone)
    const end = tz.getZonedTime(dateFns.addDays(new Date, 30), this.timezone)
    const startDate = tz.convertTimeToDate(start)
    const endDate = tz.convertTimeToDate(end)
    const startTime = tz.getUnixTime(start)
    const endTime = tz.getUnixTime(end)

    // get general ranges
    const businessRanges = getPeriodRanges(startDate, endDate, this.business.regularHours)

    // available slots by service id
    const slotsByServiceId = new Map(this.services.map(s => {
      return [s.id, [] as types.Slot[]]
    }))

    // user reserved time
    const reservations = new Map<string, DateTimeRange[]>()

    // reservations by user
    for (let i = 0; i < this.reservations.length; i++) {
      const r = this.reservations[i]
      const list = reservations.get(r.assigner.id)
      const start = tz.getUnixTime(r.start, this.timezone)
      const end = tz.getUnixTime(r.end, this.timezone)
      const dateRange = new DateTimeRange(start, end)

      if (list) {
        list.push(dateRange)
      }
      else {
        reservations.set(r.assigner.id, [dateRange])
      }
    }

    for (let k = 0; k < this.services.length; k++) {
      const service = this.services[k]
      const durationInMs = service.duration * 60 * 1000

      for (let i = 0; i < businessRanges.length; i++) {
        const range = businessRanges[i]

        for (let j = 0; j < this.users.length; j++) {
          const user = this.users[j];
          const userReservations = reservations.get(user.id) || []
          const availableRanges = range.exclude(userReservations);

          for (let l = 0; l < availableRanges.length; l++) {
            const availableRange = availableRanges[l]
            const times = availableRange.split(durationInMs, true)

            // remove last result
            times.pop()

            times.forEach(time => {
              const start = tz.getZonedTime(time.startTime, this.timezone)
              const end = tz.getZonedTime(time.endTime, this.timezone)

              slotsByServiceId.get(service.id).push({
                start,
                end,
                userId: user.id,
                serviceId: service.id
              })
            })
          }
        }

        if (slotsByServiceId.get(service.id).length !== 0) {
          break;
        }
      }
    }

    return Array.from(slotsByServiceId);
  }
}


function getPeriodRanges(start: Date, end: Date, timePeriods: TimePeriod[]): DateTimeRange[] {
  const startTime = start.getTime()
  const endTime = end.getTime()
  const wholePeriod = new DateTimeRange(startTime, endTime)
  const hashedTimePeriods = mapPeriodsByDayOfWeek(timePeriods)
  const unspecifiedDayTimePeriods = hashedTimePeriods.get(DayOfWeek.DAY_OF_WEEK_UNSPECIFIED)
  const ranges: DateTimeRange[] = [];
  let current = start

  while (current.getTime() <= endTime) {
    const dayOfWeek = current.getDay() as DayOfWeek
    const thisDayTimePeriods = hashedTimePeriods.get(dayOfWeek)

    if (thisDayTimePeriods) {
      ranges.push(...thisDayTimePeriods.map(function (period) {
        return getDateRangeFromPeriod(current, period)
      }))
    }

    if (unspecifiedDayTimePeriods) {
      ranges.push(...unspecifiedDayTimePeriods.map(function (period) {
        return getDateRangeFromPeriod(current, period);
      }))
    }

    current = dateFns.addDays(current, 1);
  }

  const mergedRanges = merge(ranges)
  const fittedRanges = mergedRanges.map(range => intersection(range, wholePeriod))
  const filteredRanges = fittedRanges.filter(Boolean) as DateTimeRange[]

  return filteredRanges
}

function mapPeriodsByDayOfWeek(periods: TimePeriod[]): Map<DayOfWeek, TimePeriod[]> {
  const map = new Map<DayOfWeek, TimePeriod[]>();

  for (let i = 0; i < periods.length; i++) {
    const period = periods[i]
    const list = map.get(period.openDay)

    if (!list) {
      map.set(period.openDay, [period]);
    }
    else {
      list.push(period);
    }

    if (period.openDay !== period.closeDay) {
      const list = map.get(period.closeDay)

      if (!list) {
        map.set(period.closeDay, [period]);
      }
      else {
        list.push(period);
      }
    }
  }

  return map;
}

function getDateRangeFromPeriod(date: Date, period: TimePeriod): DateTimeRange {
  const day = date.getDay()
  const start = new Date(date)
  const end = new Date(date)

  if (period.openDay !== DayOfWeek.DAY_OF_WEEK_UNSPECIFIED) {
    if (day !== period.openDay && day !== period.closeDay) {
      throw new Error("date should have the same date as period");
    }
  }

  // ???
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

  return new DateTimeRange(start.getTime(), end.getTime());
}

class DateTimeRange {
  readonly startTime: number
  readonly endTime: number

  constructor(start: number, end: number) {
    this.startTime = start
    this.endTime = end
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
    return new DateTimeRange(this.startTime, this.endTime)
  }

  exclude(dateRanges: DateTimeRange | DateTimeRange[]): DateTimeRange[] {
    if (Array.isArray(dateRanges)) {
      let excluded = [
        this.clone()
      ]

      for (let i = 0; i < dateRanges.length; i++) {
        let dateRange = dateRanges[i]
        let tmp: DateTimeRange[] = []

        for (let j = 0; j < excluded.length; j++) {
          tmp.push(...excluded[j].exclude(dateRange))
        }

        excluded = tmp
      }

      return excluded;
    }

    if (!this.isOverlap(dateRanges)) {
      return [this.clone()]
    }

    if (this.startTime < dateRanges.startTime && dateRanges.endTime < this.endTime) {
      return [
        new DateTimeRange(this.startTime, dateRanges.startTime),
        new DateTimeRange(dateRanges.endTime, this.endTime)
      ]
    }

    if (dateRanges.startTime <= this.startTime && this.endTime <= dateRanges.endTime) {
      return []
    }

    if (dateRanges.startTime <= this.startTime && dateRanges.endTime < this.endTime) {
      return [
        new DateTimeRange(dateRanges.endTime, this.endTime)
      ]
    }

    if (this.startTime < dateRanges.startTime && this.endTime <= dateRanges.endTime) {
      return [
        new DateTimeRange(this.startTime, dateRanges.startTime)
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
    const endTime = this.endTime
    let current = this.startTime

    while (round ? current <= endTime : current < endTime) {
      periods.push(new DateTimeRange(current, current += periodInMs))
    }

    if (!round && current !== endTime) {
      periods.push(new DateTimeRange(current, endTime))
    }

    return periods
  }
}

/**
 * 
 * dateRangeA: ---|-----------|---------
 * dateRangeB: ------|-----------|------
 * dateRangeC: --------|--------|-------
 * result    : --------|======|---------
 */
function intersection(a: DateTimeRange, b: DateTimeRange): DateTimeRange | void {
  if (!a.isOverlap(b)) {
    return
  }

  const start = a.startTime >= b.startTime ? a.startTime : b.startTime;
  const end = a.endTime <= b.endTime ? a.endTime : b.endTime;

  return new DateTimeRange(start, end);
}

function merge(ranges: DateTimeRange[]): DateTimeRange[] {
  if (ranges.length === 0) {
    return []
  }

  const result: DateTimeRange[] = [];

  // sort by startTime
  const sortedRanges = ranges.slice().sort((a, b) => a.startTime - b.startTime)

  for (let i = 0; i < sortedRanges.length; i++) {
    const range = sortedRanges[i]

    if (result.length === 0 || result[result.length - 1].endTime < range.startTime) {
      result.push(range)
    }
    else {
      result[result.length - 1] = new DateTimeRange(
        result[result.length - 1].startTime,
        result[result.length - 1].endTime > range.endTime ? result[result.length - 1].endTime : range.endTime
      )
    }
  }

  return result;
}
