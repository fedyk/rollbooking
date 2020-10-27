import * as querystring from "querystring";
import * as dateFns from "date-fns";
import * as tz from "timezone-support";
import * as users from "../data-access/users";
import * as accounts from "../data-access/businesses";
import * as Events from "../data-access/events";
import { Context, State } from '../types/app';
import { datepicker } from '../helpers/datepicker';
import { dateToISODate } from '../helpers/date/date-to-iso-date';
import { renderView } from '../render';
import { Middleware } from "../types";
import Router = require('@koa/router');

export const calendar: Middleware = async (ctx) => {
  const userId = ctx.session ? ctx.session.userId : void 0

  if (!userId) {
    return ctx.throw(404, "Page does not exist or you have no access to it")
  }

  const user = await users.getUserById(ctx.mongo, userId)

  if (!user) {
    return ctx.throw(404, "Your session has missed data about you. Please re-login again")
  }

  if (!user.defaultBusinessId) {
    return ctx.throw(404, "User has no business associated")
  }

  const businessId = user.defaultBusinessId;

  const business = await accounts.getBusinessById(ctx.mongo, businessId)

  if (!business) {
    return ctx.throw(404, "Business does not exist in storage")
  }

  const timezone = tz.findTimeZone(business.timezone)
  const backupDate = tz.getZonedTime(new Date, timezone)
  const date = dateFns.parse(ctx.request.query.date, "yyyy-MM-dd", new Date)
  const selectedDate = dateFns.isValid(date) ? tz.convertDateToTime(date) : backupDate

  const events = await Events.find(ctx.mongo, {
    businessId: businessId,
    $and: [
      {
        "start.year": { $lte: selectedDate.year },
        "start.month": { $lte: selectedDate.month },
        "start.day": { $lte: selectedDate.day },
      },
      {
        "end.year": { $gte: selectedDate.year },
        "end.month": { $gte: selectedDate.month },
        "end.day": { $gte: selectedDate.day },
      },
    ]
  })
    .limit(100)
    .sort("createdAt", -1)
    .toArray()

  const services = new Map(business.services.map(s => [s.id, s]))
  const employees = new Map(business.employees.map(e => [e.id, e]))
  const formattedEvents = formatEvents(events, services, employees, businessId)

  const datePicker = datepicker({
    selectedDate: tz.convertTimeToDate(selectedDate),
    urlBuilder: function (date) {
      return "/calendar?" + querystring.stringify({
        date: dateToISODate(date)
      })
    },
    weekStartsOn: 1
  })

  ctx.state.title = "Welcome";
  ctx.body = await renderView("calendar.ejs", {
    user: user,
    business: business,
    formattedEvents: formattedEvents,
    datePicker: datePicker
  })
}

function formatEvents(
  events: Events.Event[],
  services: Map<number, accounts.Service>,
  employees: Map<string, accounts.Employee>,
  businessId: string
) {
  return events.map(e => {
    const startHours = e.start.hours.toString().padStart(2, "0")
    const startMinutes = e.start.minutes.toString().padStart(2, "0")
    const endHours = e.end.hours.toString().padStart(2, "0")
    const endMinutes = e.end.minutes.toString().padStart(2, "0")

    /**
     * @todo service should be placed to event
     */
    const service = services.get(e.serviceId)
    const serviceName = service ? service.name : ""
    const servicePrice = service ? `${service.currencyCode}${service.price}` : ""

    /**
     * @todo all assigner information should be placed in event
     */
    const assigner = employees.get(e.assigner.id)
    const assignerName = assigner ? (assigner.name || assigner.id) : e.assigner.id

    return {
      id: e.id,
      url: Router.url("/business/:businessId/event/:eventId", { businessId, eventId: e.id }),
      serviceName,
      servicePrice,
      clientName: e.client ? e.client.name : "Appointment",
      time: `${startHours}:${startMinutes} - ${endHours}:${endMinutes}`,
      assignerName,
    }
  })
}
