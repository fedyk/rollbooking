import { getDateOptions } from "./get-date-options";
import { SelectOption } from "../../../helpers/form";

describe("getDateOptions", function() {
  it("should work", function() {
    expect(getDateOptions({
      startDate: {
        year: 2018,
        month: 1,
        day: 1,
      },
      nextDays: 1,
    })).toEqual([{
      value: "2018-01-01",
      text: "2018-01-01",
    }] as SelectOption[])
  })
  
  it("should work 2", function() {
    expect(getDateOptions({
      startDate: {
        year: 2018,
        month: 1,
        day: 3,
      },
      nextDays: 1,
    })).toEqual([{
      value: "2018-01-03",
      text: "2018-01-03",
    }] as SelectOption[])
  })
})
