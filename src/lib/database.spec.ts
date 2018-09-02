import { deepStrictEqual, ok } from "assert";
import { extractQueryParams, connect } from "./database";

describe("lib > database > extractQueryParams", () => {
  it("should work #1", () => {
    deepStrictEqual(extractQueryParams({
      t: 1
    }), {
      keys: ['t'],
      params: ['$1'],
      values: [1]
    })
  })
  
  it("should work #2", () => {
    deepStrictEqual(extractQueryParams({
      id: 1,
      di: 2,
    }), {
      keys: ['di'],
      params: ['$1'],
      values: [2]
    })
  })
  
  it("should work #3", () => {
    deepStrictEqual(extractQueryParams({
      di: 2,
      id: 1,
      ki: 3,
    }), {
      keys: ['di', 'ki'],
      params: ['$1', '$2'],
      values: [2, 3]
    })
  })
})


describe("lib > database > connect", () => {
  it('showuld be defined', () => {
    ok(connect)
    ok(typeof connect === 'function')
  })
})