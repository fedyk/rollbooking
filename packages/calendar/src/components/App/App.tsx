import * as React from "react";
import { Calendar } from "../Calendar/Calendar";
import { rawEventToEvent } from "../../helpers/raw-event-to-event";
import { dateToISODateTime } from "../../helpers/date-to-iso-datetime";
import { CalendarContext } from "../CalendarContext/CalendarContext";
import { Event, Master, Endpoints, Service } from "../../types";
import { Toolbar } from "../Toolbar/Toolbar";
import { dateToISODate } from "../../helpers/date-to-iso-date";
import { indexBy } from "../../helpers/index-by";
import { values } from "../../helpers/values";
import { delay } from "../../helpers/delay";

interface Props {
  date: Date;
  masters: Master[];
  services: Service[];
  events: Event[];
  endpoints: Endpoints;
}

interface State {
  date: Date;
  masters: Master[];
  events: {
    [key: string]: Event;
  };
}

export class App extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      date: props.date,
      masters: props.masters,
      events: indexBy(props.events, "id")
    };
  }

  onNavigate = (date: Date) => {
    this.setState({ date });
    this.fetchEvents(date);
  };

  onSelectSlot = (slotInfo: any) => {
    const { start, end, resourceId } = slotInfo;
    const tempEventId = `${Math.round(Math.random() * 1000000)}`;
    const tempEventTitle = "Saving..";
    const fetchOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: tempEventTitle,
        start: dateToISODateTime(start),
        end: dateToISODateTime(end),
        resourceId
      })
    };

    fetch(this.props.endpoints.create, fetchOptions)
      .then((response) => response.json())
      .then((rawEvent) => {
        const event = rawEventToEvent(rawEvent);
        const events = {
          ...this.state.events,
          ...{
            [event.id]: event,
            [tempEventId]: null
          }
        };

        this.setState({ events });
      })
      .catch((reason) => console.error(reason));

    // Add temp event in state
    const tempEvent = {
      id: tempEventId,
      title: tempEventTitle,
      start,
      end,
      masterId: resourceId
    };

    const events = {
      ...this.state.events,
      ...{
        [tempEventId]: tempEvent
      }
    };

    this.setState({ events });

    return true;
  };

  updateEvent = (event: Event) => {
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(event)
    };

    fetch(this.props.endpoints.update, options)
      .then((response) => response.json())
      .then((rawEvent) => {
        const event = rawEventToEvent(rawEvent);
        const events = {
          ...this.state.events,
          ...{
            [event.id]: event
          }
        };

        this.setState({ events });
      })
      .catch((reason) => console.error(reason));
  };

  fetchEvents(date: Date) {
    const url = `${this.props.endpoints.list}?date=${dateToISODate(date)}`;
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json"
      }
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((rawEvents) => {
        const incomingEvents = indexBy(
          rawEvents.map(rawEventToEvent) as Event[],
          "id"
        );
        const events = { ...this.state.events, ...incomingEvents };

        this.setState({ events });
      })
      .catch((error) => console.error(error));
  }

  onSelectEvent = (selectEvent: Event) => {
    const event = {
      ...this.state.events[selectEvent.id],
      // ...{
      //   showPopover: true
      // }
    };
    const events = {
      ...this.state.events,
      ...{
        [event.id]: event
      }
    };

    this.setState({ events });

    return true;
  };

  deleteEvent = (eventId: string) => {
    const url = `${this.props.endpoints.delete}?rid=${eventId}`;
    const options = {
      method: "POST"
    };

    fetch(url, options).then(() => {
      const events = Object.assign({}, this.state.events);
      
      delete events[eventId];

      this.setState({ events });
    })
    .catch((err) => console.error(err));
  };

  onPrev = () => {
    const date = new Date(this.state.date.getTime());

    date.setDate(date.getDate() - 1);

    this.setState({ date });
    this.fetchEvents(date);
  };

  onNext = () => {
    const date = new Date(this.state.date.getTime());

    date.setDate(date.getDate() + 1);

    this.setState({ date });
    this.fetchEvents(date);
  };

  onToday = () => {
    const date = new Date();

    this.setState({ date });
    this.fetchEvents(date);
  };

  render() {
    return (
      <CalendarContext.Provider
        value={{
          services: this.props.services,
          deleteEvent: this.deleteEvent,
          updateEvent: this.updateEvent
        }}
      >
        <div className="card">
          <div className="card-body">
            <Toolbar
              date={this.state.date}
              onPrev={this.onPrev}
              onToday={this.onToday}
              onNext={this.onNext}
            />

            <Calendar
              date={this.state.date}
              resources={this.state.masters}
              events={values(this.state.events)}
              onNavigate={this.onNavigate}
              onSelectSlot={this.onSelectSlot}
              onSelectEvent={this.onSelectEvent}
            />
          </div>
        </div>
      </CalendarContext.Provider>
    );
  }
}
