import { Salon } from "../models/salon";

export function getSalonCurrencyValue(salon: Salon): string {
  return salon && salon.properties && salon.properties.currency && salon.properties.currency.value || "USD";
}

export function getSalonCurrencySymbol(salon: Salon): string {
  return salon && salon.properties && salon.properties.currency && salon.properties.currency.symbol || "$";
}
