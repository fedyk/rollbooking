import { ObjectId } from "mongodb";
import * as dateFns from "date-fns";
import * as Types from '../types';
import { renderView } from "../render";
import { nativeDateToDateTime } from '../helpers/native-date-to-date-time';
import { ok } from "assert";

export const confirmReservation: Types.Middleware = async (ctx) => {
  const user = ctx.state.user
  const business = await ctx.organizations.get(ObjectId.createFromHexString(ctx.params.id))
  const query = parseQuery(ctx.request.query)

  if (!business) {
    return ctx.throw(404, "Not found")
  }

  const service = business.services.find(s => s.id.equals(query.serviceId))

  if (!service) {
    return ctx.throw(404, "Not found")
  }

  const member = business.users.find(m => m.id.equals(query.userId))

  if (!member) {
    return ctx.throw(404, "Not found")
  }

  if (ctx.request.method === "POST") {
    if (!user) {
      return ctx.throw(401, "Not authorized")
    }

    const body = parseBody(ctx.request.body)
    const startDate = query.date
    const endDate = dateFns.addMinutes(query.date, service.duration)
    // let customer = await ctx.customers.findById(business._id, user._id)

    // if (!customer) {
    //   customer = {
    //     _id: new ObjectId(),
    //     organizationId: business._id,
    //     userId: user._id,
    //     name: user.name,
    //     email: user.email,
    //     phone: user.phone,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   }

    //   await ctx.customers.create(customer).then(result => {
    //     ok(result.insertedCount === 1, "Failed to create reservation. Please try again later or use phone for reservation.")
    //   })
    // }

    const result = await ctx.reservations.create({
      start: nativeDateToDateTime(startDate),
      end: nativeDateToDateTime(endDate),
      status: "pending",
      organization: {
        id: business._id,
        name: business.name,
        avatarUrl: business.avatarUrl
      },
      requester: {
        id: user._id,
        name: user.name,
      },
      customer: {
        id: user._id,
        name: user.name,
      },
      assignee: {
        id: member.id,
        name: member.name,
      },
      service: {
        id: service.id,
        name: service.name,
        price: service.price,
        currencyCode: service.currencyCode,
      },
      createdAt: new Date(),
      updatedAt: new Date()
    })

    if (!result.insertedId) {
      throw new Error("Event has not been created. Please try again later.")
    }

    ctx.state.alerts.push({
      text: "Reservation has been created.",
      type: "success"
    })

    return ctx.redirect(`/salon/${business._id}`)
  }

  ctx.body = await renderView("confirm-reservation.ejs", {
    user: user,
    day: query.date.getDate(),
    month: dateFns.format(query.date, "MMM"),
    userName: member.name,
    serviceName: service.name,
    time: dateFns.format(query.date, "ccc, HH:mm")
  })
}

function parseQuery(query: any) {
  const userId = ObjectId.createFromHexString(query?.user_id)
  const serviceId = ObjectId.createFromHexString(query?.service_id)
  const date = new Date(query.date)

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
  const name = String(body?.name)
  const email = String(body?.email)
  const phone = String(body?.phone)

  return {
    name: name,
    email: email,
    phone: phone
  }
}
