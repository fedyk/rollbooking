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
    "/packages/bootstrap/bootstrap.js"
  ];

  ctx.state.styles = [
    "/packages/bootstrap/bootstrap.css"
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

  ctx.body = template({
    title: ctx.state.title,
    description: "",
    body: body,
    scripts: ctx.state.scripts,
    styles: ctx.state.styles,
  });
}
