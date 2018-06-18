const getUserName = require('../utils/get-user-name');
const getUserRole = require('../utils/get-user-role');

/**
 * @type {Array<[filterName: string, filter: Function]>}
 */
module.exports = [
  ['getUserName', getUserName],
  ['getUserRole', getUserRole],
];
