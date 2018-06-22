const getUserName = require('../utils/get-user-name');
const getUserRole = require('../utils/get-user-role');
const { getServiceName, getServicePrice, getServiceDuration } = require('../utils/service');

/**
 * @type {Array<[filterName: string, filter: Function]>}
 */
module.exports = [
  ['getUserName', getUserName],
  ['getUserRole', getUserRole],
  ['getServiceName', getServiceName],
  ['getServicePrice', getServicePrice],
  ['getServiceDuration', getServiceDuration],
];
