import { ok } from "assert";
import debugFactory from "debug";
import { addSalonService as putSalonService } from '../queries/salons'
import { PoolClient } from "pg";
import { SalonService } from "../models/salon-service";
import { getProperty } from "../utils/get-property";

const debug = debugFactory('sagas:add-salon-service');

export async function addSalonService(client: PoolClient, service: SalonService): Promise<SalonService> {

  debug('validate input data')

  ok(client, 'PoolClient is not provided')
  ok(service, 'Service is required')
  ok(service.salon_id, 'Salon id is required')
  ok(service.properties, 'Service should have a valid properties')
  ok(service.properties.general, 'Service should have a valid properties (general')
  ok(service.properties.general.name, 'Name is required')
  ok(service.properties.general.duration, 'Duration is required')
  ok(
    typeof service.properties.general.duration === 'number',
    'Duration should be a number'
  )

  ok(service.properties.price, 'Service should have a valid properties (price)')
  
  ok(
    typeof service.properties.price.value === 'number',
    'Invalid price value'
  )
  
  ok(
    service.properties.price.currency,
    'Invalid price currency'
  )

    debug('insert new service in storage')
 
  return await putSalonService(client, service);
}
