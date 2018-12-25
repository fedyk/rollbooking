import { SalonService } from "../../../models/salon-service";
import { getServiceName, getServicePrice, getServiceDescription } from "../../../utils/service";
import { BookingWorkday } from "../../../models/booking-workday";
import { stringify } from "querystring";
import { dateToISODate } from "../../../helpers/booking-workday/date-to-iso-date";

interface Params {
  salonId: number;
  workday: BookingWorkday;
  salonServices: SalonService[];
  masterId?: number;
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
            name: getServiceName(service),
            price: prettyPrice(getServicePrice(service)),
            description: getServiceDescription(service),
            times: workdayMasterServices.available_times.map(time => ({
              text: time,
              url: `/booking/${salonId}/checkout?${stringify({
                m: masterId,
                s: serviceId,
                d: `${dateToISODate(workday.period.startDate)}T${time}:00Z`,
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


// todo: add currency to number
function prettyPrice(price: number) {
  return price.toString()
}
