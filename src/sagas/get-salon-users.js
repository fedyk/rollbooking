const debug = require('debug')('saga:get-salon-users')
const { getUsersByIds } = require('../queries/users')
const { getSalonUsers: getSalonUsersQuery } = require('../queries/salons')

/**
 * @param {PoolClient} client
 * @param {number} salonId
 * @return {Array<{user: object, user_id: string, salon_id: string, data: object}>}
 */
module.exports = async function(client, salonId) {
 
  if (!salonId || isNaN(salonId)) {
    throw new RangeError('Invalid salon id');
  }

  debug('get list of salon\'s user ids')

  /**
   * @type {Array<{salon_id: string, user_id: string, data: object}}
   */
  const salonUsers = await getSalonUsersQuery(client, salonId)

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
