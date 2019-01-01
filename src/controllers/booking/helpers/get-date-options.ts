import { BookingWorkday } from "../../../models/booking-workday";
import { SelectOption } from "../../../helpers/form";
import { dateToISODate } from "../../../helpers/booking-workday/date-to-iso-date";
import { Date as DateObject } from "../../../models/date";
import { dateObjectToNativeDate } from "../../../helpers/date/date-object-to-native-date";

interface Options {
  bookingWorkdays: BookingWorkday[];
  startDate: DateObject;
  masterId: string;
  serviceId: number;
  nextDays: number
}

export function getDateOptions(params: Options): SelectOption[] {
  const { bookingWorkdays, startDate, nextDays } = params;
  const date = dateObjectToNativeDate(startDate);
  const options: SelectOption[] = [];
  const availableDates = getAvailableDates(bookingWorkdays, params.masterId, params.serviceId);

  for (let i = 0; i < nextDays; i++) {
    const optionValue = dateToISODate(date) // in UTC
    const optionsDisabled = availableDates.get(optionValue) !== true;

    options.push({
      value: optionValue,
      text: date.toLocaleDateString(),
      disabled: optionsDisabled
    });

    // next day
    date.setDate(date.getDate() + 1);
  }

  return options;
}

export function getAvailableDates(
  bookingWorkdays: BookingWorkday[],
  selectedMasterId: string = null,
  selectedServiceId: number = null
) {
  const availableDates = new Map<string, boolean>();
  const selectedServiceIdStr = selectedServiceId ? selectedServiceId.toString() : "";

  for (let i = 0; i < bookingWorkdays.length; i++) {
    const bookingWorkday = bookingWorkdays[i];
    const date = dateToISODate(bookingWorkday.period.start);

    if (availableDates.get(date) === true) {
      continue;
    }

    for (const masterId in bookingWorkday.masters) {
      if (bookingWorkday.masters.hasOwnProperty(masterId)) {

        // skip if current iteration has nothing with selected master
        if (selectedMasterId != null && masterId !== selectedMasterId) {
          continue;
        }

        const master = bookingWorkday.masters[masterId];
        const masterServices = master && master.services;

        for (const serviceId in masterServices) {
          if (masterServices.hasOwnProperty(serviceId)) {
            const masterService = masterServices[serviceId];

            // skip if current iteration has nothing with selected service
            if (selectedServiceIdStr != "" && serviceId !== selectedServiceIdStr) {
              continue;
            }

            // we have available slots
            if (masterService && masterService.availableTimes && masterService.availableTimes.length > 0) {
              availableDates.set(date, true);
            }
          }
        }
      }
    }
  }

  return availableDates;
}
