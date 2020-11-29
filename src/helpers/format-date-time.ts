import { format } from "date-fns";
import { DateTime } from "../types";
import { dateTimeToNativeDate } from "./date-time-to-native-date";

export function formatDateTime(dateTime: DateTime) {
  return format(dateTimeToNativeDate(dateTime), "E, MMM L, h:mm a")
}
