import * as React from "react";
import { DateLocalizer } from "react-big-calendar";
import { Event } from "../../types";
import { CalendarContext } from "../CalendarContext/CalendarContext";
import { CalendarEventForm } from "../CalendarEventForm/CalendarEventForm";

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
    const popoverEl = this.container.current; // .parentElement.parentElement
    this.popover = new bootstrap.Popover(popoverEl, {
      html: true,
      content: this.popoverContent.current,
      trigger: "click focus",
    //   template: `<div class="popover" role="tooltip">
    //   <div class="arrow"></div>
    //   <h3 class="popover-header"></h3>
    //   <div class="popover-body"></div>
    // </div>`
    });
  }

  // componentDidUpdate(prevProps: Props) {
  //   const { props } = this;

  //   if (props.isOpenPopover && !prevProps.isOpenPopover) {
  //     this.popover.show()
  //   }
    
  //   if (!props.isOpenPopover && prevProps.isOpenPopover) {
  //     this.popover.hide()
  //   }
  // }

  componentWillUnmount() {
    this.popover.dispose();
  }

  render() {
    return (
      <div ref={this.container}>
        {this.props.title}
        <div hidden>
          <div ref={this.popoverContent}>
            <CalendarEventForm
              event={this.props.event}
              services={this.context.services}
              onDelete={this.context.deleteEvent}
              onUpdate={this.context.updateEvent}
            />
          </div>
        </div>
      </div>
    );
  }
}

CalendarEvent.contextType = CalendarContext;
