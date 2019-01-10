import { stringify } from "querystring";
import { BookingWorkday } from "../../../models/booking-workday";
import { SalonService } from "../../../models/salon";
import { CheckoutURLParams } from "../interfaces";
import { dateTimeToISODate } from "../../../helpers/date/date-time-to-iso-date";
import { timeOfDayToISOTime } from "../../../helpers/date/time-of-day-to-iso-time";
import { Date as DateObject } from "../../../models/date";
import { dateToISODate } from "../../../helpers/booking-workday/date-to-iso-date";
import { TimeOfDay } from "../../../models/time-of-day";

interface Params {
  salonId: string;
  bookingWorkdays: BookingWorkday[];
  salonServices: SalonService[];
  selectedDate?: DateObject;
  masterId?: string;
  serviceId?: number;
}

interface Result {
  name: string;
  price: string;
  description?: string;
  times: Array<{
    url: string;
    text: string;
  }>
}

export function getResults(params: Params): Result[] {
  const serviceId = params.serviceId ? params.serviceId.toString() : "";
  const salonServices = params.salonServices || [];

  const availableTimesByServiceId = groupAvailableTimesByServiceId(params.bookingWorkdays, params.masterId, serviceId);

  return salonServices.filter(function(v) {
    return availableTimesByServiceId.has(v.id.toString())
  }).map(function(salonService) {
    const availableTimes = availableTimesByServiceId.get(salonService.id.toString());
    const uniqAvailableTimes = getUniqAvailableTimes(availableTimes);

    return {
      name: salonService.name,
      price: prettyPrice(salonService.price),
      description: salonService.description,
      times: uniqAvailableTimes.map(function ({
        availableTime: time,
        bookingWorkday: workday,
        masterId
      }) {
        const hours = time.hours.toString().padStart(2, "0");
        const minutes = time.minutes.toString().padStart(2, "0");
        const date = params.selectedDate || {
          year: workday.period.start.year,
          month: workday.period.start.month,
          day: workday.period.start.day
        }

        const queryString: CheckoutURLParams = {
          m: masterId,
          s: salonService.id.toString(),
          wdps: dateTimeToISODate(workday.period.start),
          wdpe: dateTimeToISODate(workday.period.end),
          t: timeOfDayToISOTime(time),
          d: dateToISODate(date),
        }

        return {
          text: `${hours}:${minutes}`,
          url: `/booking/${params.salonId}/checkout?${stringify(queryString)}`
        }
      })
    }
  })
}

function groupAvailableTimesByServiceId(bookingWorkdays: BookingWorkday[], selectedMasterId?: string, selectedServiceId?: string) {
  const results = new Map<string, {
    masterId: string;
    bookingWorkday: BookingWorkday;
    availableTimes: TimeOfDay[]
  }[]>();

  for (let i = 0; i < bookingWorkdays.length; i++) {
    const bookingWorkday = bookingWorkdays[i];

    for (let masterId in bookingWorkday.masters) {

      // curr master is not selected, skip it
      if (selectedMasterId && masterId !== selectedMasterId) {
        continue;
      }

      const master = bookingWorkday.masters[masterId];

      for (let serviceId in master.services) {
        if (selectedServiceId && serviceId !== selectedServiceId) {
          continue;
        }

        const service = master.services[serviceId];
        const result = {
          masterId: masterId,
          bookingWorkday: bookingWorkday,
          availableTimes: service.availableTimes
        }

        results.has(serviceId)
          ? results.get(serviceId).push(result)
          : results.set(serviceId, [result])
      }
    }
  }

  return results;
}

function getUniqAvailableTimes(availableTimes: {
  masterId: string;
  bookingWorkday: BookingWorkday;
  availableTimes: TimeOfDay[]
}[]): {
  masterId: string;
  bookingWorkday: BookingWorkday;
  availableTime: TimeOfDay
}[] {
  const result = new Map<string, {
    masterId: string;
    bookingWorkday: BookingWorkday;
    availableTime: TimeOfDay
  }>();
  const mastersSlots = new Map<string, number>();

  for (let i = 0; i < availableTimes.length; i++) {
    const availableTime = availableTimes[i];
    const masterId = availableTime.masterId;

    mastersSlots.set(masterId, availableTime.availableTimes.length);
  }

  for (let i = 0; i < availableTimes.length; i++) {
    const item = availableTimes[i];

    for (let j = 0; j < item.availableTimes.length; j++) {
      const availableTime = item.availableTimes[j];
      const time = timeOfDayToISOTime(availableTime);

      if (!result.has(time)) {
        result.set(time, {
          masterId: item.masterId,
          bookingWorkday: item.bookingWorkday,
          availableTime: availableTime
        });
      }
      else if (mastersSlots.has(item.masterId) && mastersSlots.has(result.get(time).masterId) && mastersSlots.get(item.masterId) > mastersSlots.get(result.get(time).masterId)) {
        result.set(time, {
          masterId: item.masterId,
          bookingWorkday: item.bookingWorkday,
          availableTime: availableTime
        });
      }
    }
  }

  const times = Array.from(result.values());

  times.sort(function(a, b) {
    const { availableTime: aTime } = a
    const { availableTime: bTime } = b
    
    if (aTime.hours !== bTime.hours) {
      return aTime.hours - bTime.hours;
    }

    if (aTime.minutes !== bTime.minutes) {
      return aTime.minutes - bTime.minutes;
    }

    if (aTime.seconds !== bTime.seconds) {
      return aTime.seconds - bTime.seconds;
    }

    return 0;
  })

  return times;
}

// todo: add currency to number
function prettyPrice(price: number) {
  return price.toString()
}
