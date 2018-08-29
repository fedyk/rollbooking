import debugFactory from "debug"
import { DateRange } from '../lib/date-range'
import { getSalonById } from '../queries/salons'
import { getSalonUsers } from './get-salon-users'
import { getSalonServices } from './get-salon-services'
import { getSalonFreebusy } from './get-salon-freebusy'
import { getUserCalendarId } from '../utils/get-user-calendar-id'
import { addMonth, addDay } from '../utils/date'

const debug = debugFactory('sagas:get-reservation-widget-data')

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
    salonFreeDates,
    salonServicesSlots
  }
}

function getSalonFreeDates(timeMin, timeMax, freebusy) {
  const dates = []
  // const calendars = freebusy.calendars || {};
  let curr = new Date(timeMin.getTime());

  while(curr < timeMax) {
    dates.push(curr)

    curr = addDay(curr);
  }

  return dates;
  
}

function getServicesSlots(salonServices, salonSchedule, salonFreebusy) {
  /**
   * @type {Object.<number,Date[]>}
   */
  const slots = {};

  debug('create object with available ranges')

  const freeRanges = Object.keys(salonFreebusy.calendars).reduce((p, c) => {
    return p[c] = [], p
  }, {})

  debug('calculate available ranges')

  for (let key in freeRanges) {
    freeRanges[key] = freeRanges[key].concat(salonSchedule.exclude(
      salonFreebusy.calendars[key].busy.map(v => DateRange(v))
    ))
  }

  debug('combine ranges to one collection')

  const allDateRanges = Object.keys(freeRanges).reduce((p, key) => {
    return p.concat(freeRanges[key])
  }, [])

  debug('merge overlaping ranges')

  const dateRanges = DateRange.merge(allDateRanges);

  debug('for each service split ranges by time')

  for (let i = 0; i < salonServices.length; i++) {
    const service = salonServices[i];
    const serviceDuration = service.data.duration;
    const serviceDates = [];
    
    for (let j = 0; j < dateRanges.length; j++) {
      const dateRange = dateRanges[j];
      const dates = dateRange.split(serviceDuration * 60 * 1000, {
        round: true
      });

      dates.pop();

      if (dates.length > 0) {
        serviceDates.push.apply(serviceDates, dates)
      }
    }

    slots[service.id] = serviceDates
  }

  debug('returns result')

  return slots;
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
