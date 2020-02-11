import * as ejs from "ejs";
import * as dateFns from "date-fns";
import * as Types from '../../types';
import * as accounts from '../../accounts';
import * as events from '../../events';
import { nativeDateToDateTime } from '../../helpers/date/native-date-to-date-time';
import { uniqId } from "../../lib/uniq-id";
import { Status } from "../../types";
import { dateTimeToNativeDate } from "../../helpers/date/date-time-to-native-date";

export const createEvent: Types.Middleware = async (ctx) => {
  const business = ctx.state.business as accounts.Business
  const user = ctx.state.user

  if (!business) {
    return ctx.throw(404, new Error("Page does not exist"))
  }

  if (!user) {
    throw new Error("add support anonymous user")
  }

  const query = parseQuery(ctx.request.query)
  const service = business.services.find(s => s.id === query.serviceId)

  if (!service) {
    return ctx.throw(404, "Page does not exist")
  }

  if (ctx.request.method === "POST") {
    const eventId = uniqId()
    const clientId = user.id
    const startDate = dateTimeToNativeDate(query.date)
    const endDate = dateFns.addMinutes(startDate, service.duration)
  
    const result = await events.create(ctx.mongoDatabase, {
      id: eventId,
      businessId: business.id,
      clientId: clientId,
      userId: query.userId,
      serviceId: query.serviceId,
      start: nativeDateToDateTime(startDate),
      end: nativeDateToDateTime(endDate),
      status: Status.Confirmed,
      timezone: user.timezone,
      createdAt: new Date,
      updatedAt: new Date
    })

    if (result.insertedCount !== 1) {
      throw new Error("Event has not been created.")
    }
  
    return ctx.redirect(`/b/${business.id}/events/${eventId}`)
  }

  ctx.body = await ejs.renderFile("views/business/create-event.ejs", {
    user,
  })
}


export const getEvent: Types.Middleware = async (ctx) => {
  const business = ctx.state.business as accounts.Business
  const user = ctx.state.user
  const eventId = ctx.params.eventId

  if (!business) {
    return ctx.throw(404, new Error("Page does not exist"))
  }

  if (!user) {
    return ctx.throw(404, "You have no access to this page")
  }

  if (!eventId) {
    return ctx.throw(404, "Reservation does not exist")
  }

  const event = await events.findOne(ctx.mongoDatabase, {
    id: eventId,
    clientId: user.id
  })

  if (!event) {
    return ctx.throw(404, "Reservation does not exist")
  }

  ctx.body = await ejs.renderFile(`views/business/get-event.ejs`, {
    reservation: event,
    user
  })
}


function parseQuery(query: any) {
  if (typeof query !== "object") {
    throw RangeError("Invalid query string")
  }

  const userId = query.user_id
  const serviceId = query.service_id

  if (typeof userId !== "string") {
    throw RangeError("Invalid user id")
  }

  if (typeof serviceId !== "string") {
    throw RangeError("Invalid service id")
  }

  const dateString = query.date

  if (typeof dateString !== "string") {
    throw RangeError("Invalid date")
  }

  const nativeDate = new Date(dateString)

  if (Number.isNaN(nativeDate.getTime())) {
    throw RangeError("Invalid date format")
  }

  const date = nativeDateToDateTime(nativeDate)

  return { userId, serviceId, date }
}
