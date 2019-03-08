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
  ctx.state.scripts = [
    "https://code.jquery.com/jquery-3.3.1.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.js",
    "https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.js"
  ];

  ctx.state.styles = [
    "https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.css"
  ];

  ctx.state.title = "Rollbooking";

  await next()

  ctx.body = template({
    body: ctx.body,
    title: ctx.state.title,
    scripts: ctx.state.scripts,
    styles: ctx.state.styles,
  });
}
