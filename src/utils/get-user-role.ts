import { User } from '../models/user'
import { getProperty } from './get-property';

export default function(user: User): string {
  // return user.properties.general.role
  const role = getProperty(user.properties, 'general', 'role');
  
  return role ? capitalizeFirstLetter(role) : ''
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

