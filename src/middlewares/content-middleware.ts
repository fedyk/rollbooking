import { Context } from "koa";
import { content } from "../views/shared/content";

/**
 * 
 * @example
 * 
 * Code:
 * ```
 * router.get("/", contentMiddleware, async (ctx) => {
 *   ctx.body = "Hello";
 * })
 * ``
 * 
 * Output:
 * ```
 * ctx.body === '<header>...</header><container>Hello</container>
 * ```
 */
export async function contentMiddleware(ctx: Context, next) {
  await next()

  ctx.body = content({
    body: ctx.body
  });
}
