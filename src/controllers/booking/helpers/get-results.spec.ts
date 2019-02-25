import { getResults } from "./get-results";
import { DateTime } from "../../../models/date-time";
import { BookingWorkday } from "../../../models/booking-workday";
import { SalonService } from "../../../models/salon";
import { BookingSlot } from "../../../models/booking-slot";
import { ObjectID } from "bson";

const start: DateTime = {
  year: 2018,
  month: 1,
  day: 1,
  hours: 8,
  minutes: 0,
  seconds: 0,
}

const end: DateTime = {
  year: 2018,
  month: 1,
  day: 1,
  hours: 13,
  minutes: 0,
  seconds: 0,
}

const service: SalonService = {
  id: 1,
  name: "Service 1",
  description: "Desc",
  duration: 60,
  currencyCode: "USD",
  price: 20,
}

const bookingSlot: BookingSlot = {
  _version: "v1",
  _id: new ObjectID("5c24a58a86211ebcbbde0c20"),
  salonId: new ObjectID("5c24a58a86211ebcbbde0c21"),
  start: {
    year: 2018,
    month: 1,
    day: 1,
    hours: 8,
    minutes: 0,
    seconds: 0,
  },
  end: {
    year: 2018,
    month: 1,
    day: 1,
    hours: 9,
    minutes: 0,
    seconds: 0,
  },
  userId: new ObjectID("5c24a58a86211ebcbbde0c22"),
  serviceId: 1,
}

describe("get-results", function () {
  it ("should work", function() {
    expect(getResults({
      salonAlias: "salon-1",
      bookingSlots: [bookingSlot],
      services: [service],
    })).toEqual([{
      description: "Desc",
      name: "Service 1",
      price: "20",
      times: [{
        text: "08:00",
        url: "/salon-1/booking/checkout?sid=5c24a58a86211ebcbbde0c20",
      }, {
        text: "09:00",
        url: "/salon-1/booking/checkout?sid=5c24a58a86211ebcbbde0c20",
      }],
    }])
  })

  it ("should work handle selected master", function() {
    expect(getResults({
      salonAlias: "salon-1",
      bookingSlots: [bookingSlot],
      services: [service],
    })).toEqual([{
      description: "Desc",
      name: "Service 1",
      price: "20",
      times: [{
        text: "08:00",
        url: "/salon-1/booking/checkout?mid=master-1&sid=1&wdps=2018-01-01T08%3A00%3A00&wdpe=2018-01-01T13%3A00%3A00&t=08%3A00&d=2018-01-01",
      }, {
        text: "09:00",
        url: "/salon-1/booking/checkout?mid=master-1&sid=1&wdps=2018-01-01T08%3A00%3A00&wdpe=2018-01-01T13%3A00%3A00&t=09%3A00&d=2018-01-01",
      }],
    }])
  })

  it ("should work handle selected master 2", function() {
    expect(getResults({
      salonAlias: "salon-1",
      bookingSlots: [bookingSlot],
      services: [service],
    })).toEqual([{
      description: "Desc",
      name: "Service 1",
      price: "20",
      times: [{
        text: "09:00",
        url: "/salon-1/booking/checkout?mid=master-2&sid=1&wdps=2018-01-01T08%3A00%3A00&wdpe=2018-01-01T13%3A00%3A00&t=09%3A00&d=2018-01-01",
      }],
    }])
  })

  it ("should work handle selected undefined master", function() {
    expect(getResults({
      salonAlias: "salon-1",
      bookingSlots: [bookingSlot],
      services: [service],
    })).toEqual([])
  })

  it ("should work handle selected service", function() {
    expect(getResults({
      salonAlias: "salon-1",
      bookingSlots: [bookingSlot],
      services: [service],
    })).toEqual([{
      description: "Desc",
      name: "Service 1",
      price: "20",
      times: [{
        text: "08:00",
        url: "/salon-1/booking/checkout?mid=master-1&sid=1&wdps=2018-01-01T08%3A00%3A00&wdpe=2018-01-01T13%3A00%3A00&t=08%3A00&d=2018-01-01",
      }, {
        text: "09:00",
        url: "/salon-1/booking/checkout?mid=master-1&sid=1&wdps=2018-01-01T08%3A00%3A00&wdpe=2018-01-01T13%3A00%3A00&t=09%3A00&d=2018-01-01",
      }],
    }])
  })
  
  it ("should work handle time in proper order", function() {
    expect(getResults({
      salonAlias: "salon-1",
      bookingSlots: [bookingSlot],
      services: [service],
    })).toEqual([{
      description: "Desc",
      name: "Service 1",
      price: "20",
      times: [{
        text: "08:00",
        url: "/salon-1/booking/checkout?mid=master-2&sid=1&wdps=2018-01-01T08%3A00%3A00&wdpe=2018-01-01T13%3A00%3A00&t=08%3A00&d=2018-01-01",
      }, {
        text: "09:00",
        url: "/salon-1/booking/checkout?mid=master-2&sid=1&wdps=2018-01-01T08%3A00%3A00&wdpe=2018-01-01T13%3A00%3A00&t=09%3A00&d=2018-01-01",
      }],
    }])
  })
})
