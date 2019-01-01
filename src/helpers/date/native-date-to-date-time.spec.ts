import { nativeDateToDateTime } from "./native-date-to-date-time";
import { DateTime } from "../../models/date-time";

test("nativeDateToDateTime", function() {
  expect(nativeDateToDateTime(new Date("2018-12-31T23:59:59"))).toEqual({
    year: 2018,
    month: 12,
    day: 31,
    hour: 23,
    minute: 59,
    second: 59,
  } as DateTime)
})
