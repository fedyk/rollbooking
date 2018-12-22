import { minutesToTime } from "./date";

test("minutesToTime", () => {
  expect(minutesToTime(0)).toBe("00:00")
  expect(minutesToTime(60)).toBe("01:00")
  expect(minutesToTime(61)).toBe("01:01")
  expect(minutesToTime(70)).toBe("01:10")
  expect(minutesToTime(120)).toBe("02:00")
  expect(minutesToTime(600)).toBe("10:00")
});
