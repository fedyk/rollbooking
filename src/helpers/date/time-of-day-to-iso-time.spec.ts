import { timeOfDayToISOTime } from "./time-of-day-to-iso-time";

test("timeOfDayToISOTime", function() {
  expect(timeOfDayToISOTime({
    hours: 1,
    minutes: 0,
    seconds: 0
  })).toBe("01:00")
})
