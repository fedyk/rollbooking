import { getBookingWorkday, getPeriods } from "./get-booking-workday";
import { Salon } from "../../models/salon";
import { DayOfWeek } from "../../models/dat-of-week";

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

test("getPeriods", function() {
    const now = new Date("2018-12-16T00:00:00").getTime();

    expect(getPeriods(
      new Date(now),
      new Date(now + 24 * 60 * 60 * 1000),
      [{
        openDay: DayOfWeek.MONDAY,
        openTime: 10 * 60, // 10:00
        closeDay: DayOfWeek.MONDAY,
        closeTime: 18 * 60, // 18:00
      }],
      []
    )).toEqual([{
      startDate: {
        year: 2018,
        month: 12,
        day: 16,
      },
      startTime: 60,
      endDate: {
        year: 2018,
        month: 12,
        day: 16,
      },
      endTime: 18 * 60
    }])
})
