const { google } = require('googleapis');
const { authorize } = require('../lib/googleapis')
const debug = require('debug')('saga:create-salon-saga')
const { updateUser } = require('../queries/users')
const { createSalon, createSalonWorker } = require('../queries/salons')

async function createSalonSaga(data, user, client) {

  if (!isValid(data)) {
    throw new RangeError('Invalid data provided');
  }

  debug('create salon %s', data.name)

  const newSalon = {
    name: data.name,
    timezone: data.timezone,
    created: new Date(),
    updated: new Date(),
  }

  const salon = await createSalon(client, newSalon);
  const auth = await authorize()
  const calendar = google.calendar({
    version: 'v3',
    auth
  });

  debug('create calendar for salon worker')

  const newWorkerCalendar = {
    summary: `Calendar ${salon.name}/${user.first_name} ${user.last_name}`,
    timeZone: 'Europe/Warsaw', // TODO: replace this to user timezone
  }

  const { data: workerCalendar } = await calendar.calendars.insert({
    resource: newWorkerCalendar,
    auth
  })

  debug('create salon worker')

  const salonWorker = {
    user_id: user.id,
    salon_id: salon.id,
    role: 'admin',
    calendar_id: workerCalendar.id,
    created: new Date(),
    updated: new Date(),
  }

  const newSalonWorker = await createSalonWorker(client, salonWorker)

  debug('update user timezone if it is empty')

  if (!user.timezone && data.timezone) {
    debugger

    const userChanges = {
      timezone: data.timezone
    }

    await updateUser(client, userChanges, user.id)
  }

  return salon;
}

// Private

function isValid(data) {
  if (typeof data !== 'object') {
    return false;
  }

  if (!data.name || !data.name.trim()) {
    return false
  }

  return true;
}

module.exports = createSalonSaga;
