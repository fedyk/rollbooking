import { Context } from "koa";

export async function logout(ctx: Context) {
  await ctx.redirect('/');
}
