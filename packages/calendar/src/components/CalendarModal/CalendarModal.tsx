import * as React from "react";
import { Event } from "../../types";
import { CalendarContext } from "../CalendarContext/CalendarContext";
import { CalendarEventForm } from "../CalendarEventForm/CalendarEventForm";

declare const jQuery: any;
declare const bootstrap: any;

interface Props {
  event: Event;
  onClose(): void;
}

interface State {
  event: Event;
}

export class CalendarModal extends React.PureComponent<Props, State> {
  modal: any;
  modalEl: React.RefObject<HTMLDivElement>;

  constructor(props) {
    super(props);

    this.modalEl = React.createRef();
  }

  componentDidMount() {
    this.modal = bootstrap.Modal(this.modalEl.current);

    jQuery(this.modal).on("hidden.bs.modal", this.onModalHidden)
  }

  componentWillUnmount() {
    this.modal.dispose();
  }

  onModalHidden = () => {
    this.props.onClose()
  }

  render() {
    return (
      <div ref={this.modalEl} className="modal" tabIndex={-1} role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modal title</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <CalendarEventForm event={this.state.event} onUpdate={() => {}} onDelete={() => {}} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CalendarModal.contextType = CalendarContext;
