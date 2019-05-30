import { Context } from "koa";
import { Salon } from "../../../types/salon";
import { Client } from "../../../types/client";
import { ClientsCollection } from "../../../adapters/mongodb";
import { isEmail } from "../../../utils/is-email";

export async function quickCreate(ctx: Context) {
  const salon = ctx.state.salon as Salon;
  const body: any = ctx.request.body || {};
  const text = (body.text || "").trim();

  ctx.assert(text, 400, "Client name should not be empty");

  const name = isEmail(text) ? "Client" : text;
  const email = isEmail(text) ? text : "";
  
  const client: Client = {
    salonId: salon._id,
    name,
    email,
    phone: "",
    created: new Date(),
    updated: new Date()
  }

  const $clients = await ClientsCollection();

  const { ops: [insertedClient] } = await $clients.insertOne(client);

  ctx.assert(insertedClient, 500, "Missed inserted client. Something went wrong");
  
  ctx.body = {
    id: insertedClient._id.toHexString(),
    name: insertedClient.name,
    email: insertedClient.email,
    phone: insertedClient.phone
  }
}
