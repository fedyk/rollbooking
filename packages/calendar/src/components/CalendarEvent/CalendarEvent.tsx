import * as React from "react";
import { DateLocalizer } from "react-big-calendar";
import { Event } from "../../types";
import { CalendarContext } from "../CalendarContext/CalendarContext";
import { dateToTimeString } from "../../helpers/date-to-time-string";
import { parseTime } from "../../helpers/parse-time";

declare const bootstrap: any;

interface Props {
  event: Event;
  title: string;
  isAllDay?: boolean;
  localizer?: DateLocalizer;
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
        trigger: "click",
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

  onChangeStartTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const start = new Date(this.props.event.start.getTime());
    const startTime = parseTime(e.target.value);

    if (!startTime) {
      return null;
    }

    start.setHours(startTime.hours);
    start.setMinutes(startTime.minutes);

    this.context.updateEvent({
      ...event,
      ...{
        start
      }
    });
  };

  onChangeEndTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const end = new Date(this.props.event.end.getTime());
    const endTime = parseTime(e.target.value);

    if (!endTime) {
      return null;
    }

    end.setHours(endTime.hours);
    end.setMinutes(endTime.minutes);

    this.context.updateEvent({
      ...event,
      ...{
        end
      }
    });
  };

  onChangeServiceId = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const serviceId = parseInt(e.target.value, 10);

    if (!Number.isNaN(serviceId)) {
      return;
    }

    const selectedService = this.context.services.find(
      (service) => service.id === serviceId
    );

    if (!selectedService) {
      return;
    }

    this.context.updateEvent({
      ...this.props.event,
      ...{
        serviceId
      }
    });
  };

  render() {
    const startTime = dateToTimeString(this.props.event.start);
    const endTime = dateToTimeString(this.props.event.end);
    return (
      <div ref={this.container}>
        {this.props.title}

        <div hidden>
          <div ref={this.popoverContent}>
            <div className="form-group row">
              <label htmlFor="startHour" className="col-sm-4 col-form-label">
                starts
              </label>
              <div className="col-sm-8">
                <input
                  type="time"
                  className="form-control"
                  id="startHour"
                  value={startTime}
                  onChange={this.onChangeStartTime}
                />
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="endHour" className="col-sm-4 col-form-label">
                ends
              </label>
              <div className="col-sm-8">
                <input
                  type="time"
                  className="form-control"
                  id="endHour"
                  value={endTime}
                  onChange={this.onChangeEndTime}
                />
              </div>
            </div>

            {this.context.services.length > 0 && (
              <div className="form-group row">
                <label htmlFor="service" className="col-sm-4 col-form-label">
                  service
                </label>
                <div className="col-sm-8">
                  <select
                    value={this.props.event.serviceId}
                    onChange={this.onChangeServiceId}
                  >
                    {this.context.services.map((service) => (
                      <option value={service.id}>{service.name}</option>
                    ))}
                  </select>
                  <input
                    type="time"
                    className="form-control"
                    id="endHour"
                    value={endTime}
                    onChange={this.onChangeEndTime}
                  />
                </div>
              </div>
            )}

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
