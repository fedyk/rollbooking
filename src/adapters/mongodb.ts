import { MongoClient, Db, Collection } from "mongodb";
import { config } from "../lib/config";
import { User } from "../types/user";
import { Salon } from "../types/salon";
import { Reservation } from "../types/reservation";
import { BookingWorkday } from "../types/booking-workday";
import { BookingSlot } from "../types/booking-slot";
import { Client } from "../types/client";
import { Session } from "../types/session";
import { BookingSlotSubscription } from "../types/booking-slot-subscription";

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

export async function BookingWorkdaysCollection(): Promise<Collection<BookingWorkday>> {
  return await getCollection("booking-workdays");
}

export async function BookingSlotsCollection(): Promise<Collection<BookingSlot>> {
  return await getCollection("booking-slots");
}

export async function BookingSlotsSubscriptionCollection(): Promise<Collection<BookingSlotSubscription>> {
  return await getCollection("booking-slots-subscriptions");
}

export async function ClientsCollection(): Promise<Collection<Client>> {
  return await getCollection("clients");
}

export async function SessionCollection(): Promise<Collection<Session>> {
  return await getCollection("sessions");
}
