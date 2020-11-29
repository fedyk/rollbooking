import { Service } from "../data-access/organizations";

/**
 * @deprecated - use formatPrice instead
 */
export function formatServicePrice_DEPRECATED(service: Service) {
  if (service.currencyCode === "USD") {
    return "$" + service.price.toPrecision(2)
  }

  return service.price.toPrecision(2) + service.currencyCode
}
