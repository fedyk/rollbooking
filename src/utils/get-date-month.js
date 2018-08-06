/**
 * @param {Date} date 
 * @returns {string}
 */
var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');

module.exports = function getDateMonth(date, localeMonths = defaultLocaleMonths) {
  if (date instanceof Date) {
    return localeMonths[date.getMonth()]
  }

  return null
}
