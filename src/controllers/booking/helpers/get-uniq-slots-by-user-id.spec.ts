import { getUniqSlotsByUserId } from "./get-uniq-slots-by-user-id";
import { nativeDateToDateTime } from "../../../helpers/date/native-date-to-date-time";
import { ObjectID } from "bson";

test("getUniqBookingSlotsByUserId", () => {
  expect(getUniqSlotsByUserId([
    {
      start: nativeDateToDateTime(new Date(2018, 1, 1, 10, 0, 0)),
      userId: new ObjectID("111111111111111111111111")
    },
    {
      start: nativeDateToDateTime(new Date(2018, 1, 1, 10, 0, 0)),
      userId: new ObjectID("222222222222222222222222")
    },
    {
      start: nativeDateToDateTime(new Date(2018, 1, 1, 11, 0, 0)),
      userId: new ObjectID("111111111111111111111111")
    }
  ], new Map([
    ["111111111111111111111111", 10],
    ["222222222222222222222222", 100],
  ]))).toEqual([
    {
      start: nativeDateToDateTime(new Date(2018, 1, 1, 10, 0, 0)),
      userId: new ObjectID("222222222222222222222222")
    },
    {
      start: nativeDateToDateTime(new Date(2018, 1, 1, 11, 0, 0)),
      userId: new ObjectID("111111111111111111111111")
    }
  ])
})