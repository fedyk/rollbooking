import { Date } from "../../models/date";
import { isoDateToDateObject } from "./iso-date-to-date-object";

test("isoDateToDateObject", function() {
  expect(isoDateToDateObject("2018-12-31")).toEqual({
    year: 2018,
    month: 12,
    day: 31
  } as Date)
  expect(isoDateToDateObject("invalid")).toEqual(null)
})
