import * as React from "react";
import { DateLocalizer } from "react-big-calendar";
import { Event } from "../../types";

interface Props {
  event: Event;
  title: string;
  isAllDay?: boolean;
  localizer?: DateLocalizer;
}

export class CalendarEvent extends React.PureComponent<Props> {
  render() {
    return (
      <div>{this.props.title}</div>
    );
  }
}

