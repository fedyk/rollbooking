import { parseCheckoutRequestBody } from "./parse-checkout-request-body";

test('parseCheckoutRequestBody', function () {
  expect(parseCheckoutRequestBody(null)).toEqual({
    email: "",
    name: ""
  })

  expect(parseCheckoutRequestBody({})).toEqual({
    email: "",
    name: ""
  })

  expect(parseCheckoutRequestBody({
    email: "test",
    name: "test2"
  })).toEqual({
    email: "test",
    name: "test2"
  })
  
  expect(parseCheckoutRequestBody({
    email: {},
    name: []
  })).toEqual({
    email: "",
    name: ""
  })
})
