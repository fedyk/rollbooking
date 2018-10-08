import { Context } from "koa";
import { renderer } from "../../lib/render";

export async function newService(ctx: Context) {
  const salonId = parseInt(ctx.params.salonId, 10);

  ctx.body = await renderer('salon-settings/new-service.njk', {
    salonId
  });
}
