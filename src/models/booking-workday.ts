import { Date } from "./date";

export interface BookingWorkday {
  salon_id: number;
  period: Period;
  masters: Masters;
}

export interface Period {
  startDate: Date;
  startTime: number;
  endDate: Date;
  endTime: number;
}

export interface Masters {
  [master_id: string]: {
    services: Services
  }
}

export interface Services {
  [service_id: string]: {
    available_times: number[]
  }  
}

// mock
export const bookingWorkdays2: BookingWorkday[] = [];

export const bookingWorkdays: BookingWorkday[] = [{
  period: {
    startDate: {
      year: 2018,
      month: 12,
      day: 15,
    },
    startTime: 60,
    endDate: {
      year: 2018,
      month: 12,
      day: 15,
    },
    endTime: 60 * 8
  },
  salon_id: 1,

  masters: {
    1: {
      services: {
        10: {
          available_times: [600, 660, 840]
        },
        11: {
          available_times: [600, 660, 840]
        }
      }
    },
    2: {
      services: {
        10: {
          available_times: [600, 660, 840]
        },
        11: {
          available_times: [600, 660, 840]
        }
      }
    }
  }
}]
