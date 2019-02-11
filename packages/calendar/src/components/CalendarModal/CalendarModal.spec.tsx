import * as React from "react";
import { shallow, mount } from "enzyme";
import { CalendarModal } from "./CalendarModal";
import { Event, Service } from "../../types";

const event: Event = {
  id: "1",
  title: "1",
  start: new Date(2018, 0, 1, 10, 0, 0),
  end: new Date(2018, 0, 1, 11, 0, 0),
  serviceId: 1,
  masterId: "1"
};

const services: Service[] = [
  {
    id: 1,
    name: "Service",
    duration: 60
  },
  {
    id: 2,
    name: "Service",
    duration: 120
  }
];

describe("CalendarEventForm", function() {
  const prevBootstrap = (global as any).bootstrap;
  const prevJQuery = (global as any).jQuery;

  beforeEach(function() {
    (global as any).bootstrap = {
      Modal: jest.fn().mockImplementation(() => ({
        show: jest.fn(),
        dispose: jest.fn()
      }))
    };

    (global as any).jQuery = jest.fn().mockImplementation(() => ({
      on: jest.fn()
    }));
  });

  afterEach(function() {
    (global as any).bootstrap = prevBootstrap;
    (global as any).jQuery = prevJQuery;
  });

  test("it should render", function() {
    const component = shallow(
      <CalendarModal
        event={event}
        isSaving={false}
        services={services}
        onSave={() => {}}
        onCancel={() => {}}
        onDelete={() => {}}
      />
    );

    expect(component).toBeTruthy();
    expect((global as any).bootstrap.Modal).toHaveBeenCalledTimes(1);
    expect((global as any).jQuery).toHaveBeenCalledTimes(1);
  });
});
