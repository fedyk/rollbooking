import { Collection, Db, ObjectId, WithId } from "mongodb";

export interface Customer {
  organizationId: ObjectId
  userId: ObjectId
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Customers {
  collection: Collection<Customer>

  constructor(db: Db) {
    this.collection = db.collection("customers")
  }

  create(customer: Customer) {
    return this.collection.insertOne(customer)
  }

  getById(_id: ObjectId) {
    return this.collection.findOne<WithId<Customer>>({ _id })
  }

  findById(organizationId: ObjectId, userId: ObjectId) {
    return this.collection.findOne<WithId<Customer>>({
      organizationId,
      userId
    })
  }
}
