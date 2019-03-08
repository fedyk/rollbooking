import * as parseInt from "parse-int";
import { welcomeView } from "../../views/booking/welcome-view";
import { getDateOptions } from "./helpers/get-date-options";
import { getMastersOptions } from "./helpers/get-masters-options";
import { getSelectedMaster } from "./helpers/get-selected-master";
import { getServiceOptions } from "./helpers/get-services-options";
import { getSelectedService } from "./helpers/get-selected-service";
import { getResults } from "./helpers/get-results";
import { Context } from "koa";
import { dateToISODate } from "../../helpers/date/date-to-iso-date";
import { UsersCollection, BookingSlotsCollection } from "../../adapters/mongodb";
import { ObjectID } from "bson";
import { findTimeZone, getZonedTime } from "timezone-support";
import { Date as DateObject } from "../../models/date";
import { nativeDateToDateObject } from "../../helpers/date/native-date-to-date-object";
import { Salon } from "../../models/salon";
import { getBookingSlotsFilter } from "./helpers/get-booking-slots-filter";
import { toDottedObject } from "../../helpers/to-dotted-object";

export async function welcome(ctx: Context) {
  const salon = ctx.state.salon as Salon;
  const isAuthenticated = ctx.isAuthenticated();
  const params = parseRequestParam({ ...ctx.params, ...ctx.query });

  const $users = await UsersCollection();
  const $bookingSlots = await BookingSlotsCollection();

  const usersIds = salon.employees.users.map(v => v.id);
  const salonUsers = await $users.find({ _id: { $in: usersIds } }).toArray();
  const services = salon.services.items;

  const salonTimezone = findTimeZone(salon.timezone);
  const salonZonedNow = getZonedTime(new Date(), salonTimezone);
  const dateOptions = getDateOptions({ startDate: salonZonedNow, nextDays: 60 });

  const selectedDate = params.date || salonZonedNow;
  
  const bookingSlots = await $bookingSlots.find(getBookingSlotsFilter({
    salonId: salon._id,
    userId: params.masterId,
    serviceId: params.serviceId,
    date: selectedDate
  })).toArray();

  const mastersOptions = getMastersOptions(salonUsers);
  const selectedMaster = getSelectedMaster(params.masterId);
  const servicesOptions = getServiceOptions(services);
  const selectedService = getSelectedService(params.serviceId);
  const results = getResults({
    salonAlias: salon.alias,
    bookingSlots: bookingSlots,
    services,
  });
  let isSubscribed: boolean | null = null;

  if (results.length === 0) {
    const $bookingSlots = await BookingSlotsCollection()
    const filter = getBookingSlotsFilter({
      date: params.date,
      salonId: salon._id,
      userId: params.masterId,
      serviceId: params.serviceId
    })

    const bookingSlot = $bookingSlots.findOne(toDottedObject(filter));
    
    isSubscribed = Boolean(bookingSlot)
  }

  ctx.state.title = `${salon.name}`;
  ctx.state.styles.push("/css/booking.css");
  ctx.state.styles.unshift("https://fonts.googleapis.com/icon?family=Material+Icons");
  ctx.state.scripts.push("/js/booking.js");
  ctx.body = welcomeView({
    results: results,
    dateOptions: dateOptions,
    selectedDate: selectedDate ? dateToISODate(selectedDate) : null,
    mastersOptions: mastersOptions,
    selectedMaster: selectedMaster,
    servicesOptions: servicesOptions,
    selectedService: selectedService,
    isAuthenticated: isAuthenticated,
    isSubscribed: isSubscribed,
    subscribeUrl: `/${salon.alias}/booking/slot-subscriptions`,
    unsubscribeUrl: `/${salon.alias}/booking/slot-subscriptions`,
  })
}

const DATE_REGEX = /\d{4}-[01]\d-[0-3]\d/;  // YYYY-MM-DD

export function parseRequestParam(param: any): {
  date?: DateObject;
  masterId?: ObjectID;
  serviceId?: number;
} {
  const dateStr = `${param && (param.date || param.d)}`.trim();
  const masterId = param && (param.master_id || param.m || param.mid);
  const serviceIdStr = param && (param.service_id || param.s || param.sid);
  let date;

  if (DATE_REGEX.test(dateStr)) {
    const [y, m, d] = dateStr.split("-").map(v => parseInt(v, 10));

    date = new Date(y, m - 1, d);
  }

  return {
    date: date instanceof Date && !isNaN(date.getTime()) ? nativeDateToDateObject(date) : null,
    masterId: ObjectID.isValid(masterId) ? new ObjectID(masterId) : null,
    serviceId: parseInt(serviceIdStr) || null
  }
}