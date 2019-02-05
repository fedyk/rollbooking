import * as React from "react";
import { DateLocalizer } from "react-big-calendar";
import { Event } from "../../types";
import { CalendarContext } from "../CalendarContext/CalendarContext";

declare const bootstrap: any;

interface Props {
  event: Event;
  title: string;
  isAllDay: boolean;
  localizer: DateLocalizer;
}

export class CalendarEvent extends React.PureComponent<Props> {
  container: React.RefObject<HTMLDivElement>;
  popoverContent: React.RefObject<HTMLDivElement>;

  popover: any;

  constructor(props) {
    super(props);

    this.container = React.createRef();
    this.popoverContent = React.createRef();
  }

  componentDidMount() {
    this.popover = new bootstrap.Popover(
      this.container.current.parentElement.parentElement,
      {
        animation: false,
        container: false,
        html: true,
        content: this.popoverContent.current,
        title: "title",
        trigger: "manual",
        template: `<div class="popover" role="tooltip">
        <div class="arrow"></div>
        <h3 class="popover-header"></h3>
        <div class="popover-body"></div>
      </div>`
      }
    );
  }

  componentWillUnmount() {
    this.popover.dispose();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.event.showPopover && !prevProps.event.showPopover) {
      this.popover.show();
    }

    if (!this.props.event.showPopover && prevProps.event.showPopover) {
      this.popover.hide();
    }
  }

  deleteEvent = () => {
    this.popover.hide();
    this.context.deleteEvent(this.props.event.id);
  };

  openEventModal = () => {
    this.popover.hide();
    this.context.openEventModal(this.props.event.id);
  };

  render() {
    return (
      <div ref={this.container}>
        {this.props.title}

        <div hidden>
          <div ref={this.popoverContent}>
            <div className="mb-2">
              <div className="font-weight-bold">Service</div>
              <div>{this.props.event.serviceName || "None"}</div>
            </div>
            <div className="mb-2">
              <div className="font-weight-bold">Client</div>
              <div>{this.props.event.clientName || "None"}</div>
            </div>
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={this.deleteEvent}
              >
                Delete
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={this.openEventModal}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CalendarEvent.contextType = CalendarContext;
