import { BookingWorkday } from "../../../models/booking-workday";
import { getSelectedWorkday } from "./get-salon-workday";
import { DateTime } from "../../../models/date-time";
import { Date as DateObject } from "../../../models/date";

describe("getSelectedWorkday", function() {
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
    masters: {
      1: {
        services: {
          1: {
            availableTimes: [
              {
                hours: 8,
                minutes: 0,
                seconds: 0
              },
              {
                hours: 9,
                minutes: 0,
                seconds: 0
              }
            ]
          }
        }
      },
      2: {
        services: {
          1: {
            availableTimes: []
          }
        }
      }
    }
  }]

  it("shoult work", function() {
    expect(getSelectedWorkday(bookingWorkdays, date)).toEqual(bookingWorkdays[0])
  })

  it("shoult work 2", function() {
    expect(getSelectedWorkday(bookingWorkdays, null)).toEqual(bookingWorkdays[0])
  })
  
  it("shoult work 3", function() {
    expect(getSelectedWorkday(bookingWorkdays, {
      year: 2018,
      month: 1,
      day: 2
    })).toBeNull()
  })
})