import { parseCheckoutRequestQuery } from "./parse-checkout-request-query";
import { DateTime } from "../../../models/date-time";
import { Date as DateObject } from "../../../models/date";
import { TimeOfDay } from "../../../models/time-of-day";

test('parseCheckoutRequestQuery', function () {
  expect(parseCheckoutRequestQuery({})).toEqual({
    masterId: null,
    serviceId: null,
    startPeriod: null,
    endPeriod: null,
    time: null,
    date: null,
  })

  expect(parseCheckoutRequestQuery({
    mid: "5c24a58a86211ebcbbde0c26",
    sid: "1",
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

  expect(parseCheckoutRequestQuery({
    mid: "test",
    sid: "test",
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
