import { input, hidden, select } from "./form";

test("form/input", () => {
  expect(
    input("test", "val")
  ).toBe(
    "<input name=\"test\" value=\"val\" type=\"text\" />"
  );
  
  expect(
    input("test", "val", {
      type: "email",
      "class": "class1"
    })
  ).toBe(
    "<input class=\"class1\" type=\"email\" name=\"test\" value=\"val\" />"
  );
});

test("form/hidden", () => {
  expect(
    hidden("test", "val")
  ).toBe(
    "<input type=\"hidden\" name=\"test\" value=\"val\" />"
  );
});

test("form/select", () => {
  expect(
    select("test", [{
      value: "1",
      disabled: false,
      text: "option"
    }], "1", {
      "class": "custom"
    })
  ).toBe(
    "<select class=\"custom\" name=\"test\"><option value=\"1\" selected=\"selected\">option</option></select>"
  );
});
