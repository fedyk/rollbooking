import { Context } from "koa";
import { SalonsCollection, ReservationsCollection } from "../../adapters/mongodb";
import { template } from "../../views/template";
import { Date as DateObject } from "../../models/date";
import { calendarView } from "./calendar-view";
import { Salon } from "../../models/salon";

export async function calendar(ctx: Context) {
  const salon = ctx.state.salon as Salon;
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
