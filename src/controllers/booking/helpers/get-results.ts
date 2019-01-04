import { stringify } from "querystring";
import { BookingWorkday } from "../../../models/booking-workday";
import { SalonService } from "../../../models/salon";
import { CheckoutURLParams } from "../interfaces";
import { dateTimeToISODate } from "../../../helpers/date/date-time-to-iso-date";
import { timeOfDayToISOTime } from "../../../helpers/date/time-of-day-to-iso-time";
import { Date as DateObject } from "../../../models/date";
import { dateToISODate } from "../../../helpers/booking-workday/date-to-iso-date";

interface Params {
  salonId: string;
  workday: BookingWorkday;
  date: DateObject;
  salonServices: SalonService[];
  masterId?: string;
  serviceId?: number;
  timezoneName: string;
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
  const { salonId, workday, salonServices, masterId, serviceId } = params;
  const masterIdStr = masterId ? masterId.toString() : "";
  const serviceIdStr = serviceId ? serviceId.toString() : "";
  const results: Result[] = [];
  const salonServicesByIds = getSalonServiceByIds(salonServices);

  for (const masterId in workday.masters) {
    if (workday.masters.hasOwnProperty(masterId)) {
      const workdayMaster = workday.masters[masterId];

      if (masterIdStr !== "" && masterId !== masterIdStr) {
        continue;
      }

      for (const serviceId in workdayMaster.services) {
        if (workdayMaster.services.hasOwnProperty(serviceId)) {

          if (serviceIdStr !== "" && serviceId !== serviceIdStr) {
            continue;
          }

          const workdayMasterServices = workdayMaster.services[serviceId];
          const service = salonServicesByIds.get(serviceId);

          results.push({
            name: service.name,
            price: prettyPrice(service.price),
            description: service.description,
            times: workdayMasterServices.availableTimes.map(function(time) {
              const hours = time.hours.toString().padStart(2, "0");
              const minutes = time.minutes.toString().padStart(2, "0");
              const queryString: CheckoutURLParams = {
                m: masterId,
                s: serviceId,
                wdps: dateTimeToISODate(workday.period.start),
                wdpe: dateTimeToISODate(workday.period.end),
                t: timeOfDayToISOTime(time),
                d: dateToISODate(params.date),
              }

              return {
                text: `${hours}:${minutes}`,
                url: `/booking/${salonId}/checkout?${stringify(queryString)}`
              }
            })
          })
        }
      }
      
    }
  }

  return results;
}

function getSalonServiceByIds(salonServices: SalonService[]) {
  const result = new Map<string, SalonService>();

  for (let i = 0; i < salonServices.length; i++) {
    const salonService = salonServices[i];
    
    result.set(`${salonService.id}`, salonService);
  }

  return result;
}


// todo: add currency to number
function prettyPrice(price: number) {
  return price.toString()
}
