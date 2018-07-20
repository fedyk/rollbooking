/**
 * 
 * @param {Date} date 
 * @returns {string}
 */
module.exports = function dateToLocalTime(date) {
  return `${date.getHours()}:${date.getMinutes() > 9 ? '' : '0'}${date.getMinutes()}`;
}
