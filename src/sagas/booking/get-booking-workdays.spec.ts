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
                {
                  hours: 12,
                  minutes: 0,
                  seconds: 0
                },
                {
                  hours: 13,
                  minutes: 30,
                  seconds: 0
                },
                {
                  hours: 14,
                  minutes: 30,
                  seconds: 0
                }
              ]
            },
            2: {
              availableTimes: [
                {
                  hours: 10,
                  minutes: 30,
                  seconds: 0
                },
                {
                  hours: 12,
                  minutes: 0,
                  seconds: 0
                },
                {
                  hours: 12,
                  minutes: 30,
                  seconds: 0
                },
                {
                  hours: 13,
                  minutes: 30,
                  seconds: 0
                },
                {
                  hours: 14,
                  minutes: 0,
                  seconds: 0
                },
                {
                  hours: 14,
                  minutes: 30,
                  seconds: 0
                },
                {
                  hours: 15,
                  minutes: 0,
                  seconds: 0
                },
                {
                  hours: 15,
                  minutes: 30,
                  seconds: 0
                }
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
          hours: 10,
          minutes: 0,
          seconds: 0,
        },
        end: {
          year: 2018,
          month: 1,
          day: 1,
          hours: 16,
          minutes: 0,
          seconds: 0
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
  }; // DayOfWeek.Monday
  const end: DateObject = {
    year: 2018,
    month: 12,
    day: 18
  }; // DayOfWeek.TUESDAY

  it("should work", function () {
    expect(getPeriods(start, end, {
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
    expect(getPeriods(start, end, {
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
})

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

    expect(getGroupedPeriodsByDayOfWeek(periods)).toEqual(new Map([
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
      openTime: {
        hours: 10,
        minutes: 0,
        seconds: 0
      },
      closeDay: DayOfWeek.TUESDAY,
      closeTime: {
        hours: 1,
        minutes: 0,
        seconds: 0
      }
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
      openTime: {
        hours: 10,
        minutes: 0,
        seconds: 0
      },
      closeDay: DayOfWeek.DAY_OF_WEEK_UNSPECIFIED,
      closeTime: {
        hours: 20,
        minutes: 0,
        seconds: 0
      }
    }

    expect(getDateRangeFromPeriod(date, period)).toEqual({
      start: new Date("2018-12-17T10:00:00"),
      end: new Date("2018-12-17T20:00:00")
    })
  })
  
  it("should return period 3", function () {
    const date = new Date(2018, 11, 15); // Saturday
    const period: TimePeriod = {
      openDay: DayOfWeek.SATURDAY,
      openTime: {
        hours: 10,
        minutes: 0,
        seconds: 0
      },
      closeDay: DayOfWeek.SUNDAY,
      closeTime: {
        hours: 20,
        minutes: 0,
        seconds: 0
      }
    }

    expect(getDateRangeFromPeriod(date, period)).toEqual({
      start: new Date(2018, 11, 15, 10),
      end: new Date(2018, 11, 16, 20)
    })
  })
  
  it("should return period 4", function () {
    const date = new Date(2018, 11, 16); // Sunday
    const period: TimePeriod = {
      openDay: DayOfWeek.SATURDAY,
      openTime: {
        hours: 10,
        minutes: 0,
        seconds: 0
      },
      closeDay: DayOfWeek.SUNDAY,
      closeTime: {
        hours: 20,
        minutes: 0,
        seconds: 0
      }
    }

    expect(getDateRangeFromPeriod(date, period)).toEqual({
      start: new Date(2018, 11, 15, 10),
      end: new Date(2018, 11, 16, 20)
    })
  })
  
  it("should return period 5", function () {
    const date = new Date(2018, 11, 17); // Monday
    const period: TimePeriod = {
      openDay: DayOfWeek.SUNDAY,
      openTime: {
        hours: 10,
        minutes: 0,
        seconds: 0
      },
      closeDay: DayOfWeek.MONDAY,
      closeTime: {
        hours: 20,
        minutes: 0,
        seconds: 0
      }
    }

    expect(getDateRangeFromPeriod(date, period)).toEqual({
      start: new Date(2018, 11, 16, 10),
      end: new Date(2018, 11, 17, 20)
    })
  })
})
