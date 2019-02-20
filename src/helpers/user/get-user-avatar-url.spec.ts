import { getUserAvatarUrl } from "./get-user-avatar-url";
import { User } from "../../models/user";

test("getUserAvatarUrl", function() {
  expect(getUserAvatarUrl(null, "small")).toBe("");
  expect(getUserAvatarUrl({
    name: "user",
    properties: {},
  } as any, "small")).toBe("");
  expect(getUserAvatarUrl({
    name: "user",
    properties: {
      avatar: {}
    },
  } as any, "small")).toBe("");
  expect(getUserAvatarUrl({
    name: "user",
    properties: {
      avatar: {
        small: "test"
      }
    },
  } as any, "small")).toBe("test");
})
