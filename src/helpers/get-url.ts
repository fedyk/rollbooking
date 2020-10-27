import Router = require("@koa/router")

export function getUrl(path: string, params: object) {
  return Router.url(path, params)
}
