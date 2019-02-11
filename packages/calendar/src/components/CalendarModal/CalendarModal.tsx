import * as React from "react";
import { Event, Service } from "../../types";
import { CalendarContext } from "../CalendarContext/CalendarContext";
import { CalendarEventForm } from "../CalendarEventForm/CalendarEventForm";

declare const jQuery: any;
declare const bootstrap: any;

interface Props {
  event: Event;
  services: Service[];
  isSaving?: boolean;
  isDeleting?: boolean;
  isOpen?: boolean;
  onCancel(): void;
  onSave(event: Event): void;
  onDelete(eventId: string): void;
}

interface State {
  event: Event;
}

export class CalendarModal extends React.PureComponent<Props, State> {
  static defaultProps = {
    services: [],
    isSaving: false,
    isDeleting: false,
    isOpen: false
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.isOpen && (!state.event || state.event.id !== props.event.id)) {
      return { event: props.event };
    }

    return null;
  }

  modal: any;
  modalEl: React.RefObject<HTMLDivElement>;

  constructor(props) {
    super(props);

    this.modalEl = React.createRef();

    this.state = {
      event: null
    };
  }

  componentDidMount() {
    this.modal = new bootstrap.Modal(this.modalEl.current);
    jQuery(this.modalEl.current).on("hidden.bs.modal", this.onModalHidden);
  }

  componentDidUpdate(prevProps: Props) {
    const { props } = this;

    if (props.isOpen && !prevProps.isOpen) {
      this.modal.show();
    }

    if (!props.isOpen && prevProps.isOpen) {
      this.modal.hide();
    }
  }

  componentWillUnmount() {
    jQuery(this.modalEl.current).off("hidden.bs.modal", this.onModalHidden);
    this.modal.hide();
    this.modal.dispose();
  }

  onModalHidden = () => {
    this.props.onCancel();
  };

  handleUpdate = (event: Event) => {
    this.setState({ event });
  };

  handleCancel = () => {
    this.modal.hide();
  };

  handleSave = () => {
    this.props.onSave(this.state.event);
  };

  handleDelete = () => {
    this.props.onDelete(this.props.event.id);
  };

  render() {
    return (
      <div
        ref={this.modalEl}
        className="modal fade"
        tabIndex={-1}
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Event</h5>
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
              {this.state.event && (
                <CalendarEventForm
                  event={this.state.event}
                  services={this.props.services}
                  onUpdate={this.handleUpdate}
                />
              )}
            </div>
            <div className="modal-footer">
              {!this.props.isDeleting ? (
                <button
                  type="button"
                  className="btn btn-outline-danger mr-auto"
                  onClick={this.handleDelete}
                  disabled={this.props.isSaving}
                >
                  Delete
                </button>
              ) : (
                <button className="btn btn-primary" type="button" disabled>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Deleting...
                </button>
              )}

              <button
                type="button"
                className="btn btn-secondary"
                onClick={this.handleCancel}
                disabled={this.props.isSaving || this.props.isDeleting}
              >
                Cancel
              </button>
              {!this.props.isSaving ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.handleSave}
                  disabled={this.props.isDeleting}
                >
                  Save
                </button>
              ) : (
                <button className="btn btn-primary" type="button" disabled>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Saving...
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CalendarModal.contextType = CalendarContext;
