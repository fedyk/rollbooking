import { equal } from "assert";
import { toDate, toTime } from "./date";

describe("utils > date", () => {
  describe("toDate", () => {
    it("should works", () => {
      equal(toDate(new Date('1995-12-17T03:24:00')), '1995-12-17')
    })
  })
  
  describe("toTime", () => {
    it("should works", () => {
      equal(toTime(new Date('1995-12-17T03:24:00')), '03:24:00')
    })
  })
})