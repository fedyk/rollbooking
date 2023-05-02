import * as Router from "@koa/router"
import { stringify } from "querystring";
import * as tz from "timezone-support";
import * as dateFns from "date-fns";
import { ObjectId } from "mongodb";

import * as types from '../types';
import { getServicesSlots } from '../booking';
import { dateTimeToISODate } from '../helpers/date-time-to-iso-date';
import { DateTime } from '../types';
import { renderView } from "../render";
import { ErrorWithType } from "../errors";
import { dateTimeToNativeDate } from "../helpers/date-time-to-native-date";
import { formatPrice } from "../helpers/format-price";

export const salon: types.Middleware = async (ctx) => {
  const business = await ctx.organizations.get(ObjectId.createFromHexString(ctx.params.id))

  if (!business) {
    throw new ErrorWithType("Not found", "ORGANIZATION_NOT_EXIST", 404)
  }

  const timezone = tz.findTimeZone(business.timezone)

  if (!timezone) {
    throw new RangeError(`Business ${business._id} has missed or invalid timezone`)
  }

  const currentUserId = ctx.session?.userId
  const startTime = tz.getZonedTime(new Date, timezone)
  const endTime = tz.getZonedTime(dateFns.addDays(new Date, 7), timezone)
  const reservations = await ctx.reservations.findByDateRange(business._id, startTime, endTime)
  const servicesSlots = getServicesSlots(business, reservations)
  const servicesById = new Map(business.services.map(s => [s.id.toHexString(), s]))
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
        url: `/salon/${business._id}/confirm?${stringify({
          user_id: slot.userId,
          service_id: serviceId,
          date: dateTimeToISODate(slot.start)
        })}`
      }))
    }
  })

  const settingsUrl = business.creatorId.toHexString() === currentUserId
    ? `/salon/${business._id}/settings/profile`
    : void 0

  let upcomingReservations: Array<{
    url: string
    assigneeName: string
    date: string
    price: string
  }> = []

  // curr user's reservations
  if (ctx.state.user) {
    const reservations = await ctx.reservations.findCustomerUpcoming(
      business._id,
      ctx.state.user._id,
      startTime
    )

    upcomingReservations = reservations.map(reservation => {
      return {
        url: `/reservation/${reservation._id}`,
        assigneeName: reservation.assignee.name ?? "Unknown user",
        date: dateTimeToNativeDate(reservation.start).toISOString(),
        serviceName: reservation.service.name,
        price: formatPrice(reservation.service.price, reservation.service.currencyCode),
      }
    })
  }

  ctx.state.title = business.name
  ctx.body = await renderView("salon.ejs", {
    name: business.name,
    avatarUrl: business.avatarUrl,
    settingsUrl,
    business,
    services,
    upcomingReservations
  })
}

function formatDateTime(dateTime: DateTime): string {
  const h = dateTime.hours.toString().padStart(2, "0")
  const m = dateTime.minutes.toString().padStart(2, "0")

  return `${h}:${m}`
}
