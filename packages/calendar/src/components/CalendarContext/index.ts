import * as React from "react";

const noop = () => {};

interface ContextValue {
  deleteEvent(eventId: string): void;
  openEventModal(eventId: string): void;
}

export const CalendarContext = React.createContext<ContextValue>({
  deleteEvent: noop,
  openEventModal: noop
})
