import { Context } from "koa";
import { renderer } from "../../lib/render";

export async function login(ctx: Context) {
  ctx.body = await renderer('auth/login.njk');
}
