import { Collection, Db, ObjectID, WithId } from "mongodb";

export interface Review {
  text: string
  stars: number
  eventId: ObjectID
  authorId: ObjectID
  serviceId: ObjectID
  organizationId: ObjectID
  created: Date;
  updated: Date;
}

export class Reviews {
  collection: Collection<Review>

  constructor(db: Db) {
    this.collection = db.collection("reviews")
  }

  create(review: Review) {
    return this.collection.insertOne(review)
  }

  getById(_id: ObjectID) {
    return this.collection.findOne<WithId<Review>>({ _id })
  }
}
