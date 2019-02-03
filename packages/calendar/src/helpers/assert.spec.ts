import { assert } from "./assert";

test("assert", function() {
  expect(() => assert(true, "error")).not.toThrow(Error);
  expect(() => assert(false, "error")).toThrow(Error);
});
