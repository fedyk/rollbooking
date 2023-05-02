import { ObjectId } from "mongodb";
import { renderView } from "../../render";
import { Middleware } from "../../types";

export const users: Middleware = async (ctx) => {
  const business = await ctx.organizations.get(ObjectId.createFromHexString(ctx.params.id))

  if (!business) {
    return ctx.throw("Not found", 404)
  }

  if (!ctx.session.userId) {
    return ctx.throw("Not found", 404)
  }

  if (!business.creatorId.equals(ctx.session.userId)) {
    return ctx.throw("Restricted access", 404)
  }

  const members = business.users.map(function(member) {
    return {
      name: member.name,
      avatarUrl: member.avatarUrl,
      role: member.role,
      position: member.position ?? "",
      url: `/salon/${business._id}/settings/users/${member.id}`,
    }
  })

  // @ts-ignore
  ctx.state.selectedItemId = "users"
  ctx.state.title = business.name
  ctx.body = await renderView("business-settings/users.ejs", {
    name: business.name,
    users: members,
    addUserUrl: `/salon/${business._id}/settings/users/add`
  })
}
