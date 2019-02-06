import * as React from "react";
import { Event } from "../../types";

const noop = () => {};

interface ContextValue {
  deleteEvent(eventId: string): void;
  updateEvent(event: Event): void;
  openEventModal(eventId: string): void;
}

export const CalendarContext = React.createContext<ContextValue>({
  deleteEvent: noop,
  openEventModal: noop,
  updateEvent: noop,
})
