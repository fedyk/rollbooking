import { MongoClient, Db, Collection } from "mongodb";
import { config_DEPRECATED } from "../../lib/config";
import { User } from "../types/user";
import { Salon } from "../types/salon";
import { Reservation } from "../types/reservation";
import { BookingWorkday } from "../types/booking-workday";
import { BookingSlot } from "../types/booking-slot";
import { Client } from "../types/client";
import { Session } from "../types/session";
import { BookingSlotSubscription } from "../types/booking-slot-subscription";

const client = new MongoClient(config_DEPRECATED.MONGODB_URI, {
  useNewUrlParser: true
});

export async function getClient_DEPRECATED(): Promise<MongoClient> {
  if (!client.isConnected()) {
    await client.connect();
  }

  return client;
}

export async function closeClient() {
  return await client.close();
}

export async function getCollection_DEPRECATED(name): Promise<Collection<any>> {
  return getClient_DEPRECATED().then(client => client.db()).then(db => db.collection(name));
}

export async function UsersCollection_DEPRECATED(): Promise<Collection<User>> {
  return await getCollection_DEPRECATED("users");
}

export async function SalonsCollection_DEPRECATED(): Promise<Collection<Salon>> {
  return await getCollection_DEPRECATED("salons");
}

export async function ReservationsCollection_DEPRECATED(): Promise<Collection<Reservation>> {
  return await getCollection_DEPRECATED("reservations");
}

export async function BookingWorkdaysCollection_DEPRECATED(): Promise<Collection<BookingWorkday>> {
  return await getCollection_DEPRECATED("booking-workdays");
}

export async function BookingSlotsCollection_DEPRECATED(): Promise<Collection<BookingSlot>> {
  return await getCollection_DEPRECATED("booking-slots");
}

export async function BookingSlotsSubscriptionCollection_DEPRECATED(): Promise<Collection<BookingSlotSubscription>> {
  return await getCollection_DEPRECATED("booking-slots-subscriptions");
}

export async function ClientsCollection_DEPRECATED(): Promise<Collection<Client>> {
  return await getCollection_DEPRECATED("clients");
}

export async function SessionCollection_DEPRECATED(): Promise<Collection<Session>> {
  return await getCollection_DEPRECATED("sessions");
}
