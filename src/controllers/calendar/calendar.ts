import { Context } from "koa";
import { SalonsCollection, ReservationsCollection } from "../../adapters/mongodb";
import { template } from "../../views/template";
import { Date as DateObject } from "../../models/date";
import { calendarView } from "./calendar-view";
import { ObjectID } from "bson";

export async function calendar(ctx: Context) {
  const salonId = ctx.params.salonId;
  const params = parseParams(ctx.query)

  ctx.assert(salonId, 404)
  ctx.assert(ObjectID.isValid(salonId), 404)

  const $reservations = await ReservationsCollection();
  const reservations = await $reservations.find({
    salonId: new ObjectID(salonId)
  }).toArray();

  ctx.body = template({
    title: "Calendar",
    body: calendarView({
      date: params.date,
      reservations
    })
  })
}

function parseParams(params: any) {
  const dateStr = `${params.date || params.d}`.trim();
  let date: DateObject;

  if (dateStr) {
    const [ year, month, day ] = dateStr.split(":").map(v => parseInt(v));

    date = {
      year,
      month,
      day
    }
  }

  return {
    date
  }
}