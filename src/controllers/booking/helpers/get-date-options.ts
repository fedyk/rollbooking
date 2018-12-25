import { BookingWorkday } from "../../../models/booking-workday";
import { SelectOption } from "../../../helpers/form";
import { dateToISODate } from "../../../helpers/booking-workday/date-to-iso-date";
import { getStartDay } from "../../../helpers/date/get-start-day";

interface Options {
  masterId: number;
  serviceId: number;
}

export function getDateOptions(bookingWorkdays: BookingWorkday[], params: Options, nextDays: number): SelectOption[] {
  const date = getStartDay(new Date(Date.now()));
  const options: SelectOption[] = [];
  const availableDates = getAvailableDates(bookingWorkdays, params.masterId, params.serviceId);

  for (let i = 0; i < nextDays; i++) {
    const optionValue = dateToISODate(date)
    const optionText = date.toLocaleDateString()
    const optionsDisabled = availableDates.get(optionValue) !== true;

    options.push({
      value: optionValue,
      text: optionText,
      disabled: optionsDisabled
    });

    // next day
    date.setDate(date.getDate() + 1);
  }

  return options;
}

export function getAvailableDates(
  bookingWorkdays: BookingWorkday[],
  selectedMasterId: number = null,
  selectedServiceId: number = null
) {
  const availableDates = new Map<string, boolean>();
  const selectedMasterIdStr = selectedMasterId ? selectedMasterId.toString() : "";
  const selectedServiceIdStr = selectedServiceId ? selectedServiceId.toString() : "";

  for (let i = 0; i < bookingWorkdays.length; i++) {
    const bookingWorkday = bookingWorkdays[i];
    const date = dateToISODate(bookingWorkday.period.startDate);

    if (availableDates.get(date) === true) {
      continue;
    }

    for (const masterId in bookingWorkday.masters) {
      if (bookingWorkday.masters.hasOwnProperty(masterId)) {

        // skip if current iteration has nothing with selected master
        if (selectedMasterIdStr != "" && masterId !== selectedMasterIdStr) {
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
            if (masterService && masterService.available_times && masterService.available_times.length > 0) {
              availableDates.set(date, true);
            }
          }
        }
      }
    }
  }

  return availableDates;
}
