import User from '../models/user'

export default function (user) {
  if (user && user.user) {
    return getUserName(user.user as User)
  }

  return getUserName(user as User)  
}

function getUserName(user: User): string {
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
