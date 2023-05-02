import { Collection, Db, Filter, ObjectId, WithId } from "mongodb";
import { DateTime } from "../types";
import { Organization, Service } from "./organizations";
import { User } from "./users";

export interface Reservation {
  start: DateTime
  end: DateTime
  status: "pending" | "confirmed" | "rejected" | "deleted"
  organization: OrganizationSummary
  /** this is user who requested reservation */
  requester: UserSummary
  customer: UserSummary
  assignee: UserSummary
  service: ServiceSummary
  createdAt: Date
  updatedAt: Date
}

type OrganizationSummary = Pick<Organization, "name" | "avatarUrl"> & { id: ObjectId }
type ServiceSummary = Pick<Service, "id" | "name" | "price" | "currencyCode">
type UserSummary = Pick<User, "name"> & { id: ObjectId }

export class Reservations {
  collection: Collection<Reservation>

  constructor(db: Db) {
    this.collection = db.collection("reservations")
  }

  create(event: Reservation) {
    return this.collection.insertOne(event)
  }

  /** @deprecated */
  findOne(query: Filter<WithId<Reservation>>) {
    return this.collection.findOne<WithId<Reservation>>(query)
  }

  /** @deprecated */
  find(query: Filter<Reservation>) {
    return this.collection.find<WithId<Reservation>>(query)
  }

  findByCustomerId(customerId: ObjectId) {
    return this.collection.find<WithId<Reservation>>({
      "customer.id": customerId
    }).toArray()
  }

  findByDateRange(organizationId: ObjectId, startTime: DateTime, endTime: DateTime) {
    return this.collection.find({
      "organization.id": organizationId,
      $and: [{
        "start.year": { $lte: endTime.year },
        "start.month": { $lte: endTime.month },
        "start.day": { $lte: endTime.day },
      },
      {
        "end.year": { $gte: startTime.year },
        "end.month": { $gte: startTime.month },
        "end.day": { $gte: startTime.day },
      }]
    }).toArray()
  }

  findCustomerUpcoming(organizationId: ObjectId, customerId: ObjectId, startTime: DateTime) {
    return this.collection.find<WithId<Reservation>>({
      "organization.id": organizationId,
      customerId,
      $and: [{
        "start.year": { $gte: startTime.year },
        "start.month": { $gte: startTime.month },
        "start.day": { $gte: startTime.day },
      }]
    }).toArray()
  }
}
