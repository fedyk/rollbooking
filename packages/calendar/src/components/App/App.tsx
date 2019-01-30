import * as React from "react";
import { Calendar, Resource, Event } from "../Calendar";
import { rawEventToEvent } from "../../helpers/raw-event-to-event";
import { dateToLocalISOString } from "../../helpers/date-to-local-iso-string";

interface Props {
  date: Date;
  resources: Resource[];
  events: Event[];
  endpoints: {
    create: string;
    updates: string;
    delete: string;
  }
}

interface State {
  date: Date;
  resources: Resource[];
  events: Event[];
}

export class App extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      date: props.date,
      resources: props.resources,
      events: props.events,
    }
  }

  onSelectSlot = (slotInfo: any) => {
    console.log('onSelectSlot', slotInfo);

    const { start, end, resourceId } = slotInfo;
    const tempEventId = `${Math.round(Math.random() * 1000000)}`;
    const tempEventTitle = "Saving..";
 
    fetch(this.props.endpoints.create, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: tempEventTitle,
        start: dateToLocalISOString(start),
        end: dateToLocalISOString(end),
        resourceId
      })
    })
    .then((response) => {
      return response.json();
    })
    .then((rawEvent) => {

      // Replace temp event to real one
      const events = this.state.events.map(v => v.id === tempEventId ? rawEventToEvent(rawEvent) : v);

      this.setState({ events })
    })
    .catch((reason) => {
      console.error(reason)
    })

    this.setState({
      events: this.state.events.concat({
        id: tempEventId,
        title: tempEventTitle,
        start,
        end,
        resourceId
      })
    })

    return true;
  }

  onSelectEvent = (selectEvent: Event) => {
    const events = this.state.events.map(function(event) {
      if (event.id === selectEvent.id) {
        return { ...event, ...{
          showPopover: true
        }}
      }
      else {
        return { ...event, ...{
          showPopover: false
        }}
      }
    })

    this.setState({ events })

    return true;
  }

  render() {
    return <Calendar
      date={this.state.date}
      resources={this.state.resources}
      events={this.state.events}
      onSelectSlot={this.onSelectSlot}
      onSelectEvent={this.onSelectEvent}
    ></Calendar>
  }
}

