import { Collection, Db, ObjectId } from "mongodb";

export interface Session {
  body: string
  expiresAt: Date
  createdAt: Date
}

/**
 * TBD
 */
export class Sessions {
  collection: Collection<Session>

  constructor(db: Db) {
    this.collection = db.collection("sessions")
  }

  // generateId() {
  //   return new ObjectId().toHexString()
  // }

  // get(id: String) {
  //   return this.collection.findOne(ObjectId(id)).then
  // }

  // create(id: string, session: Session) {
  //   return this.collection.insertOne(Object.assign({
  //     session
  //   })
  // }

  // delete(_id: ObjectId) {
  //   return this.collection.deleteOne({
  //     _id
  //   })
  // }
}
