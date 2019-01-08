import { nativeDateToTime } from "./native-date-to-time";

test("nativeDateToTime", function() {
  expect(nativeDateToTime(new Date(new Date("2018-12-31T23:59:59")))).toBe("23:59");
})
