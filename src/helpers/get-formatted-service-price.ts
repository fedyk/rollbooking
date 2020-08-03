import { Service } from "../models/businesses";

export function getFormattedServicePrice(service: Service) {
  if (service.currencyCode === "USD") {
    return "$" + service.price.toPrecision(2)
  }

  return service.price.toPrecision(2) + service.currencyCode
}
