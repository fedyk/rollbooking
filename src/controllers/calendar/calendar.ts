import { Context } from "koa";
import { ReservationsCollection } from "../../adapters/mongodb";
import { template } from "../../views/template";
import { calendarView } from "./calendar-view";
import { Salon } from "../../models/salon";
import { parseUrlParams } from "./helpers/parse-url-params";

export async function calendar(ctx: Context) {
  const salon = ctx.state.salon as Salon;
  const params = parseUrlParams(ctx.query);
  const $reservations = await ReservationsCollection();
  const reservations = await $reservations.find({
    salonId: salon._id
  }).toArray();

  ctx.body = template({
    title: "Calendar",
    body: calendarView({
      reservations
    })
  })
}


