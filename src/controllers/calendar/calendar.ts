import { Context } from "koa";
import { ReservationsCollection, UsersCollection } from "../../adapters/mongodb";
import { template } from "../../views/template";
import { calendarView } from "./calendar-view";
import { Salon } from "../../models/salon";
import { parseUrlParams } from "./helpers/parse-url-params";
import { findTimeZone, getZonedTime } from "timezone-support";
import { dateTimeToISODate } from "../../helpers/date/date-time-to-iso-date";

export async function calendar(ctx: Context) {
  const salon = ctx.state.salon as Salon;
  const params = parseUrlParams(ctx.query);
  const $reservations = await ReservationsCollection();
  const $users = await UsersCollection();

  const users = await $users.find({
    _id: {
      $in: salon.employees.users.map(v => v.id)
    }
  }).toArray();

  const resources = users.map(function(user) {
    return {
      id: user._id.toHexString(),
      title: user.name
    }
  });

  const date = params.date ? params.date : getZonedTime(new Date(), findTimeZone(salon.timezone));

  const reservations = await $reservations.find({
    salonId: salon._id,
    $or: [{
      "start.year": date.year,
      "start.month": date.month,
      "start.day": date.day
    }, {
      "end.year": date.year,
      "end.month": date.month,
      "end.day": date.day
    }]
  }).toArray();

  const events = reservations.map(function(r) {
    return {
      id: r._id.toHexString(),
      title: `serviceId=${r.serviceId}, userId=${r.userId}`,
      start: dateTimeToISODate(r.start),
      end: dateTimeToISODate(r.end),
      resourceId: r.masterId.toHexString()
    }
  })

  ctx.body = template({
    title: "Calendar",
    body: calendarView({
      date: date,
      reservations: reservations,
      resources: resources,
      events: events
    })
  })
}


