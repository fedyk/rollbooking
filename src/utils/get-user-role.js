/**
 * 
 * @param {UserModel} user
 * @returns {String}
 */
module.exports = function(user) {
  if (user.data && user.data.role) {
    return capitalizeFirstLetter(user.data.role)
  }

  return ``;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
