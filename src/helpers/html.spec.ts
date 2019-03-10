import { escape, attrs, classes, script, stylesheet } from "./html";

test('html/escape', () => {
  expect(escape("test")).toBe("test")
  expect(escape("test <script>")).toBe("test &lt;script&gt;")
});

test('html/attrs', () => {
  expect(attrs({
    test: 1
  })).toBe("test=\"1\"")
  expect(attrs({
    test: 2,
    test1: false
  })).toBe("test=\"2\"")
  expect(attrs({
    "class": "open",
    "data-param": "val"
  })).toBe("class=\"open\" data-param=\"val\"")
  expect(attrs({ onclick: 'click("1")' })).toBe(`onclick="click(&quot;1&quot;)"`)
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

test('html/script', () => {
  expect(script("test.js")).toBe("<script src=\"test.js\" type=\"text/javascript\"></script>")
});

test('html/script', () => {
  expect(stylesheet("test.css")).toBe("<link href=\"test.css\" rel=\"stylesheet\">")
});
