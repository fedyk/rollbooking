import { Event } from "../types";

export function rawEventToEvent(event): Event {
  return {
    id: event.id,
    title: event.title,
    start: new Date(event.start),
    end: new Date(event.end),
    masterId: event.masterId,
    clientId: event.clientId,
    clientName: event.clientName,
    serviceId: event.serviceId,
    serviceName: event.serviceName,
    showPopover: false
  };
}
