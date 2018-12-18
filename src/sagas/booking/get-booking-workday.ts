import { Salon } from "../../models/salon";
import { SalonUser } from "../../models/salon-user";
import { SalonService } from "../../models/salon-service";
import { SalonReservation } from "../../models/salon-reservation";
import { BookingWorkday, Masters, Period } from "../../models/booking-workday";
import { TimePeriod } from "../../models/time-period";
import { SpecialHourPeriod } from "../../models/special-hour-period";

interface Params {
  startPeriod: Date;
  endPeriod: Date;
  salon: Salon;
  salonMasters: SalonUser[];
  salonService: SalonService[];
  salonReservations: SalonReservation[]
}

export async function getBookingWorkday(params: Params): Promise<BookingWorkday> {
  const { salon } = params;

  const masters: Masters = {
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

  return {
    period: {
      startDate: {
        year: 2018,
        month: 2,
        day: 1
      },
      startTime: 120,
      endDate: {
        year: 2018,
        month: 2,
        day: 1
      },
      endTime: 120 * 8
    },
    salon_id: salon.id,
    masters: masters
  }
}

export function getPeriods(start: Date, end: Date, periods: TimePeriod[], specialPeriods: SpecialHourPeriod[]): Period[] {
  return []
}


