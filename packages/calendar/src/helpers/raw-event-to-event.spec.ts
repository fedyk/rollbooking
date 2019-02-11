import { rawEventToEvent } from "./raw-event-to-event";

test("rawEventToEvent", function() {
  expect(rawEventToEvent({
    id: "1",
    title: "title",
    start: "2018-01-01T10:00:00",
    end: "2018-01-01T11:00:00",
    masterId: "1"
  })).toEqual({
    id: "1",
    title: "title",
    start: new Date(2018, 0, 1, 10),
    end: new Date(2018, 0, 1, 11),
    masterId: "1"
  })
});
