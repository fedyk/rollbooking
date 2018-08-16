const assert = require('assert')
const debug = require('debug')('saga:get-salon-service')
const { getSalonService } = require('../queries/salons')

/**
 * @param {PoolClient} client
 * @param {number} salonId
 * @param {number} serviceId
 * @return {Array<{id: number, salon_id: number, data: object}>}
 */
module.exports = async function(client, salonId, serviceId) {

  assert.ok(client, 'PoolCliect is not provided')
  assert.ok(salonId, 'Salon id is required')
  assert.ok(serviceId, 'Service id is required')
 
  debug('fetch service associated with salon')

  const service = await getSalonService(client, salonId, serviceId)

  debug('return fetched service')

  return service;
}
