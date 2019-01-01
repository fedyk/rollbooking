import { dateTimeToNativeDate } from "./date-time-to-native-date";

test("dateTimeToNativeDate", function() {
  expect(dateTimeToNativeDate({
    year: 2018,
    month: 12,
    day: 31,
    hour: 23,
    minute: 59,
    second: 59
  })).toEqual(new Date("2018-12-31T23:59:59"))
})
