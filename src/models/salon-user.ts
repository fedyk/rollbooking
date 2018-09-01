import { User } from './user'

export enum SalonUserRole {
  Owner = 1,
  Admin = 2,
  Member = 5,
}

export interface SalonUserProperties {
  general: {
    role: SalonUserRole;
    timezone: string;
  },
  google: {
    calendar_id: string;
    calendar_etag: string;
    calendar_kind: string;
  }
}

export interface SalonUser {
  user?: User // todo: remove this prop from here
  salon_id: number
  user_id: number;
  properties: SalonUserProperties
  created: Date
  updated: Date
}

export default SalonUser
