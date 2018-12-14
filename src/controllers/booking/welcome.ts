import * as Debug from "debug";
import * as parseInt from "parse-int";
import { welcome as welcomeView } from "../../views/booking/welcome";
import { layout as layoutView } from "../../views/booking/layout";
import { bookingWorkdays } from "./../../models/booking-workday";
import { getDateOptions } from "./helpers/get-date-options";
import { workdayISODate } from "../../helpers/booking-workday/workday-iso-date";
import { getSalonUsers } from "../../sagas/get-salon-users";
import { connect } from "../../lib/database";
import { getSalonServices } from "../../sagas/get-salon-services";
import { getSelectedWorkday } from "./helpers/get-salon-workday";
import { getMastersOptions } from "./helpers/get-masters-options";
import { getSelectedMaster } from "./helpers/get-selected-master";
import { getServiceOptions } from "./helpers/get-services-options";
import { getSelectedService } from "./helpers/get-selected-service";
import { getResults } from "./helpers/get-results";
import { getSalonById } from "../../queries/salons";
import { Context } from "koa";

const debug = Debug("app:booking:welcome");

export async function welcome(ctx: Context) {
  const salonId = parseInt(ctx.params.salonId);
  const params = parseRequestParam(ctx.params);
  const database = await connect();
  const salon = await getSalonById(database, salonId);

  const salonUsers = await getSalonUsers(database, salon.id);
  const salonServices = await getSalonServices(database, salon.id);
  const dateOptions = getDateOptions(bookingWorkdays, 60);
  const selectedWorkday = getSelectedWorkday(bookingWorkdays, params.date);
  const selectedDate = selectedWorkday ? workdayISODate(selectedWorkday) : null;
  const mastersOptions = getMastersOptions(salonUsers);
  const selectedMaster = getSelectedMaster(params.masterId);
  const servicesOptions = getServiceOptions(salonServices);
  const selectedService = getSelectedService(params.serviceId);
  const results = selectedWorkday ? getResults(selectedWorkday, salonServices) : [];

  database.release();

  ctx.body = layoutView({
    title: "Test Salon",
    body: welcomeView({
      salonName: salon.name,
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