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
import { CalendarModal } from "../CalendarModal/CalendarModal";
import { eventToRawEvent } from "../../helpers/event-to-raw-event";

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
  selectedEventId: string;
  isSavingEvent: boolean;
  isDeletingEvent: boolean;
}

export class App extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      date: props.date,
      masters: props.masters,
      events: indexBy(props.events, "id"),
      selectedEventId: null,
      isSavingEvent: false,
      isDeletingEvent: false
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
        masterId: resourceId
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

  updateEvent = async (event: Event) => {
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(eventToRawEvent(event))
    };

    this.setState({ isSavingEvent: true });

    try {
      const response = await fetch(this.props.endpoints.update, options);
      const rawEvent = await response.json();
      const updatedEvent = rawEventToEvent(rawEvent);
      const events = { ...this.state.events, [event.id]: updatedEvent };

      this.setState({ events, isSavingEvent: false });
    } catch (error) {
      this.setState({ isSavingEvent: false });
      console.error(error);
    }
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
    return (
      this.setState({
        selectedEventId: selectEvent.id
      }),
      true
    );
  };

  onUnselectEvent = () => {
    return this.setState({
      selectedEventId: null
    });
  };

  deleteEvent = async (eventId: string) => {
    const url = `${this.props.endpoints.delete}?rid=${eventId}`;
    const options = {
      method: "POST"
    };

    try {
      const response = await fetch(url, options);
      const events = { ...this.state.events };
      const selectedEventId =
        this.state.selectedEventId === eventId
          ? null
          : this.state.selectedEventId;

      delete events[eventId];

      this.setState({ events, selectedEventId, isDeletingEvent: false });
    } catch (error) {
      this.setState({ isDeletingEvent: false });
      console.error(error);
    }
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

  handleModalSave = async (event: Event) => {
    try {
      await this.updateEvent(event);
    } finally {
      this.setState({ selectedEventId: null });
    }
  };

  handleModalDelete = async (eventId: string) => {
    try {
      await this.deleteEvent(eventId);
    } finally {
      this.setState({ selectedEventId: null });
    }
  };

  render() {
    return (
      <React.Fragment>
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
                selected={this.state.events[this.state.selectedEventId]}
                resources={this.state.masters}
                events={values(this.state.events)}
                onNavigate={this.onNavigate}
                onSelectSlot={this.onSelectSlot}
                onSelectEvent={this.onSelectEvent}
              />
            </div>
          </div>
        </CalendarContext.Provider>

        <CalendarModal
          event={this.state.events[this.state.selectedEventId]}
          services={this.props.services}
          isOpen={Boolean(this.state.selectedEventId)}
          isSaving={this.state.isSavingEvent}
          isDeleting={this.state.isDeletingEvent}
          onCancel={this.onUnselectEvent}
          onSave={this.handleModalSave}
          onDelete={this.handleModalDelete}
        />
      </React.Fragment>
    );
  }
}
