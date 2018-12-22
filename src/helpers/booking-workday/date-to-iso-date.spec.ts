import { dateToISODate } from "./date-to-iso-date";

test("dateToISODate", () => {
  expect(dateToISODate(new Date(0))).toBe("1970-01-01")
  expect(dateToISODate(new Date(1545108181434))).toBe("2018-12-18")
  expect(dateToISODate({
    year: 2018,
    month: 1,
    day: 1
  })).toBe("2018-01-01")
});
