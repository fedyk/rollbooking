/**
 * 
 * @param {Date} date
 */
module.exports = function(date) {
  const start = new Date(date.getTime());
  const end = new Date(date.getTime());
  const methods = ['setHours', 'setMinutes', 'setSeconds', ]
  start.setHours(0, 0, 0, 0)
  end.setHours(24, 59, 59, 999)

  return {
    start, end
  }
}