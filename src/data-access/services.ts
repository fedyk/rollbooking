// import { Collection, Db, ObjectID, WithId } from "mongodb";

// export interface Service {
//   name: string
//   description: string
//   /** service duration in minutes */
//   duration: number
//   /** ISO 4217 */
//   currencyCode: string
//   price: number
// }

// export class Services {
//   collection: Collection<Service>

//   constructor(db: Db) {
//     this.collection = db.collection("services")
//   }

//   getOne(_id: ObjectID) {
//     return this.collection.findOne<WithId<Service>>({ _id })
//   }

//   create(service: Service) {
//     return this.collection.insertOne(service)
//   }

//   update(_id: ObjectID, service: Service) {
//     return this.collection.updateOne({
//       _id
//     }, {
//       $set: service
//     })
//   }

//   delete(_id: ObjectID) {
//     return this.collection.deleteOne({ _id })
//   }
// }
