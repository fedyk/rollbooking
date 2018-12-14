import { escape, attrs, classes } from "./html";

test('html/escape', () => {
  expect(escape("test")).toBe("test")
  expect(escape("test <script>")).toBe("test &lt;script&gt;")
});

test('html/attrs', () => {
  expect(attrs({ test: 1 })).toBe("test=\"1\"")
  expect(attrs({
    "class": "open",
    "data-param": "val"
  })).toBe("class=\"open\" data-param=\"val\"")
});

test('html/classes', () => {
  expect(classes("test")).toBe("test")
  expect(classes(["class1", "class2"])).toBe("class1 class2");
  expect(classes({
    "class-name-1": false,
    "class-name-2": true,
    "class-name-3": true
  })).toBe("class-name-2 class-name-3")
});
