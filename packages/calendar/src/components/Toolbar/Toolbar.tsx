import * as React from "react";

interface Props {
  date: Date;
  onNext(): void;
  onPrev(): void;
  onToday(): void;
}

export function Toolbar(props: Props) {
  return (
    <div className="d-flex align-items-center justify-content-between mb-3">
      <h5 className="card-title mb-0">Calendar</h5>
      <span>{props.date.toLocaleDateString()}</span>
      <div className="btn-group" role="group" aria-label="Basic example">
        <button
          type="button"
          className="btn btn-sm btn-light"
          onClick={props.onPrev}
        >
          Back
        </button>
        <button
          type="button"
          className="btn btn-sm btn-light"
          onClick={props.onToday}
        >
          Today
        </button>
        <button
          type="button"
          className="btn btn-sm btn-light"
          onClick={props.onNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
