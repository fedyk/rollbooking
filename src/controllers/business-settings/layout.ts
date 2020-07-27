import * as Router from "@koa/router";
import * as types from "../../types";
import { renderView } from "../../render";

export const layout: types.Middleware = async (ctx, next) => {
  const businessId = ctx.params.businessId

  if (!businessId) {
    throw new RangeError("`businessSettingsLayout` midlware requires `bussinessId` parameter in the scope")
  }

  // first link is selected by default
  ctx.state.selectedItemId = "users";

  const links = [{
    id: "users",
    title: "Users",
    url: Router.url("/business/:businessId/settings", { businessId })
  }]

  await next()

  ctx.body = await renderView("business-settings/layout.ejs", {
    body: ctx.body,
    links,
    selectedItemId: ctx.state.selectedItemId
  })
}
