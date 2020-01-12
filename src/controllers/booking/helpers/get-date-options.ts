import { format } from "date-fns"
import { SelectOption } from "../../../helpers/form";
import { dateToISODate } from "../../../helpers/date/date-to-iso-date";
import { Date as DateObject } from "../../../core/types/date";
import { dateObjectToNativeDate } from "../../../helpers/date/date-object-to-native-date";

interface Options {
  startDate: DateObject;
  nextDays: number
}

export function getDateOptions({
  startDate,
  nextDays
}: Options): SelectOption[] {
  const date = dateObjectToNativeDate(startDate);
  const options: SelectOption[] = [];

  for (let i = 0; i < nextDays; i++) {
    const optionValue = dateToISODate(date) // in UTC

    options.push({
      value: optionValue,
      text: format(date, "ddd, MMM D"),
    });

    date.setDate(date.getDate() + 1);
  }

  return options;
}
