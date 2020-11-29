import { Collection, Db, FilterQuery, ObjectID, WithId } from "mongodb";
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
  creatorId: ObjectID
  createdAt: Date
  updatedAt: Date
}

export type UserRole = "owner" | "admin"| "normal"

export interface UserSummary extends Pick<User, "name" | "avatarUrl"> {
  id: ObjectID
  role: UserRole
  position?: string
}

export interface Service {
  id: ObjectID
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

  get(id: ObjectID) {
    return this.collection.findOne<WithId<Organization>>({ _id: id })
  }

  findOne(filters: FilterQuery<WithId<Organization>>) {
    return this.collection.findOne<WithId<Organization>>(filters)
  }

  findManyByIds(ids: ObjectID[]) {
    return this.collection.find<WithId<Organization>>({
      _id: {
        $in: ids
      }
    }).toArray()
  }

  create(organization: Organization) {
    return this.collection.insertOne(organization)
  }

  update(id: ObjectID, org: Partial<Organization>) {
    return this.collection.updateOne({
      _id: id
    }, {
      $set: org
    })
  }

  addMember(id: ObjectID, member: UserSummary) {
    return this.collection.updateOne({
      _id: id
    }, {
      $push: {
        members: member
      }
    })
  }

  setMember(id: ObjectID, userId: ObjectID, member: Partial<UserSummary>) {
    return this.collection.updateOne({
      _id: id,
      "members.id": userId
    }, {
      $set: {
        "members.$": member
      }
    })
  }

  removeMember(id: ObjectID, memberId: ObjectID) {
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

  addService(id: ObjectID, service: Service) {
    return this.collection.updateOne({
      _id: id
    }, {
      $push: {
        services: service
      }
    })
  }

  setService(id: ObjectID, serviceId: ObjectID, service: Partial<Service>) {
    return this.collection.updateOne({
      _id: id,
      "services.id": serviceId,
    }, {
      $set: {
        "services.$": service
      }
    })
  }

  removeService(id: ObjectID, serviceId: ObjectID) {
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
