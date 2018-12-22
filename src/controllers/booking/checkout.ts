import * as parseInt from "parse-int";
import { checkout as checkoutView } from "../../views/booking/checkout";
import { layout as layoutView } from "../../views/booking/layout";
import { connect } from "../../lib/database";
import { getSalonById } from "../../queries/salons";
import { Context } from "koa";
import { minutesToTime } from "../../helpers/date";

export async function checkout(ctx: Context) {
  const salonId = parseInt(ctx.params.salonId);
  const params = parseRequestQuery(ctx.query);
  const database = await connect();

  const salon = await getSalonById(database, salonId);

  // const salonUsers = await getSalonUsers(database, salon.id);
  // const salonServices = await getSalonServices(database, salon.id);
  // const dateOptions = getDateOptions(bookingWorkdays, 60);
  // const selectedWorkday = getSelectedWorkday(bookingWorkdays, params.date);
  // const selectedDate = selectedWorkday ? workdayISODate(selectedWorkday) : null;
  // const mastersOptions = getMastersOptions(salonUsers);
  // const selectedMaster = getSelectedMaster(params.masterId);
  // const servicesOptions = getServiceOptions(salonServices);
  // const selectedService = getSelectedService(params.serviceId);
  // const results = selectedWorkday ? getResults(selectedWorkday, salonServices) : [];

  database.release();

  ctx.body = layoutView({
    title: "Test Salon",
    body: checkoutView({
      salonName: salon.name,
      masterId: params.masterId.toString(),
      serviceId: params.serviceId.toString(),
      date: params.date && params.date.toISOString(),
    })
  })
}

export function parseRequestQuery(query: any): {
  masterId: number;
  serviceId: number;
  date: Date;
} {
  const masterIdStr = query && query.master_id || query.m;
  const serviceIdStr = query && query.service_id || query.s;
  const dateStr = query && query.date || query.d;
  const timeStr = query && query.time || query.t;
  let date = null;

  if (dateStr && timeStr) {
    const minutes = parseInt(timeStr);

    if (minutes != null) {
      const time = minutesToTime(minutes);

      date = new Date(`${dateStr}T${time}`)
    }
  }

  return {
    date: date instanceof Date && !isNaN(date.getTime()) ? date : null,
    masterId: parseInt(masterIdStr) || null,
    serviceId: parseInt(serviceIdStr) || null,
  }
}
