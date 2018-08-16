const { getSalonById } = require('../../../queries/salons')
const getSalonUsers = require('../../get-salon-users')
const getSalonService = require('../../get-salon-service')
const getSalonServices = require('../../get-salon-services')
const getDateStartEnd = require('../../../utils/get-date-start-end')
const getUserCalendarId = require('../../../utils/get-user-calendar-id')
const debug = require('debug')('saga:widgets')

/**
 * @param {PoolClient} client
 * @param {number} salonId
 * @param {Object} service
 * @return {Object<{id: number, data: object}>}
 */
module.exports = async function getServices(client, googleAuth, salonId, date, serviceId, masterId) {
  const salonMasters = [];
  const salonServices = [];
  const salonServicesSlots = [];

  debug('fetch salon info')

  const salon = await getSalonById(client, salonId);

  debug('fetch info about masters')

  const salonUsers = await getSalonUsers(client, salonId);

  if (masterId) {
    salonMasters.push(salonUsers.find(v => v.id == masterId));
  }
  else {
    salonMasters.push(...salonUsers);
  }

  debug('fetch salon services')

  if (serviceId) {
    salonServices.push(await getSalonService(client, salonId, serviceId));
  }
  else {
    salonServices.push(...await getSalonServices(client, salonId));
  }

  debug('define ids of calendars for freebusy')

  const calendarIds = salonMasters.map(v => getUserCalendarId(v))

  debug('fetch freebusy for masters')

  const { start, end } = getDateStartEnd(date);
  const salonFreebusy = await getSalonFreebusy(googleAuth, start, end, salon.timezone || 'UTC', calendarIds);
  
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