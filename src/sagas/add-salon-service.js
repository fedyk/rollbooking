const assert = require('assert')
const debug = require('debug')('saga:add-salon-service')
const { addServiceToSalon } = require('../queries/salons')

/**
 * @param {PoolClient} client
 * @param {number} salonId
 * @param {Object} service
 * @return {Object<{id: number, data: object}>}
 */
module.exports = async function(client, salonId, service) {

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
