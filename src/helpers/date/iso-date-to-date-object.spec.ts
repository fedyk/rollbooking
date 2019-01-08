import { Date } from "../../models/date";
import { isoDateToDateObject } from "./iso-date-to-date-object";

test("isoDateToDateObject", function() {
  expect(isoDateToDateObject("2018-12-31")).toEqual({
    year: 2018,
    month: 12,
    day: 31
  } as Date)
  expect(isoDateToDateObject("invalid")).toEqual(null)
  expect(isoDateToDateObject("1990-01-01")).toEqual(null)
  expect(isoDateToDateObject("2018-13-01")).toEqual(null)
  expect(isoDateToDateObject("2018-13-32")).toEqual(null)
})
