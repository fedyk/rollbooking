import { DateTime } from "../../base/types/date-time";
import { isoDateTimeToDateTime } from "./iso-date-time-to-date-time";

test("isoDateTimeToDateTime", function() {
  expect(isoDateTimeToDateTime("2018-12-31T23:59:59")).toEqual({
    year: 2018,
    month: 12,
    day: 31,
    hours: 23,
    minutes: 59,
    seconds: 59
  } as DateTime);

  expect(isoDateTimeToDateTime("")).toEqual(null)
  expect(isoDateTimeToDateTime("Invalid String")).toEqual(null)
  expect(isoDateTimeToDateTime("YYYY-MM-ddThh-mm-ss")).toEqual(null)
})