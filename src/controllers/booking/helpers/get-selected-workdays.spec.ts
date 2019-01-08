import { BookingWorkday } from "../../../models/booking-workday";
import { getSelectedWorkdays } from "./get-selected-workdays";
import { DateTime } from "../../../models/date-time";
import { Date as DateObject } from "../../../models/date";

describe("getSelectedWorkdays", function () {
  const date: DateObject = {
    year: 2018,
    month: 1,
    day: 1
  };

  const start: DateTime = {
    year: 2018,
    month: 1,
    day: 1,
    hours: 8,
    minutes: 0,
    seconds: 0,
  }

  const end: DateTime = {
    year: 2018,
    month: 1,
    day: 1,
    hours: 13,
    minutes: 0,
    seconds: 0,
  }

  const bookingWorkdays: BookingWorkday[] = [{
    period: {
      start,
      end,
    },
    masters: {}
  }]

  it("should work", function () {
    expect(getSelectedWorkdays(bookingWorkdays, date)).toEqual(bookingWorkdays)
  })

  it("should work 2", function () {
    expect(getSelectedWorkdays(bookingWorkdays, null)).toEqual([])
  })

  it("should work 3", function () {
    expect(getSelectedWorkdays(bookingWorkdays, {
      year: 2018,
      month: 1,
      day: 2
    })).toEqual([])
  })

  it("should work 4", function () {
    const workday1: BookingWorkday = {
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
          hours: 13,
          minutes: 0,
          seconds: 0,
        },
      },
      masters: {}
    }
    const workday2: BookingWorkday = {
      period: {
        start: {
          year: 2018,
          month: 1,
          day: 1,
          hours: 14,
          minutes: 0,
          seconds: 0,
        },
        end: {
          year: 2018,
          month: 1,
          day: 1,
          hours: 16,
          minutes: 0,
          seconds: 0,
        },
      },
      masters: {}
    }

    expect(getSelectedWorkdays([workday1, workday2], {
      year: 2018,
      month: 1,
      day: 1
    })).toEqual([workday1, workday2])
  })
})