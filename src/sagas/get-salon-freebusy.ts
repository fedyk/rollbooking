import { google, calendar_v3 } from 'googleapis';

/**
 * @param {object} googleAuth
 * @param {Date} timeMin
 * @param {Date} timeMax
 * @param {string} timeZone
 * @param {string[]} calendarIds
 */
export async function getSalonFreebusy(googleAuth, timeMin, timeMax, timeZone, calendarIds): Promise<calendar_v3.Schema$FreeBusyResponse> {
  const calendar = google.calendar({
    version: 'v3',
    auth: googleAuth
  });
  const items = calendarIds.map(id => ({ id }))
  const freebusy = await calendar.freebusy.query({
    auth: googleAuth,
    requestBody: {
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      timeZone: timeZone,
      items: items
    }
  })

  return freebusy.data
}
