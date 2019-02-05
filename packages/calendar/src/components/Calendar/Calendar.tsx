import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";

import * as React from "react";
import globalize from "globalize";
import {
  default as BigCalendar,
  Navigate,
  View,
  stringOrDate
} from "react-big-calendar";
import { CalendarEvent } from "../CalendarEvent/CalendarEvent";
import { Event, Master } from "../../types";

const localizer = BigCalendar.globalizeLocalizer(globalize);

export interface Props {
  date: Date;
  resources: Master[];
  events: Event[];
  onNavigate?: (newDate: Date, view: View, action: Navigate) => void;
  onSelectSlot?: (slotInfo: {
    start: stringOrDate;
    end: stringOrDate;
    resourceId?: string;
    slots: Date[] | string[];
    action: "select" | "click" | "doubleClick";
  }) => void;
  onDoubleClickEvent?: (
    event: Event,
    clickEvent?: React.SyntheticEvent
  ) => void;
  onSelectEvent?: (event: Event) => void;
}

export class Calendar extends React.PureComponent<Props> {
  render() {
    return (
      <BigCalendar
        defaultDate={this.props.date}
        events={this.props.events}
        titleAccessor={(event) => event.title}
        resources={this.props.resources}
        resourceAccessor={(event: Event) => event.masterId}
        resourceIdAccessor={(resource) => resource.id}
        resourceTitleAccessor={(resource) => resource.name}
        selectable={true}
        localizer={localizer}
        defaultView={BigCalendar.Views.DAY}
        views={["day"]}
        step={15}
        components={{
          toolbar: () => null,
          event: CalendarEvent
        }}
        onNavigate={this.props.onNavigate}
        onSelectSlot={this.props.onSelectSlot}
        onDoubleClickEvent={this.props.onDoubleClickEvent}
        onSelectEvent={this.props.onSelectEvent}
        culture="en"
      />
    );
  }
}
