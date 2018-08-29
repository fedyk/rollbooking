import * as assert from 'assert'
import debugFactory from 'debug';
import { getSalonService as fetchSalonService } from '../queries/salons'
import { PoolClient } from 'pg';
import { SalonService } from '../models/salon-service';

const debug = debugFactory('sagas:get-salon-service');

export async function getSalonService(client: PoolClient, salonId: number, serviceId: number): Promise<SalonService> {

  assert.ok(client, 'PoolCliect is not provided')
  assert.ok(salonId, 'Salon id is required')
  assert.ok(serviceId, 'Service id is required')
 
  debug('fetch service associated with salon')

  const service = await fetchSalonService(client, salonId, serviceId)

  debug('return fetched service')

  return service;
}
