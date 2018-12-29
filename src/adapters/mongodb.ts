import { MongoClient, Db, Collection } from "mongodb";
import { config } from "../lib/config";
import { User } from "../models/user";
import { Salon } from "../models/salon";
import { Reservation } from "../models/reservation";
import { SalonBookingWorkday } from "../models/salon-booking-workday";

const client = new MongoClient(config.MONGODB_URI, {
  useNewUrlParser: true
});

export async function getClient(): Promise<MongoClient> {
  if (!client.isConnected()) {
    await client.connect();
  }

  return client;
}

export async function closeClient() {
  return await client.close();
}

export async function getCollection(name): Promise<Collection<any>> {
  return getClient().then(client => client.db()).then(db => db.collection(name));
}

export async function UsersCollection(): Promise<Collection<User>> {
  return await getCollection("users");
}

export async function SalonsCollection(): Promise<Collection<Salon>> {
  return await getCollection("salons");
}


export async function ReservationsCollection(): Promise<Collection<Reservation>> {
  return await getCollection("reservations");
}

export async function BookingWorkdaysCollection(): Promise<Collection<SalonBookingWorkday>> {
  return await getCollection("booking-workdays");
}



// TODO: leftovers

// export function Mongo(MONGODB_URI): IMongo {
//   const connect: Promise<MongoClient> = new Promise((resolve, reject) => {
//     MongoClient.connect(MONGODB_URI, {
//       useNewUrlParser: true
//     }, (error, mongoClient) => error ? reject(error) : resolve(mongoClient));
//   })
//   connect
//     .then(() => debug("connected to mongo server"))
//     .catch(error => debug("error connect to mongo %O", error));
  
//   async function db(): Promise<Db> {
//     return connect.then(client => client.db());
//   }

//   async function collection(collectionName) {
//     return db().then(db => db.collection(collectionName))
//   }

//   async function activities(): Promise<Collection<Activity>> {
//     return collection("activities");
//   }

//   async function close() {
//     return connect.then(client => client.close())
//   }

//   return {
//     db,
//     collection,
//     activities,
//     close,
//   }
// }