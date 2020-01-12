import { nativeDateToDateTime } from "./native-date-to-date-time";
import { DateTime } from "../../core/types/date-time";

test("nativeDateToDateTime", function() {
  expect(nativeDateToDateTime(new Date("2018-12-31T23:59:59"))).toEqual({
    year: 2018,
    month: 12,
    day: 31,
    hours: 23,
    minutes: 59,
    seconds: 59,
  } as DateTime)
})
