import { ok } from "assert";
import debugFactory from 'debug'
import { google } from 'googleapis'
import { isEmail } from '../utils/is-email';
import { authorize } from '../lib/googleapis'
import { addSalonUser, getSalonUser } from '../queries/salons'
import { getUserByEmail, createUser } from '../queries/users'
import { PoolClient } from 'pg';
import { User } from '../models/user';
import { SalonUser, SalonUserRole } from '../models/salon-user';
import { getProperty } from '../utils/get-property';

const debug = debugFactory('sagas:invite-user-to-salon')

/**
 * @param {PoolClient} client
 * @param {number} salonId
 * @param {Object} userData
 * @param {number} currentUserId
 * @param {string} role
 */
export async function inviteUserToSalon(
  client: PoolClient,
  salonId: number,
  user: User,
  currentUserId: number,
  role: SalonUserRole
): Promise<SalonUser> { 

  ok(typeof user !== 'object', 'Invalid data')
  ok(!user.email || !user.email.trim(), 'Email is required')
  ok(!isEmail(user.email), 'Invalid email')
  ok(!getProperty(user.properties, 'general', 'timezone'), 'Invalid timezone')

  debug('find user with requested email')

  let userModel = await getUserByEmail(client, user.email)

  if (!userModel) {
    debug('create a new user')

    const userData = Object.assign({}, user);

    userData.properties.invitation = Object.assign(userData.properties.invitation, {
      from_user_id: currentUserId,
      to_salon_id: salonId
    })

    userModel = await createUser(client, userData)
  }
  else {
    debug('check if user has no relation with salon')

    const userToSalon = await getSalonUser(client, salonId, userModel.id)

    ok(!userToSalon, 'User already added')
  }

  debug('authorize in google')

  const auth = await authorize()

  const calendar = google.calendar({
    version: 'v3',
    auth
  });

  debug('create new calendar for user')

  const calendarResource = {
    summary: `Calendar ${salonId}:${userModel.id}`,
    timeZone: getProperty(userModel.properties, 'general', 'timezone'),
  }

  const { data: createdCalendar } = await calendar.calendars.insert({
    requestBody: calendarResource,
    auth
  })

  debug('create new relation between user & salon')

  const salonUser: SalonUser = {
    user_id: userModel.id,
    salon_id: salonId,
    properties: {
      general: {
        role: role,
        timezone: getProperty(userModel, 'general', 'timezone'),
      },
      google: {
        calendar_id: createdCalendar.id,
        calendar_etag: createdCalendar.etag,
        calendar_kind: createdCalendar.kind,
      }
    },
    created: new Date(),
    updated: new Date(),
  }

  return await addSalonUser(client, salonUser)
}

