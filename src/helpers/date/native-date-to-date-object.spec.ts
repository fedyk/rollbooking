import { nativeDateToDateObject } from "./native-date-to-date-object";

test("nativeDateToDateObject", function () {
  expect(nativeDateToDateObject(new Date(1994, 11, 1))).toEqual({
    year: 1994,
    month: 12,
    day: 1
  })
  expect(nativeDateToDateObject(new Date(1994, 12, 10))).toEqual({
    year: 1995,
    month: 1,
    day: 10
  })
})
