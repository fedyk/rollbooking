import { isoTimeToTimeOfDay } from "./iso-time-to-time-of-day";
import { TimeOfDay } from "../../base/types/time-of-day";

test("isoTimeToTimeOfDay", function() {
  expect(isoTimeToTimeOfDay("23:00")).toEqual({
    hours: 23,
    minutes: 0,
    seconds: 0
  } as TimeOfDay)

  expect(isoTimeToTimeOfDay("test")).toEqual(null)
})