import { Event } from "../types";
import { dateToISODateTime } from "./date-to-iso-datetime";

export function eventToRawEvent(event: Event) {
  return {
    id: event.id,
    title: event.title,
    start: dateToISODateTime(event.start),
    end: dateToISODateTime(event.end),
    masterId: event.masterId,
    clientId: event.clientId,
    clientName: event.clientName,
    serviceId: event.serviceId,
    serviceName: event.serviceName
  };
}
