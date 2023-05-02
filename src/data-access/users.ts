import { Collection, Db, ObjectId, WithId } from "mongodb";

export interface User {
  name: string
  email: string
  phone: string
  avatarUrl: string
  timezone: string
  password?: string
  createdAt: Date
  updatedAt: Date
}

export class Users {
  protected collection: Collection<User>

  constructor(db: Db) {
    this.collection = db.collection("users")
  }

  createUser(user: User) {
    return this.collection.insertOne(user);
  }

  createUsers(users: User[]) {
    return this.collection.insertMany(users);
  }

  getUserById(id: string) {
    return this.collection.findOne<WithId<User>>(new ObjectId(id))
  }

  findUserByCredentials(email: string, password: string) {
    return this.collection.findOne<WithId<User>>({ email, password })
  }

  findIn(ids: ObjectId[]) {
    return this.collection.find<WithId<User>>({
      _id: {
        $in: ids
      }
    }).toArray()
  }
}
