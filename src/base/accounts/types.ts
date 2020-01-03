import { TimePeriod } from "../types/time-period"
import { SpecialHourPeriod } from "../types/special-hour-period";

export interface User {
  type: "user"
  id: string
  alias: string
  name: string
  email: string
  avatar: string
  timezone: string
  password?: string
  properties: UserProperties
  created?: Date
  updated?: Date
}

export interface UserProperties {  
  google?: {
    scope?: string[]
    accessToken?: string
    refreshToken?: string
  }
  business?: {
    default_business_id?: number
  }
}

export interface Business {
  type: "business"
  id: string
  alias: string
  name: string
  avatar: string
  desc: string
  timezone: string
  employees: BusinessEmployee[]
  services: BusinessService[]
  regularHours: TimePeriod[]
  specialHours: SpecialHourPeriod[]
  created?: Date
  updated?: Date
}

export interface BusinessEmployee {
  id: string
  name: string
  avatar: string
  position: string
}

export interface BusinessService {
  id: string
  name: string
  description: string
  duration: number // in minutes
  currencyCode: string // ISO 4217
  price: number
}
