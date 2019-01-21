import "./Calendar.scss";
import "react-big-calendar/lib/css/react-big-calendar.css";

import * as React from "react";
import { default as BigCalendar } from "react-big-calendar";
import moment from "moment";

const events = [
  {
    id: 0,
    title: 'Board meeting',
    start: new Date(2018, 0, 29, 9, 0, 0),
    end: new Date(2018, 0, 29, 13, 0, 0),
    resourceId: 1,
  },
  {
    id: 1,
    title: 'MS training',
    allDay: true,
    start: new Date(2018, 0, 29, 14, 0, 0),
    end: new Date(2018, 0, 29, 16, 30, 0),
    resourceId: 2,
  },
  {
    id: 2,
    title: 'Team lead meeting',
    start: new Date(2018, 0, 29, 8, 30, 0),
    end: new Date(2018, 0, 29, 12, 30, 0),
    resourceId: 3,
  },
  {
    id: 11,
    title: 'Birthday Party',
    start: new Date(2018, 0, 30, 7, 0, 0),
    end: new Date(2018, 0, 30, 10, 30, 0),
    resourceId: 4,
  },
]

const resourceMap = [
  { id: 1, title: 'Board room' },
  { id: 2, title: 'Training room' },
  { id: 3, title: 'Meeting room 1' },
  { id: 4, title: 'Meeting room 2' },
]

const localizer = BigCalendar.momentLocalizer(moment);

export interface Props {
  date: Date;
  resources: Array<{
    id: string;
    title: string;
  }>
  events: Array<{
    id: string;
    title: string;
    start: Date;
    end: Date;
    resourceId: string;
  }>
}

export class Calendar extends React.PureComponent<Props> {
  render() {
    return <div>
      <BigCalendar
      events={this.props.events}
      localizer={localizer}
      defaultView={BigCalendar.Views.DAY}
      views={['day']}
      step={15}
      defaultDate={this.props.date}
      resources={this.props.resources}
    />
    </div>
  }
}
