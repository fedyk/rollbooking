import { Context } from "koa";
import { ReservationsCollection, UsersCollection } from "../../adapters/mongodb";
import { template } from "../../views/template";
import { calendar as calendarView } from "./views/calendar";
import { Salon, SalonService } from "../../models/salon";
import { parseUrlParams } from "./helpers/parse-url-params";
import { findTimeZone, getZonedTime } from "timezone-support";
import { dateTimeToISODate } from "../../helpers/date/date-time-to-iso-date";
import { content } from "../../views/shared/content";
import { reservationToEvent } from "./helpers/reservation-to-event";

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

  const servicesMap = new Map<number, SalonService>(salon.services.items.map(function(service): [number, SalonService] {
    return [service.id, service];
  }));

  const events = reservations.map(function(reservation) {
    return reservationToEvent(reservation, servicesMap);
  });

  ctx.body = template({
    title: "Calendar",
    styles: [
      "/packages/calendar/calendar.css"
    ],
    scripts: [
      "/packages/calendar/calendar.js"
    ],
    body: content({
      alias: salon.alias,
      body: calendarView({
        date: date,
        reservations: reservations,
        resources: resources,
        events: events,
        endpoints: {
          create: `/${salon.alias}/calendar/events/create`,
          update: `/${salon.alias}/calendar/events/update`,
          delete: `/${salon.alias}/calendar/events/delete`,
        }
      })
    })
  })
}


