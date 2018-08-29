import * as assert from "assert";
import debugFactory from "debug";
import { updateSalonService as putSalonService } from '../queries/salons'
import { PoolClient } from "pg";
import { SalonService, SalonServiceProperties } from "../models/salon-service";
import { getSalonService } from "./get-salon-service";

export async function updateSalonService(client: PoolClient, salonId: number, serviceId: number, newProperties: SalonServiceProperties): Promise<SalonService> {

  assert(client, 'PoolClient is not provided')
  assert(salonId, 'Salon is required')

  const service = await getSalonService(client, salonId, serviceId);
  const oldProperties = service.properties;

  const properties = Object.assign({}, oldProperties, {
    general: { ...oldProperties.general, ...newProperties.general },
    price: { ...oldProperties.price, ...newProperties.price }
  })
 
  return await putSalonService(client, salonId, serviceId, {
    ...service,
    properties: properties,
    updated: new Date
  });
}
