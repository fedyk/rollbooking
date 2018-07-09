/**
 * 
 * @param {UserModel} user
 * @returns {String}
 */
module.exports = function(user) {
  return user.data && user.data.calendarId || ''
}
