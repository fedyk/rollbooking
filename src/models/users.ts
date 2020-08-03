import { Db } from "mongodb";

export interface User {
  id: string
  name: string
  email: string
  avatarUrl: string
  timezone: string
  password?: string
  ownedBusinessIds: string[]
  defaultBusinessId: string | null
  created?: Date
  updated?: Date
}

export function createUser(db: Db, user: User) {
  return getCollection(db).insertOne(user).then(r => r.insertedId);
}

export function createUsers(db: Db, users: User[]) {
  return getCollection(db).insertMany(users);
}

export function getUserById(db: Db, id: string) {
  return getCollection(db).findOne({ id })
}

export function findUserByCredentials(db: Db, email: string, password: string) {
  return getCollection(db).findOne({ email, password })
}

function getCollection(db: Db) {
  return db.collection<User>("users")
}
