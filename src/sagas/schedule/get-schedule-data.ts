import { google } from 'googleapis'
import { calendar_v3 } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import { PoolClient } from 'pg'
import debugFactory from 'debug'
import { getSalonById } from '../../queries/salons'
import { getUsersCalendarId } from '../../utils/get-user-calendar-id'
import getCalendarEvents from '../../sagas/get-calendar-events'
import getDateStartEndDay from '../../utils/get-date-start-end'
import Salon from '../../models/salon';
import User from '../../models/user';

const getSalonServices = require('../../sagas/get-salon-services')
const getSalonUsers = require('../../sagas/get-salon-users')

const debug = debugFactory('saga:get-schedule-events')

export interface Params {
  client: PoolClient
  googleAuth: OAuth2Client
  salonId: number
  currentDate: Date
}

export interface Result {
  salon: Salon,
  salonUsers: any
  salonServices: any
  salonUsersEvents: {
    [userId: string]: calendar_v3.Schema$Events
  }
}

export const getScheduleData = async (params: Params): Promise<Result> => {
  const { client, salonId } = params; 

  debug('fetch salon information')

  const salon = await getSalonById(client, salonId) as Salon;

  debug('fetch salon users')

  const salonUsers = await getSalonUsers(client, salonId)

  debug('fetch salon services')

  const salonServices = await getSalonServices(client, salonId)

  debug('factory calendar sdk')

  const calendar = google.calendar({
    version: 'v3',
    auth: params.googleAuth
  });

  debug('fetch users events')
  
  const salonUsersEvents: { [userId: string]: calendar_v3.Schema$Events } = {};
  const { start, end } = getDateStartEndDay(params.currentDate)

  await Promise.all(
    salonUsers.map(salonUser => {
      const calendarId = getUsersCalendarId(salonUser);
      const user = salonUser.user as User;

      return getCalendarEvents(calendar, {
        calendarId: calendarId,
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        timeZone: salon.timezone
      }).then(events => salonUsersEvents[user.id] = events.data);
    })
  );

  return {
    salon,
    salonUsers,
    salonServices,
    salonUsersEvents
  }
}
