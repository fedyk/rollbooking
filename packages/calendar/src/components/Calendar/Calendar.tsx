import "./Calendar.scss";
import "react-big-calendar/lib/css/react-big-calendar.css";

import * as React from "react";
import { default as BigCalendar } from "react-big-calendar";
import moment from "moment";

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
}

export interface Props {
  date: Date;
  resources: Resource[];
  events: Event[];
}

export interface State {
  events: Event[];
}

export class Calendar extends React.PureComponent<Props> {
  handleSelectSlot = ({ start, end }) => {
    console.log(start, end)
    return true;
  }
  render() {
    return <React.Fragment>
      <BigCalendar
        selectable={true}
        events={this.props.events}
        localizer={localizer}
        defaultView={BigCalendar.Views.DAY}
        views={['day']}
        step={15}
        defaultDate={this.props.date}
        resources={this.props.resources}
        onSelectSlot={this.handleSelectSlot}
      />
    </React.Fragment>
  }
}
