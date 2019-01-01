import Debug from "debug";
import { welcome as welcomeView } from "../../views/booking/welcome";
import { layout as layoutView } from "../../views/booking/layout";
import { getDateOptions } from "./helpers/get-date-options";
import { connect } from "../../lib/database";
import { getSelectedWorkday } from "./helpers/get-salon-workday";
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
import { DateTime } from "../../models/date-time";
import { Date as DateObject } from "../../models/date";
import { nativeDateToDateObject } from "../../helpers/date/native-date-to-date-object";

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
  const selectedWorkday = getSelectedWorkday(bookingWorkdays, params.date);
  const selectedDate = selectedWorkday ? dateToISODate(selectedWorkday.period.start) : null;
  const mastersOptions = getMastersOptions(salonUsers);
  const selectedMaster = getSelectedMaster(params.masterId);
  const servicesOptions = getServiceOptions(salonServices);
  const selectedService = getSelectedService(params.serviceId);
  const results = selectedWorkday ? getResults({
    salonId,
    workday: selectedWorkday,
    salonServices,
    masterId: params.masterId,
    serviceId: params.serviceId,
    timezoneName: salon.timezone
  }) : [];


  ctx.body = layoutView({
    title: "Test Salon",
    body: welcomeView({
      salonName: salon.name,
      showFilters: showFilters,
      dateOptions: dateOptions,
      selectedDate: selectedDate,
      mastersOptions: mastersOptions,
      selectedMaster: selectedMaster,
      servicesOptions: servicesOptions,
      selectedService: selectedService,
      results: results
    })
  })
}

const DATE_REGEX = /\d{4}-[01]\d-[0-3]\d/;  // YYYY-MM-DD

function parseRequestParam(param: any): {
  date: DateObject;
  masterId: string;
  serviceId: number;
} {
  const dateStr = `${param && param.date || param.d}`.trim();
  const masterId = param && param.master_id || param.m;
  const serviceIdStr = param && param.service_id || param.s;
  let date;

  if (DATE_REGEX.test(dateStr)) {
    const [y, m, d] = dateStr.split("-").map(v => parseInt(v, 10));

    date = new Date(y, m - 1, d);
  }

  return {
    date: date instanceof Date && !isNaN(date.getTime()) ? nativeDateToDateObject(date) : null,
    masterId: ObjectID.isValid(masterId) ? masterId : null,
    serviceId: parseInt(serviceIdStr)
  }
}