import { Collection, Db, ObjectID, WithId } from "mongodb";

export interface Customer {
  organizationId: ObjectID
  userId: ObjectID
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

  getById(_id: ObjectID) {
    return this.collection.findOne<WithId<Customer>>({ _id })
  }

  findById(organizationId: ObjectID, userId: ObjectID) {
    return this.collection.findOne<WithId<Customer>>({
      organizationId,
      userId
    })
  }
}
