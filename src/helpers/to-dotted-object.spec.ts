import { toDottedObject } from "./to-dotted-object";
import { ObjectID } from "bson";

test("toDottedObject", function() {
  expect(toDottedObject({
    a: 1
  })).toEqual({
    a: 1
  })
  
  expect(toDottedObject({
    a: 1,
    b: {
      c: 2
    }
  })).toEqual({
    a: 1,
    "b.c": 2
  })

  expect(toDottedObject({
    a: 1,
    b: {
      c: 2,
      d: [3],
      e: "4"
    }
  })).toEqual({
    a: 1,
    "b.c": 2,
    "b.d.0": 3,
    "b.e": "4"
  })

  expect(toDottedObject({
    id: new ObjectID("5c3819d8fb84ad76aa3be1d4"),
    period: {
      start: {
        year: 2018,
        month: 1,
        day: 1
      },
      end: {
        year: 2018,
        month: 12,
        day: 31
      }
    }
  })).toEqual({
    id: new ObjectID("5c3819d8fb84ad76aa3be1d4"),
    "period.start.year": 2018,
    "period.start.month": 1,
    "period.start.day": 1,
    "period.end.year": 2018,
    "period.end.month": 12,
    "period.end.day": 31,
  })
})
