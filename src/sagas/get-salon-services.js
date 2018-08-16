const assert = require('assert')
const debug = require('debug')('saga:get-salon-services')
const { getSalonServices } = require('../queries/salons')

module.exports = getSalonServices
module.exports.getSalonServices = getSalonServices

/**
 * @param {PoolClient} client
 * @param {number} salonId
 * @return {Array<{id: number, salon_id: number, data: object}>}
 */
async function getSalonServices(client, salonId) {

  assert.ok(client, 'PoolCliect is not provided')
  assert.ok(salonId, 'Salon id is required')
 
  debug('fetch services associated with salon')

  const services = await getSalonServices(client, salonId)

  debug('return fetched services')

  return services;
}
