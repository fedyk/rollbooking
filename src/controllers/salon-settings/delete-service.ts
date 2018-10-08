import { Context } from "koa";
import { renderer } from "../../lib/render";

export async function deleteService(ctx: Context) {
  ctx.body = renderer('settings/edit-services.njk', {});
}