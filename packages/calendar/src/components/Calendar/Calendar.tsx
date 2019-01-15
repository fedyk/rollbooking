import './Calendar.scss';

import * as React from 'react';

export interface Props {
  title: string;
}

export class Calendar extends React.PureComponent<Props> {
  render() {
    return <h1 className="calendar">{this.props.title}</h1>
  }
}
