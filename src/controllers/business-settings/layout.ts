import * as Router from "@koa/router";
import * as types from "../../types";
import { renderView } from "../../render";
import { ObjectId } from "mongodb";

export const layout: types.Middleware = async (ctx, next) => {
  const businessId = new ObjectId(ctx.params.id)

  if (!businessId) {
    throw new RangeError("`businessSettingsLayout` midlware requires `bussinessId` parameter in the scope")
  }

  const org = await ctx.organizations.get(businessId)

  /**
   * To mark item as selected, assign his id to `  // @ts-ignore
ctx.state.selectedItemId`
   */
  const links = [
    {
      id: "profile",
      title: "Profile",
      url: `/salon/${businessId}/settings/profile`,
    },
    {
      id: "services",
      title: "Services",
      url: `/salon/${businessId}/settings/services`,
    },
    {
      id: "users",
      title: "Users",
      url: `/salon/${businessId}/settings/users`,
    }]

  await next()

  ctx.body = await renderView("business-settings/layout.ejs", {
    body: ctx.body,
    profileUrl: `/salon/${ctx.params.id}`,
    profileName: org?.name,
    links,
    // @ts-ignore
    selectedItemId: ctx.state.selectedItemId
  })
}
