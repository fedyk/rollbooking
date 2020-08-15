import { renderView } from "../../render"
import { Middleware } from "../../types"
import { getUrl } from "../../helpers/get-url"
import { getBusinessById, setUser } from "../../models/businesses"

export const user: Middleware = async (ctx) => {
  const business = await getBusinessById(ctx.mongo, ctx.params.businessId)

  if (!business) {
    return ctx.throw(new Error("Page not found"), 404)
  }

  if (ctx.session?.userId !== business.ownerId) {
    return ctx.throw(new Error("Access restricted"), 404)
  }

  const user = business.employees.find(u => u.id === ctx.params.userId)

  if (!user) {
    return ctx.throw(new Error("Page not found"), 404)
  }

  const listUrl = getUrl("/business/:businessId/settings/users", {
    businessId: business.id
  })

  if (ctx.request.method === "POST") {
    const body = parseBody(ctx.request.body)

    const result = await setUser(ctx.mongo, business.id, user.id, {
      ...user,
      name: body.name,
      position: body.position,
      role: body.role ? body.role : user.role,
    })

    if (result.matchedCount !== 1) {
      ctx.state.alerts?.push({
        text: "Failed to update user. Please try again later",
        type: "danger"
      })
    }
    else {
      return ctx.redirect(listUrl)
    }
  }


  const pageTitle = user.name;

  ctx.state.selectedItemId = "users"
  ctx.state.title = pageTitle
  ctx.body = await renderView("business-settings/user.ejs", {
    pageTitle: user.name,
    user,
    listUrl,
  })
}

function parseBody(body: any) {
  if (!body) {
    throw new RangeError("`body` can't be empty")
  }

  let name = String(body.name ?? "").trim()
  let position = String(body.position ?? "").trim()
  let role = String(body.role ?? "").trim()

  if (name.length > 256) {
    throw new RangeError("`name` should be a longer than 256")
  }

  if (name.length === 0) {
    throw new RangeError("`name` can't be empty")
  }

  if (position.length > 2048) {
    throw new RangeError("`description` should be a longer than 2048")
  }

  if (role && role !== "owner" && role !== "admin" && role !== "normal") {
    throw new RangeError("`role` should have supported role")
  }

  return {
    name,
    position,
    role: role as "owner" | "admin" | "normal" | void,
  }
}
