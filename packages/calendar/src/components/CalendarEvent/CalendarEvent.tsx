import * as React from "react";
// import * as Bootstrap from "bootstrap";
import { DateLocalizer } from "react-big-calendar";

declare const bootstrap: any;

interface Props {
  event: any;
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
    this.popover = new bootstrap.Popover(this.container.current.parentElement.parentElement, {
      animation: false,
      container: false,
      content: this.popoverContent.current,
      title: "title",
      trigger: "manual",
      template: `<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>`
    })
  }

  componentWillUnmount() {
    this.popover.dispose();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.event.showPopover && !prevProps.event.showPopover) {
      this.popover.show()
    }
    
    if (!this.props.event.showPopover && prevProps.event.showPopover) {
      this.popover.hide()
    }
  }

  render() {
    return <div ref={this.container}>
      {this.props.title}
      <div ref={this.popoverContent} hidden>sdfsdfskdf</div>
    </div>;
  }
}
