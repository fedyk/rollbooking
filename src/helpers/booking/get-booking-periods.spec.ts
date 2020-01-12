import { getBookingPeriods } from "./get-booking-periods";
import { Date as DateObject } from "../../types/date";
import { DayOfWeek } from "../../types/dat-of-week";
import { DateRange } from "../../lib/date-range";

describe("getBookingPeriods", function () {
  const start: DateObject = {
    year: 2018,
    month: 12,
    day: 17
  }; // DayOfWeek.Monday

  const end: DateObject = {
    year: 2018,
    month: 12,
    day: 18
  }; // DayOfWeek.TUESDAY

  it("should work", function () {
    expect(getBookingPeriods(start, end, {
      periods: [{
        openDay: DayOfWeek.MONDAY,
        openTime: {
          hours: 10,
          minutes: 0,
          seconds: 0
        },
        closeDay: DayOfWeek.MONDAY,
        closeTime: {
          hours: 18,
          minutes: 0,
          seconds: 0
        },
      }, {
        openDay: DayOfWeek.TUESDAY,
        openTime: {
          hours: 10,
          minutes: 0,
          seconds: 0
        },
        closeDay: DayOfWeek.TUESDAY,
        closeTime: {
          hours: 16,
          minutes: 0,
          seconds: 0
        },
      }, {
        openDay: DayOfWeek.DAY_OF_WEEK_UNSPECIFIED,
        openTime: {
          hours: 8,
          minutes: 0,
          seconds: 0
        },
        closeDay: DayOfWeek.DAY_OF_WEEK_UNSPECIFIED,
        closeTime: {
          hours: 9,
          minutes: 0,
          seconds: 0
        },
      }]
    }, {
        periods: []
      }
    )).toEqual([
      new DateRange(
        new Date(2018, 11, 17, 8, 0, 0),
        new Date(2018, 11, 17, 9, 0, 0)
      ),
      new DateRange(
        new Date(2018, 11, 17, 10, 0, 0),
        new Date(2018, 11, 17, 18, 0, 0)
      ),
      new DateRange(
        new Date(2018, 11, 18, 8, 0, 0),
        new Date(2018, 11, 18, 9, 0, 0)
      ),
      new DateRange(
        new Date(2018, 11, 18, 10, 0, 0),
        new Date(2018, 11, 18, 16, 0, 0)
      ),
    ])
  })

  it("should work 2", function () {
    expect(getBookingPeriods(start, end, {
      periods: [{
        openDay: DayOfWeek.SUNDAY,
        openTime: {
          hours: 10,
          minutes: 0,
          seconds: 0
        },
        closeDay: DayOfWeek.MONDAY,
        closeTime: {
          hours: 1,
          minutes: 0,
          seconds: 0
        },
      }, {
        openDay: DayOfWeek.MONDAY,
        openTime: {
          hours: 23,
          minutes: 0,
          seconds: 0
        },
        closeDay: DayOfWeek.TUESDAY,
        closeTime: {
          hours: 1,
          minutes: 0,
          seconds: 0
        },
      }]
    }, {
        periods: []
      }
    )).toEqual([
      new DateRange(
        new Date(2018, 11, 17, 0, 0, 0),
        new Date(2018, 11, 17, 1, 0, 0)
      ),
      new DateRange(
        new Date(2018, 11, 17, 23, 0),
        new Date(2018, 11, 18, 1, 0)
      )
    ])
  })
  
  it("should work 3", function () {
    expect(getBookingPeriods({
      year: 2018,
      month: 12,
      day: 28
    }, {
      year: 2019,
      month: 1,
      day: 2
    }, {
      periods: [{
        openDay: DayOfWeek.WEDNESDAY,
        openTime: {
          hours: 10,
          minutes: 0,
          seconds: 0
        },
        closeDay: DayOfWeek.WEDNESDAY,
        closeTime: {
          hours: 16,
          minutes: 0,
          seconds: 0
        },
      }]
    }, {
        periods: []
      }
    )).toEqual([
      new DateRange(
        new Date(2019, 0, 2, 10, 0),
        new Date(2019, 0, 2, 16, 0)
      )
    ])
  })
})
