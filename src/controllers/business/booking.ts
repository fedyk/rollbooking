import * as ejs from "ejs";
import * as dateFns from "date-fns";
import * as Types from '../../types';
import * as accounts from '../../accounts';
import * as reservations from '../../reservations';
import { nativeDateToDateTime } from '../../helpers/date/native-date-to-date-time';
import { uniqId } from "../../lib/uniq-id";
import { Status } from "../../types";

export const getBooking: Types.Middleware = async (ctx) => {
  const business = ctx.state.business as accounts.Business
  const user = ctx.state.user

  if (!business) {
    return ctx.throw(404, new Error("Page does not exist"))
  }

  const query = parseQuery(ctx.request.query)
  
  ctx.body = await ejs.renderFile(`views/business/booking.ejs`, {
    user
  })
}

export const createBooking: Types.Middleware = async (ctx) => {
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
  const clientId = user.id
  const end = nativeDateToDateTime(dateFns.addMinutes())

  const result = await reservations.create(ctx.mongoDatabase, {
    id: uniqId(),
    businessId: business.id,
    clientId: clientId,
    userId: query.userId,
    serviceId: query.serviceId,
    start: query.date,
    end: add query.date,
    status: Status.Confirmed,
    timezone: user.timezone,
    createdAt: new Date,
    updatedAt: new Date
  })

  ctx.body = await ejs.renderFile(`views/business/booking.ejs`, {
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
