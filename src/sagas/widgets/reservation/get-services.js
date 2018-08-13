const getSalonServices = require('../../get-salon-services')
const getSalonUsers = require('../../get-salon-users')
const debug = require('debug')('saga:widgets')

/**
 * @param {PoolClient} client
 * @param {number} salonId
 * @param {Object} service
 * @return {Object<{id: number, data: object}>}
 */
module.exports = async function getServices(client, googleAuth, salonId, date, serviceId, masterId) {

  debug('fetch salon services')

  let salonServices = await getSalonServices(client, salonId);
  
  debug('filter needed services')

  if (serviceId) {
    salonServices = salonServices.filter(v => v.id == serviceId);
  }
  
  // debug('fetch salon users')
  
  // const salonUsers = await getSalonUsers(client, salonId)
  
  // debug('find needed user')
  
  // const master = findNeededUser(salonUsers, masterId);
  
  return {
    salonServices
    // master
  }
}

// function findNeededUser(salonUsers, masterId) {
//   if (typeof masterId == 'number') {
//     return salonUsers.find(v => v.user_id === masterId);
//   }
//   else if (salonUsers.length > 0) {
//     return salonUsers[0];
//   }
//   return null
// }