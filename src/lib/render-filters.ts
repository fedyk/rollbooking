import { getUserRole } from '../utils/get-user-role'
import {
  getServiceName,
  getServiceDescription,
  getServicePrice,
  getServiceDuration
} from '../utils/service'
import dateToLocalTime from '../utils/date-to-local-time'
import getDateDay from '../utils/get-date-day'
import getDateMonth from '../utils/get-date-month'
import getErrorMessage from '../utils/get-error-message'
import { toDate, toTime } from '../utils/date'

export const renderFilters = [
  ['getUserRole', getUserRole],
  
  ['getServiceName', getServiceName],
  ['getServiceDescription', getServiceDescription],
  ['getServicePrice', getServicePrice],
  ['getServiceDuration', getServiceDuration],

  ['dateToLocalTime', dateToLocalTime],
  ['getDateDay', getDateDay],
  ['getDateMonth', getDateMonth],
  ['getErrorMessage', getErrorMessage],
  ['toDate', toDate],
  ['toTime', toTime],
]
