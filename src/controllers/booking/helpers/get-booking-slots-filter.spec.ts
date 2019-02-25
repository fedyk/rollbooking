import { getBookingSlotsFilter } from "./get-booking-slots-filter";
import { ObjectID } from "bson";
import { Date } from "../../../models/date";

test("getBookingSlotsFilter", () => {
  const salonId = new ObjectID("1");
  const userId = new ObjectID("2");
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
    salonId, userId, serviceId, $or: [{
      "start.year": date.year,
      "start.month": date.month,
      "start.day": date.day,
    }, {
      "end.year": date.year,
      "end.month": date.month,
      "end.day": date.day,
    }]
  })
})
