const getUserName = require('../utils/get-user-name');
const getUserRole = require('../utils/get-user-role');
const { getServiceName, getServicePrice, getServiceDuration } = require('../utils/service');
const dateToLocalTime = require('../utils/date-to-local-time');
const getServiceReservationUrl = require('../utils/get-service-reservation-url');
const getDateDay = require('../utils/get-date-day');
const getDateMonth = require('../utils/get-date-month');
const getErrorMessage = require('../utils/get-error-message');

/**
 * @type {Array<[filterName: string, filter: Function]>}
 */
module.exports = [
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
];
