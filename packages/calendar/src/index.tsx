import * as React from 'react';
import * as ReactDOM from 'react-dom'
import { Calendar, Props } from "./components/Calendar";

export interface InitialState extends Props {}

export function render(targetSelector, initialState: InitialState) {
  const target = document.querySelector(targetSelector);

  if (!target) {
    throw new Error(`Target for calendar doesn't exist(${targetSelector})`);
  }

  return ReactDOM.render(<Calendar {...initialState} />, target);
}
