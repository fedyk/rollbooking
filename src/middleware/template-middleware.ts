import { Context } from "../types/app/context";
import { template } from "../views/template";
import { content } from "../views/shared/content";
import { State } from "../types/app/state";
import { ParameterizedContext } from "koa";

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
export async function templateMiddleware(ctx: ParameterizedContext<State>, next) {
  ctx.state.scripts = [
    "/js/jquery-3.3.1.slim.js?1",
    "/js/popper.js?1",
    "/js/bootstrap.js?1",
  ];

  ctx.state.styles = [
    "/css/bootstrap.css?1"
  ];

  ctx.state.title = "Rollbooking";

  await next()

  const isAuthenticated = ctx.isAuthenticated ? ctx.isAuthenticated() : false;
  const userName = isAuthenticated ? ctx.state.user.name : null;


  // todo: do we need mobile support
  const body = content({
    isAuthenticated: isAuthenticated,
    userName: userName,
    body: ctx.body
  })

  ctx.response.type = "html";

  ctx.body = template({
    title: ctx.state.title,
    description: "",
    body: body,
    scripts: ctx.state.scripts,
    styles: ctx.state.styles,
  });
}
