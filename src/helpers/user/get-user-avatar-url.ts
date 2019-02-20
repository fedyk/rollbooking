import { User, UserAvatar } from "../../models/user";

export function getUserAvatarUrl(user: User, size: keyof UserAvatar = "small"): string {
  return user && user.properties && user.properties.avatar && user.properties.avatar[size] || "";
}
