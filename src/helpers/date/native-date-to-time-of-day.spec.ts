import { nativeDateToTimeOfDay } from "./native-date-to-time-of-day";
import { TimeOfDay } from "../../types/time-of-day";

test("nativeDateToTimeOfDay", function() {
  expect(nativeDateToTimeOfDay(new Date("2018-12-31T23:59:59"))).toEqual({
    hours: 23,
    minutes: 59,
    seconds: 59
  } as TimeOfDay)
})