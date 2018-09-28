import { calendar_v3 } from "googleapis";
import { Event as FullCalendarEvent } from "../../view-models/fullcalendar/event";

export function toFullcalendarEvent(
  schema: calendar_v3.Schema$Event,
  masterId: number
): FullCalendarEvent {
  return {
    id: schema.id,
    title: schema.summary,
    start: schema.start.dateTime,
    end: schema.end.dateTime,
    resourceId: masterId
  }
}
