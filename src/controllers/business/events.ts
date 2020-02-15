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
  /** Logged-in user */
  const user = ctx.state.user
  /** Anonymous client(his ID) */
  const clientId = ctx.session.clientId

  if (!business) {
    return ctx.throw(404, new Error("Page does not exist"))
  }

  const query = parseQuery(ctx.request.query)
  const service = business.services.find(s => s.id === query.serviceId)

  if (!service) {
    return ctx.throw(404, "Page does not exist")
  }

  const employee = business.employees.find(e => e.id === query.userId)

  if (!employee) {
    return ctx.throw(404, "Page does not exist")
  }

  const employeeAccount = await accounts.getById(ctx.mongoDatabase, employee.id)

  if (ctx.request.method === "POST") {
    const body = parseBody(ctx.request.body)
    const eventId = uniqId()
    const startDate = query.date
    const endDate = dateFns.addMinutes(query.date, service.duration)

    let organizer: accounts.User | clients.Client = user;

    if (!organizer && clientId) {
      organizer = await clients.getById(ctx.mongoDatabase, clientId)
    }

    // create new record for client
    if (!organizer) {
      await clients.create(ctx.mongoDatabase, organizer = {
        id: uniqId(),
        businessId: business.id,
        name: body.name || "Client",
        email: body.email,
        phone: body.phone,
        created: new Date,
        updated: new Date,
      })

      // associate current session with client in storage
      ctx.session.clientId = organizer.id
    }

    const result = await events.create(ctx.mongoDatabase, {
      id: eventId,
      businessId: business.id,
      organizer: {
        id: organizer.id,
        name: organizer.name,
        type: "client",
      },
      assigner: {
        id: employee.id,
        name: employee.name,
      },
      client: {
        id: organizer.id,
        name: organizer.name,
        type: user ? "user" : "client"
      },
      serviceId: query.serviceId,
      start: nativeDateToDateTime(startDate),
      end: nativeDateToDateTime(endDate),
      status: "pending",
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
    userName: employeeAccount.name,
    serviceName: service.name,
    time: dateFns.format(query.date, "ccc, HH:mm")
  })
}

export const getEvent: Types.Middleware = async (ctx) => {
  const business = ctx.state.business as accounts.Business
  const user = ctx.state.user
  const clientId = user ? user.id : ctx.session.clientId
  const eventId = ctx.params.eventId

  if (!business) {
    return ctx.throw(404, new Error("Page does not exist"))
  }

  if (!clientId) {
    return ctx.throw(404, "Page does not exist")
  }

  if (!eventId) {
    return ctx.throw(404, "Reservation does not exist")
  }

  const event = await events.findOne(ctx.mongoDatabase, {
    id: eventId,
    "client.id": clientId
  })

  if (!event) {
    return ctx.throw(404, "Reservation does not exist")
  }

  const employee = await accounts.getById(ctx.mongoDatabase, event.assigner.id)

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

function parseBody(body: any) {
  if (!body || typeof body !== "object") {
    throw RangeError("Invalid data passed")
  }

  const name = body.name

  if (typeof name !== "string") {
    throw RangeError("Invalid name was passed")
  }

  const email = body.email

  if (typeof email !== "string") {
    throw RangeError("Invalid email was passed")
  }

  const phone = body.phone

  if (typeof phone !== "string") {
    throw RangeError("Invalid phone was passed")
  }

  return {
    name: name,
    email: email,
    phone: phone
  }
}
