import { Collection, Db, ObjectId, WithId } from "mongodb";

export interface Invitation {
  email: string
  position: string
  organizationId: ObjectId
  created: Date;
  updated: Date;
}

export class Invitations {
  collection: Collection<Invitation>

  constructor(db: Db) {
    this.collection = db.collection("invitations")
  }

  getById(_id: ObjectId) {
    return this.collection.findOne<WithId<Invitation>>(_id)
  }

  create(invitation: Invitation) {
    return this.collection.insertOne(invitation)
  }

  delete(_id: ObjectId) {
    return this.collection.deleteOne(_id)
  }
}
