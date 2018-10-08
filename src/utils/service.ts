import { SalonService } from "../models/salon-service";

export const getServiceName = (service: SalonService) => {
  return service && service.properties && service.properties.general && service.properties.general.name;
}

export const getServiceDuration = (service: SalonService): number => {
  return service && service.properties && service.properties.general && service.properties.general.duration;
}

export const getServiceDescription = (service: SalonService): string => {
  return service && service.properties && service.properties.general && service.properties.general.description;
}

export const getServicePrice = (service: SalonService): number => {
  return service && service.properties && service.properties.price && service.properties.price.value;
}

export const getServicePriceCurrency = (service: SalonService): number => {
  return service && service.properties && service.properties.price && service.properties.price.value;
}
