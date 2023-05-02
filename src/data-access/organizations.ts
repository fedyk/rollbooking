import { Collection, Db, Filter, ObjectId, WithId } from "mongodb";
import { TimePeriod } from "../types/time-period";
import { SpecialHourPeriod } from "../types/special-hour-period";
import { User } from "./users";

export interface Organization {
  name: string
  description: string
  avatarUrl: string
  timezone: string
  users: UserSummary[]
  services: Service[]
  regularHours: TimePeriod[]
  specialHours: SpecialHourPeriod[]
  creatorId: ObjectId
  createdAt: Date
  updatedAt: Date
}

export type UserRole = "owner" | "admin"| "normal"

export interface UserSummary extends Pick<User, "name" | "avatarUrl"> {
  id: ObjectId
  role: UserRole
  position?: string
}

export interface Service {
  id: ObjectId
  name: string
  description: string
  /** service duration in minutes */
  duration: number
  /** ISO 4217 */
  currencyCode: string
  price: number
}

export class Organizations {
  collection: Collection<Organization>

  constructor(db: Db) {
    this.collection = db.collection("organizations")
  }

  get(id: ObjectId) {
    return this.collection.findOne<WithId<Organization>>({ _id: id })
  }

  findOne(filters: Filter<WithId<Organization>>) {
    return this.collection.findOne<WithId<Organization>>(filters)
  }

  findManyByIds(ids: ObjectId[]) {
    return this.collection.find<WithId<Organization>>({
      _id: {
        $in: ids
      }
    }).toArray()
  }

  create(organization: Organization) {
    return this.collection.insertOne(organization)
  }

  update(id: ObjectId, org: Partial<Organization>) {
    return this.collection.updateOne({
      _id: id
    }, {
      $set: org
    })
  }

  addMember(id: ObjectId, member: UserSummary) {
    return this.collection.updateOne({
      _id: id
    }, {
      $push: {
        members: member
      }
    })
  }

  setMember(id: ObjectId, userId: ObjectId, member: Partial<UserSummary>) {
    return this.collection.updateOne({
      _id: id,
      "members.id": userId
    }, {
      $set: {
        "members.$": member
      }
    })
  }

  removeMember(id: ObjectId, memberId: ObjectId) {
    return this.collection.updateOne({
      _id: id
    }, {
      $pull: {
        members: {
          id: memberId
        }
      }
    })
  }

  addService(id: ObjectId, service: Service) {
    return this.collection.updateOne({
      _id: id
    }, {
      $push: {
        services: service
      }
    })
  }

  setService(id: ObjectId, serviceId: ObjectId, service: Partial<Service>) {
    return this.collection.updateOne({
      _id: id,
      "services.id": serviceId,
    }, {
      $set: {
        "services.$": service
      }
    })
  }

  removeService(id: ObjectId, serviceId: ObjectId) {
    return this.collection.updateOne({
      _id: id
    }, {
      $pull: {
        services: {
          id: serviceId
        }
      }
    })
  }
}
