import { find } from "./find";

test("find", function() {
  expect(find([1, 2], (v) => v === 1)).toBe(1);
  expect(
    find(
      [
        {
          a: 1
        }
      ],
      (v) => v.a === 1
    )
  ).toEqual({
    a: 1
  });
});
