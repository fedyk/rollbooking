import { nativeDateToDateObject } from "./native-date-to-date-object";

test("nativeDateToDateObject", function () {
  expect(nativeDateToDateObject(new Date("2018-12-31T23:59:59Z"))).toEqual({
    year: 2018,
    month: 12,
    day: 31
  })

  expect(nativeDateToDateObject(new Date(Date.UTC(1994, 11, 1)))).toEqual({
    year: 1994,
    month: 12,
    day: 1
  })

  expect(nativeDateToDateObject(new Date(Date.UTC(1994, 12, 10)))).toEqual({
    year: 1995,
    month: 1,
    day: 10
  })
})
