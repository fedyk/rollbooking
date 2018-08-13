/** @param {Error} error */
module.exports = function getErrorMessage(error) {
  if (error && error.message) {
    return error.message;
  }

  if (error) {
    return error + '';
  }
  
  return '';
}
