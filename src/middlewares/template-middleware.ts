import { Context } from "koa";
import { template } from "../views/template";

/**
 * @example
 * 
 * Code:
 * ```
 * router.get("/", templateMiddleware, async (ctx) => {
 *   ctx.body = "Hello";
 * })
 * ```
 */
export async function templateMiddleware(ctx: Context, next) {
  ctx.state.scripts = ["/packages/bootstrap/bootstrap.js"];

  ctx.state.styles = ["/packages/bootstrap/bootstrap.css"];

  ctx.state.title = "Rollbooking";

  await next()

  ctx.body = template({
    body: ctx.body,
    title: ctx.state.title,
    scripts: ctx.state.scripts,
    styles: ctx.state.styles,
  });
}
