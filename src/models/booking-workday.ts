import { ObjectID } from "bson";
import { DateTime } from "./date-time";

export interface BookingWorkday {
  _id?: ObjectID;
  salonId?: ObjectID;
  created?: Date;

  period: Period;
  masters: Masters;
}

export interface Period {
  start: DateTime;
  end: DateTime;
}

export interface Masters {
  [masterId: string]: {
    services: Services
  }
}

/**
 * Time in 24hr ISO 8601 extended format (hh:mm).
 * Valid values are 00:00-24:00, where 24:00 represents midnight at the end of the specified day field.
 */
export interface Services {
  [serviceId: string]: {
    availableTimes: string[]
  }
}

/**
 * Example of test workday Object
 */
const bookingWorkday: BookingWorkday = {

  period: {
    start: {
      year: 2018,
      month: 12,
      day: 30,
      hour: 10,
      minute: 0,
      second: 0,
    },
    end: {
      year: 2018,
      month: 12,
      day: 30,
      hour: 16,
      minute: 0,
      second: 0,
    },
  },

  masters: {
    "master1": {
      services: {
        "service1": {
          availableTimes: [
            "10:00",
            "11:00"
          ]
        }
      }
    }
  }
}
