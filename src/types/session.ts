import { ObjectID } from "bson";

export interface Session {
  _id: string;
  payload: SessionPayload;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionPayload {
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
}
