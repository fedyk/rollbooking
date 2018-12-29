import { BookingWorkday } from "../../../models/booking-workday";
import { getSelectedWorkday } from "./get-salon-workday";

describe("getSelectedWorkday", function() {
  const date = new Date(Date.UTC(2018, 0, 1));
  const bookingWorkdays: BookingWorkday[] = [{
    period: {
      start: new Date("2018-01-01T08:00:00Z"),
      end: new Date("2018-01-01T13:00:00Z"),
    },
    masters: {
      1: {
        services: {
          1: {
            availableTimes: [
              new Date("2018-01-01T08:00:00Z"),
              new Date("2018-01-01T09:00:00Z")
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
    expect(getSelectedWorkday(bookingWorkdays, new Date(Date.UTC(2018, 0, 2)))).toBeNull()
  })
})