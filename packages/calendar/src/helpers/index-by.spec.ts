import { indexBy } from "./index-by";

test("indexBy", function() {
  expect(indexBy([{ a: 1 }, { a: 2 }], "a")).toEqual({
    1: { a: 1 },
    2: { a: 2 }
  });
});
