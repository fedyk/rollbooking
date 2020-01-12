import { DayOfWeek } from "../../core/types/dat-of-week";
import { TimePeriod } from "../../core/types/time-period";
import { indexPeriodsByOpenDay } from "./index-periods-by-open-day";

describe("getGroupedPeriodsByDayOfWeek", function () {
  it("should work", function () {
    const periods: TimePeriod[] = [{
      openDay: DayOfWeek.MONDAY,
      openTime: {
        hours: 10,
        minutes: 0,
        seconds: 0
      },
      closeDay: DayOfWeek.MONDAY,
      closeTime: {
        hours: 12,
        minutes: 0,
        seconds: 0
      }
    }]

    expect(indexPeriodsByOpenDay(periods)).toEqual(new Map([
      [DayOfWeek.MONDAY, [periods[0]]]
    ]))
  })
  
  it("should work 2", function () {
    const periods: TimePeriod[] = [{
      openDay: DayOfWeek.MONDAY,
      openTime: {
        hours: 10,
        minutes: 0,
        seconds: 0
      },
      closeDay: DayOfWeek.TUESDAY,
      closeTime: {
        hours: 10,
        minutes: 0,
        seconds: 0
      }
    }]

    expect(indexPeriodsByOpenDay(periods)).toEqual(new Map([
      [DayOfWeek.MONDAY, [periods[0]]],
      [DayOfWeek.TUESDAY, [periods[0]]]
    ]))
  })
})
