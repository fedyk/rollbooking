import { renderView } from "../../render"
import { Middleware } from "../../types"
import { getUrl } from "../../helpers/get-url"
import { getBusinessById, Service, pushService, setService } from "../../data-access/businesses"

export const service: Middleware = async (ctx) => {
  const business = await getBusinessById(ctx.mongo, ctx.params.businessId)

  if (!business) {
    return ctx.throw(404, new Error("Page not found"))
  }

  if (ctx.session?.userId !== business.ownerId) {
    return ctx.throw(404, new Error("Access restricted"))
  }

  const serviceId = ctx.params.serviceId === "new" ? "new" : Number(ctx.params.serviceId)
  const listUrl = getUrl("/business/:businessId/settings/services", {
    businessId: business.id
  })

  let service: Service;

  if (serviceId === "new") {
    service = {
      id: -1,
      name: "",
      description: "",
      duration: 30,
      currencyCode: "USD",
      price: 0
    }
  }
  else {
    const currentService = business.services.find(s => s.id === serviceId)

    if (!currentService) {
      return ctx.throw(new Error("Page does not exist"), 404)
    }

    service = currentService
  }

  if (ctx.request.method === "POST") {
    const body = parseBody(ctx.request.body)

    if (serviceId === "new") {
      const result = await pushService(ctx.mongo, business.id, {
        ...service,
        ...body,
        id: business.servicesCount + 1
      })

      if (result.modifiedCount !== 1) {
        return ctx.throw(new Error("failed to create service. Please try again later"), 500)
      }

      return ctx.redirect(listUrl)
    }
    else {
      const result = await setService(ctx.mongo, business.id, serviceId, {
        ...service,
        ...body
      })

      if (result.matchedCount !== 1) {
        return ctx.throw(new Error("failed to create service. Please try again later"), 500)
      }

      return ctx.redirect(listUrl)
    }
  }

  const pageTitle = serviceId === "new" ? "New" : service.name
  const submitLabel = serviceId === "new" ? "Add service" : "Update service"

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

  let name = body.name
  let description = body.description
  let duration = Number(body.duration)
  let price = Number(body.price)

  if (typeof name !== "string") {
    throw new RangeError("`name` should be a string")
  }

  name = name.trim()

  if (name.length > 256) {
    throw new RangeError("`name` should be a longer than 256")
  }

  if (name.length === 0) {
    throw new RangeError("`name` can't be empty")
  }

  if (typeof description !== "string") {
    throw new RangeError("`description` should be a string")
  }

  description = description.trim()

  if (description.length > 2048) {
    throw new RangeError("`description` should be a longer than 2048")
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
