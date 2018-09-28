import { User } from '../models/user'
import { getProperty } from './get-property';

export function getUserTimezone(user: User): string {
  return getProperty(user.properties, 'general', 'timezone');
}
