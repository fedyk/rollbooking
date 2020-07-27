import * as Router from "@koa/router"
import * as querystring from "querystring";
import * as tz from "timezone-support";
import * as dateFns from "date-fns";
import { getBusinessById } from "../../models/businesses";
import { renderView } from "../../render";
import { Middleware } from "../../types";

export const users: Middleware = async (ctx) => {
  const business = await getBusinessById(ctx.mongo, ctx.params.businessId)

  if (!business) {
    return ctx.throw(404, new Error("Page not found"))
  }

  const currentUserId = ctx.session?.userId

  if (currentUserId !== business.ownerId) {
    return ctx.throw(404, new Error("Access restricted"))
  }

  const timezone = tz.findTimeZone(business.timezone)

  if (!timezone) {
    throw new RangeError(`Business ${business.id} has missed or invalid timezone`)
  }

  const employees = business.employees;
  
  ctx.state.title = business.name
  ctx.body = await renderView("business-settings/users.ejs", {
    name: business.name,
    employees: employees,
  })
}
