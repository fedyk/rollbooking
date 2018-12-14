// import { BookingWorkday } from "../../models/booking-workday";
// import { SelectOption } from "../../helpers/form";

// export function getDateOptions(bookingWorkdays: BookingWorkday[], nextDays): SelectOption[] {
//   const date = new Date();
//   const options: SelectOption[] = [];

//   const availableDates: {
//     [key: string]: boolean
//   } = {};

//   bookingWorkdays.forEach(bookingWorkday => {
//     const isoDate = workdayISODate(bookingWorkday);

//     availableDates[isoDate] = true;
//   })

//   for (let i = 0; i < nextDays; i++) {
//     const optionValue = date.toISOString().slice(0, 10);
//     const optionText = date.toLocaleDateString();
//     const optionsDisabled = !availableDates[optionValue];

//     options.push({
//       value: optionValue,
//       text: optionText,
//       disabled: optionsDisabled
//     });

//     // next day
//     date.setDate(date.getDate() + 1);
//   }

//   return options;
// }

// export function getFirstAvailableDate(bookingWorkdays: BookingWorkday[]): string {
//   if (bookingWorkdays.length === 0) {
//     return null;
//   }

//   const sortedWorkdays = bookingWorkdays.concat().sort((a, b) => {
//     if (a.year !== b.year) {
//       return a.year - b.year;
//     }

//     if (a.month !== b.month) {
//       return a.month - b.month;
//     }

//     return a.day - b.day;
//   })

//   const firstAvailableDay = sortedWorkdays.find(workday => {
//     if (workday.masters.length === 0) {
//       return false;
//     }

//     const firstAvailableMaster = workday.masters.find(master => {
//       if (master.services.length === 0) {
//         return false;
//       }

//       const firstAvailableService = master.services.find(service => {
//         return service.available_times.length > 0;
//       })

//       return firstAvailableService != null;
//     })

//     return firstAvailableMaster != null;
//   })

//   if (firstAvailableDay) {
//     return workdayISODate(firstAvailableDay);
//   }

//   return null;
// }

// export function workdayISODate(bookingWorkday: BookingWorkday): string {
//   const { year, month, day } = bookingWorkday;

//   return `${year.toString().padStart(4, "20")}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
// }
