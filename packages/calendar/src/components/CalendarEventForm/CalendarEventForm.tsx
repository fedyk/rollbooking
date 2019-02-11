import * as React from "react";
import { Event, Service } from "../../types";
import { parseTime } from "../../helpers/parse-time";
import { dateToTimeString } from "../../helpers/date-to-time-string";
import { find } from "../../helpers/find";
import "./CalendarEventForm.css";

var MS_PER_MINUTE = 60000;

interface Props {
  event: Event;
  services: Service[];
  onUpdate(event: Event): void;
}

export class CalendarEventForm extends React.PureComponent<Props> {
  static defaultProps = {
    services: []
  };

  onChangeStartTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { event } = this.props;
    const duration = event.end.getTime() - event.start.getTime();
    const start = new Date(event.start.getTime());
    const end = new Date(event.end.getTime());
    const time = parseTime(e.target.value);

    // invalid time
    if (!time) {
      return null;
    }

    start.setHours(time.hours);
    start.setMinutes(time.minutes);
    end.setTime(start.getTime() + duration);

    this.props.onUpdate(
      Object.assign({}, this.props.event, {
        start,
        end
      })
    );
  };

  onChangeEndTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { event } = this.props;
    const duration = event.end.getTime() - event.start.getTime();
    const start = new Date(event.start.getTime());
    const end = new Date(event.end.getTime());
    const time = parseTime(e.target.value);

    // invalid time
    if (!time) {
      return null;
    }

    end.setHours(time.hours);
    end.setMinutes(time.minutes);
    start.setTime(end.getTime() - duration);

    this.props.onUpdate(
      Object.assign({}, this.props.event, {
        start,
        end
      })
    );
  };

  onChangeServiceId = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const serviceId = parseInt(e.target.value, 10);
    const start = new Date(this.props.event.start.getTime());
    const end = new Date(this.props.event.end.getTime());

    if (Number.isNaN(serviceId)) {
      return;
    }

    const service = find(this.props.services, (v) => v.id === serviceId);

    if (service && service.duration) {
      end.setTime(start.getTime() + service.duration * MS_PER_MINUTE);
    }

    this.props.onUpdate(
      Object.assign({}, this.props.event, {
        start,
        end,
        serviceId
      })
    );
  };

  render() {
    const startTime = dateToTimeString(this.props.event.start);
    const endTime = dateToTimeString(this.props.event.end);

    return (
      <div className="calendar-event-container">
        <div className="form-group row">
          <label htmlFor="starts" className="col-sm-4 col-form-label">
            starts
          </label>
          <div className="col-sm-8">
            <input
              type="time"
              className="form-control"
              id="starts"
              value={startTime}
              onChange={this.onChangeStartTime}
            />
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="ends" className="col-sm-4 col-form-label">
            ends
          </label>
          <div className="col-sm-8">
            <input
              type="time"
              className="form-control"
              id="ends"
              value={endTime}
              onChange={this.onChangeEndTime}
            />
          </div>
        </div>

        {this.props.services.length > 0 && (
          <div className="form-group row">
            <label htmlFor="service" className="col-sm-4 col-form-label">
              service
            </label>
            <div className="col-sm-8">
              <select
                className="form-control"
                value={`${this.props.event.serviceId || ""}`}
                onChange={this.onChangeServiceId}
                id="service"
              >
                {this.props.services.map((service) => (
                  <option value={service.id} key={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    );
  }
}
