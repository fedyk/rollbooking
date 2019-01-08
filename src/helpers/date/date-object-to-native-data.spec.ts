import { dateObjectToNativeDate } from "./date-object-to-native-date";

test("dateObjectToNativeDate", function() {
  expect(dateObjectToNativeDate({
    year: 2018,
    month: 12,
    day: 31
  })).toEqual(new Date(2018, 11, 31))
})
