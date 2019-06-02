import { ObjectID } from "bson";
import { parseRequestParam } from "./welcome";

test("parseRequestParam", function () {
  expect(parseRequestParam(null)).toEqual({
    date: null,
    masterId: null,
    serviceId: null
  })
  
  expect(parseRequestParam({
    d: "2018-01-01",
    m: "aaaabbbbccccddddeeeeffff",
    s: 1,
  })).toEqual({
    date: {
      year: 2018,
      month: 1,
      day: 1
    },
    masterId: new ObjectID("aaaabbbbccccddddeeeeffff"),
    serviceId: 1
  })
  
})