import { getBusinessById, updateBusiness } from "../../models/businesses";
import { renderView } from "../../render";
import { Middleware } from "../../types";
import { daysOfWeek } from "../../helpers/days-of-week";
import { timeOfDayToISOTime } from "../../helpers/date/time-of-day-to-iso-time";
import { getUrl } from "../../helpers/get-url";

export const profile: Middleware = async (ctx) => {
  const business = await getBusinessById(ctx.mongo, ctx.params.businessId)

  if (!business) {
    return ctx.throw(404, new Error("Page not found"))
  }

  if (ctx.session?.userId !== business.ownerId) {
    return ctx.throw(404, new Error("Access restricted"))
  }

  if (ctx.request.method === "POST") {
    const body = parseBody(ctx.request.body)
    const response = await updateBusiness(ctx.mongo, business.id, body)

    if (response.result.n !== 1) {
      throw new Error("Failed to update business profile")
    }

    Object.assign(business, body)
  }

  const regularHours = business.regularHours.map(function (regularHour) {
    return {
      openDay: regularHour.openDay,
      closeDay: regularHour.closeDay,
      openTime: timeOfDayToISOTime(regularHour.openTime),
      closeTime: timeOfDayToISOTime(regularHour.closeTime),
    }
  })

  ctx.state.selectedItemId = "profile"
  ctx.state.title = business.name
  ctx.body = await renderView("business-settings/profile.ejs", {
    name: business.name,
    description: business.description,
    regularHours: regularHours,
    daysOfWeek: daysOfWeek,
  })
}

function parseBody(body: any) {
  if (!body) {
    throw new RangeError("`body` can't be empty")
  }

  let name = body.name
  let description = body.description

  if (typeof name !== "string") {
    throw new RangeError("`name` should be a string")
  }

  name = name.trim()

  if (name.length > 256) {
    throw new RangeError("`name` should be a longer than 256")
  }

  if (name.length === 0) {
    throw new RangeError("`name` can't be empty")
  }

  if (typeof description !== "string") {
    throw new RangeError("`description` should be a string")
  }

  description = description.trim()

  if (description.length > 2048) {
    throw new RangeError("`description` should be a longer than 2048")
  }

  return {
    name,
    description,
  }
}
