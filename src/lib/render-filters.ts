import getUserName from '../utils/get-user-name'
import { getUserRole } from '../utils/get-user-role'
import {
  getServiceName,
  getServiceDescription,
  getServicePrice,
  getServiceDuration
} from '../utils/service'
import dateToLocalTime from '../utils/date-to-local-time'
import { getServiceReservationUrl } from '../utils/get-service-reservation-url'
import getDateDay from '../utils/get-date-day'
import getDateMonth from '../utils/get-date-month'
import getErrorMessage from '../utils/get-error-message'
import { getSalonTimezone } from '../utils/get-salon-timezone'
import { toDate, toTime } from '../utils/date'
import { getSalonCurrencySymbol, getSalonCurrencyValue } from '../utils/salon';

export const renderFilters = [
  ['getUserName', getUserName],
  ['getUserRole', getUserRole],
  
  ['getSalonCurrencyValue', getSalonCurrencyValue],
  ['getSalonCurrencySymbol', getSalonCurrencySymbol],
  ['getSalonTimezone', getSalonTimezone],

  ['getServiceName', getServiceName],
  ['getServiceDescription', getServiceDescription],
  ['getServicePrice', getServicePrice],
  ['getServiceDuration', getServiceDuration],

  ['dateToLocalTime', dateToLocalTime],
  ['getServiceReservationUrl', getServiceReservationUrl],
  ['getDateDay', getDateDay],
  ['getDateMonth', getDateMonth],
  ['getErrorMessage', getErrorMessage],
  ['toDate', toDate],
  ['toTime', toTime],
]
