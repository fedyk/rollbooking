import { getBookingWorkdays, getPeriods, getDateRangeFromPeriod, getGroupedPeriodsByDayOfWeek } from "./get-booking-workdays";
import { DayOfWeek } from "../../models/dat-of-week";
import { TimePeriod } from "../../models/time-period";
import { DateRange } from "../../lib/date-range";
import { BookingWorkday } from "../../models/booking-workday";
import { Date as DateObject } from "../../models/date";

describe("getBookingWorkday", function () {
  it("should return booking workday", function () {
    expect(getBookingWorkdays({
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
          openTime: "10:00",
          closeDay: DayOfWeek.MONDAY,
          closeTime: "16:00",
        }],
      },
      specialHours: {
        periods: []
      },
      masters: [{
        id: "1"
      }],
      services: [{
        id: 1,
        duration: 60,
      }, {
        id: 2,
        duration: 30
      }],
      reservations: [{
        masterId: "1",
        range: new DateRange("2018-01-01T10:00:00", "2018-01-01T10:30:00")
      }, {
        masterId: "1",
        range: new DateRange("2018-01-01T11:00:00", "2018-01-01T12:00:00")
      }, {
        masterId: "1",
        range: new DateRange("2018-01-01T13:00:00", "2018-01-01T13:30:00")
      }],
    })).toEqual([{
      masters: {
        "1": {
          services: {
            "1": {
              availableTimes: [
                "12:00",
                "13:30",
                "14:30"
              ]
            },
            2: {
              availableTimes: [
                "10:30",
                "12:00",
                "12:30",
                "13:30",
                "14:00",
                "14:30",
                "15:00",
                "15:30"
              ]
            }
          }
        }
      },
      period: {
        start: {
          year: 2018,
          month: 1,
          day: 1,
          hour: 10,
          minute: 0,
          second: 0,
        },
        end: {
          year: 2018,
          month: 1,
          day: 1,
          hour: 16,
          minute: 0,
          second: 0
        }
      },
    }] as BookingWorkday[])
  })
})

describe("getPeriods", function () {
  const start: DateObject = {
    year: 2018,
    month: 12,
    day: 17
  };
  const end: DateObject = {
    year: 2018,
    month: 12,
    day: 18
  };

  it("should work", function () {
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
      new DateRange("2018-12-17T08:00:00", "2018-12-17T09:00:00"),
      new DateRange("2018-12-17T10:00:00", "2018-12-17T18:00:00"),
    ])
  })

  it("should work 2", function () {
    expect(getPeriods(start, end, {
      periods: [{
        openDay: DayOfWeek.MONDAY,
        openTime: "23:00",
        closeDay: DayOfWeek.TUESDAY,
        closeTime: "01:00",
      }]
    }, {
        periods: []
      }
    )).toEqual([
      new DateRange(new Date(2018, 11, 17, 23, 0), new Date(2018, 11, 18, 1, 0))
    ])
  })
})

describe("getGroupedPeriodsByDayOfWeek", function () {
  it("should work", function () {
    const periods: TimePeriod[] = [{
      openDay: DayOfWeek.MONDAY,
      openTime: "10:00",
      closeDay: DayOfWeek.MONDAY,
      closeTime: "12:00"
    }]

    expect(getGroupedPeriodsByDayOfWeek(periods)).toEqual(new Map([
      [DayOfWeek.MONDAY, [periods[0]]]
    ]))
  })
  
  it("should work 2", function () {
    const periods: TimePeriod[] = [{
      openDay: DayOfWeek.MONDAY,
      openTime: "10:00",
      closeDay: DayOfWeek.TUESDAY,
      closeTime: "10:00"
    }]

    expect(getGroupedPeriodsByDayOfWeek(periods)).toEqual(new Map([
      [DayOfWeek.MONDAY, [periods[0]]],
      [DayOfWeek.TUESDAY, [periods[0]]]
    ]))
  })
})

describe("getDateRangeFromPeriod", function () {
  it("should return period", function () {
    const date = new Date("2018-12-17T23:59:59");
    const period: TimePeriod = {
      openDay: DayOfWeek.MONDAY,
      openTime: "10:00",
      closeDay: DayOfWeek.TUESDAY,
      closeTime: "01:00"
    }

    expect(getDateRangeFromPeriod(date, period)).toEqual({
      start: new Date("2018-12-17T10:00:00"),
      end: new Date("2018-12-18T01:00:00")
    })
  })

  it("should return period 2", function () {
    const date = new Date(2018, 11, 17);
    const period: TimePeriod = {
      openDay: DayOfWeek.DAY_OF_WEEK_UNSPECIFIED,
      openTime: "10:00",
      closeDay: DayOfWeek.DAY_OF_WEEK_UNSPECIFIED,
      closeTime: "20:00"
    }

    expect(getDateRangeFromPeriod(date, period)).toEqual({
      start: new Date("2018-12-17T10:00:00"),
      end: new Date("2018-12-17T20:00:00")
    })
  })
})
