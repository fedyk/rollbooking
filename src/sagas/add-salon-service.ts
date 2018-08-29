import * as assert from "assert";
import debugFactory from "debug";
import { addServiceToSalon } from '../queries/salons'
import { PoolClient } from "pg";
import { SalonService } from "../models/salon-service";

const debug = debugFactory('sagas:add-salon-service');

export async function addSalonService(client: PoolClient, salonId: Number, service: SalonService): Promise<SalonService> {

  debug('validate input data')
  assert.ok(client, 'PoolClient is not provided')
  assert.ok(salonId, 'Salon id is required')
  assert.ok(service, 'Salon id is required')
  assert.ok(service.name, 'Name is required')
  assert.ok(service.name.trim().length >= 1, 'Name is to short')
  assert.ok(service.name.trim().length <= 64, 'Name is too long')
  assert.ok(service.duration, 'Duration is required')
  assert.ok(typeof service.duration === 'number', 'Duration should be a number')
  assert.ok(service.duration > 0 && service.duration < 60 * 24, 'Duration should longer than minute and shorter than one day')
  assert.ok(typeof service.price === 'number', 'Price should be a number')
  assert.ok(service.duration > 0 && service.duration < 60 * 24, 'Duration should longer than minute and shorter than one day')
  assert.ok(typeof service.description === 'string', 'Description should be a string')
  assert.ok(service.description.length < 1024, 'Description is too long')

  debug('insert new service in storage')
 
  return await addServiceToSalon(client, {
    salon_id: salonId,
    data: service,
    created: new Date(),
    updated: new Date()
  })
}
