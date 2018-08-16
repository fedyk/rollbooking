import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import { Client } from 'pg'
import debugFactory from 'debug'
import { getSalonById } from '../../queries/salons'
import { getSalonUsers } from '../../sagas/get-salon-users'
import { getSalonServices } from '../../sagas/get-salon-services'
import { getUsersCalendarId } from '../../utils/get-user-calendar-id'

const debug = debugFactory('saga:get-schedule-events')

// const { getUsersByIds } = require('../queries/users')
// const { getSalonUsers } = require('../queries/salons')

export interface GetScheduleData$Params {
  client: Client
  googleAuth: OAuth2Client
  salonId: number
}

export interface GetScheduleData$Result {
  salon: any
}

module.exports = async (params: GetScheduleData$Params): Promise<GetScheduleData$Result> => {
  const { client, salonId, googleAuth } = params; 

  debug('fetch salon information')

  const salon = getSalonById(client, salonId)

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
  
  const userCalendarIds = salonUsers.map(v => getUsersCalendarId(v));
  const salonUsersEvents = await getCalendarEvents(calendar, userCalendarIds)

  // const items = calendarIds.map(id => ({ id }))
  
  // const calendar = google.calendar({
  //   version: 'v3',
  //   auth: params.googleAuth
  // });

  // const eventsList = await calendar.events.list({
  //   requestBody: {
  //     timeMin: timeMin.toISOString(),
  //     timeMax: timeMax.toISOString(),
  //     timeZone: timeZone,
  //     calendarId: calendarId
  //   }
  // })

  return {
    salon: null
  }
 
  

  // debug('get list of salon\'s user ids')

  // /**
  //  * @type {Array<{salon_id: string, user_id: string, data: object}}
  //  */
  // const salonUsers = await getSalonUsers(client, salonId)

  // debug('map user ids')
  
  // /**
  //  * @type {Array<string>}
  //  */
  // const usersIds = salonUsers.map(v => v.user_id);

  // if (usersIds.length === 0) {
  //   return []
  // }

  // debug('fetch users from db')

  // /**
  //  * @type {Array<object>}
  //  */
  // const users = await getUsersByIds(client, usersIds)

  // debug('hash users by id')

  // /**
  //  * @type {Map<string, object>}
  //  */
  // const usersHashedById = users.reduce((hashMap, user) => hashMap.set(user.id, user), new Map())

  // debug('map user with meta')

  // return salonUsers.map(v => {
  //   return v.user = usersHashedById.get(v.user_id), v;
  // })
}
