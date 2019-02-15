import { ObjectID } from "bson";
import { Client } from "../../models/client";
import { closeClient, ClientsCollection } from "../../adapters/mongodb";

interface Options {
  salonId: ObjectID,
  userId?: ObjectID
}

export async function createTestClient(options: Options) {
  const $clients = await ClientsCollection();
  const salonId = options.salonId || null;
  const userId = options.userId || null;

  const client: Client = {
    salonId,
    userId,
    name: "Test User",
    email: "email@example.com",
    phone: "666666666"
  }

  const { ops: [insertedClient] } = await $clients.insertOne(client);

  return insertedClient as Client;
}

if (!module.parent) {
  const salonId = new ObjectID(process.argv[2])
  createTestClient({ salonId })
    .then(client => console.log("Test client was successfully created: clientId=%s", client._id))
    .catch(error => console.error(error))
    .then(() => closeClient())
}