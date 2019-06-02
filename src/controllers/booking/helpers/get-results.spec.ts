import { ObjectID } from "bson";
import { getResults } from "./get-results";
import { SalonService } from "../../../types/salon";
import { BookingSlot } from "../../../types/booking-slot";
import { nativeDateToDateTime } from "../../../helpers/date/native-date-to-date-time";

const services: SalonService[] = [
  {
    id: 1,
    name: "Service 1",
    description: "Desc",
    duration: 60,
    currencyCode: "USD",
    price: 20,
  },
  {
    id: 2,
    name: "Service 2",
    description: "Desc",
    duration: 60,
    currencyCode: "USD",
    price: 20,
  }
]

const bookingSlots: BookingSlot[] = [
  {
    _version: "v1",
    _id: new ObjectID("000000000000000000000000"),
    salonId: new ObjectID("aaaaaaaaaaaaaaaaaaaaaaaa"),
    start: nativeDateToDateTime(new Date(2018, 0, 1, 8, 0, 0)),
    end: nativeDateToDateTime(new Date(2018, 0, 1, 9, 0, 0)),
    userId: new ObjectID("bbbbbbbbbbbbbbbbbbbbbbbb"),
    serviceId: 1,
  },
  {
    _version: "v1",
    _id: new ObjectID("111111111111111111111111"),
    salonId: new ObjectID("aaaaaaaaaaaaaaaaaaaaaaaa"),
    start: nativeDateToDateTime(new Date(2018, 0, 1, 9, 0, 0)),
    end: nativeDateToDateTime(new Date(2018, 0, 1, 10, 0, 0)),
    userId: new ObjectID("bbbbbbbbbbbbbbbbbbbbbbbb"),
    serviceId: 2,
  },
  {
    _version: "v1",
    _id: new ObjectID("222222222222222222222222"),
    salonId: new ObjectID("aaaaaaaaaaaaaaaaaaaaaaaa"),
    start: nativeDateToDateTime(new Date(2018, 0, 1, 8, 0, 0)),
    end: nativeDateToDateTime(new Date(2018, 0, 1, 9, 0, 0)),
    userId: new ObjectID("cccccccccccccccccccccccc"),
    serviceId: 1,
  },
]

test("getResults", function () {
  expect(getResults({
    salonAlias: "salon-1",
    bookingSlots: bookingSlots.reverse(),
    services: services,
  })).toEqual([
    {
      name: "Service 1",
      description: "Desc",
      price: "20",
      times: [
        {
          text: "08:00",
          url: "/salon-1/booking/checkout?sid=000000000000000000000000",
        }
      ],
    },
    {
      name: "Service 2",
      description: "Desc",
      price: "20",
      times: [
        {
          text: "09:00",
          url: "/salon-1/booking/checkout?sid=111111111111111111111111",
        }
      ],
    }
  ])
})
