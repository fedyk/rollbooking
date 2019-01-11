import Debug from "debug";
import * as parseInt from "parse-int";
import { welcomeView } from "../../views/booking/welcome-view";
import { bookingLayoutView } from "../../views/booking/booking-layout-view";
import { getDateOptions } from "./helpers/get-date-options";
import { getSelectedWorkdays } from "./helpers/get-selected-workdays";
import { getMastersOptions } from "./helpers/get-masters-options";
import { getSelectedMaster } from "./helpers/get-selected-master";
import { getServiceOptions } from "./helpers/get-services-options";
import { getSelectedService } from "./helpers/get-selected-service";
import { getResults } from "./helpers/get-results";
import { Context } from "koa";
import { dateToISODate } from "../../helpers/booking-workday/date-to-iso-date";
import { BookingWorkdaysCollection, UsersCollection, SalonsCollection } from "../../adapters/mongodb";
import { ObjectID } from "bson";
import { findTimeZone, getZonedTime } from "timezone-support";
import { Date as DateObject } from "../../models/date";
import { nativeDateToDateObject } from "../../helpers/date/native-date-to-date-object";
import { getSelectedDate } from "./helpers/get-selected-date";

const debug = Debug("app:booking:welcome");

export async function welcome(ctx: Context) {
  const salonId = ctx.params.salonId as string;
  const params = parseRequestParam({...ctx.params, ...ctx.query});
  const $salons = await SalonsCollection();

  debug("Salon ID should be a valid BJSON ObjectID")

  ctx.assert(ObjectID.isValid(salonId), 404, "Page doesn't exist")

  const salon = await $salons.findOne({
    _id: new ObjectID(salonId)
  });

  ctx.assert(salon, 404, "Page doesn't exist")

  const $users = await UsersCollection();

  const salonUsers = await $users.find({
    _id: {
      $in: salon.employees.users.map(v => v.id)
    }
  }).toArray();

  const salonServices = salon.services.items;

  const $bookingWorkdays = await BookingWorkdaysCollection();
  const bookingWorkdays = await $bookingWorkdays.find({
    salonId: salon._id
  }).toArray();

  const salonTimezone = findTimeZone(salon.timezone);
  const salonDateTime = getZonedTime(new Date(), salonTimezone);
  const salonDate: DateObject = {
    year: salonDateTime.year,
    month: salonDateTime.month,
    day: salonDateTime.day,
  }

  const dateOptions = getDateOptions({
    bookingWorkdays,
    startDate: salonDate,
    masterId: params.masterId,
    serviceId: params.serviceId,
    nextDays: 60
  });

  const showFilters = bookingWorkdays.length > 0;
  const selectedDate = getSelectedDate(dateOptions, params.date)
  const selectedWorkdays = getSelectedWorkdays(bookingWorkdays, selectedDate);
  const mastersOptions = getMastersOptions(salonUsers);
  const selectedMaster = getSelectedMaster(params.masterId);
  const servicesOptions = getServiceOptions(salonServices);
  const selectedService = getSelectedService(params.serviceId);
  const results = getResults({
    salonId,
    bookingWorkdays: selectedWorkdays,
    selectedDate: params.date,
    salonServices,
    masterId: params.masterId,
    serviceId: params.serviceId
  });

  ctx.body = bookingLayoutView({
    salonName: salon.name,
    salonId: salon._id.toHexString(),
    body: welcomeView({
      showFilters: showFilters,
      dateOptions: dateOptions,
      selectedDate: selectedDate ? dateToISODate(selectedDate) : null,
      mastersOptions: mastersOptions,
      selectedMaster: selectedMaster,
      servicesOptions: servicesOptions,
      selectedService: selectedService,
      results: results
    })
  })
}

const DATE_REGEX = /\d{4}-[01]\d-[0-3]\d/;  // YYYY-MM-DD

export function parseRequestParam(param: any): {
  date?: DateObject;
  masterId?: string;
  serviceId?: number;
} {
  const dateStr = `${param && (param.date || param.d)}`.trim();
  const masterId = param && (param.master_id || param.m);
  const serviceIdStr = param && (param.service_id || param.s);
  let date;

  if (DATE_REGEX.test(dateStr)) {
    const [y, m, d] = dateStr.split("-").map(v => parseInt(v, 10));

    date = new Date(y, m - 1, d);
  }

  return {
    date: date instanceof Date && !isNaN(date.getTime()) ? nativeDateToDateObject(date) : null,
    masterId: ObjectID.isValid(masterId) ? masterId : null,
    serviceId: parseInt(serviceIdStr) || null
  }
}