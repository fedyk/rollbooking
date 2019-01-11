import { parseRequestQuery, parseRequestBody } from "./checkout";
import { DateTime } from "../../models/date-time";
import { TimeOfDay } from "../../models/time-of-day";
import { Date as DateObject } from "../../models/date";

test('parseRequestQuery', function() {
  expect(parseRequestQuery({})).toEqual({
    masterId: null,
    serviceId: null,
    startPeriod: null,
    endPeriod: null,
    time: null,
    date: null,
  })

  expect(parseRequestQuery({
    m: "5c24a58a86211ebcbbde0c26",
    s: "1",
    wdps: "2018-01-01T01:01:01",
    wdpe: "2018-01-01T10:01:01",
    t: "08:00",
    d: "2018-01-01",
  })).toEqual({
    masterId: "5c24a58a86211ebcbbde0c26",
    serviceId: 1,
    startPeriod: {
      year: 2018,
      month: 1,
      day: 1,
      hours: 1,
      minutes: 1,
      seconds: 1
    } as DateTime,
    endPeriod: {
      year: 2018,
      month: 1,
      day: 1,
      hours: 10,
      minutes: 1,
      seconds: 1
    } as DateTime,
    time: {
      hours: 8,
      minutes: 0,
      seconds: 0
    } as TimeOfDay,
    date: {
      year: 2018,
      month: 1,
      day: 1
    } as DateObject,
  })

  expect(parseRequestQuery({
    m: "test",
    s: "test",
    wdps: "test",
    wdpe: "test",
    d: "test",
    t: "test"
  })).toEqual({
    masterId: null,
    serviceId: null,
    startPeriod: null,
    endPeriod: null,
    time: null,
    date: null,
  })
})

test('parseRequestBody', function() {
  expect(parseRequestBody(null)).toEqual({
    email: "",
    name: ""
  })

  expect(parseRequestBody({})).toEqual({
    email: "",
    name: ""
  })

  expect(parseRequestBody({
    email: "test",
    name: "test2"
  })).toEqual({
    email: "test",
    name: "test2"
  })
})