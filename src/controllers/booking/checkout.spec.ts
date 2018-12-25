import { parseRequestQuery, parseRequestBody } from "./checkout";

test('booking/checkout/parseRequestQuery', function() {
  expect(parseRequestQuery({})).toEqual({
    masterId: null,
    serviceId: null,
    date: null
  })

  expect(parseRequestQuery({
    m: "1",
    s: "1",
    d: "2018-01-01T01:01:01Z",
  })).toEqual({
    masterId: 1,
    serviceId: 1,
    date: new Date("2018-01-01T01:01:01Z"),
  })

  expect(parseRequestQuery({
    m: "1",
    s: "1",
    d: "2018-01-01",
  })).toEqual({
    masterId: 1,
    serviceId: 1,
    date: null,
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

test('booking/checkout/parseRequestBody', function() {
  expect(parseRequestBody(null)).toEqual({
    email: "",
    fullName: ""
  })

  expect(parseRequestBody({})).toEqual({
    email: "",
    fullName: ""
  })

  expect(parseRequestBody({
    email: "test",
    full_name: "test2"
  })).toEqual({
    email: "test",
    fullName: "test2"
  })
})