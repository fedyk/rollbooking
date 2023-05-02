import { Collection, Db, ObjectId, WithId } from "mongodb";

export interface Review {
  text: string
  stars: number
  eventId: ObjectId
  authorId: ObjectId
  serviceId: ObjectId
  organizationId: ObjectId
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

  getById(_id: ObjectId) {
    return this.collection.findOne<WithId<Review>>({ _id })
  }
}
