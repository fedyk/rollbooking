import { ObjectID } from "bson";
import { Client } from "../../types/client";
import { closeClient, ClientsCollection_DEPRECATED } from "./mongodb";

interface Options {
  salonId: ObjectID,
  userId?: ObjectID,
  name?: string;
  email?: string;
  phone?: string;
}

export async function createTestClient(options: Options) {
  const $clients = await ClientsCollection_DEPRECATED();
  const salonId = options.salonId || null;
  const userId = options.userId || null;
  const randomId = Math.round(Math.random() * 1000)

  const client: Client = {
    _version: "v1",
    salonId,
    userId,
    name: options.name || `Test Client ${randomId}`,
    email: options.email || `email${randomId}@example.com`,
    phone: options.phone || `${randomId}666666`
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
