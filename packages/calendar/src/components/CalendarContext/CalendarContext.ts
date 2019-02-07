import * as React from "react";
import { Event, Service } from "../../types";

const noop = () => {};

interface ContextValue {
  services: Service[],
  deleteEvent(eventId: string): void;
  updateEvent(event: Event): void;
  openEventModal(eventId: string): void;
}

export const CalendarContext = React.createContext<ContextValue>({
  services: [],
  deleteEvent: noop,
  updateEvent: noop,
  openEventModal: noop,
})
