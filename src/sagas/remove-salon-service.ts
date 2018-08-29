import * as assert from "assert";
import debugFactory from "debug"
import { removeServiceFromSalon } from '../queries/salons'

const debug = debugFactory('sagas:add-salon-service')

export async function removeSalonService(client, salonId, serviceId) {

  debug('validate input data')

  assert.ok(client, 'PoolClient is not provided')
  assert.ok(salonId, 'salonId is required')
  assert.ok(typeof salonId === 'number', 'salonId is invalid')
  assert.ok(serviceId, 'serviceId is required')
  assert.ok(typeof serviceId === 'number', 'serviceId is invalid')

  debug('delete service from storage')
 
  return await removeServiceFromSalon(client, salonId, serviceId);
}
