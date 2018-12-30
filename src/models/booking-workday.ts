import { Date as DateObj } from "./date";

export interface BookingWorkday {
  period: Period;
  masters: Masters;
}

export interface BookingWorkdayTZ {
  period: Period;
  masters: Masters;
}

export interface Period {
  start: Date;
  end: Date;
}

export interface Masters {
  [master_id: string]: {
    services: Services
  }
}

/**
 * Time in 24hr ISO 8601 extended format (hh:mm). Valid values are 00:00-24:00, where 24:00 represents midnight at the end of the specified day field.
 */
export interface Services {
  [serviceId: string]: {
    availableTimes: Date[]
  }
}

// mock
export const bookingWorkdays: BookingWorkday[] = [{
  period: {
    start: new Date("2018-12-15T01:00:00Z"),
    end: new Date("2018-12-15T08:00:00Z"),
  },

  masters: {
    1: {
      services: {
        10: {
          availableTimes: [
            new Date("2018-12-15T01:00:00Z"),
            new Date("2018-12-15T02:00:00Z"),
            new Date("2018-12-15T03:00:00Z"),
          ]
        },
        11: {
          availableTimes: [
            new Date("2018-12-15T01:00:00Z"),
            new Date("2018-12-15T02:00:00Z"),
            new Date("2018-12-15T03:00:00Z"),
          ]
        }
      }
    },
    2: {
      services: {
        10: {
          availableTimes: [
            new Date("2018-12-15T01:00:00Z"),
            new Date("2018-12-15T02:00:00Z"),
            new Date("2018-12-15T03:00:00Z"),
          ]
        },
        11: {
          availableTimes: [
            new Date("2018-12-15T01:00:00Z"),
            new Date("2018-12-15T02:00:00Z"),
            new Date("2018-12-15T03:00:00Z"),
          ]
        }
      }
    }
  }
}]
