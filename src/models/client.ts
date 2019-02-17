import { ObjectID } from "bson";

export interface Client {
  _id?: ObjectID;
  salonId?: ObjectID;
  userId?: ObjectID;
  name: string;
  email?: string;
  phone?: string;
  created?: Date;
  updated?: Date;
}
