import { getBookingWorkdays, getPeriods, getDateRangeFromPeriod } from "./get-booking-workdays";
import { Salon } from "../../models/salon";
import { DayOfWeek } from "../../models/dat-of-week";
import { TimePeriod } from "../../models/time-period";
import { DateRange } from "../../lib/date-range";

describe("getBookingWorkday", function() {
  expect(getBookingWorkdays({
    startPeriod: new Date("2018-01-01T10:00:00.00Z"),
    endPeriod: new Date("2018-01-02T23:59:59.00Z"),
    salonId: 1,
    salonRegularHours: {
      periods: [{
        openDay: DayOfWeek.MONDAY,
        openTime: 10 * 60,
        closeDay: DayOfWeek.MONDAY,
        closeTime: 18 * 60,
      }, {
        openDay: DayOfWeek.TUESDAY,
        openTime: 11 * 60,
        closeDay: DayOfWeek.TUESDAY,
        closeTime: 17 * 60,
      }],
    },
    salonSpecialHours: {
      periods: []
    },
    salonMastersIds: [1, 2, 3],
    salonServices: [{
      id: 1,
      salon_id: 1,
      properties: {
        general: {
          name: "Test",
          duration: 60,
        },
        price: {
          value: 1
        }
      },
      created: new Date(),
      updated: new Date()
    }],
    reservations: [],
  })).toEqual([{
    salon_id: 1,
    masters: {},
    period: {
      startTime: 10 * 60,
      startDate: {
        day: 1,
        month: 1,
        year: 2018,
      },
      endTime: 18 * 60,
      endDate: {
        day: 1,
        month: 1,
        year: 2018,
      },
    },
  }, {
      salon_id: 1,
      masters: {},
      period: {
        startTime: 11 * 60,
        startDate: {
          day: 2,
          month: 1,
          year: 2018,
        },
        endTime: 17 * 60,
        endDate: {
          day: 2,
          month: 1,
          year: 2018,
        },
      }
  }])
})

describe("getPeriods", function() {
  it("should work", function() {
    const start = new Date("2018-12-17T00:00:00.00Z");
    const end = new Date("2018-12-18T00:00:00.00Z");

    expect(getPeriods(start, end, {
      periods: [{
        openDay: DayOfWeek.MONDAY,
        openTime: 10 * 60, // 10:00
        closeDay: DayOfWeek.MONDAY,
        closeTime: 18 * 60, // 18:00
      }]}, {
        periods: []
      }
    )).toEqual([
      new DateRange(new Date("2018-12-17T10:00:00.00Z"), new Date("2018-12-17T18:00:00.00Z")
    )])
  })
})

describe("getDateRangeFromPeriod", function() {
  it("should return period", function() {
    const date = new Date("2018-12-17T00:00:00.00Z");    
    const period: TimePeriod = {
      openDay: DayOfWeek.MONDAY,
      openTime: 600,
      closeDay: DayOfWeek.TUESDAY,
      closeTime: 60
    }

    expect(getDateRangeFromPeriod(date, period)).toEqual({
      start: new Date("2018-12-17T10:00:00.00Z"),
      end: new Date("2018-12-18T01:00:00.00Z")
    })
  })

  it("should return period 2", function() {
    const date = new Date("2018-12-17T00:00:00.00Z");    
    const period: TimePeriod = {
      openDay: DayOfWeek.DAY_OF_WEEK_UNSPECIFIED,
      openTime: 600,
      closeDay: DayOfWeek.DAY_OF_WEEK_UNSPECIFIED,
      closeTime: 1200
    }

    expect(getDateRangeFromPeriod(date, period)).toEqual({
      start: new Date("2018-12-17T10:00:00.00Z"),
      end: new Date("2018-12-17T20:00:00.00Z")
    })
  })
})
