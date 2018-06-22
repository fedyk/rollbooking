const assert = require('assert')
const debug = require('debug')('saga:add-salon-service')
const { removeServiceFromSalon } = require('../queries/salons')

/**
 * @param {PoolClient} client
 * @param {number} salonId
 * @param {number} salonId
 * @return {Object<{id: number, data: object}>}
 */
module.exports = async function(client, salonId, serviceId) {

  debug('validate input data')

  assert.ok(client, 'PoolClient is not provided')
  assert.ok(salonId, 'salonId is required')
  assert.ok(typeof salonId === 'number', 'salonId is invalid')
  assert.ok(serviceId, 'serviceId is required')
  assert.ok(typeof serviceId === 'number', 'serviceId is invalid')

  debug('delete service from storage')
 
  return await removeServiceFromSalon(client, salonId, serviceId);
}
