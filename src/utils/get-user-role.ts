import { User } from '../models/user'
import { getProperty } from './get-property';
import { SalonUserRole } from '../models/salon-user';

export function getUserRole(user: User): string {
  // return user.properties.general.role
  const role = getProperty(user.properties, 'general', 'role') as SalonUserRole;
  
  return role ? SalonUserRole[role] : '';
}
