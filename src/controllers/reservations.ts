import { ObjectID } from "mongodb";
import { dateTimeToNativeDate } from "../helpers/date-time-to-native-date";
import { formatPrice } from "../helpers/format-price";
import { renderView } from "../render";
import { Middleware } from "../types";

export const reservations: Middleware = async (ctx) => {
  if (!ctx.session.userId) {
    return ctx.throw(400, "Not authorized")
  }

  const userId = ObjectID.createFromHexString(ctx.session.userId)
  const reservations = await ctx.reservations.findByCustomerId(userId)

  const items = reservations.map(reservation => {
    return {
      url: `/reservation/${reservation._id}`,
      serviceName: reservation.service.name,
      assigneeName: reservation.assignee.name,
      date: dateTimeToNativeDate(reservation.start).toISOString(),
      price: formatPrice(reservation.service.price, reservation.service.currencyCode),
    }
  })

  ctx.state.title = "My reservations"
  ctx.body = await renderView("reservations.ejs", {
    items
  })
}
