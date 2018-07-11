const DateRange = require('../lib/date-range')
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

  const selectedTime = new Date()
  const timeMin = new Date()
  const timeMax = addMonth(new Date(), 1)
  const calendarIds = salonUsers.map(user => getUserCalendarId(user))
  const salonFreebusy = await getSalonFreebusy(googleAuth, timeMin, timeMax, salon.timezone || 'UTC', calendarIds)

  debug('calculate available dates')

  const salonFreeDates = getSalonFreeDates(timeMin, timeMax, salonFreebusy)

  debug('calculate available hours for services')

  const salonSchedule = getSalonSchedule(selectedTime)

  const salonServicesSlots = getServicesSlots(salonServices, salonSchedule, salonFreebusy)

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

function getSalonSchedule(date) {
  const start = new Date(date.getTime())
  const end = new Date(date.getTime())

  start.setHours(10)
  start.setMinutes(0)
  start.setSeconds(0)
  start.setMilliseconds(0)

  end.setHours(18)
  end.setMinutes(0)
  end.setSeconds(0)
  end.setMilliseconds(0)

  return new DateRange(start, end)
}