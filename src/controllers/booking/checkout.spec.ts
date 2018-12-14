import { parseRequestQuery } from "./checkout";

test('parseRequestQuery', () => {
  expect(parseRequestQuery({})).toEqual({
    masterId: null,
    serviceId: null,
    date: null
  })
  expect(parseRequestQuery({
    m: "1",
    s: "1",
    d: "2018-01-01",
    t: "61"
  })).toEqual({
    masterId: 1,
    serviceId: 1,
    date: new Date("2018-01-01T01:01:00")
  })
  expect(parseRequestQuery({
    m: "test",
    s: "test",
    d: "test",
    t: "test"
  })).toEqual({
    masterId: null,
    serviceId: null,
    date: null
  })
})