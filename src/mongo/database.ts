import { MongoClient } from "mongodb";

export function getDatabase(client: MongoClient) {
  if (!client.isConnected()) {
    throw new Error("client is not connected")
  }

  return client.db()
}
