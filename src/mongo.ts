import { MongoClient } from "mongodb";

export function createClient(uri: string) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  return client.connect().then(c => c)
}

export async function closeClient(client: MongoClient) {
  return client.close();
}

export function getDatabase(client: MongoClient) {
  if (!client.isConnected()) {
    throw new Error("`client` is not connected")
  }

  return client.db()
}
