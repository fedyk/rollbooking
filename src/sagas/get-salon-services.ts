import * as assert from 'assert'
import debugFactory from 'debug'
import { getSalonServices as fetchSalonServices } from '../queries/salons'
import { PoolClient } from 'pg';

const debug = debugFactory('sagas:get-salon-services');

export async function getSalonServices(client: PoolClient, salonId: number) {

  assert.ok(client, 'PoolCliect is not provided')
  assert.ok(salonId, 'Salon id is required')
 
  debug('fetch services associated with salon')

  const services = await fetchSalonServices(client, salonId)

  debug('return fetched services')

  return services;
}
