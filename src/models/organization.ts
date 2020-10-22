import { Db } from "mongodb";
import { TimePeriod } from "../types/time-period";
import { SpecialHourPeriod } from "../types/special-hour-period";

export interface Organization {
  id: string
  name: string
  alias: string
  avatarUrl: string
  description: string
  timezone: string
  ownerId: string
  employees: Employee[]
  services: Service[]
  servicesCount: number
  regularHours: TimePeriod[]
  specialHours: SpecialHourPeriod[]
  createdAt: Date
  updatedAt: Date
}

export interface Employee {
  id: string
  name: string
  email: string
  avatarUrl: string
  role: "owner" | "admin" | "normal"
  position?: string
}

export interface Service {
  id: number
  name: string
  description: string
  /** service duration in minutes */
  duration: number
  /** ISO 4217 */
  currencyCode: string
  price: number
}

function getCollection(db: Db) {
  return db.collection<Organization>("organizations")
}

export function getById(db: Db, id: string) {
  return getCollection(db).findOne({ id })
}

export function getRecent(db: Db) {
  return getCollection(db).find().limit(20).toArray()
}

export function create(db: Db, organization: Organization) {
  return getCollection(db).insertOne(organization).then(r => r.insertedId)
}

export function update(db: Db, organizationId: string, organization: Partial<Omit<Organization, "id">>) {
  return getCollection(db).updateOne({
    id: organizationId
  }, {
    $set: organization
  })
}

export function pushEmployee(db: Db, organizationId: string, employee: Employee) {
  return getCollection(db).updateOne({
    id: organizationId
  }, {
    $push: {
      employees: employee
    }
  })
}
export function pushService(db: Db, organizationId: string, service: Service) {
  return getCollection(db).updateOne(
    {
      id: organizationId
    },
    {
      $inc: {
        servicesCount: 1
      },
      $push: {
        services: service
      }
    }
  )
}

export function setService(db: Db, organizationId: string, serviceId: number, service: Service) {
  return getCollection(db).updateOne(
    {
      id: organizationId,
      "services.id": serviceId,
    },
    {
      $set: {
        "services.$": service
      }
    }
  )
}

export function setUser(db: Db, organizationId: string, userId: string, user: Employee) {
  const key: keyof Organization = "employees";
  const id: keyof Employee = "id"

  return getCollection(db).updateOne(
    {
      id: organizationId,
      [`${key}.${id}`]: userId
    },
    {
      $set: {
        [`${key}.$`]: user
      }
    }
  )
}
