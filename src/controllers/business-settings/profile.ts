import { getBusinessById, updateBusiness } from "../../models/businesses";
import { renderView } from "../../render";
import { Middleware, DayOfWeek } from "../../types";
import { daysOfWeek } from "../../helpers/days-of-week";
import { timeOfDayToISOTime } from "../../helpers/date/time-of-day-to-iso-time";
import { TimePeriod } from "../../types/time-period";
import { parseISOTime } from "../../helpers/date/parse-iso-time";

export const profile: Middleware = async (ctx) => {
  const business = await getBusinessById(ctx.mongo, ctx.params.businessId)

  if (!business) {
    return ctx.throw(404, new Error("Page not found"))
  }

  if (ctx.session?.userId !== business.ownerId) {
    return ctx.throw(404, new Error("Access restricted"))
  }

  if (ctx.request.method === "POST") {
    const action = parseBodyAction(ctx.request.body)

    if (action === "update_profile") {
      const body = parseProfileBody(ctx.request.body)

      await updateBusiness(ctx.mongo, business.id, body).then(resp => {
        if (resp.result.n !== 1) {
          throw new Error("Failed to update business profile")
        }
      })
    }

    if (action === "update_hours") {
      const regularHours = parseHoursBody(ctx.request.body)

      await updateBusiness(ctx.mongo, business.id, { regularHours }).then(resp => {
        if (resp.result.n !== 1) {
          throw new Error("Failed to update business profile")
        }
      })
    }

    return ctx.redirect(ctx.request.path)
  }

  const hours = getGroupedRegularHours(business.regularHours)

  ctx.state.selectedItemId = "profile"
  ctx.state.title = business.name
  ctx.state.scripts?.push("/js/work-hours.js")
  ctx.body = await renderView("business-settings/profile.ejs", {
    name: business.name,
    description: business.description,
    hours,
    daysOfWeek,
  })
}

function parseBodyAction(body: any) {
  const action = body?.action

  if (action === "update_profile") {
    return "update_profile"
  }

  if (action === "update_hours") {
    return "update_hours"
  }

  throw new RangeError("unsupported `action` passed")
}

function parseProfileBody(body: any) {
  let name = String(body.name ?? "").trim()
  let description = String(body.description ?? "").trim()

  if (name.length > 256) {
    throw new RangeError("`name` should be a longer than 256")
  }

  if (name.length === 0) {
    throw new RangeError("`name` can't be empty")
  }

  if (description.length > 2048) {
    throw new RangeError("`description` should be a longer than 2048")
  }

  return {
    name,
    description,
  }
}

function parseHoursBody(body: any): TimePeriod[] {
  const openDays = parseOpenDays(body?.open_days)
  const dayHours = body?.day_hours ?? {}
  const timePeriods: TimePeriod[] = []

  openDays.forEach(day => {
    parseHours(dayHours[`day_${day}`]).forEach(hours => {
      timePeriods.push({
        openDay: day,
        closeDay: day,
        openTime: hours.openTime,
        closeTime: hours.closeTime
      })
    })
  })

  return timePeriods;

  function parseOpenDays(data: any) {
    if (!Array.isArray(data)) {
      return []
    }

    const openDays: DayOfWeek[] = []

    data.forEach(function (openDay: any) {
      const day = Number(openDay)

      if (Number.isNaN(day)) {
        return
      }

      if (-1 <= day && day <= 6) {
        openDays.push(day)
      }
    })

    return openDays
  }

  function parseHours(data: any) {
    if (!Array.isArray(data)) {
      return []
    }

    return data.map(function (item) {
      return {
        openTime: parseISOTime(item.open_time),
        closeTime: parseISOTime(item.close_time)
      }
    })
  }
}

function getGroupedRegularHours(regularHours: TimePeriod[]) {
  const groups = new Map<number, Array<{
    openTime: string
    closeTime: string
  }>>();

  regularHours.forEach(function (regularHour) {
    let group = groups.get(regularHour.openDay)
    const hours = {
      openTime: timeOfDayToISOTime(regularHour.openTime),
      closeTime: timeOfDayToISOTime(regularHour.closeTime),
    }

    if (group) {
      group.push(hours)
    }
    else {
      groups.set(regularHour.openDay, [hours])
    }
  })

  return groups
}
