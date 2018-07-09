const { getSalonById } = require('../queries/salons')
const getSalonUsers = require('./get-salon-users')
const getSalonServices = require('./get-salon-services')
const getSalonFreebusy = require('./get-salon-freebusy')
const getUserCalendarId = require('../utils/get-user-calendar-id')
const { addMonth, addDay } = require('../utils/date')
const debug = require('debug')('saga:get-reservation-widget-data')

/**
 * @typedef {object} ReservationWidgetData
 * @property {object} salon
 * @property {object} salonUsers
 * @property {object} salonServices
 */

/**
 * @param {PoolClient} client
 * @param {object} googleAuth
 * @param {Number} salonId
 * @return {ReservationWidgetData}
 */
module.exports = async function getReservationWidgetData(client, googleAuth, salonId) {

  debug('fetch salon info')

  const salon = await getSalonById(client, salonId);
  
  if (!salon) {
    throw new Error('Salon does not exist')
  }

  debug('fetch salon users data')
  
  const salonUsers = await getSalonUsers(client, salonId)
  
  debug('fetch salon services')

  const salonServices = await getSalonServices(client, salonId)

  debug('fetch salon free dates and times')

  const timeMin = new Date()
  const timeMax = addMonth(new Date(), +1)
  const calendarIds = salonUsers.map(user => getUserCalendarId(user))
  const salonFreebusy = await getSalonFreebusy(googleAuth, timeMin, timeMax, salon.timezone || 'UTC', calendarIds)

  debug('calculate available dates')

  const salonFreeDates = getSalonFreeDates(timeMin, timeMax, salonFreebusy)

  debug('calculate available hours for services')

  const salonSchedule = []
  salonSchedule[0] = new Date(timeMin.getTime())
  salonSchedule[0].setHours(10)
  salonSchedule[0].setMinutes(0)
  salonSchedule[0].setSeconds(0)
  salonSchedule[0].setMilliseconds(0)
  salonSchedule[1] = new Date(timeMin.getTime())
  salonSchedule[1].setHours(18)
  salonSchedule[1].setMinutes(0)
  salonSchedule[1].setSeconds(0)
  salonSchedule[1].setMilliseconds(0)

  const salonServicesSlots = getServicesSlots(salonServices, timeMin, salonFreebusy)

  debug('return data')

  return {
    salon,
    salonUsers,
    salonServices,
    salonFreeDates
  }
}

function getSalonFreeDates(timeMin, timeMax, freebusy) {
  const dates = []
  const calendars = freebusy.calendars || {};
  let curr = new Date(timeMin.getTime());

  while(curr < timeMax) {
    dates.push(curr)

    curr = addDay(curr);
  }

  return dates;
  
}

function getServicesSlots(salonS) {
  
}