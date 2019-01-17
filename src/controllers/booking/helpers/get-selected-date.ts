import { SelectOption } from "../../../helpers/form";
import { Date as DateObject } from "../../../models/date";
import { dateToISODate } from "../../../helpers/date/date-to-iso-date";
import { isoDateToDateObject } from "../../../helpers/date/iso-date-to-date-object";

export function getSelectedDate(dates: SelectOption[], selectedDate?: DateObject): DateObject {
  if (selectedDate) {
    const isoDate = dateToISODate(selectedDate);

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];

      if (date.value === isoDate) {
        return selectedDate;
      }
    }

    return null;
  }


  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];

    if (!date.disabled && date.value) {
      return isoDateToDateObject(date.value)
    }
  }
}
