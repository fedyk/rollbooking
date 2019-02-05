import { values } from "./values";

test("values", function() {
  expect(values({ a: 1, b: 2 })).toEqual([1, 2]);
});
