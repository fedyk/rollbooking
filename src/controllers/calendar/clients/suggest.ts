import { Context } from "koa";
import { Salon } from "../../../models/salon";
import { ClientsCollection } from "../../../adapters/mongodb";
import { ObjectID } from "bson";

export async function suggest(ctx: Context) {
  const salon = ctx.state.salon as Salon;
  const params = parseUrlParams(ctx.query);

  ctx.assert(ObjectID.isValid(salon._id), 500, "Invalid salon");

  if (params.query === "") {
    return ctx.body = [];
  }

  const $in = params.query.split(" ").filter(v => !!v.trim()).map(v => new RegExp(v, "i"));
  const $clients = await ClientsCollection();
  const clients = await $clients.find({
    salonId: salon._id,
    $or: [{
      name: {
        $in: $in
      }
    }, {
      email: {
        $in: $in
      }
    }, {
      phone: {
        $in: $in
      }
    }]
  }).toArray();

  ctx.body = clients.map(v => ({
    id: v._id.toHexString(),
    name: v.name,
    email: v.email,
    phone: v.phone
  }));
}

function parseUrlParams(params: any = {}) {
  const query = params ? (params.q || params.query || "") : "";

  return {
    query: String(query).replace(/\"/g, " ").trim()
  }
}
