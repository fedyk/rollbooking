import * as React from 'react';
import * as ReactDOM from 'react-dom'
import { Calendar, Props } from "./components/Calendar";

export interface Date {
  year: number;
  month: number;
  day: number;
}

export interface Resource {
  id: string;
  title: string;
}

export interface Event {
  id: string;
  title: string;
  start: string; // iso, local
  end: string; // iso, local
  resourceId: string;
}

export function render(targetSelector, date: Date, resources: Resource[], events: Event[]) {
  const target = document.querySelector(targetSelector);

  if (!target) {
    throw new Error(`Target for calendar doesn't exist(${targetSelector})`);
  }

  return ReactDOM.render(<Calendar
    date={new Date(date.year, date.month - 1, date.day)}
    resources={resources}
    events={events.map(function(event) {
      return {
        id: event.id,
        title: event.title,
        start: new Date(event.start),
        end: new Date(event.end),
        resourceId: event.resourceId
      };
    })}
  />, target);
}
