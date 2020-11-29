import { ObjectID } from "mongodb"
import { renderView } from "../../render"
import { Middleware } from "../../types"
import { Service } from "../../data-access/organizations"

export const service: Middleware = async (ctx) => {
  const business = await ctx.organizations.get(ObjectID.createFromHexString(ctx.params.id))

  if (!business) {
    return ctx.throw(404, "Not found")
  }

  if (!ctx.session.userId) {
    return ctx.throw(404, "Not found")
  }

  if (!business.creatorId.equals(ctx.session.userId)) {
    return ctx.throw(404, "Not found")
  }

  const isCreatingMode = ctx.params.serviceId === "new"
  const listUrl = `/salon/${business._id}/settings/services`

  let service: Service;

  if (isCreatingMode) {
    service = {
      id: new ObjectID(),
      name: "",
      description: "",
      duration: 30,
      currencyCode: "USD",
      price: 0
    }
  }
  else {
    const currentService = business.services.find(s => s.id.equals(ctx.params.serviceId))

    if (!currentService) {
      return ctx.throw(new Error("Page does not exist"), 404)
    }

    service = currentService
  }

  if (ctx.request.method === "POST") {
    const body = parseBody(ctx.request.body)
    const result = isCreatingMode
      ? await ctx.organizations.addService(business._id, Object.assign(service, body))
      : await ctx.organizations.setService(business._id, service.id, Object.assign(service, body))

    if (result.matchedCount !== 1) {
      return ctx.throw(500, "failed to create service. Please try again later")
    }

    return ctx.redirect(listUrl)
  }

  const pageTitle = isCreatingMode ? "New" : service.name
  const submitLabel = isCreatingMode ? "Add service" : "Update service"

  // @ts-ignore
  ctx.state.selectedItemId = "services"
  ctx.state.title = pageTitle
  ctx.body = await renderView("business-settings/service.ejs", {
    pageTitle,
    submitLabel,
    service,
    listUrl,
  })
}

function parseBody(body: any) {
  if (!body) {
    throw new RangeError("`body` can't be empty")
  }

  let name = String(body?.name ?? "").trim()
  let description = String(body?.description ?? "").trim()
  let duration = Number(body.duration)
  let price = Number(body.price)

  if (name.length === 0) {
    throw new RangeError("`name` can't be empty")
  }

  if (Number.isNaN(duration)) {
    throw new RangeError("`duration` should be a number")
  }

  if (duration < 0) {
    throw new RangeError("`duration` can't be negative")
  }

  if (Number.isNaN(price)) {
    throw new RangeError("`price` should be a number")
  }

  if (price < 0) {
    throw new RangeError("`price` can't be negative")
  }

  return {
    name,
    description,
    duration,
    price
  }
}
