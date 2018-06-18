module.exports = function(user) {
  if (user.first_name || user.last_name) {
    return `${user.first_name} ${user.last_name}`.trim()
  }

  if (user.meta && user.meta.name) {
    return user.meta.name
  }

  if (user.email) {
    return user.email
  }

  return `User`;
}
