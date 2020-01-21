import { MongoClient } from "mongodb";

export function createClient(uri: string) {
  const client = new MongoClient(uri, {
    // autoReconnect: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  return client.connect().then(c => c)
}

export async function closeClient(client: MongoClient) {
  return client.close();
}
