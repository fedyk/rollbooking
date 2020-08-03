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

  ctx.body = await renderView("template.ejs", {
    title: ctx.state.title,
    description: ctx.state.description,
    body: ctx.body,
    scripts: ctx.state.scripts,
    styles: ctx.state.styles,
  })
}
