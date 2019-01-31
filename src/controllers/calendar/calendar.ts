import { Context } from "koa";
import { UsersCollection } from "../../adapters/mongodb";
import { template } from "../../views/template";
import { calendar as calendarView } from "./views/calendar";
import { Salon } from "../../models/salon";
import { parseUrlParams } from "./helpers/parse-url-params";
import { findTimeZone, getZonedTime } from "timezone-support";
import { content } from "../../views/shared/content";
import { getEvents } from "./helpers/get-events";

export async function calendar(ctx: Context) {
  const salon = ctx.state.salon as Salon;
  const params = parseUrlParams(ctx.query);
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
  const events = await getEvents(salon, date);

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


