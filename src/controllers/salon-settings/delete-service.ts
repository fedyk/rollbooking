import { Context } from "koa";
import { connect } from "../../lib/database";
import { deleteSalonService } from "../../sagas/delete-salon-service";

export async function deleteService(ctx: Context) {
  const salonId = parseInt(ctx.params.salonId, 10);
  const serviceId = parseInt(ctx.params.serviceId, 10);
  const client = await connect();

  try {
    deleteSalonService(client, salonId, serviceId);
  }
  catch(e) {
    e.status = 400;
    e.expose = true;
    client.release();
    throw e;
  }

  client.release();

  ctx.body = "ok";
}
