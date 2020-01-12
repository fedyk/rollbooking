import { ObjectID } from "bson";
import { closeClient, ClientsCollection_DEPRECATED } from "../../mongo/mongodb";

export async function deleteTestClient(clientId: ObjectID) {
  const $clients = await ClientsCollection_DEPRECATED();
  await $clients.deleteOne({
    _id: clientId
  });
}

if (!module.parent) {
  deleteTestClient(new ObjectID(process.argv[2]))
    .then(() => console.log("Test client was successfully deleted"))
    .catch(error => console.error(error))
    .then(() => closeClient())
}
