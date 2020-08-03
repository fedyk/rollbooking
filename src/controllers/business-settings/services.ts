import { getBusinessById, Service } from "../../models/businesses";
import { renderView } from "../../render";
import { Middleware } from "../../types";
import { getUrl } from "../../helpers/get-url";
import { getFormattedServicePrice } from "../../helpers/get-formatted-service-price";
import { business } from "../business";

export const services: Middleware = async (ctx) => {
  const business = await getBusinessById(ctx.mongo, ctx.params.businessId)

  if (!business) {
    return ctx.throw(404, new Error("Page not found"))
  }

  if (ctx.session?.userId !== business.ownerId) {
    return ctx.throw(404, new Error("Access restricted"))
  }

  const services = business.services.map(function (service) {
    return parseService(service, business.id)
  })

  ctx.state.selectedItemId = "services"
  ctx.state.title = business.name
  ctx.body = await renderView("business-settings/services.ejs", {
    name: business.name,
    services: services,
    addUrl: getUrl("/business/:businessId/settings/services/new", {
      businessId: business.id,
    })
  })
}

function parseService(service: Service, businessId: string) {
  return {
    name: service.name,
    description: service.description,
    duration: `${service.duration}min`,
    price: getFormattedServicePrice(service),
    url: getUrl("/business/:businessId/settings/services/:serviceId", {
      businessId: businessId,
      serviceId: service.id,
    }),
  }
}
