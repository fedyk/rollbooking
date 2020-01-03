import { DayOfWeek } from "../../base/types/dat-of-week";
import { DateRange } from "../../lib/date-range";
import { getBookingSlots, Slot } from "./get-booking-slots";

describe("getBookingSlots", function () {
  it("should return booking workday", function () {
    expect(getBookingSlots({
      startPeriod: {
        year: 2018,
        month: 1,
        day: 1,
      },
      endPeriod: {
        year: 2018,
        month: 1,
        day: 2,
      },
      regularHours: {
        periods: [{
          openDay: DayOfWeek.MONDAY,
          openTime: {
            hours: 10,
            minutes: 0,
            seconds: 0
          },
          closeDay: DayOfWeek.MONDAY,
          closeTime: {
            hours: 16,
            minutes: 0,
            seconds: 0
          },
        }],
      },
      specialHours: {
        periods: []
      },
      users: [{
        id: "1"
      }],
      services: [{
        id: 1,
        duration: 60,
      }, {
        id: 2,
        duration: 120
      }],
      reservations: [{
        userId: "1",
        range: new DateRange("2018-01-01T10:00:00", "2018-01-01T10:30:00")
      }, {
        userId: "1",
        range: new DateRange("2018-01-01T11:00:00", "2018-01-01T12:00:00")
      }, {
        userId: "1",
        range: new DateRange("2018-01-01T13:00:00", "2018-01-01T13:30:00")
      }],
    })).toEqual([{
      userId: "1",
      serviceId: 1,
      start: {
        year: 2018,
        month: 1,
        day: 1,
        hours: 12,
        minutes: 0,
        seconds: 0,
      },
      end: {
        year: 2018,
        month: 1,
        day: 1,
        hours: 13,
        minutes: 0,
        seconds: 0
      }
    },
    {
      userId: "1",
      serviceId: 1,
      start: {
        year: 2018,
        month: 1,
        day: 1,
        hours: 13,
        minutes: 30,
        seconds: 0,
      },
      end: {
        year: 2018,
        month: 1,
        day: 1,
        hours: 14,
        minutes: 30,
        seconds: 0
      }
    },
    {
      userId: "1",
      serviceId: 1,
      start: {
        year: 2018,
        month: 1,
        day: 1,
        hours: 14,
        minutes: 30,
        seconds: 0,
      },
      end: {
        year: 2018,
        month: 1,
        day: 1,
        hours: 15,
        minutes: 30,
        seconds: 0
      }
    }, {
      userId: "1",
      serviceId: 2,
      start: {
        year: 2018,
        month: 1,
        day: 1,
        hours: 13,
        minutes: 30,
        seconds: 0,
      },
      end: {
        year: 2018,
        month: 1,
        day: 1,
        hours: 15,
        minutes: 30,
        seconds: 0
      }
    }] as Slot[])
  })
})
