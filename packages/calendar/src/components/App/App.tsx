import * as React from "react";
import { Calendar } from "../Calendar";
import { rawEventToEvent } from "../../helpers/raw-event-to-event";
import { dateToLocalISOString } from "../../helpers/date-to-local-iso-string";
import { CalendarContext } from "./../CalendarContext";
import { CalendarModal } from "../CalendarModal";
import { find } from "../../helpers/find";
import { Event, Master } from "../../types";

interface Props {
  date: Date;
  masters: Master[];
  events: Event[];
  endpoints: {
    create: string;
    update: string;
    delete: string;
  };
}

interface State {
  date: Date;
  masters: Master[];
  events: Event[];
  modalEventId: string;
}

export class App extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      date: props.date,
      masters: props.masters,
      events: props.events,
      modalEventId: null
    };
  }

  onSelectSlot = (slotInfo: any) => {
    const { start, end, resourceId } = slotInfo;

    // todo check if slotInfo has resourceId or masterId
    debugger;

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
        start: dateToLocalISOString(start),
        end: dateToLocalISOString(end),
        resourceId
      })
    };

    fetch(this.props.endpoints.create, fetchOptions)
      .then((response) => response.json())
      .then((rawEvent) => {
        // Replace temp event to real one
        const events = this.state.events.map((v) =>
          v.id === tempEventId ? rawEventToEvent(rawEvent) : v
        );

        this.setState({ events });
      })
      .catch((reason) => {
        console.error(reason);
      });

    // Add temp event in state
    this.setState({
      events: this.state.events.concat({
        id: tempEventId,
        title: tempEventTitle,
        start,
        end,
        masterId: resourceId
      })
    });

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
        const events = this.state.events.map((v) =>
          v.id === rawEvent.id ? rawEventToEvent(rawEvent) : v
        );

        this.setState({ events });
      })
      .catch((reason) => {
        console.error(reason);
      });
  };

  onSelectEvent = (selectEvent: Event) => {
    const events = this.state.events.map(function(event) {
      return {
        ...event,
        ...{
          showPopover: event.id === selectEvent.id
        }
      };
    });

    this.setState({ events });

    return true;
  };

  deleteEvent = (eventId: string) => {
    alert("delete event " + eventId);
  };

  openEventModal = (modalEventId: string) => {
    this.setState({ modalEventId });
  };

  onDoubleClickEvent = (event, clickEvent) => {
    clickEvent.preventDefault();
    this.openEventModal(event.id);
  };

  onCloseCalendarModal = () => {
    this.setState({ modalEventId: null });
  };

  render() {
    const modalEvent = this.state.modalEventId
      ? find(this.state.events, (v) => v.id === this.state.modalEventId)
      : null;

    return (
      <CalendarContext.Provider
        value={{
          deleteEvent: this.deleteEvent,
          updateEvent: this.updateEvent,
          openEventModal: this.openEventModal
        }}
      >
        <Calendar
          date={this.state.date}
          resources={this.state.masters}
          events={this.state.events}
          onSelectSlot={this.onSelectSlot}
          onDoubleClickEvent={this.onDoubleClickEvent}
          onSelectEvent={this.onSelectEvent}
        />
        {modalEvent && (
          <CalendarModal
            event={modalEvent}
            onClose={this.onCloseCalendarModal}
          />
        )}
      </CalendarContext.Provider>
    );
  }
}
