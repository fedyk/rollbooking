import { Event as BigCalendarEvent } from "react-big-calendar";

export interface Event extends BigCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId: string;
  userId?: string;
  userName?: string;
  serviceId?: string;
  serviceName?: string;
  showPopover?: boolean;
}
