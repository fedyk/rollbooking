import { User } from '../models/user'
import { getProperty } from './get-property';

export default function (user) {
  if (user && user.user) {
    return getUserName(user.user as User)
  }

  return getUserName(user as User)  
}

export function getUserName(user: User): string {
  const name = getProperty(user.properties, 'general', 'name')

  if (name) {
    return name;
  }

  return user.email;
}
