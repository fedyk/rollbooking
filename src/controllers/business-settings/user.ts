import { ObjectID } from "mongodb"
import { UserRole, UserSummary } from "../../data-access/organizations"
import { User } from "../../data-access/users"
import { getGravatarUrl } from "../../helpers/gravatar"
import { isEmail } from "../../lib/is-email"
import { renderView } from "../../render"
import { Middleware } from "../../types"

interface UserForm {
  name: string
  email: string
  possition: string
  role: UserRole
}

export const user: Middleware = async (ctx) => {
  const business = await ctx.organizations.get(ObjectID.createFromHexString(ctx.params.id))

  if (!business) {
    return ctx.throw(new Error("Page not found"), 404)
  }

  if (!ctx.session.userId) {
    return ctx.throw("Not found", 404)
  }

  if (!business.creatorId.equals(ctx.session.userId)) {
    return ctx.throw(new Error("Access restricted"), 404)
  }

  /**
   * 
   * 
   * We should switch back to idea to have users and organization.usersSummary relations
   * 
   * 
   */


  // this controller handle adding and updating of users
  // const isCreateMode = ctx.params.userId === "add"

  // let userFormData: UserForm

  // // create empty model in create-mode
  // if (isCreateMode) {
  //   userFormData = {
  //     name: "",
  //     email: "",
  //     possition: "",
  //     role: "normal",
  //   }
  // }
  // else {
  //   const user = business.users.find(u => u.id.equals(ctx.params.userId))

  //   if (!user) {
  //     return ctx.throw("Not found", 404)
  //   }

  //   userFormData = {
  //     name: user.name
  //     possition: user.position
  //     role = user.role
  //   }
  // }

  // const listUrl = `/salon/${business._id}/settings/users`

  // // update/create member
  // if (ctx.request.method === "POST") {
  //   Object.assign(user, parseBody(ctx.request.body))

  //   const result = isCreateMode
  //     ? await ctx.organizations.addMember(business._id, user)
  //     : await ctx.organizations.setMember(business._id, user.id, user)

  //   if (result.modifiedCount === 1) {
  //     ctx.state.alerts.push({
  //       text: isCreateMode ? "User has been added." : "User has been updated.",
  //       type: "success"
  //     })

  //     return ctx.redirect(listUrl)
  //   }

  //   ctx.state.alerts.push({
  //     text: "Failed to update user. Please try again later.",
  //     type: "danger"
  //   })
  // }

  // const pageTitle = isCreateMode ? "Add user" : user.name;

  // // @ts-ignore
  // ctx.state.selectedItemId = "users"
  // ctx.state.title = pageTitle
  // ctx.body = await renderView("business-settings/user.ejs", {
  //   pageTitle,
  //   user: user,
  //   listUrl,
  // })
}

function parseBody(body: any): Partial<UserSummary> {
  let name = String(body?.name ?? "").trim()
  let email = String(body?.email ?? "").trim()
  let position = String(body?.position ?? "").trim()
  let role = String(body?.role ?? "").trim()

  if (name.length === 0) {
    throw new RangeError("`name` can't be empty")
  }

  if (role !== "owner" && role !== "admin" && role !== "normal") {
    throw new RangeError("`role` should have supported role")
  }

  if (email.length !== 0) {
    if (!isEmail(email)) {
      throw new RangeError("Invalid email address")
    }
  }

  const partial = {
    name,
    email,
    position,
    role: role as "owner" | "admin" | "normal"
  }

  return partial
}
