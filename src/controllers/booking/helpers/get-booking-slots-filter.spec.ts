import { getBookingSlotsFilter } from "./get-booking-slots-filter";
import { ObjectID } from "bson";
import { Date } from "../../../core/types/date";

test("getBookingSlotsFilter", () => {
  const salonId = new ObjectID("aaaaaaaaaaaaaaaaaaaaaaaa");
  const userId = new ObjectID("bbbbbbbbbbbbbbbbbbbbbbbb");
  const serviceId = 3;
  const date: Date = {
    year: 2018,
    month: 1,
    day: 1
  }

  expect(getBookingSlotsFilter({ salonId })).toEqual({ salonId })
  expect(getBookingSlotsFilter({ salonId, userId })).toEqual({ salonId, userId })
  expect(getBookingSlotsFilter({ salonId, userId, serviceId })).toEqual({ salonId, userId, serviceId })
  expect(getBookingSlotsFilter({ salonId, userId, serviceId, date })).toEqual({
    salonId,
    userId,
    serviceId,
    $and: [
      {
      "start.year": {
        $lte: date.year,
      },
      "start.month": {
        $lte: date.month
      },
      "start.day": {
        $lte: date.day
      },
    },
    {
      "end.year": {
        $gte: date.year
      },
      "end.month": {
        $gte: date.month
      },
      "end.day": {
        $gte: date.day
      },
    }]
  })
})
