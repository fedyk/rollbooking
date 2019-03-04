import { MongoClient, Db, Collection } from "mongodb";
import { config } from "../lib/config";
import { User } from "../models/user";
import { Salon } from "../models/salon";
import { Reservation } from "../models/reservation";
import { BookingWorkday } from "../models/booking-workday";
import { BookingSlot } from "../models/booking-slot";
import { Client } from "../models/client";
import { Session } from "../models/session";
import { BookingSlotSubscription } from "../models/booking-slot-subscription";

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
