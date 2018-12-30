import { getDateOptions, getAvailableDates } from "./get-date-options";
import { SelectOption } from "../../../helpers/form";
import { dateToISODate } from "../../../helpers/booking-workday/date-to-iso-date";
import { BookingWorkday } from "../../../models/booking-workday";

describe("getDateOptions", function() {
  const now = new Date();
  const bookingWorkdays: BookingWorkday[] = [{
    period: {
      start: new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0)),
      end: new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 13, 0)),
    },
    masters: {
      1: {
        services: {
          1: {
            availableTimes: [
              new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0)),
              new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0)),
            ]
          }
        }
      }
    }
  }]

  it("should work", function() {
    expect(getDateOptions(bookingWorkdays, {
      masterId: null,
      serviceId: null
    }, 1)).toEqual([{
      value: dateToISODate(now),
      text: dateToISODate(now),
      disabled: false
    }] as SelectOption[])
  })
  
  it("should work 2", function() {
    expect(getDateOptions(bookingWorkdays, {
      masterId: null,
      serviceId: null
    }, 1)).toEqual([{
      value: dateToISODate(now),
      text: dateToISODate(now),
      disabled: false
    }] as SelectOption[])
  })
})

describe("getAvailableDates", function() {
  const bookingWorkdays: BookingWorkday[] = [{
    period: {
      start: new Date("2018-01-01T08:00:00Z"),
      end: new Date("2018-01-01T13:00:00Z")
    },
    masters: {
      "1": {
        services: {
          1: {
            availableTimes: [
              new Date("2018-01-01T08:00:00Z"),
              new Date("2018-01-01T09:00:00Z"),
            ]
          }
        }
      },
      "2": {
        services: {
          1: {
            availableTimes: []
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
    expect(getAvailableDates(bookingWorkdays, "1", null)).toEqual(new Map<string, boolean>([["2018-01-01", true]]))
  })

  it("shoult work 4", function() {
    expect(getAvailableDates(bookingWorkdays, "1", 1)).toEqual(new Map<string, boolean>([["2018-01-01", true]]))
  })
  
  it("shoult work 5", function() {
    expect(getAvailableDates(bookingWorkdays, "2", null)).toEqual(new Map<string, boolean>())
  })
  
  it("shoult work 6", function() {
    expect(getAvailableDates(bookingWorkdays, "2", 1)).toEqual(new Map<string, boolean>())
  })
  
  it("shoult work 7", function() {
    expect(getAvailableDates(bookingWorkdays, null, 1)).toEqual(new Map<string, boolean>([["2018-01-01", true]]))
  })
})