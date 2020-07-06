import { Db } from "mongodb";
import { TimePeriod } from "./types/time-period";
import { SpecialHourPeriod } from "./types/special-hour-period";


export interface Account {
  id: string
  name: string
  alias: string
  avatar: string
  desc: string
  timezone: string
  ownerId: string
  employees: Employee[]
  services: Service[]
  regularHours: TimePeriod[]
  specialHours: SpecialHourPeriod[]
  createdAt: Date
  updatedAt: Date
}

export interface Employee {
  id: string
  name: string
  avatar: string
  role: EmployeeRole
  position?: string
}

export interface Service {
  id: string
  name: string
  description: string
  /** service duration in minutes */
  duration: number
  /** ISO 4217 */
  currencyCode: string
  price: number
}

export enum EmployeeRole {
  Owner = 1,
  Admin = 2,
  Normal = 3,
}

export function getCollection(db: Db) {
  return db.collection<Account>("accounts")
}

export function getBusinessById(db: Db, id: string) {
  return getCollection(db).findOne({ id })
}

export function getRecentBusinesses(db: Db) {
  return getCollection(db).find().limit(20).toArray()
}

export function createAccount(db: Db, business: Account) {
  return getCollection(db).insertOne(business).then(r => r.insertedId)
}
