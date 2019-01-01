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
    hour: 8,
    minute: 0,
    second: 0,
  }
  
  const end: DateTime = {
    year: 2018,
    month: 1,
    day: 1,
    hour: 13,
    minute: 0,
    second: 0,
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
              "08:00",
              "09:00"
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