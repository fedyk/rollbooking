import { dateTimeToISODate } from "./date-time-to-iso-date";

test("dateTimeToNativeDate", function() {
  expect(dateTimeToISODate({
    year: 2018,
    month: 1,
    day: 1,
    hours: 1,
    minutes: 1,
    seconds: 1
  })).toBe("2018-01-01T01:01:01")
})
