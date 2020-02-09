import * as ejs from "ejs";
import * as Types from '../../types';
import * as accounts from '../../accounts';
import { nativeDateToDateTime } from '../../helpers/date/native-date-to-date-time';

export const getBooking: Types.Middleware = async (ctx) => {
  const business = ctx.state.business as accounts.Business

  if (!business) {
    return ctx.throw(404, new Error("Page does not exist"))
  }

  const query = parseQuery(ctx.request.query)
  
  ctx.body = await ejs.renderFile(`views/business/booking.ejs`, {})
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
