import * as React from 'react';
import * as ReactDOM from 'react-dom'
import { App } from "./components/App";
import { rawEventToEvent } from './helpers/raw-event-to-event';

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

export interface Data {
  date: Date,
  resources: Resource[],
  events: Event[],
  endpoints: {
    create: string;
    updates: string;
    delete: string;
  }
}

export function render(targetSelector, data: Data) {
  const { date } = data
  const target = document.querySelector(targetSelector);

  if (!target) {
    throw new Error(`Target for calendar doesn't exist(${targetSelector})`);
  }

  return ReactDOM.render(<App
    date={new Date(date.year, date.month - 1, date.day)}
    resources={data.resources}
    events={data.events.map(rawEventToEvent)}
    endpoints={data.endpoints}
  />, target);
}

const initialState = (window as any).__initialState;

if (initialState) {
  render("#calendar", initialState)
}
