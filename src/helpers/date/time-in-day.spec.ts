import { timeInDay } from "./time-in-day";

test("timeInDay", function() {
  expect(timeInDay(new Date("2018-12-17T08:00:00.00Z"))).toBe("08:00")
  expect(timeInDay(new Date("2018-12-17T00:30:00.00Z"))).toBe("00:30")
  expect(timeInDay(new Date("2018-12-17T00:00:00.00Z"))).toBe("00:00")
})
