import * as types from "../types";
import { renderView } from "../render";

/**
 * @example
 * ```
 * router.get("/", template, async (ctx) => {
 *   ctx.body = "Content";
 * })
 * ```
 */
export const template: types.Middleware = async (ctx, next) => {
  ctx.state.scripts = [
    "/js/jquery.js",
    "/js/popper.js",
    "/js/bootstrap.js",
  ]

  ctx.state.styles = [
    "/css/bootstrap.css",
    "/css/bootstrap-theme.css"
  ]

  ctx.state.alerts = []

  ctx.state.title = "Rollbooking";
  ctx.response.type = "html"

  await next()

  const layout = await renderView("layout.ejs", {
    isAuthenticated: !!ctx.state.user,
    userName: ctx.state.user ? ctx.state.user.name : void 0,
    userId: ctx.state.user ? ctx.state.user.id : void 0,
    body: ctx.body,
    alerts: ctx.state.alerts
  })

  ctx.body = await renderView("template.ejs", {
    title: ctx.state.title,
    description: ctx.state.description,
    body: layout,
    scripts: ctx.state.scripts,
    styles: ctx.state.styles,
  })
}
