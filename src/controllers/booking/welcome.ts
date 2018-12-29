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

const debug = Debug("app:booking:welcome");

export async function welcome(ctx: Context) {
  const salonId = ctx.params.salonId;
  const params = parseRequestParam({...ctx.params, ...ctx.query});
  const database = await connect();
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

  const salonServices = salon.services.items
  
  database.release();

  const $bookingWorkdays = await BookingWorkdaysCollection();
  const bookingWorkdays = await $bookingWorkdays.find({
    salonId: salon._id
  }).toArray();

  const dateOptions = getDateOptions(bookingWorkdays, params, 60);
  const showFilters = bookingWorkdays.length > 0;
  const selectedWorkday = getSelectedWorkday(bookingWorkdays, params.date);
  const selectedDate = selectedWorkday ? dateToISODate(selectedWorkday.period.startDate) : null;
  const mastersOptions = getMastersOptions(salonUsers);
  const selectedMaster = getSelectedMaster(params.masterId);
  const servicesOptions = getServiceOptions(salonServices);
  const selectedService = getSelectedService(params.serviceId);
  const results = selectedWorkday ? getResults({
    salonId,
    workday: selectedWorkday,
    salonServices,
    masterId: params.masterId,
    serviceId: params.serviceId
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

function parseRequestParam(param: any): {
  date: Date;
  masterId: number;
  serviceId: number;
} {
  const dateStr = param && param.date || param.d;
  const masterIdStr = param && param.master_id || param.m;
  const serviceIdStr = param && param.service_id || param.s;

  const date = new Date(dateStr);

  return {
    date: date instanceof Date && !isNaN(date.getTime()) ? date : null,
    masterId: parseInt(masterIdStr),
    serviceId: parseInt(serviceIdStr)
  }
}