import { SalonService } from "../models/salon-service";
import { getProperty } from "./get-property";

export const getServiceName = (service: SalonService) => {
  return getProperty(service.properties, 'general', 'name');
}

export const getServiceDuration = (service: SalonService): string => {
  return getProperty(service.properties, 'general', 'duration');
}

export const getServiceDescription = (service: SalonService): string => {
  return getProperty(service.properties, 'general', 'description');
}

export const getServicePrice = (service: SalonService): string => {
  return getProperty(service.properties, 'price', 'value');
}

export const getServicePriceCurrency = (service: SalonService): string => {
  return getProperty(service.properties, 'price', 'currency');
}
