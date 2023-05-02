import { ObjectId } from "mongodb";
import { renderView } from "../../render";
import { Middleware } from "../../types";
import { formatServicePrice_DEPRECATED } from "../../helpers/format-service-price";
import { Service } from "../../data-access/organizations";

export const services: Middleware = async (ctx) => {
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

  const services = business.services.map(function (service) {
    return parseService(service, business._id.toHexString())
  }).reverse()

  // @ts-ignore
  // @ts-ignore
ctx.state.selectedItemId = "services"
  ctx.state.title = business.name
  ctx.body = await renderView("business-settings/services.ejs", {
    name: business.name,
    services: services,
    addUrl: `/salon/${business._id}/settings/services/new`
  })
}

function parseService(service: Service, businessId: string) {
  return {
    name: service.name,
    description: service.description,
    duration: `${service.duration}min`,
    price: formatServicePrice_DEPRECATED(service),
    url: `/salon/${businessId}/settings/services/${service.id}`,
  }
}
