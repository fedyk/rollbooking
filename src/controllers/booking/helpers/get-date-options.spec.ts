import { getDateOptions, getAvailableDates } from "./get-date-options";
import { SelectOption } from "../../../helpers/form";
import { dateToISODate } from "../../../helpers/booking-workday/date-to-iso-date";
import { BookingWorkday } from "../../../models/booking-workday";
import { DateTime } from "../../../models/date-time";
import { Date as DateObject } from "../../../models/date";

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

describe("getDateOptions", function() {
  const bookingWorkdays: BookingWorkday[] = [{
    period: {
      start,
      end
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
      }
    }
  }]

  it("should work", function() {
    expect(getDateOptions({
      bookingWorkdays,
      masterId: null,
      serviceId: null,
      startDate: {
        year: 2018,
        month: 1,
        day: 1,
      },
      nextDays: 1,
    })).toEqual([{
      value: "",
      text: "Select date"
    }, {
      value: "2018-01-01",
      text: "2018-01-01",
      disabled: false
    }] as SelectOption[])
  })
  
  it("should work 2", function() {
    expect(getDateOptions({
      bookingWorkdays,
      masterId: null,
      serviceId: null,
      startDate: {
        year: 2018,
        month: 1,
        day: 3,
      },
      nextDays: 1,
    })).toEqual([{
      value: "",
      text: "Select date"
    }, {
      value: "2018-01-03",
      text: "2018-01-03",
      disabled: true
    }] as SelectOption[])
  })
})

describe("getAvailableDates", function() {
  const bookingWorkdays: BookingWorkday[] = [{
    period: {
      start,
      end,
    },
    masters: {
      "1": {
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
              },
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