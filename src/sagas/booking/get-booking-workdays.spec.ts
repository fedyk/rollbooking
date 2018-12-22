import { getBookingWorkdays, getPeriods, getDateRangeFromPeriod } from "./get-booking-workdays";
import { DayOfWeek } from "../../models/dat-of-week";
import { TimePeriod } from "../../models/time-period";
import { DateRange } from "../../lib/date-range";
import { BookingWorkday } from "../../models/booking-workday";

describe("getBookingWorkday", function () {
  it("should redurn booking workday", function () {
    expect(getBookingWorkdays({
      startPeriod: new Date("2018-01-01T10:00:00.00Z"),
      endPeriod: new Date("2018-01-02T23:59:59.00Z"),
      regularHours: {
        periods: [{
          openDay: DayOfWeek.MONDAY,
          openTime: "10:00",
          closeDay: DayOfWeek.MONDAY,
          closeTime: "16:00",
        }],
      },
      specialHours: {
        periods: []
      },
      masters: [{
        id: 1
      }],
      services: [{
        id: 1,
        duration: 60,
      }, {
        id: 2,
        duration: 60
      }],
      reservations: [{
        master_id: 1,
        range: new DateRange("2018-01-01T11:00:00.00Z", "2018-01-01T12:00:00.00Z")
      }, {
        master_id: 1,
        range: new DateRange("2018-01-01T13:00:00.00Z", "2018-01-01T13:30:00.00Z")
      }],
    })).toEqual([{
      masters: {
        1: {
          services: {
            1: {
              available_times: ["10:00", "12:00", "13:30", "14:30"]
            },
            2: {
              available_times: ["10:00", "12:00", "13:30", "14:30"]
            }
          }
        }
      },
      period: {
        startTime: "10:00",
        startDate: {
          day: 1,
          month: 1,
          year: 2018,
        },
        endTime: "16:00",
        endDate: {
          day: 1,
          month: 1,
          year: 2018,
        },
      },
    }] as BookingWorkday[])
  })
})

describe("getPeriods", function () {
  it("should work", function () {
    const start = new Date("2018-12-17T00:00:00.00Z");
    const end = new Date("2018-12-18T01:00:00.00Z");

    expect(getPeriods(start, end, {
      periods: [{
        openDay: DayOfWeek.MONDAY,
        openTime: "10:00",
        closeDay: DayOfWeek.MONDAY,
        closeTime: "18:00",
      }, {
        openDay: DayOfWeek.TUESDAY,
        openTime: "10:00",
        closeDay: DayOfWeek.TUESDAY,
        closeTime: "18:00",
      }, {
        openDay: DayOfWeek.DAY_OF_WEEK_UNSPECIFIED,
        openTime: "08:00",
        closeDay: DayOfWeek.DAY_OF_WEEK_UNSPECIFIED,
        closeTime: "09:00",
      }]
    }, {
        periods: []
      }
    )).toEqual([
      new DateRange("2018-12-17T08:00:00.00Z", "2018-12-17T09:00:00.00Z"),
      new DateRange("2018-12-17T10:00:00.00Z", "2018-12-17T18:00:00.00Z"),
    ])
  })
})

describe("getDateRangeFromPeriod", function () {
  it("should return period", function () {
    const date = new Date("2018-12-17T00:00:00.00Z");
    const period: TimePeriod = {
      openDay: DayOfWeek.MONDAY,
      openTime: "10:00",
      closeDay: DayOfWeek.TUESDAY,
      closeTime: "01:00"
    }

    expect(getDateRangeFromPeriod(date, period)).toEqual({
      start: new Date("2018-12-17T10:00:00.00Z"),
      end: new Date("2018-12-18T01:00:00.00Z")
    })
  })

  it("should return period 2", function () {
    const date = new Date("2018-12-17T00:00:00.00Z");
    const period: TimePeriod = {
      openDay: DayOfWeek.DAY_OF_WEEK_UNSPECIFIED,
      openTime: "10:00",
      closeDay: DayOfWeek.DAY_OF_WEEK_UNSPECIFIED,
      closeTime: "20:00"
    }

    expect(getDateRangeFromPeriod(date, period)).toEqual({
      start: new Date("2018-12-17T10:00:00.00Z"),
      end: new Date("2018-12-17T20:00:00.00Z")
    })
  })
})
