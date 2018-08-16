/**
 * 
 * @param {UserModel} user
 * @returns {String}
 */
module.exports = getUsersCalendarId
module.exports.getUsersCalendarId = getUsersCalendarId // fix for ts

function getUsersCalendarId(user) {
  return user.data && user.data.calendarId || ''
}
