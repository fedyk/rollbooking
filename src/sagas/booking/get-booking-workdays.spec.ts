import { getBookingWorkdays, getPeriods, getDateRangeFromPeriod } from "./get-booking-workdays";
import { Salon } from "../../models/salon";
import { DayOfWeek } from "../../models/dat-of-week";
import { TimePeriod } from "../../models/time-period";
import { DateRange } from "../../lib/date-range";
import { BookingWorkday } from "../../models/booking-workday";

describe("getBookingWorkday", function() {
  const bookingWorkdays: BookingWorkday = {
    salon_id: 1,
    masters: {
      1: {
        services: {
          1: {
            available_times: [10 * 60, 11 * 60, 12 * 60, 13 * 60, 14 * 60, 15 * 60]
          },
          2: {
            available_times: [10 * 60, 11 * 60, 12 * 60, 13 * 60, 14 * 60, 15 * 60]
          }
        }
      }
    },
    period: {
      startTime: 10 * 60,
      startDate: {
        day: 1,
        month: 1,
        year: 2018,
      },
      endTime: 16 * 60,
      endDate: {
        day: 1,
        month: 1,
        year: 2018,
      },
    },
  }
  expect(getBookingWorkdays({
    startPeriod: new Date("2018-01-01T10:00:00.00Z"),
    endPeriod: new Date("2018-01-02T23:59:59.00Z"),
    salonId: 1,
    salonRegularHours: {
      periods: [{
        openDay: DayOfWeek.MONDAY,
        openTime: 10 * 60,
        closeDay: DayOfWeek.MONDAY,
        closeTime: 16 * 60,
      }],
    },
    salonSpecialHours: {
      periods: []
    },
    salonMasters: [{
      id: 1
    }],
    salonServices: [{
      id: 1,
      duration: 60,
    }, {
      id: 2,
      duration: 60
    }],
    reservations: [],
  })).toEqual([bookingWorkdays])
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
