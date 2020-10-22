import Router = require("@koa/router");
import * as dateFns from "date-fns";
import * as Types from '../types';
import * as accounts from '../models/businesses';
import * as users from '../models/users';
import * as clients from '../models/clients';
import * as events from '../models/events';
import { nativeDateToDateTime } from '../helpers/date/native-date-to-date-time';
import { uniqId } from "../lib/uniq-id";
import { renderView } from "../render";

export const confirmEvent: Types.Middleware = async (ctx) => {
  if (!ctx.session) {
    return ctx.throw(404, "Internal problem with session. please try again later")
  }

  const business = await accounts.getBusinessById(ctx.mongo, ctx.params.id)

  /** Logged-in user */
  const user = ctx.state.user || null

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

  const employeeAccount = await users.getUserById(ctx.mongo, employee.id)

  if (ctx.request.method === "POST") {
    const body = parseBody(ctx.request.body)
    const eventId = uniqId()
    const startDate = query.date
    const endDate = dateFns.addMinutes(query.date, service.duration)

    let organizer: users.User | clients.Client | null = user;

    if (!organizer && clientId) {
      organizer = await clients.getById(ctx.mongo, clientId)
    }

    // create new record for client
    if (!organizer) {
      await clients.create(ctx.mongo, organizer = {
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

    const result = await events.create(ctx.mongo, {
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

    return ctx.redirect(Router.url("/business/:businessId/event/:eventId", { businessId: business.id, eventId }))
  }

  ctx.body = await renderView("create-event.ejs", {
    user,
    day: query.date.getDate(),
    month: dateFns.format(query.date, "MMM"),
    userName: employeeAccount ? employeeAccount.name : "",
    serviceName: service.name,
    time: dateFns.format(query.date, "ccc, HH:mm")
  })
}

function parseQuery(query: any) {
  if (typeof query !== "object") {
    throw RangeError("Invalid query string")
  }

  const userId = query.user_id
  const serviceId = Number(query.service_id)

  if (typeof userId !== "string") {
    throw RangeError("Invalid user id")
  }

  if (Number.isNaN(serviceId)) {
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

  return {
    userId,
    serviceId,
    date
  }
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
