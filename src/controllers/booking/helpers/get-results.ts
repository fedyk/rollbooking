import { SalonService } from "../../../models/salon-service";
import { getServiceName, getServicePrice, getServiceDescription } from "../../../utils/service";
import { BookingWorkday } from "../../../models/booking-workday";
import { stringify } from "querystring";
import { workdayISODate } from "../../../helpers/booking-workday/workday-iso-date";

interface Result {
  name: string;
    price: string;
    description?: string;
    times: Array<{
      url: string;
      text: string;
    }>
}

export function getResults(workday: BookingWorkday, salonServices: SalonService[]): Result[] {
  const results: Result[] = [];
  const salonServicesByIds = getSalonServiceByIds(salonServices);


  for (const masterId in workday.masters) {
    if (workday.masters.hasOwnProperty(masterId)) {
      const workdayMaster = workday.masters[masterId];

      for (const serviceId in workdayMaster.services) {
        if (workdayMaster.services.hasOwnProperty(serviceId)) {
          const workdayMasterServices = workdayMaster.services[serviceId];
          const service = salonServicesByIds.get(serviceId);

          results.push({
            name: getServiceName(service),
            price: prettyPrice(getServicePrice(service)),
            description: getServiceDescription(service),
            times: workdayMasterServices.available_times.map(time => ({
              text: prettyTime(time),
              url: `/booking/${workday.salon_id}/checkout?${stringify({
                m: masterId,
                s: serviceId,
                d: workdayISODate(workday),
                t: time
              })}`
            }))
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

function prettyTime(time: number) {
  const hours = Math.floor(time / 60).toString().padStart(2, "0");
  const minutes = (time % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}

// todo: add currency to number
function prettyPrice(price: number) {
  return price.toString()
}
