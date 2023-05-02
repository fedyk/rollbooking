import { MongoClient } from "mongodb";

export function createClient(uri: string) {
  const client = new MongoClient(uri)

  return client.connect().then(c => c)
}

export async function closeClient(client: MongoClient) {
  return client.close();
}

export function getDatabase(client: MongoClient) {
  return client.db()
}
