import { getResults } from "./get-results";
import { DateTime } from "../../../models/date-time";
import { BookingWorkday } from "../../../models/booking-workday";
import { SalonService } from "../../../models/salon";

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

const workdays: BookingWorkday[] = [{
  period: {
    start,
    end
  },
  masters: {
    "master-1": {
      services: {
        "1": {
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
    "master-2": {
      services: {
        "1": {
          availableTimes: [
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

const service: SalonService = {
  id: 1,
  name: "Service 1",
  description: "Desc",
  duration: 60,
  currencyCode: "USD",
  price: 20,
}

test("get-results", function () {
  expect(getResults({
    salonId: "1",
    workdays: workdays,
    date: null,
    salonServices: [service],
    masterId: null,
    serviceId: null
  })).toBe([{
    description: "",
    name: "Service 1",
    price: "20",
    times: [{
      text: "08:00",
      url: "/booking/1/checkout?m=master-1&s=1&wdps=2018-01-01T08%3A00%3A00&wdpe=2018-01-01T13%3A00%3A00&t=08%3A00&d=2018-01-01",
    }, {
      text: "09:00",
      url: "/booking/1/checkout?m=master-2&s=1&wdps=2018-01-01T08%3A00%3A00&wdpe=2018-01-01T13%3A00%3A00&t=09%3A00&d=2018-01-01",
    }],
  }])
})
