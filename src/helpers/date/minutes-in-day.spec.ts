import { minutesInDay } from "./minutes-in-day";

test("minutesInDay", function() {
  expect(minutesInDay(new Date("2018-01-01T10:00:00.00Z"))).toBe(10 * 60);
  expect(minutesInDay(new Date(Date.UTC(2018, 0, 1, 10, 0, 0, 0)))).toBe(10 * 60);
  expect(minutesInDay(new Date(Date.UTC(2018, 0, 1, 10, 1, 0, 0)))).toBe(10 * 60 + 1);
})
