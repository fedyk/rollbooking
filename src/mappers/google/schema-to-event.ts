import { calendar_v3 } from "googleapis";
import { SalonEvent } from "../../models/salon-event";

export function schemaToEvent(schema: calendar_v3.Schema$Event, masterId: number): SalonEvent {
  return {
    id: schema.id,
    name: schema.description,
    start: new Date(schema.start.dateTime),
    end: new Date(schema.end.dateTime),
    masterId
  }
}
