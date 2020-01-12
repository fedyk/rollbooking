import { DayOfWeek } from "../../core/types/dat-of-week";
import { TimePeriod } from "../../core/types/time-period";
import { getDateRangeFromPeriod } from "./get-date-range-from-period";

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
