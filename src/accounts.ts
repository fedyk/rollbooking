import { Db } from "mongodb";
import { TimePeriod } from "./types/time-period"
import { SpecialHourPeriod } from "./types/special-hour-period";

export interface User {
  id: string
  type: "user"
  name: string
  alias: string
  email: string
  avatar: string
  timezone: string
  password?: string
  google?: {
    scope?: string[]
    accessToken?: string
    refreshToken?: string
  }
  business?: {
    owned_business_ids: string[]
    default_business_id: string
  }
  created?: Date
  updated?: Date
}

export interface Business {
  id: string
  type: "business"
  name: string
  alias: string
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

export enum EmployeeRole {
  Owner = 1,
  Admin = 2,
  Normal = 3,
}

export interface BusinessEmployee {
  id: string
  role: EmployeeRole
  position?: string
}

export interface BusinessService {
  id: string
  name: string
  description: string
  duration: number // in minutes
  currencyCode: string // ISO 4217
  price: number
}

export function getCollection(db: Db) {
  return db.collection<User | Business>("accounts")
}

export function createUser(db: Db, user: User) {
  return getCollection(db).insertOne(user).then(r => r.insertedId);
}

export function createBusiness(db: Db, business: Business) {
  return getCollection(db).insertOne(business).then(r => r.insertedId)
}
