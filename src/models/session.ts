import { ObjectID } from "bson";

export interface Session {
  _id: string;
  payload: object;
  createdAt: Date;
  updatedAt: Date;
}