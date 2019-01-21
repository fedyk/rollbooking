import { parseUrlParams } from "./parse-url-params";

test("parseUrlParams", function() {
  expect(parseUrlParams("")).toEqual({
    date: null
  })
  
  expect(parseUrlParams({
    date: "2018-12-31"
  })).toEqual({
    date: {
      year: 2018,
      month: 12,
      day: 31
    }
  })
})
