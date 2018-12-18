import { getBookingWorkday, getPeriods, getDateRangeFromPeriod } from "./get-booking-workday";
import { Salon } from "../../models/salon";
import { DayOfWeek } from "../../models/dat-of-week";
import { TimePeriod } from "../../models/time-period";
import { DateRange } from "../../lib/date-range";

// test("", () => {
//   const now = Date.now();
//   const salon: Salon = {
//     id: 1,
//     name: "Test",
//     hours: {
//       regular: {
//         periods: [{
//           openDay: DayOfWeek.MONDAY,
//           openTime: 10 * 60, // 10:00
//           closeDay: DayOfWeek.MONDAY,
//           closeTime: 18 * 60, // 18:00
//         }]
//       },
//       special: {
//         periods: []
//       }
//     },
//     properties: {
//       general: {
//         timezone: "",
//       },
//       currency: {
//         symbol: "",
//         value: ""
//       } 
//     },
//     created: new Date,
//     updated: new Date,
//   }
//   const salonMasters = []
//   const salonServices = []
//   const salonReservations = []

//   expect(getBookingWorkday({
//     startPeriod: new Date(now),
//     endPeriod: new Date(now + 1000 * 60 * 60 * 24),
//     salon: salon,
//     salonMasters: salonMasters,
//     salonService: salonServices,
//     salonReservations: salonReservations
//   }))
// })

describe("getPeriods", function() {
  it("should work", function() {
    const start = new Date("2018-12-17T00:00:00.00Z");
    const end = new Date("2018-12-18T00:00:00.00Z");

    expect(getPeriods(start, end, [{
        openDay: DayOfWeek.MONDAY,
        openTime: 10 * 60, // 10:00
        closeDay: DayOfWeek.MONDAY,
        closeTime: 18 * 60, // 18:00
      }], []
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
