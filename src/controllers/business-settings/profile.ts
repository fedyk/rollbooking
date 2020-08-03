import { getBusinessById } from "../../models/businesses";
import { renderView } from "../../render";
import { Middleware } from "../../types";

export const profile: Middleware = async (ctx) => {
  const business = await getBusinessById(ctx.mongo, ctx.params.businessId)

  if (!business) {
    return ctx.throw(404, new Error("Page not found"))
  }

  if (ctx.session?.userId !== business.ownerId) {
    return ctx.throw(404, new Error("Access restricted"))
  }

  ctx.state.selectedItemId = "profile"
  ctx.state.title = business.name
  ctx.body = await renderView("business-settings/profile.ejs", {
    name: business.name,
    description: business.description
  })
}
