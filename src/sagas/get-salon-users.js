const debug = require('debug')('saga:get-salon-users')
const { getUsersByIds } = require('../queries/users')
const { getSalonUsers } = require('../queries/salons')

module.exports = getSalonUsers;
module.exports.getSalonUsers = getSalonUsers;

/**
 * @param {PoolClient} client
 * @param {number} salonId
 * @return {Array<{user: object, user_id: string, salon_id: string, data: object}>}
 */
async function getSalonUsers(client, salonId, usersIds = null) {
 
  if (!salonId || isNaN(salonId)) {
    throw new RangeError('Invalid salon id');
  }

  debug('get list of salon\'s user ids')

  /**
   * @type {Array<{salon_id: string, user_id: string, data: object}}
   */
  const salonUsers = await getSalonUsers(client, salonId)

  debug('map user ids')
  
  /**
   * @type {Array<string>}
   */
  const usersIds = salonUsers.map(v => v.user_id);

  if (usersIds.length === 0) {
    return []
  }

  debug('fetch users from db')

  /**
   * @type {Array<object>}
   */
  const users = await getUsersByIds(client, usersIds)

  debug('hash users by id')

  /**
   * @type {Map<string, object>}
   */
  const usersHashedById = users.reduce((hashMap, user) => hashMap.set(user.id, user), new Map())

  debug('map user with meta')

  return salonUsers.map(v => {
    return v.user = usersHashedById.get(v.user_id), v;
  })
}
