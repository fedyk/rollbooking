import { toDottedObject } from "./to-dotted-object";

test("toDottedObject", function() {
  expect(toDottedObject({
    a: 1
  })).toEqual({
    a: 1
  })
  
  expect(toDottedObject({
    a: 1,
    b: {
      c: 2
    }
  })).toEqual({
    a: 1,
    "b.c": 2
  })

  expect(toDottedObject({
    a: 1,
    b: {
      c: 2,
      d: [3],
      e: "4"
    }
  })).toEqual({
    a: 1,
    "b.c": 2,
    "b.d.0": 3,
    "b.e": "4"
  })
})