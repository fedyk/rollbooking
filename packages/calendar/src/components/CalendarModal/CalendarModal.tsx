import * as React from "react";
import { Event } from "../../types";
import { CalendarContext } from "../CalendarContext/CalendarContext";
import { dateToTimeString } from "../../helpers/date-to-time-string";

declare const jQuery: any;
declare const bootstrap: any;

interface Props {
  event: Event;
  onClose(): void;
}

interface State {
  startTime: string;
  endTime: string;
  masterId: string;
  serviceId: string;
  clientId: string;
}

const noop = () => {};

export class CalendarModal extends React.PureComponent<Props, State> {
  // todo: use proper type for modal
  modal: any;

  modalElement: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);

    this.modalElement = React.createRef();
    this.state = {
      startTime: dateToTimeString(props.event.start),
      endTime: dateToTimeString(props.event.end),
      masterId: props.event.masterId,
      serviceId: props.event.serviceId,
      clientId: props.event.clientId
    };
  }

  componentDidMount() {
    this.modal = new bootstrap.Modal(this.modalElement.current);

    // Show modal after component in mounted
    this.modal.show();

    // When modal is hidden, notify parent about it
    jQuery(this.modalElement.current).on("hidden.bs.modal", this.props.onClose);
  }

  componentWillUnmount() {
    // Remove listener from modalElement
    jQuery(this.modalElement.current).off(
      "hidden.bs.modal",
      this.props.onClose
    );

    // Destroy Modal
    this.modal.dispose();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.event && !prevProps.event) {
      this.modal.show();
    }

    if (!this.props.event && prevProps.event) {
      this.modal.hide();
    }
  }

  render() {
    return (
      <div
        ref={this.modalElement}
        className="modal"
        tabIndex={-1}
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit event</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group row">
                  <label
                    htmlFor="startHour"
                    className="col-sm-4 col-form-label"
                  >
                    Starts
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="time"
                      className="form-control"
                      id="startHour"
                      value={this.state.startTime}
                      onChange={noop}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label htmlFor="endHour" className="col-sm-4 col-form-label">
                    Ends
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="time"
                      className="form-control"
                      id="endHour"
                      value={this.state.endTime}
                      onChange={noop}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label htmlFor="service" className="col-sm-4 col-form-label">
                    Service
                  </label>
                  <div className="col-sm-8">
                    {/* <select id="service" className="custom-select">
                      <option selected>Open this select menu</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </select> */}
                  </div>
                </div>

                <div className="form-group row">
                  <label htmlFor="client" className="col-sm-4 col-form-label">
                    Client
                  </label>
                  <div className="col-sm-8">
                    <input type="text" className="form-control" id="client" />
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CalendarModal.contextType = CalendarContext;
