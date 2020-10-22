import * as Router from "@koa/router"
import * as querystring from "querystring";
import * as tz from "timezone-support";
import * as dateFns from "date-fns";

import * as types from '../types';
import * as accounts from '../models/businesses';
import * as Events from "../models/events";
import { Booking } from '../booking';
import { dateTimeToISODate } from '../helpers/date/date-time-to-iso-date';
import { DateTime } from '../types';
import { renderView } from "../render";

export const business: types.Middleware = async (ctx) => {
  const business = await accounts.getBusinessById(ctx.mongo, ctx.params.id)

  if (!business) {
    return ctx.throw(404, new Error("Page not found"))
  }

  const timezone = tz.findTimeZone(business.timezone)

  if (!timezone) {
    throw new RangeError(`Business ${business.id} has missed or invalid timezone`)
  }

  const currentUserId = ctx.session?.userId
  const startTime = tz.getZonedTime(new Date, timezone)
  const endTime = tz.getZonedTime(dateFns.addDays(new Date, 7), timezone)

  const events = await Events.find(ctx.mongo, {
    businessId: business.id,
    $and: [
      {
        "start.year": { $lte: endTime.year },
        "start.month": { $lte: endTime.month },
        "start.day": { $lte: endTime.day },
      },
      {
        "end.year": { $gte: startTime.year },
        "end.month": { $gte: startTime.month },
        "end.day": { $gte: startTime.day },
      },
    ]
  }).toArray()

  const booking = new Booking(business, events)

  const servicesSlots = booking.getServicesSlots()
  const servicesById = new Map(business.services.map(s => [s.id, s]))
  const services = servicesSlots.map(servicesSlots => {
    const [serviceId, slots] = servicesSlots
    const service = servicesById.get(serviceId)

    if (!service) {
      return null
    }

    return {
      name: service.name,
      price: service.price + service.currencyCode,
      slots: slots.map(slot => ({
        title: dateTimeToISODate(slot.start),
        text: formatDateTime(slot.start),
        url: Router.url("/business/:businessId/event/confirm", {
          businessId: business.id
        }) + "?" + querystring.stringify({
          user_id: slot.userId,
          service_id: serviceId,
          date: dateTimeToISODate(slot.start)
        })
      }))
    }
  })

  const avatarUrl = `/images/business-avatar-${business.id.charCodeAt(0) % 3}.png`
  const settingsUrl = business.ownerId === currentUserId
    ? Router.url("/business/:businessId/settings/profile", {
      businessId: business.id
    })
    : void 0

  ctx.state.title = business.name
  ctx.body = await renderView("business.ejs", {
    name: business.name,
    avatarUrl,
    settingsUrl,
    business,
    services
  })
}

function formatDateTime(dateTime: DateTime): string {
  const h = dateTime.hours.toString().padStart(2, "0")
  const m = dateTime.minutes.toString().padStart(2, "0")

  return `${h}:${m}`
}
