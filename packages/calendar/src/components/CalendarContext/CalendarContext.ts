import * as React from "react";
import { Event, Service, Client } from "../../types";

export interface ContextValue {
  clients: Client[],
  services: Service[],
  deleteEvent(eventId: string): void;
  updateEvent(event: Event): void;
  createClient(text: string): Promise<Client>;
  suggestClients(query: string): Promise<Client[]>;
}

export const CalendarContext = React.createContext<ContextValue>({
  clients: [],
  services: [],
  deleteEvent: () => {},
  updateEvent: () => {},
  createClient: () => Promise.reject(new Error("Not implemented")),
  suggestClients: () => Promise.reject(new Error("Not implemented"))
})
