import { addMinutes } from "./add-minutes";

test("addMinutes", function() {
  expect(addMinutes(new Date(2018, 1, 1, 0, 0), 30)).toEqual(new Date(2018, 1, 1, 0, 30))
})
