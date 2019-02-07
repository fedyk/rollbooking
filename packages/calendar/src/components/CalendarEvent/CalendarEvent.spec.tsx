import * as React from "react";
import { create } from "react-test-renderer";

import { CalendarEvent } from "./CalendarEvent";
import { Event } from "../../types";
import { CalendarContext } from "../CalendarContext/CalendarContext";

(global as any).bootstrap = {
  Popover: () => {}
};

xit("renders correctly", () => {
  const event: Event = {
    id: "1",
    title: "event",
    start: new Date(2018, 0, 1, 10, 0, 0),
    end: new Date(2018, 0, 1, 11, 0, 0),
    masterId: "1",
    serviceId: 1
  };
  const noop = () => {};
  const tree = create(
    <CalendarContext.Provider
      value={{
        services: [
          {
            id: 1,
            name: "Service",
            duration: 60
          }
        ],
        updateEvent: noop,
        deleteEvent: noop,
        openEventModal: noop
      }}
    >
      <div>
        <div>
          <div>
            <CalendarEvent event={event} title={event.title} />
          </div>
        </div>
      </div>
      ]
    </CalendarContext.Provider>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
