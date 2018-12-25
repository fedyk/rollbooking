import { getDateOptions, getAvailableDates } from "./get-date-options";
import { SelectOption } from "../../../helpers/form";
import { dateToISODate } from "../../../helpers/booking-workday/date-to-iso-date";
import { BookingWorkday } from "../../../models/booking-workday";

describe("getDateOptions", function() {
  const now = new Date(Date.now());
  const bookingWorkdays: BookingWorkday[] = [{
    period: {
      startDate: {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
      },
      startTime: "08:00",
      endDate: {          
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
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
      }
    }
  }]

  it("should work", function() {
    debugger
    expect(getDateOptions(bookingWorkdays, {
      masterId: null,
      serviceId: null
    }, 1)).toEqual([{
      value: dateToISODate(now),
      text: now.toLocaleDateString(),
      disabled: false
    }] as SelectOption[])
  })
  
  it("should work 2", function() {
    expect(getDateOptions(bookingWorkdays, {
      masterId: null,
      serviceId: null
    }, 1)).toEqual([{
      value: dateToISODate(now),
      text: now.toLocaleDateString(),
      disabled: false
    }] as SelectOption[])
  })
})

describe("getAvailableDates", function() {
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
    expect(getAvailableDates(bookingWorkdays, null, null)).toEqual(new Map([["2018-01-01", true]]))
  })

  it("shoult work 2", function() {
    expect(getAvailableDates(bookingWorkdays, null, null)).toEqual(new Map<string, boolean>([["2018-01-01", true]]))
  })

  it("shoult work 3", function() {
    expect(getAvailableDates(bookingWorkdays, 1, null)).toEqual(new Map<string, boolean>([["2018-01-01", true]]))
  })

  it("shoult work 4", function() {
    expect(getAvailableDates(bookingWorkdays, 1, 1)).toEqual(new Map<string, boolean>([["2018-01-01", true]]))
  })
  
  it("shoult work 5", function() {
    expect(getAvailableDates(bookingWorkdays, 2, null)).toEqual(new Map<string, boolean>())
  })
  
  it("shoult work 6", function() {
    expect(getAvailableDates(bookingWorkdays, 2, 1)).toEqual(new Map<string, boolean>())
  })
  
  it("shoult work 7", function() {
    expect(getAvailableDates(bookingWorkdays, null, 1)).toEqual(new Map<string, boolean>([["2018-01-01", true]]))
  })
})