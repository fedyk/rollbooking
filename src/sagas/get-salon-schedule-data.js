const debug = require('debug')('saga:get-salon-schedule-data')
// const { authorize } = require('../lib/googleapis')
// const { google } = require('googleapis')
// const { updateUser } = require('../queries/users')
const { getUsersByIds } = require('../queries/users')
const { getSalonUsers } = require('../queries/salons')

/**
 * @param {number} salonId
 * @param {PoolClient} client
 */
async function getSalonScheduleData(salonId, client) {
 
  if (!salonId || isNaN(salonId)) {
    throw new RangeError('Invalid salon id');
  }

  debug('get salon from salon_users table')
  const salonUsers = await getSalonUsers(client, salonId) // Array<{ salon_id, user_id, data }> 

  debug('get users ids')
  const salonUsersIds = salonUsers.map(v => v.user_id)

  debug('fetch users from db')
  const users = await getUsersByIds(client, salonUsersIds)

  return {
    users
  }
}


module.exports = getSalonScheduleData;
