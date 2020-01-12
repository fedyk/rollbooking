import dateToLocalTime from '../utils/date-to-local-time'
import getDateDay from '../utils/get-date-day'
import getDateMonth from '../utils/get-date-month'
import getErrorMessage from '../utils/get-error-message'
import { toDate, toTime } from '../utils/date'

export const renderFilters_DEPRECATED = [
  ['dateToLocalTime', dateToLocalTime],
  ['getDateDay', getDateDay],
  ['getDateMonth', getDateMonth],
  ['getErrorMessage', getErrorMessage],
  ['toDate', toDate],
  ['toTime', toTime],
]
