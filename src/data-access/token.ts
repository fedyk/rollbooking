import { Db, ObjectID } from "mongodb";

export type Token = EmailInviteToken

export interface EmailInviteToken {
  _id?: ObjectID
  type: "email-invite"
  business_id: string
  inviter_id: string
  invitee_id: string
  invitee_email: string
  created_at: Date
}

export function getCollection(db: Db) {
  return db.collection<Token>("tokens")
}

export function createToken<T extends Token>(db: Db, token: T) {
  return getCollection(db).insertOne(token).then(r => r.insertedId);
}

export function getTokenById(db: Db, _id: ObjectID) {
  return getCollection(db).findOne({ _id })
}

export function deleteToken(db: Db, _id: ObjectID) {
  return getCollection(db).deleteOne({ _id })
}

