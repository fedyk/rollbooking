import { Context } from "koa";
import { content } from "../views/shared/content";
import { User } from "../models/user";

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

  const isAuthenticated = ctx.isAuthenticated ? ctx.isAuthenticated() : false;
  const userName = isAuthenticated ? (ctx.state.user as User).name : null;

  ctx.body = content({
    isAuthenticated,
    userName,
    body: ctx.body
  });
}
