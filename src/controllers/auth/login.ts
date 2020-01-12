import { Context } from "koa";
import { renderer_DEPRECATED } from "../../lib/render";

export async function login(ctx: Context) {
  ctx.body = await renderer_DEPRECATED('auth/login.njk');
}
