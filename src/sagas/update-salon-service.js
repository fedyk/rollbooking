const assert = require('assert')
const debug = require('debug')('saga:add-salon-service')
const { updateServiceToSalon } = require('../queries/salons')

/**
 * @param {PoolClient} client
 * @param {number} salonId
 * @param {number} service
 * @param {Object} service
 * @return {Object<{id: number, data: object}>}
 */
module.exports = async function(client, salonId, serviceId, service) {

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

  debug('update service values in storage')
 
  return await updateServiceToSalon(client, salonId, serviceId, {
    data: service,
    updated: new Date(),
  })
}
