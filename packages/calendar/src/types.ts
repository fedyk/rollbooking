import { Event as BigCalendarEvent } from "react-big-calendar";

export interface Event extends BigCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  masterId: string;
  clientId?: string;
  clientName?: string;
  serviceId?: string;
  serviceName?: string;
  showPopover?: boolean;
}

export interface Master {
  id: string;
  name: string;
}

export interface Service {
  id: number,
  name: string,
  duration: number;
}

export interface DateObject {
  year: number;
  month: number;
  day: number;
}

export interface Data {
  date: DateObject;
  events: Event[];
  masters: Master[];
  services: Service[];
  endpoints: {
    base: string,
    create: string;
    update: string;
    "delete": string;
  };
}