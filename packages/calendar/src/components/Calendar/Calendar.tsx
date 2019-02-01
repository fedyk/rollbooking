import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.scss";

import * as React from "react";
import {
  default as BigCalendar,
  Navigate,
  View,
  stringOrDate,
  ToolbarProps
} from "react-big-calendar";
import moment from "moment";
import { CalendarEvent } from "../CalendarEvent";

const localizer = BigCalendar.momentLocalizer(moment);

export interface Resource {
  id: string;
  title: string;
}

export interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId: string;
  showPopover?: boolean;
}

export interface Props {
  date: Date;
  resources: Resource[];
  events: Event[];
  onNavigate?: (newDate: Date, view: View, action: Navigate) => void;
  onSelectSlot?: (
    slotInfo: {
      start: stringOrDate;
      end: stringOrDate;
      resourceId?: string;
      slots: Date[] | string[];
      action: "select" | "click" | "doubleClick";
    }
  ) => void;
  onDoubleClickEvent?: (event: Event) => void;
  onSelectEvent?: (event: Event) => void;
}

export class Calendar extends React.PureComponent<Props> {
  render() {
    return (
      <BigCalendar
        defaultDate={this.props.date}
        events={this.props.events}
        resources={this.props.resources}
        selectable={true}
        localizer={localizer}
        defaultView={BigCalendar.Views.DAY}
        views={["day"]}
        step={15}
        components={{
          toolbar: Test,
          event: CalendarEvent
        }}
        onNavigate={this.props.onNavigate}
        onSelectSlot={this.props.onSelectSlot}
        onDoubleClickEvent={this.props.onDoubleClickEvent}
        onSelectEvent={this.props.onSelectEvent}
      />
    );
  }
}

class Test extends React.PureComponent<ToolbarProps> {
  render() {
    return <h5 className="card-title">Calendar</h5>
  }
}