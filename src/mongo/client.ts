import { MongoClient } from "mongodb";

export async function createClient(uri: string) {
  return new MongoClient(uri, {
    useNewUrlParser: true
  })  
}

export async function closeClient(client: MongoClient) {
  return client.close();
}
