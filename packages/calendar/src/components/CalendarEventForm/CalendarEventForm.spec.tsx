import * as React from "react";
import { shallow, mount } from "enzyme";
import { CalendarEventForm } from "./CalendarEventForm";
import { Event, Service, Client } from "../../types";

const event: Event = {
  id: "1",
  title: "1",
  start: new Date(2018, 0, 1, 10, 0, 0),
  end: new Date(2018, 0, 1, 11, 0, 0),
  serviceId: 1,
  masterId: "1"
};

const clients: Client[] = [];

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
  test("it should render", function() {
    const component = shallow(
      <CalendarEventForm
        event={event}
        clients={clients}
        services={services}
        onUpdate={() => {}}
      />
    );

    expect(component).toBeTruthy();
    expect(component.find("#starts").props().value).toBe("10:00");
    expect(component.find("#ends").props().value).toBe("11:00");
    expect(component.find("#service").props().value).toBe("1");
  });

  test("it should update start time", function() {
    const onUpdate = jest.fn();
    const component = mount(
      <CalendarEventForm
        event={event}
        clients={clients}
        services={services}
        onUpdate={onUpdate}
      />
    );

    component.find("#starts").simulate("change", {
      target: {
        value: "11:00"
      }
    });

    expect(onUpdate).toBeCalledTimes(1);
    expect(onUpdate.mock.calls[0][0]).toMatchObject({
      start: new Date(2018, 0, 1, 11, 0, 0),
      end: new Date(2018, 0, 1, 12, 0, 0)
    });
  });

  test("it should update end time", function() {
    const onUpdate = jest.fn();
    const component = mount(
      <CalendarEventForm
        event={event}
        clients={clients}
        services={services}
        onUpdate={onUpdate}
      />
    );

    component.find("#ends").simulate("change", {
      target: {
        value: "12:00"
      }
    });

    expect(onUpdate).toBeCalledTimes(1);
    expect(onUpdate.mock.calls[0][0]).toMatchObject({
      start: new Date(2018, 0, 1, 11, 0, 0),
      end: new Date(2018, 0, 1, 12, 0, 0)
    });
  });

  test("it should update service & event duration", function() {
    const onUpdate = jest.fn();
    const component = mount(
      <CalendarEventForm
        event={event}
        clients={clients}
        services={services}
        onUpdate={onUpdate}
      />
    );

    component.find("#service").simulate("change", {
      target: {
        value: 2
      }
    });

    expect(onUpdate).toBeCalledTimes(1);
    expect(onUpdate.mock.calls[0][0]).toMatchObject({
      serviceId: 2,
      start: new Date(2018, 0, 1, 10, 0, 0),
      end: new Date(2018, 0, 1, 12, 0, 0)
    } as Partial<Event>);
  });
});
