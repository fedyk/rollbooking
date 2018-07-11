/**
 * Add month to date
 * @param {Date} date
 * @param {number} days
 */
module.exports.addDay = (date, days = 1) => {
  const clone = new Date(date.getTime());

  return clone.setDate(clone.getDate() + days), clone;
}

/**
 * Add month to date
 * @param {Date} date
 * @param {number} months
 */
module.exports.addMonth = (date, months) => {
  const clone = new Date(date.getTime());

  return clone.setMonth(clone.getMonth() + months), clone;
}
