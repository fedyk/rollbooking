import { stringMapJoin } from "./string-map-join";

test("stringMapJoin", () => {
  expect(stringMapJoin([1], v => `${v}`)).toBe("1");
  expect(stringMapJoin([{a: 2}], v => `${v.a}`)).toBe("2");
});
