import { Context } from "koa";
import { template } from "../views/template";
import { content } from "../views/shared/content";

export async function contentMiddleware(ctx: Context, next) {
  await next()

  ctx.body = template({
    title: `Rollbooking`,
    body: content({
      body: ctx.body
    })
  })
}
