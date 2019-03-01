import { ObjectID } from "bson";
import { parseCheckoutRequestQuery } from "./parse-checkout-request-query";

test('parseCheckoutRequestQuery', function () {
  expect(parseCheckoutRequestQuery({})).toEqual({ slotId: null, })
  expect(parseCheckoutRequestQuery({ sid: "test" })).toEqual({ slotId: null })
  expect(parseCheckoutRequestQuery({
    sid: "5c24a58a86211ebcbbde0c26",
  })).toEqual({
    slotId: new ObjectID("5c24a58a86211ebcbbde0c26"),
  })
})
