import * as ejs from "ejs";
import * as dateFns from "date-fns";
import * as localize from "date-fns/locale/en-US/_lib/localize";
import * as Types from '../../types';
import * as accounts from '../../accounts';
import * as clients from '../../clients';
import * as events from '../../events';
import { nativeDateToDateTime } from '../../helpers/date/native-date-to-date-time';
import { uniqId } from "../../lib/uniq-id";
import { Status } from "../../types";
import { dateTimeToNativeDate } from "../../helpers/date/date-time-to-native-date";

export const createEvent: Types.Middleware = async (ctx) => {
  const business = ctx.state.business as accounts.Business
  let user = ctx.state.user
  const clientId = ctx.session.clientId

  if (!business) {
    return ctx.throw(404, new Error("Page does not exist"))
  }

  const query = parseQuery(ctx.request.query)
  const service = business.services.find(s => s.id === query.serviceId)

  if (!service) {
    return ctx.throw(404, "Page does not exist")
  }

  const employe = business.employees.find(e => e.id === query.userId)

  if (!employe) {
    return ctx.throw(404, "Page does not exist")
  }

  const employeAccount = await accounts.getById(ctx.mongoDatabase, employe.id)

  if (ctx.request.method === "POST") {
    const eventId = uniqId()
    const clientId = user.id
    const startDate = query.date
    const endDate = dateFns.addMinutes(query.date, service.duration)

    const result = await events.create(ctx.mongoDatabase, {
      id: eventId,
      businessId: business.id,
      clientId: clientId,
      userId: query.userId,
      serviceId: query.serviceId,
      start: nativeDateToDateTime(startDate),
      end: nativeDateToDateTime(endDate),
      status: Status.Confirmed,
      timezone: business.timezone,
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
    day: query.date.getDate(),
    month: dateFns.format(query.date, "MMM"),
    userName: employeAccount.name,
    serviceName: service.name,
    time: dateFns.format(query.date, "ccc, HH:mm")
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

  const employee = await accounts.getById(ctx.mongoDatabase, event.userId)

  if (!employee) {
    return ctx.throw(404, "Reservation does not exist")
  }

  const service = business.services.find(s => s.id === event.serviceId)

  if (!service) {
    return ctx.throw(404, "Reservation does not exist")
  }

  ctx.body = await ejs.renderFile(`views/business/get-event.ejs`, {
    event,
    user,
    day: event.start.day,
    month: localize.month(event.start.month - 1, { width: "abbreviated" }),
    userName: employee.name,
    serviceName: service.name,
    time: dateFns.format(dateTimeToNativeDate(event.start), "ccc, HH:mm")
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

  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) {
    throw RangeError("Invalid date format")
  }

  return { userId, serviceId, date }
}
