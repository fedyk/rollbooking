const assert = require('assert')
const debug = require('debug')('saga:remove-salon-user')
const { removeUserFromSalon } = require('../queries/salons')

/**
 * @param {PoolClient} client
 * @param {number} salonId
 * @param {number} userId
 * @return {void}
 */
module.exports = async function(client, salonId, userId) {
 
  assert.ok(salonId, 'Invalid salonId')
  assert.ok(userId, 'Invalid userId')

  debug('remove user relations with salon')

  await removeUserFromSalon(client, userId, salonId)

  // TODO: handle Google Calendar
}
