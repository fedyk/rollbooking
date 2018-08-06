/**
 * @param {Date} date 
 * @returns {string}
 */
module.exports = function getDateDay(date) {
  if (date instanceof Date) {
    return date.getDate();
  }

  return null
}
