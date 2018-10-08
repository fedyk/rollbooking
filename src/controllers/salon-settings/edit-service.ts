import { Context } from "koa";
import { renderer } from "../../lib/render";
import { connect } from "../../lib/database";
import { updateSalonService } from "../../sagas/update-salon-service";
import { serviceBodyMapper } from "../../mappers/salon-settings/service";
import { getSalonService } from "../../sagas/get-salon-service";

export async function editService(ctx: Context) {
  const salonId = parseInt(ctx.params.salonId, 10);
  const serviceId = parseInt(ctx.params.serviceId, 10);
  const client = await connect();

  if (ctx.request.method === 'POST') {
    try {
      const service = serviceBodyMapper(ctx.request.body, salonId);

      updateSalonService(client, salonId, serviceId, service.properties)

      return ctx.redirect(`/salon${salonId}/settings/services`);
    }
    catch(e) {
      e.status = 400;
      e.expose = true;
      client.release();
      throw e;
    }
  }

  const salonService = await getSalonService(client, salonId, serviceId);

  client.release();

  ctx.body = await renderer("salon-settings/edit-services.njk", {
    salonId,
    salonService
  });
}
