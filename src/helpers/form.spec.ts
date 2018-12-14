import { select } from "./form";

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
