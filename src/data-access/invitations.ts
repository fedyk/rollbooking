import { Collection, Db, ObjectID, WithId } from "mongodb";

export interface Invitation {
  email: string
  position: string
  organizationId: ObjectID
  created: Date;
  updated: Date;
}

export class Invitations {
  collection: Collection<Invitation>

  constructor(db: Db) {
    this.collection = db.collection("invitations")
  }

  getById(_id: ObjectID) {
    return this.collection.findOne<WithId<Invitation>>(_id)
  }

  create(invitation: Invitation) {
    return this.collection.insertOne(invitation)
  }

  delete(_id: ObjectID) {
    return this.collection.deleteOne(_id)
  }
}
