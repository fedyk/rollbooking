import * as Router from "@koa/router";
import * as types from "../../types";
import { renderView } from "../../render";

export const layout: types.Middleware = async (ctx, next) => {
  const businessId = ctx.params.businessId

  if (!businessId) {
    throw new RangeError("`businessSettingsLayout` midlware requires `bussinessId` parameter in the scope")
  }

  /**
   * To mark item as selected, assign his id to `ctx.state.selectedItemId`
   */
  const links = [
    {
      id: "profile",
      title: "Profile",
      url: Router.url("/business/:businessId/settings/profile", {
        businessId
      })
    },
    {
      id: "services",
      title: "Services",
      url: Router.url("/business/:businessId/settings/services", {
        businessId
      })
    },
    {
      id: "users",
      title: "Users",
      url: Router.url("/business/:businessId/settings/users", {
        businessId
      })
    }]

  await next()

  ctx.body = await renderView("business-settings/layout.ejs", {
    body: ctx.body,
    links,
    selectedItemId: ctx.state.selectedItemId
  })
}
