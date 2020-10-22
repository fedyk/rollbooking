import * as types from "../types";
import { renderView } from "../render";

/**
 * @example
 * ```
 * router.get("/", layout, async (ctx) => {
 *   ctx.body = "Some HTML";
 * })
 * ```
 */
export const defaultLayout: types.Middleware = async (ctx, next) => {
  await next()

  ctx.body = await renderView("layout.ejs", {
    isAuthenticated: !!ctx.state.user,
    userName: ctx.state.user ? ctx.state.user.name : void 0,
    userId: ctx.state.user ? ctx.state.user.id : void 0,
    body: ctx.body,
    alerts: ctx.state.alerts
  })
}
