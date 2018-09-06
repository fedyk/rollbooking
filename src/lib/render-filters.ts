import getUserName from '../utils/get-user-name'
import { getUserRole } from '../utils/get-user-role'
import { getServiceName, getServicePrice, getServiceDuration } from '../utils/service'
import dateToLocalTime from '../utils/date-to-local-time'
import { getServiceReservationUrl } from '../utils/get-service-reservation-url'
import getDateDay from '../utils/get-date-day'
import getDateMonth from '../utils/get-date-month'
import getErrorMessage from '../utils/get-error-message'
import { getSalonTimezone } from '../utils/get-salon-timezone'

export const renderFilters = [
  ['getUserName', getUserName],
  ['getUserRole', getUserRole],
  ['getServiceName', getServiceName],
  ['getServicePrice', getServicePrice],
  ['getServiceDuration', getServiceDuration],
  ['dateToLocalTime', dateToLocalTime],
  ['getServiceReservationUrl', getServiceReservationUrl],
  ['getDateDay', getDateDay],
  ['getDateMonth', getDateMonth],
  ['getErrorMessage', getErrorMessage],
  ['getSalonTimezone', getSalonTimezone],
]
