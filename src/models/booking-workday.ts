import { Date } from "./date";

export interface BookingWorkday {
  period: Period;
  masters: Masters;
}

export interface Period {
  startDate: Date;
  startTime: string;
  endDate: Date;
  endTime: string;
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
  [service_id: string]: {
    available_times: string[]
  }
}

// mock
export const bookingWorkdays: BookingWorkday[] = [{
  period: {
    startDate: {
      year: 2018,
      month: 12,
      day: 15,
    },
    startTime: "01:00",
    endDate: {
      year: 2018,
      month: 12,
      day: 15,
    },
    endTime: "08:00"
  },

  masters: {
    1: {
      services: {
        10: {
          available_times: ["10:00", "11:00", "12:00"]
        },
        11: {
          available_times: ["10:00", "11:00", "12:00"]
        }
      }
    },
    2: {
      services: {
        10: {
          available_times: ["10:00", "11:00", "12:00"]
        },
        11: {
          available_times: ["10:00", "11:00", "12:00"]
        }
      }
    }
  }
}]
