export interface BookingWorkday {
  year: number;
  month: number;
  day: number;

  salon_id: 1;

  masters: {
    [master_id: string]: {
      services: {
        [service_id: string]: {
          available_times: number[]
        }
      }
    }
  }
}

// mock
export const bookingWorkdays: BookingWorkday[] = [{
  year: 2018,
  month: 12,
  day: 15,

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
