import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/App/App";
import { rawEventToEvent } from "./helpers/raw-event-to-event";
import { Data } from "./types";
import { assert } from "./helpers/assert";

export function render(targetSelector, data: Data) {
  const { date } = data;
  const target = document.querySelector(targetSelector);

  assert(target, `Target for calendar doesn't exist(${targetSelector})`);
  assert(data, `Calendar require initial state`);
  assert(data.date, "`data.date` is required");
  assert(data.date.day, "`data.date` should follow `DateObject` interface");
  assert(data.date.month, "`data.date` should follow `DateObject` interface");
  assert(data.date.year, "`data.date` should follow `DateObject` interface");
  assert(data.events, "`data.events` is required");
  assert(data.masters, "`data.masters` is required");
  assert(data.services, "`data.services` is required");
  assert(data.endpoints, "`data.endpoints` is required");

  return ReactDOM.render(
    <App
      date={new Date(date.year, date.month - 1, date.day)}
      events={data.events.map(rawEventToEvent)}
      masters={data.masters}
      services={data.services}
      endpoints={data.endpoints}
    />,
    target
  );
}

const initialState = (window as any).__INITIAL_STATE__;

if (initialState) {
  render("#calendar", initialState);
}
