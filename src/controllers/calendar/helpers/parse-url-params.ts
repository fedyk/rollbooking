import { Date } from "../../../models/date";
import { isoDateToDateObject } from "../../../helpers/date/iso-date-to-date-object";

export interface UrlParams {
  date?: Date
}

export function parseUrlParams(params: any): UrlParams {
  const dateString = params ? (params.date || params.d) : "";
  let date: Date = null;

  if (dateString) {
    date = isoDateToDateObject(dateString);
  }

  return {
    date
  }
}