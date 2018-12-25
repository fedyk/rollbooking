import { BookingWorkday } from "../../../models/booking-workday";
import { getSelectedWorkday } from "./get-salon-workday";

describe("getSelectedWorkday", function() {
  const date = new Date(Date.UTC(2018, 0, 1));
  const bookingWorkdays: BookingWorkday[] = [{
    period: {
      startDate: {
        year: 2018,
        month: 1,
        day: 1,
      },
      startTime: "08:00",
      endDate: {          
        year: 2018,
        month: 1,
        day: 1,
      },
      endTime: "13:00"
    },
    masters: {
      1: {
        services: {
          1: {
            available_times: ["08:00", "09:00"]
          }
        }
      },
      2: {
        services: {
          1: {
            available_times: []
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