import { User } from './user'

export interface SalonUserProperties {
  general: {
    role: string;
  }
  google: {
    calendar_id: string
  }
}

export interface SalonUser {
  user: User
  salon_id: number
  user_id: number;
  properties: SalonUserProperties
  created: Date
  updated: Date
}

export default SalonUser
