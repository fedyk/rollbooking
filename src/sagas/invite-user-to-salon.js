const { google } = require('googleapis')
const isEmail = require('../utils/is-email')
const { authorize } = require('../lib/googleapis')
const debug = require('debug')('saga:invite-user-to-salon')
const { createSalon, addUserToSalon } = require('../queries/salons')
const { getUserByEmail, createUser, getUserSalon } = require('../queries/users')

module.exports = inviteUserToSalon;

/**
 * @param {PoolClient} client
 * @param {number} salonId
 * @param {Object} userData
 * @param {number} currentUserId
 * @param {string} role
 */
async function inviteUserToSalon(client, salonId, userData, currentUserId, role = 'member') {

  debug('user data validation')

  /**
   * @type {string|null}
   */
  const error = validate(userData);

  if (error !== null) {
    throw new Error(error);
  }

  debug('find user with requested email')

  let userModel = await getUserByEmail(client, userData.email)

  if (!userModel) {
    debug('create a new user')

    userModel = await createUser(client, {
      email: userData.email,
      meta: {
        name: userData.name,
        invited: true,
        invitedByUserId: currentUserId,
        invitedToSalon: salonId,
        invitedWithRole: role
      },
      timezone: userData.timezone,
    })
  }
  else {
    debug('check if user has no relation with salon')

    const userToSalon = await getUserSalon(client, userModel.id, salonId)

    if (userToSalon) {
      throw new Error('User already added')
    }
  }

  debug('autorize in google')

  const auth = await authorize()
  const calendar = google.calendar({
    version: 'v3',
    auth
  });

  debug('create new calendar for user')

  const calendarResource = {
    summary: `Calendar ${salonId}:${userModel.id}`,
    timeZone: userData.timezone
  }

  const { data: createdCalendar } = await calendar.calendars.insert({
    resource: calendarResource,
    auth
  })

  debug('create new relation between user & salon')

  const salonToUser = {
    user_id: userModel.id,
    salon_id: salonId,
    data: {
      role,
      calendarId: createdCalendar.id,
      calendarEtag: calendarResource.etag,
      calendarKind: calendarResource.kind,
      timezone: userData.timezone,
    },
    created: new Date(),
    updated: new Date(),
  }

  await addUserToSalon(client, salonToUser)
}

// Private

function validate(userData) {

  if (typeof userData !== 'object') {
    return 'Invalid data'
  }

  if (!userData.email || !userData.email.trim()) {
    return 'Email is required'
  }

  if (!isEmail(userData.email)) {
    return 'Invalid email'
  }

  if (!userData.timezone) {
    return 'Invalid timezone'
  }

  return null;
}

