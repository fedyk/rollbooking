import User from '../models/user'

export default function(user: User): string {
  if (user.meta && user.meta.role) {
    return capitalizeFirstLetter(user.meta.role)
  }

  return ``;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
