import { stringMapJoin } from "./string-map-join";

describe("stringMapJoin", () => {
  it("should return string from a array of numbers", () => {
    expect(stringMapJoin([1, 2], (item, index) => `(${item}:${index})`)).toBe("(1:0)(2:1)");
  })
  
  it("should return string from a array of objects", () => {
    expect(stringMapJoin([{ a: 2 }], (item, index) => `${item.a}:${index}`)).toBe("2:0");
  })

  it("should return string from a Map with items", () => {
    const map = new Map<number, string>([[1, 'first']]);
    expect(stringMapJoin(map.entries(), ([key, value]) => `${key}:${value}`)).toBe("1:first");
  })
});
